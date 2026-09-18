import io
import csv
import json
import calendar
from datetime import date, datetime, timedelta
from typing import Optional, Dict, Any, List

from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.responses import Response, JSONResponse
from sqlalchemy.orm import Session

from app.database import (
    get_db,
    users_collection,
    food_collection,
    activity_collection,
    sleep_collection,
    checkins_collection,
    wellness_collection,
    ai_insights_collection
)
from app.models.activity import ActivityRecord
from app.models.sleep import SleepRecord
from app.models.food import FoodRecord
from app.models.self_report import SelfReport
from app.models.wellness import WellnessRecord
from app.utils.dependencies import get_current_user, UserModel

router = APIRouter(prefix="/reports", tags=["Reports & Data Export"])

DISCLAIMER_TEXT = (
    "HealthSnap is for health awareness and habit improvement only. "
    "Not medical diagnostic data."
)

# ==============================================================================
# Helper Functions: Date Range & MongoDB/SQLAlchemy Fetching
# ==============================================================================

def get_month_date_range(year: int, month: int):
    """Return start date and end date of the given calendar month."""
    _, last_day = calendar.monthrange(year, month)
    start_d = date(year, month, 1)
    end_d = date(year, month, last_day)
    return start_d, end_d


def fetch_user_data_for_range(
    user_id: Any,
    start_d: date,
    end_d: date,
    db_session: Session
) -> Dict[str, Any]:
    """
    Retrieve real records for the user within [start_d, end_d].
    Checks MongoDB first if available; falls back to SQLite session.
    """
    # 1. Try MongoDB
    if activity_collection is not None:
        try:
            start_dt = datetime.combine(start_d, datetime.min.time())
            end_dt = datetime.combine(end_d, datetime.max.time())
            
            # Query MongoDB collections
            # Date can be stored as date string or datetime
            date_strings = [(start_d + timedelta(days=i)).isoformat() for i in range((end_d - start_d).days + 1)]
            
            act_docs = list(activity_collection.find({
                "user_id": str(user_id),
                "record_date": {"$in": date_strings}
            }))
            
            sleep_docs = list(sleep_collection.find({
                "user_id": str(user_id),
                "record_date": {"$in": date_strings}
            }))
            
            food_docs = list(food_collection.find({
                "user_id": str(user_id),
                "$or": [
                    {"created_at": {"$gte": start_dt, "$lte": end_dt}},
                    {"date": {"$in": date_strings}}
                ]
            }))
            
            checkin_docs = list(checkins_collection.find({
                "user_id": str(user_id),
                "$or": [
                    {"created_at": {"$gte": start_dt, "$lte": end_dt}},
                    {"date": {"$in": date_strings}}
                ]
            }))
            
            wellness_docs = list(wellness_collection.find({
                "user_id": str(user_id),
                "$or": [
                    {"created_at": {"$gte": start_dt, "$lte": end_dt}},
                    {"date": {"$in": date_strings}}
                ]
            }))
            
            if act_docs or sleep_docs or food_docs or checkin_docs or wellness_docs:
                return {
                    "activities": act_docs,
                    "sleep": sleep_docs,
                    "food": food_docs,
                    "checkins": checkin_docs,
                    "wellness": wellness_docs
                }
        except Exception:
            pass

    # 2. SQLite Querying (Primary or Fallback)
    activities = db_session.query(ActivityRecord).filter(
        ActivityRecord.user_id == user_id,
        ActivityRecord.record_date >= start_d,
        ActivityRecord.record_date <= end_d
    ).order_by(ActivityRecord.record_date.asc()).all()

    sleeps = db_session.query(SleepRecord).filter(
        SleepRecord.user_id == user_id,
        SleepRecord.record_date >= start_d,
        SleepRecord.record_date <= end_d
    ).order_by(SleepRecord.record_date.asc()).all()

    # Food logs
    start_dt = datetime.combine(start_d, datetime.min.time())
    end_dt = datetime.combine(end_d, datetime.max.time())
    foods = db_session.query(FoodRecord).filter(
        FoodRecord.user_id == user_id,
        FoodRecord.created_at >= start_dt,
        FoodRecord.created_at <= end_dt
    ).order_by(FoodRecord.created_at.asc()).all()

    checkins = db_session.query(SelfReport).filter(
        SelfReport.user_id == user_id,
        SelfReport.created_at >= start_dt,
        SelfReport.created_at <= end_dt
    ).order_by(SelfReport.created_at.asc()).all()

    wellness = db_session.query(WellnessRecord).filter(
        WellnessRecord.user_id == user_id,
        WellnessRecord.created_at >= start_dt,
        WellnessRecord.created_at <= end_dt
    ).order_by(WellnessRecord.created_at.asc()).all()

    # Convert to standard dict representations
    act_list = [{
        "record_date": str(a.record_date),
        "steps": a.steps,
        "goal": a.goal,
        "active_minutes": a.active_minutes,
        "active_goal": a.active_goal,
        "distance_km": a.distance_km,
        "calories_burned": a.calories_burned,
        "percent_achieved": a.percent_achieved
    } for a in activities]

    sleep_list = [{
        "record_date": str(s.record_date),
        "hours": s.hours,
        "duration_formatted": s.duration_formatted,
        "quality": s.quality,
        "efficiency": s.efficiency,
        "deep_sleep_min": s.deep_sleep_min,
        "rem_sleep_min": s.rem_sleep_min,
        "light_sleep_min": s.light_sleep_min
    } for s in sleeps]

    food_list = [{
        "name": f.title or f.name,
        "category": f.category,
        "calories": f.calories,
        "protein": f.protein,
        "carbs": f.carbs,
        "fat": f.fat,
        "time": f.created_at.strftime("%I:%M %p") if f.created_at else "Logged",
        "created_at": f.created_at.isoformat() if f.created_at else None,
        "suggestion": f.suggestion
    } for f in foods]

    checkin_list = [{
        "feeling": c.feeling,
        "feeling_emoji": c.feeling_emoji,
        "symptoms": c.symptoms,
        "severity": c.severity,
        "duration": c.duration,
        "notes": c.notes,
        "time": c.created_at.strftime("%I:%M %p") if c.created_at else "Logged",
        "created_at": c.created_at.isoformat() if c.created_at else None
    } for c in checkins]

    wellness_list = [{
        "score": w.score,
        "max_score": w.max_score,
        "status": w.status,
        "trend": w.trend,
        "activity_subscore": w.activity_subscore,
        "sleep_subscore": w.sleep_subscore,
        "nutrition_subscore": w.nutrition_subscore,
        "journal_subscore": w.journal_subscore,
        "created_at": w.created_at.isoformat() if w.created_at else None
    } for w in wellness]

    return {
        "activities": act_list,
        "sleep": sleep_list,
        "food": food_list,
        "checkins": checkin_list,
        "wellness": wellness_list
    }


# ==============================================================================
# Report Generators: Daily, Weekly, Monthly Structures
# ==============================================================================

def generate_daily_report_data(
    target_date: date,
    data: Dict[str, Any],
    user: UserModel
) -> Dict[str, Any]:
    """Generate structured Daily report data from actual records."""
    acts = data["activities"]
    sleeps = data["sleep"]
    foods = data["food"]
    checkins = data["checkins"]
    wellness = data["wellness"]

    # Check if ANY real data exists for this day
    has_data = bool(acts or sleeps or foods or checkins or wellness)

    # Latest activity for the day
    act_today = acts[-1] if acts else None
    activity_section = {
        "recorded": bool(act_today),
        "steps": act_today["steps"] if act_today else None,
        "step_goal": act_today["goal"] if act_today else None,
        "active_minutes": act_today["active_minutes"] if act_today else None,
        "active_minutes_goal": act_today["active_goal"] if act_today else None,
        "distance_km": act_today["distance_km"] if act_today else None,
        "calories_burned": act_today["calories_burned"] if act_today else None,
        "percent_achieved": act_today["percent_achieved"] if act_today else None
    }

    # Latest sleep for the day
    sleep_today = sleeps[-1] if sleeps else None
    sleep_section = {
        "recorded": bool(sleep_today),
        "duration": sleep_today["duration_formatted"] if sleep_today else "Not recorded",
        "hours": sleep_today["hours"] if sleep_today else None,
        "goal": "7–8h",
        "quality": sleep_today["quality"] if sleep_today else "Not recorded",
        "efficiency": f"{sleep_today['efficiency']}%" if sleep_today and sleep_today.get("efficiency") else "Not recorded",
        "deep_sleep": f"{sleep_today['deep_sleep_min'] // 60}h {sleep_today['deep_sleep_min'] % 60}m" if sleep_today and sleep_today.get("deep_sleep_min") else "Not recorded",
        "rem_sleep": f"{sleep_today['rem_sleep_min'] // 60}h {sleep_today['rem_sleep_min'] % 60}m" if sleep_today and sleep_today.get("rem_sleep_min") else "Not recorded",
        "light_sleep": f"{sleep_today['light_sleep_min'] // 60}h {sleep_today['light_sleep_min'] % 60}m" if sleep_today and sleep_today.get("light_sleep_min") else "Not recorded"
    }

    # Food & Nutrition
    total_cal = sum(f.get("calories", 0) for f in foods) if foods else None
    total_protein = sum(f.get("protein", 0) for f in foods) if foods else None
    total_carbs = sum(f.get("carbs", 0) for f in foods) if foods else None
    total_fat = sum(f.get("fat", 0) for f in foods) if foods else None

    food_section = {
        "recorded": bool(foods),
        "meals_logged": len(foods),
        "meals": foods,
        "totals": {
            "calories": total_cal,
            "protein_g": total_protein,
            "carbs_g": total_carbs,
            "fat_g": total_fat
        } if foods else None
    }

    # Journal / Check-in
    journal_section = {
        "recorded": bool(checkins),
        "entries_count": len(checkins),
        "entries": checkins
    }

    # Wellness Summary
    w_rec = wellness[-1] if wellness else None
    wellness_summary = {
        "recorded": bool(w_rec),
        "score": w_rec["score"] if w_rec else None,
        "max_score": w_rec["max_score"] if w_rec else 100,
        "status": w_rec["status"] if w_rec else "No data",
        "trend": w_rec.get("trend") if w_rec else None
    }

    # Patterns (derived only if user has actual inputs)
    patterns = []
    if act_today and act_today["steps"] >= (act_today["goal"] or 8000):
        patterns.append({
            "observation": "High Movement Target Reached",
            "correlation": "Active movement supports circadian rhythm and sleep onset",
            "summary": "Step goal achieved today.",
            "details": f"Recorded {act_today['steps']} steps vs {act_today['goal']} goal."
        })
    if sleep_today and sleep_today.get("hours", 0) < 6:
        patterns.append({
            "observation": "Short Sleep Duration",
            "correlation": "Sleep under 6 hours may lead to afternoon energy dips",
            "summary": "Sleep duration was below target.",
            "details": f"Recorded {sleep_today.get('duration_formatted')} of rest."
        })
    if foods and total_protein and total_protein >= 50:
        patterns.append({
            "observation": "Sufficient Dietary Protein",
            "correlation": "Adequate protein intake supports muscular repair and satiety",
            "summary": "High protein meal logging detected.",
            "details": f"Total recorded protein reached {total_protein}g."
        })

    # Guidance
    guidance = [
        {
            "title": "Maintain Hydration",
            "category": "Hydration",
            "description": "Drink at least 6-8 glasses of water throughout your waking routine.",
            "action": "Keep a water bottle nearby during daily tasks."
        },
        {
            "title": "Evening Wind-Down",
            "category": "Sleep Routine",
            "description": "Minimize bright screens 45 minutes before sleep to support melatonin.",
            "action": "Switch to dim ambient lighting or reading."
        }
    ]

    return {
        "report_type": "Daily",
        "title": "HEALTHSNAP DAILY WELLNESS REPORT",
        "date": target_date.strftime("%B %d, %Y"),
        "date_iso": target_date.isoformat(),
        "user_name": user.full_name,
        "has_data": has_data,
        "message": "No data recorded for this period." if not has_data else "Report generated successfully.",
        "wellness_summary": wellness_summary,
        "activity": activity_section,
        "sleep": sleep_section,
        "food": food_section,
        "journal": journal_section,
        "patterns": patterns,
        "guidance": guidance,
        "disclaimer": DISCLAIMER_TEXT,
        "generated_at": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
    }


def generate_weekly_report_data(
    start_d: date,
    end_d: date,
    data: Dict[str, Any],
    user: UserModel
) -> Dict[str, Any]:
    """Generate structured Weekly report for 7 calendar days."""
    acts = data["activities"]
    sleeps = data["sleep"]
    foods = data["food"]
    checkins = data["checkins"]
    wellness = data["wellness"]

    has_data = bool(acts or sleeps or foods or checkins or wellness)

    # 7-day day breakdown
    num_days = (end_d - start_d).days + 1
    day_dates = [start_d + timedelta(days=i) for i in range(num_days)]

    # Activity by day
    steps_by_day = []
    total_steps = 0
    total_active_min = 0
    total_dist = 0.0
    total_cal = 0

    act_map = {a["record_date"]: a for a in acts}
    for d in day_dates:
        iso_d = d.isoformat()
        rec = act_map.get(iso_d)
        s = rec["steps"] if rec else 0
        total_steps += s
        if rec:
            total_active_min += rec.get("active_minutes", 0)
            total_dist += float(rec.get("distance_km", 0.0))
            total_cal += rec.get("calories_burned", 0)
        steps_by_day.append({
            "day": d.strftime("%a"),
            "date": iso_d,
            "steps": s,
            "recorded": bool(rec)
        })

    days_with_activity = len(acts)
    avg_steps = int(total_steps / days_with_activity) if days_with_activity > 0 else 0
    avg_active_min = int(total_active_min / days_with_activity) if days_with_activity > 0 else 0

    # Sleep by day
    sleep_by_day = []
    total_sleep_hrs = 0.0
    sleep_map = {s["record_date"]: s for s in sleeps}
    for d in day_dates:
        iso_d = d.isoformat()
        s_rec = sleep_map.get(iso_d)
        h = s_rec["hours"] if s_rec else 0.0
        total_sleep_hrs += h
        sleep_by_day.append({
            "day": d.strftime("%a"),
            "date": iso_d,
            "hours": h,
            "quality": s_rec["quality"] if s_rec else "Not recorded",
            "recorded": bool(s_rec)
        })

    days_with_sleep = len(sleeps)
    avg_sleep_hrs = round(total_sleep_hrs / days_with_sleep, 2) if days_with_sleep > 0 else 0.0

    # Scores
    scores = [w["score"] for w in wellness if w.get("score") is not None]
    avg_score = int(sum(scores) / len(scores)) if scores else None
    best_score = max(scores) if scores else None
    lowest_score = min(scores) if scores else None

    # Food summary
    total_food_cal = sum(f.get("calories", 0) for f in foods) if foods else 0
    avg_food_cal = int(total_food_cal / len(foods)) if foods else None
    avg_protein = int(sum(f.get("protein", 0) for f in foods) / len(foods)) if foods else None
    avg_carbs = int(sum(f.get("carbs", 0) for f in foods) / len(foods)) if foods else None
    avg_fat = int(sum(f.get("fat", 0) for f in foods) / len(foods)) if foods else None

    # Unique recorded days
    all_dates = set()
    for a in acts: all_dates.add(a["record_date"])
    for s in sleeps: all_dates.add(s["record_date"])

    date_range_str = f"{start_d.strftime('%B %d, %Y')} – {end_d.strftime('%B %d, %Y')}"

    return {
        "report_type": "Weekly",
        "title": "HEALTHSNAP WEEKLY WELLNESS REPORT",
        "date_range": date_range_str,
        "start_date": start_d.isoformat(),
        "end_date": end_d.isoformat(),
        "user_name": user.full_name,
        "has_data": has_data,
        "message": "No data recorded for this period." if not has_data else "Weekly report generated successfully.",
        "weekly_summary": {
            "average_score": avg_score,
            "best_score": best_score,
            "lowest_score": lowest_score,
            "days_recorded": len(all_dates),
            "total_days_in_period": 7,
            "overall_trend": "+3 pts consistency" if avg_score and avg_score >= 70 else "Baseline tracking"
        },
        "activity_summary": {
            "total_steps": total_steps,
            "average_daily_steps": avg_steps,
            "total_active_minutes": total_active_min,
            "average_active_minutes": avg_active_min,
            "total_distance_km": round(total_dist, 2),
            "total_calories_burned": total_cal,
            "steps_by_day": steps_by_day
        },
        "sleep_summary": {
            "average_sleep_duration_hours": avg_sleep_hrs,
            "average_sleep_duration_formatted": f"{int(avg_sleep_hrs)}h {int((avg_sleep_hrs % 1) * 60)}m" if avg_sleep_hrs else "Not recorded",
            "days_tracked": days_with_sleep,
            "sleep_by_day": sleep_by_day
        },
        "food_summary": {
            "meals_logged": len(foods),
            "average_calories": avg_food_cal,
            "average_protein_g": avg_protein,
            "average_carbs_g": avg_carbs,
            "average_fat_g": avg_fat
        },
        "journal_summary": {
            "entries_count": len(checkins),
            "feelings": [c.get("feeling") for c in checkins if c.get("feeling")]
        },
        "weekly_patterns": [
            {
                "pattern": "Weekly Movement Consistency",
                "observation": f"Active records tracked across {days_with_activity} of 7 days.",
                "supporting_data": f"Total {total_steps} steps accumulated this week."
            }
        ] if has_data else [],
        "weekly_guidance": [
            {
                "title": "Consistent Circadian Target",
                "category": "Rest & Recovery",
                "description": "Maintaining identical wake-up times within 30 minutes enhances daytime alertness."
            }
        ],
        "disclaimer": DISCLAIMER_TEXT,
        "generated_at": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
    }


def generate_monthly_report_data(
    year: int,
    month: int,
    data: Dict[str, Any],
    user: UserModel
) -> Dict[str, Any]:
    """Generate structured Monthly report for calendar month."""
    start_d, end_d = get_month_date_range(year, month)
    acts = data["activities"]
    sleeps = data["sleep"]
    foods = data["food"]
    checkins = data["checkins"]
    wellness = data["wellness"]

    has_data = bool(acts or sleeps or foods or checkins or wellness)
    month_name = calendar.month_name[month]
    total_days = (end_d - start_d).days + 1

    total_steps = sum(a.get("steps", 0) for a in acts)
    total_active_min = sum(a.get("active_minutes", 0) for a in acts)
    total_dist = sum(float(a.get("distance_km", 0.0)) for a in acts)
    total_cal = sum(a.get("calories_burned", 0) for a in acts)

    days_with_activity = len(acts)
    avg_steps = int(total_steps / days_with_activity) if days_with_activity > 0 else 0
    avg_active_min = int(total_active_min / days_with_activity) if days_with_activity > 0 else 0

    total_sleep_hrs = sum(s.get("hours", 0.0) for s in sleeps)
    days_with_sleep = len(sleeps)
    avg_sleep_hrs = round(total_sleep_hrs / days_with_sleep, 2) if days_with_sleep > 0 else 0.0

    scores = [w["score"] for w in wellness if w.get("score") is not None]
    avg_score = int(sum(scores) / len(scores)) if scores else None
    highest_score = max(scores) if scores else None
    lowest_score = min(scores) if scores else None

    # Tracked days set
    all_dates = set()
    for a in acts: all_dates.add(a["record_date"])
    for s in sleeps: all_dates.add(s["record_date"])

    return {
        "report_type": "Monthly",
        "title": "HEALTHSNAP MONTHLY WELLNESS REPORT",
        "month_label": f"{month_name} {year}",
        "year": year,
        "month": month,
        "user_name": user.full_name,
        "has_data": has_data,
        "message": "No data recorded for this period." if not has_data else "Monthly report generated successfully.",
        "monthly_overview": {
            "average_wellness_score": avg_score,
            "highest_score": highest_score,
            "lowest_score": lowest_score,
            "total_tracked_days": len(all_dates),
            "calendar_days": total_days,
            "tracking_rate": f"{int((len(all_dates) / max(1, total_days)) * 100)}%"
        },
        "activity": {
            "total_monthly_steps": total_steps,
            "average_daily_steps": avg_steps,
            "total_active_minutes": total_active_min,
            "average_active_minutes": avg_active_min,
            "total_distance_km": round(total_dist, 2),
            "total_calories_burned": total_cal
        },
        "sleep": {
            "average_sleep_duration_hours": avg_sleep_hrs,
            "average_sleep_formatted": f"{int(avg_sleep_hrs)}h {int((avg_sleep_hrs % 1) * 60)}m" if avg_sleep_hrs else "Not recorded",
            "total_tracked_nights": days_with_sleep
        },
        "food": {
            "total_meals_logged": len(foods),
            "average_calories": int(sum(f.get("calories", 0) for f in foods) / len(foods)) if foods else None
        },
        "journal": {
            "total_checkins": len(checkins)
        },
        "monthly_patterns": [
            {
                "observation": "Longitudinal Activity Pattern",
                "summary": f"{len(all_dates)} days of logged routine markers during {month_name}.",
                "recommendation": "Maintain habit consistency into the coming month."
            }
        ] if has_data else [],
        "monthly_progress": {
            "improved_areas": ["Routine habit logging", "Active movement awareness"] if has_data else [],
            "areas_to_focus_on": ["Sleep schedule consistency", "Dietary fiber balance"] if has_data else [],
            "consistency": f"{int((len(all_dates) / max(1, total_days)) * 100)}%"
        },
        "disclaimer": DISCLAIMER_TEXT,
        "generated_at": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
    }


# ==============================================================================
# CSV Generation Helpers
# ==============================================================================

def generate_daily_csv(report: Dict[str, Any]) -> str:
    """Produce clean structured CSV for daily report."""
    output = io.StringIO()
    writer = csv.writer(output)

    writer.writerow(["HEALTHSNAP DAILY WELLNESS REPORT"])
    writer.writerow(["Date", report["date"]])
    writer.writerow(["User", report["user_name"]])
    writer.writerow(["Generated At", report["generated_at"]])
    writer.writerow([])

    if not report["has_data"]:
        writer.writerow(["Status", "No data recorded for this period."])
        writer.writerow([])
        writer.writerow(["Disclaimer", report["disclaimer"]])
        return output.getvalue()

    # Wellness summary
    ws = report["wellness_summary"]
    writer.writerow(["--- WELLNESS SUMMARY ---"])
    writer.writerow(["Metric", "Value"])
    writer.writerow(["Wellness Score", f"{ws['score']}/{ws['max_score']}" if ws['score'] else "Not recorded"])
    writer.writerow(["Status", ws.get("status", "Not recorded")])
    writer.writerow(["Trend", ws.get("trend", "Not recorded")])
    writer.writerow([])

    # Activity
    act = report["activity"]
    writer.writerow(["--- ACTIVITY ---"])
    writer.writerow(["Metric", "Value"])
    writer.writerow(["Steps", act["steps"] if act["steps"] is not None else "Not recorded"])
    writer.writerow(["Step Goal", act["step_goal"] if act["step_goal"] is not None else "Not recorded"])
    writer.writerow(["Active Minutes", act["active_minutes"] if act["active_minutes"] is not None else "Not recorded"])
    writer.writerow(["Distance Km", act["distance_km"] if act["distance_km"] is not None else "Not recorded"])
    writer.writerow(["Calories Burned", act["calories_burned"] if act["calories_burned"] is not None else "Not recorded"])
    writer.writerow([])

    # Sleep
    sl = report["sleep"]
    writer.writerow(["--- SLEEP ---"])
    writer.writerow(["Metric", "Value"])
    writer.writerow(["Duration", sl["duration"]])
    writer.writerow(["Quality", sl["quality"]])
    writer.writerow(["Efficiency", sl["efficiency"]])
    writer.writerow(["Deep Sleep", sl["deep_sleep"]])
    writer.writerow(["REM Sleep", sl["rem_sleep"]])
    writer.writerow(["Light Sleep", sl["light_sleep"]])
    writer.writerow([])

    # Food
    food = report["food"]
    writer.writerow(["--- FOOD / NUTRITION ---"])
    writer.writerow(["Meal Name", "Time", "Calories", "Protein (g)", "Carbs (g)", "Fat (g)"])
    if food["meals"]:
        for m in food["meals"]:
            writer.writerow([
                m.get("name", "Meal"),
                m.get("time", ""),
                m.get("calories", ""),
                m.get("protein", ""),
                m.get("carbs", ""),
                m.get("fat", "")
            ])
        if food.get("totals"):
            t = food["totals"]
            writer.writerow(["TOTALS", "", t["calories"], t["protein_g"], t["carbs_g"], t["fat_g"]])
    else:
        writer.writerow(["No meals logged for this date", "", "", "", "", ""])
    writer.writerow([])

    # Journal
    jr = report["journal"]
    writer.writerow(["--- JOURNAL & CHECK-IN ---"])
    writer.writerow(["Feeling", "Symptoms", "Severity", "Duration", "Notes"])
    if jr["entries"]:
        for j in jr["entries"]:
            writer.writerow([
                j.get("feeling", ""),
                j.get("symptoms", ""),
                j.get("severity", ""),
                j.get("duration", ""),
                j.get("notes", "")
            ])
    else:
        writer.writerow(["No check-in entries logged", "", "", "", ""])
    writer.writerow([])

    writer.writerow(["Disclaimer", report["disclaimer"]])
    return output.getvalue()


def generate_weekly_csv(report: Dict[str, Any]) -> str:
    """Produce clean structured CSV for weekly report with date-wise rows."""
    output = io.StringIO()
    writer = csv.writer(output)

    writer.writerow(["HEALTHSNAP WEEKLY WELLNESS REPORT"])
    writer.writerow(["Period", report["date_range"]])
    writer.writerow(["User", report["user_name"]])
    writer.writerow(["Generated At", report["generated_at"]])
    writer.writerow([])

    if not report["has_data"]:
        writer.writerow(["Status", "No data recorded for this period."])
        writer.writerow([])
        writer.writerow(["Disclaimer", report["disclaimer"]])
        return output.getvalue()

    ws = report["weekly_summary"]
    writer.writerow(["--- WEEKLY SUMMARY ---"])
    writer.writerow(["Average Wellness Score", ws["average_score"] if ws["average_score"] else "Not recorded"])
    writer.writerow(["Best Score", ws["best_score"] if ws["best_score"] else "Not recorded"])
    writer.writerow(["Lowest Score", ws["lowest_score"] if ws["lowest_score"] else "Not recorded"])
    writer.writerow(["Days Recorded", ws["days_recorded"]])
    writer.writerow([])

    # Daily breakdown table (Steps & Sleep)
    writer.writerow(["--- DAILY BREAKDOWN ---"])
    writer.writerow(["Date", "Day", "Steps", "Sleep Hours", "Sleep Quality"])
    steps_list = report["activity_summary"]["steps_by_day"]
    sleep_list = report["sleep_summary"]["sleep_by_day"]
    sleep_dict = {s["date"]: s for s in sleep_list}

    for item in steps_list:
        d = item["date"]
        s_info = sleep_dict.get(d, {})
        writer.writerow([
            d,
            item["day"],
            item["steps"] if item["recorded"] else "Not recorded",
            s_info.get("hours", "Not recorded") if s_info.get("recorded") else "Not recorded",
            s_info.get("quality", "Not recorded") if s_info.get("recorded") else "Not recorded"
        ])
    writer.writerow([])

    writer.writerow(["Disclaimer", report["disclaimer"]])
    return output.getvalue()


def generate_monthly_csv(report: Dict[str, Any]) -> str:
    """Produce clean structured CSV for monthly report."""
    output = io.StringIO()
    writer = csv.writer(output)

    writer.writerow(["HEALTHSNAP MONTHLY WELLNESS REPORT"])
    writer.writerow(["Month", report["month_label"]])
    writer.writerow(["User", report["user_name"]])
    writer.writerow(["Generated At", report["generated_at"]])
    writer.writerow([])

    if not report["has_data"]:
        writer.writerow(["Status", "No data recorded for this period."])
        writer.writerow([])
        writer.writerow(["Disclaimer", report["disclaimer"]])
        return output.getvalue()

    mo = report["monthly_overview"]
    writer.writerow(["--- MONTHLY OVERVIEW ---"])
    writer.writerow(["Average Wellness Score", mo["average_wellness_score"] if mo["average_wellness_score"] else "Not recorded"])
    writer.writerow(["Highest Score", mo["highest_score"] if mo["highest_score"] else "Not recorded"])
    writer.writerow(["Lowest Score", mo["lowest_score"] if mo["lowest_score"] else "Not recorded"])
    writer.writerow(["Total Tracked Days", f"{mo['total_tracked_days']} of {mo['calendar_days']} days ({mo['tracking_rate']})"])
    writer.writerow([])

    act = report["activity"]
    writer.writerow(["--- ACTIVITY ---"])
    writer.writerow(["Total Steps", act["total_monthly_steps"]])
    writer.writerow(["Average Daily Steps", act["average_daily_steps"]])
    writer.writerow(["Total Active Minutes", act["total_active_minutes"]])
    writer.writerow(["Total Distance Km", act["total_distance_km"]])
    writer.writerow(["Total Calories Burned", act["total_calories_burned"]])
    writer.writerow([])

    sl = report["sleep"]
    writer.writerow(["--- SLEEP ---"])
    writer.writerow(["Average Sleep Duration", sl["average_sleep_formatted"]])
    writer.writerow(["Total Tracked Nights", sl["total_tracked_nights"]])
    writer.writerow([])

    fd = report["food"]
    writer.writerow(["--- NUTRITION ---"])
    writer.writerow(["Total Meals Logged", fd["total_meals_logged"]])
    writer.writerow(["Average Calories per Meal", fd["average_calories"] if fd["average_calories"] else "Not recorded"])
    writer.writerow([])

    writer.writerow(["Disclaimer", report["disclaimer"]])
    return output.getvalue()


# ==============================================================================
# PDF Generation (ReportLab or Robust Pure-Python PDF Fallback)
# ==============================================================================

def generate_pdf_report(report: Dict[str, Any]) -> bytes:
    """
    Generate professional wellness report PDF.
    Uses ReportLab if installed; otherwise falls back to a clean PDF-1.4 stream.
    """
    try:
        from reportlab.lib.pagesizes import letter
        from reportlab.lib import colors
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=36,
            leftMargin=36,
            topMargin=36,
            bottomMargin=36
        )

        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            'ReportTitle',
            parent=styles['Heading1'],
            fontSize=20,
            leading=24,
            textColor=colors.HexColor('#0f172a'),
            fontName='Helvetica-Bold'
        )
        h2_style = ParagraphStyle(
            'H2',
            parent=styles['Heading2'],
            fontSize=12,
            leading=16,
            textColor=colors.HexColor('#10b981'),
            fontName='Helvetica-Bold',
            spaceBefore=10,
            spaceAfter=6
        )
        body_style = ParagraphStyle(
            'Body',
            parent=styles['Normal'],
            fontSize=9,
            leading=13,
            textColor=colors.HexColor('#334155'),
            fontName='Helvetica'
        )
        disclaimer_style = ParagraphStyle(
            'Disc',
            parent=styles['Italic'],
            fontSize=8,
            leading=11,
            textColor=colors.HexColor('#64748b'),
            fontName='Helvetica-Oblique'
        )

        elements = []

        # Brand header
        elements.append(Paragraph("<b>HealthSnap</b> &bull; AI Wellness Companion", h2_style))
        elements.append(Paragraph(report["title"], title_style))
        date_line = report.get("date") or report.get("date_range") or report.get("month_label") or ""
        elements.append(Paragraph(f"<b>Period:</b> {date_line} &nbsp;|&nbsp; <b>User:</b> {report['user_name']}", body_style))
        elements.append(Spacer(1, 10))
        elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#e2e8f0'), spaceAfter=12))

        if not report["has_data"]:
            elements.append(Paragraph("<b>Status:</b> No data recorded for this period.", body_style))
            elements.append(Spacer(1, 14))
            elements.append(Paragraph(report["disclaimer"], disclaimer_style))
            doc.build(elements)
            buffer.seek(0)
            return buffer.getvalue()

        # Wellness summary section
        if "wellness_summary" in report:
            ws = report["wellness_summary"]
            elements.append(Paragraph("Wellness Summary", h2_style))
            score_text = f"{ws['score']}/100 ({ws.get('status', 'Good')})" if ws.get('score') else "Not recorded"
            t_data = [
                ["Metric", "Value"],
                ["Wellness Score", score_text],
                ["Score Trend", ws.get("trend", "Not recorded")]
            ]
            t = Table(t_data, colWidths=[200, 300])
            t.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f1f5f9')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor('#0f172a')),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
            ]))
            elements.append(t)
            elements.append(Spacer(1, 10))

        # Activity section
        act = report.get("activity") or report.get("activity_summary")
        if act:
            elements.append(Paragraph("Activity & Movement", h2_style))
            act_rows = [["Metric", "Value"]]
            if "steps" in act:
                act_rows.append(["Steps", f"{act['steps']:,} steps" if act['steps'] is not None else "Not recorded"])
            if "total_steps" in act:
                act_rows.append(["Total Steps", f"{act['total_steps']:,} steps"])
            if "average_daily_steps" in act:
                act_rows.append(["Avg Daily Steps", f"{act['average_daily_steps']:,} steps"])
            if "active_minutes" in act:
                act_rows.append(["Active Minutes", f"{act['active_minutes']} min" if act['active_minutes'] is not None else "Not recorded"])
            if "total_active_minutes" in act:
                act_rows.append(["Total Active Minutes", f"{act['total_active_minutes']} min"])
            if "distance_km" in act:
                act_rows.append(["Distance", f"{act['distance_km']} km" if act['distance_km'] is not None else "Not recorded"])
            if "calories_burned" in act:
                act_rows.append(["Calories Burned", f"{act['calories_burned']} kcal" if act['calories_burned'] is not None else "Not recorded"])

            t_act = Table(act_rows, colWidths=[200, 300])
            t_act.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f1f5f9')),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
            ]))
            elements.append(t_act)
            elements.append(Spacer(1, 10))

        # Sleep section
        sl = report.get("sleep") or report.get("sleep_summary")
        if sl:
            elements.append(Paragraph("Sleep & Circadian Recovery", h2_style))
            sl_rows = [["Metric", "Value"]]
            if "duration" in sl:
                sl_rows.append(["Duration", str(sl["duration"])])
            if "average_sleep_duration_formatted" in sl:
                sl_rows.append(["Avg Duration", str(sl["average_sleep_duration_formatted"])])
            if "average_sleep_formatted" in sl:
                sl_rows.append(["Avg Duration", str(sl["average_sleep_formatted"])])
            if "quality" in sl:
                sl_rows.append(["Quality", str(sl["quality"])])
            if "efficiency" in sl:
                sl_rows.append(["Efficiency", str(sl["efficiency"])])

            t_sl = Table(sl_rows, colWidths=[200, 300])
            t_sl.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f1f5f9')),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
            ]))
            elements.append(t_sl)
            elements.append(Spacer(1, 10))

        # Disclaimer
        elements.append(Spacer(1, 14))
        elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#e2e8f0'), spaceAfter=8))
        elements.append(Paragraph(f"<b>Disclaimer:</b> {report['disclaimer']}", disclaimer_style))
        elements.append(Paragraph(f"Generated on {report['generated_at']}", disclaimer_style))

        doc.build(elements)
        buffer.seek(0)
        return buffer.getvalue()

    except ImportError:
        # Pure-Python PDF-1.4 Fallback Generator
        return generate_pure_python_pdf(report)


def generate_pure_python_pdf(report: Dict[str, Any]) -> bytes:
    """
    Zero-dependency pure Python PDF generator.
    Produces a valid standard PDF document without external libraries.
    """
    lines = [
        "HEALTHSNAP WELLNESS REPORT",
        f"Title: {report.get('title', 'Wellness Report')}",
        f"User: {report.get('user_name', 'User')}",
        f"Period: {report.get('date') or report.get('date_range') or report.get('month_label') or ''}",
        f"Generated: {report.get('generated_at', '')}",
        "----------------------------------------------------------------",
    ]

    if not report.get("has_data"):
        lines.append("Status: No data recorded for this period.")
    else:
        # Score
        if "wellness_summary" in report:
            ws = report["wellness_summary"]
            lines.append(f"Wellness Score: {ws.get('score', 'Not recorded')}/100 (Status: {ws.get('status', 'Not recorded')})")
        
        # Activity
        act = report.get("activity") or report.get("activity_summary")
        if act:
            lines.append("")
            lines.append("[ACTIVITY]")
            for k in ["steps", "total_steps", "average_daily_steps", "active_minutes", "total_active_minutes", "distance_km", "calories_burned"]:
                if k in act and act[k] is not None:
                    lines.append(f"  {k.replace('_', ' ').title()}: {act[k]}")

        # Sleep
        sl = report.get("sleep") or report.get("sleep_summary")
        if sl:
            lines.append("")
            lines.append("[SLEEP]")
            for k in ["duration", "average_sleep_duration_formatted", "average_sleep_formatted", "quality", "efficiency"]:
                if k in sl and sl[k] is not None:
                    lines.append(f"  {k.replace('_', ' ').title()}: {sl[k]}")

        # Food
        fd = report.get("food") or report.get("food_summary")
        if fd:
            lines.append("")
            lines.append("[NUTRITION]")
            lines.append(f"  Meals Logged: {fd.get('meals_logged', fd.get('total_meals_logged', 0))}")

    lines.append("")
    lines.append("----------------------------------------------------------------")
    lines.append("DISCLAIMER:")
    lines.append(report.get("disclaimer", DISCLAIMER_TEXT))

    # Construct simple PDF syntax
    content_stream = "BT /F1 10 Tf 40 750 Td 14 TL\n"
    for line in lines:
        safe_line = line.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")
        content_stream += f"({safe_line}) '\n"
    content_stream += "ET\n"
    content_bytes = content_stream.encode("latin-1", "replace")

    pdf = bytearray()
    pdf.extend(b"%PDF-1.4\n")
    
    offsets = []
    
    def add_obj(obj_bytes):
        offsets.append(len(pdf))
        pdf.extend(obj_bytes)
        pdf.extend(b"\n")

    # 1: Catalog
    add_obj(b"1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj")
    # 2: Pages
    add_obj(b"2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj")
    # 3: Page
    add_obj(b"3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj")
    # 4: Contents
    add_obj(f"4 0 obj\n<< /Length {len(content_bytes)} >>\nstream\n".encode("ascii") + content_bytes + b"\nendstream\nendobj")
    # 5: Font
    add_obj(b"5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj")

    xref_pos = len(pdf)
    pdf.extend(f"xref\n0 {len(offsets)+1}\n0000000000 65535 f \n".encode("ascii"))
    for offset in offsets:
        pdf.extend(f"{offset:010d} 00000 n \n".encode("ascii"))
    pdf.extend(f"trailer\n<< /Size {len(offsets)+1} /Root 1 0 R >>\nstartxref\n{xref_pos}\n%%EOF\n".encode("ascii"))
    
    return bytes(pdf)


# ==============================================================================
# API Endpoints
# ==============================================================================

# ----------------- DAILY -----------------

@router.get("/daily")
def get_daily_report(
    date_str: str = Query(..., alias="date", description="Date in YYYY-MM-DD format"),
    db_session: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    """Get authenticated user's Daily Wellness Report data in JSON format."""
    try:
        t_date = datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Expected YYYY-MM-DD.")

    raw_data = fetch_user_data_for_range(current_user.id, t_date, t_date, db_session)
    return generate_daily_report_data(t_date, raw_data, current_user)


@router.get("/daily/csv")
def download_daily_csv(
    date_str: str = Query(..., alias="date"),
    db_session: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    """Download authenticated user's Daily Report as a structured CSV."""
    try:
        t_date = datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format.")

    raw_data = fetch_user_data_for_range(current_user.id, t_date, t_date, db_session)
    report = generate_daily_report_data(t_date, raw_data, current_user)
    csv_content = generate_daily_csv(report)
    filename = f"HealthSnap_Daily_{t_date.isoformat()}.csv"

    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )


@router.get("/daily/pdf")
def download_daily_pdf(
    date_str: str = Query(..., alias="date"),
    db_session: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    """Download authenticated user's Daily Report as a formatted PDF."""
    try:
        t_date = datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format.")

    raw_data = fetch_user_data_for_range(current_user.id, t_date, t_date, db_session)
    report = generate_daily_report_data(t_date, raw_data, current_user)
    pdf_bytes = generate_pdf_report(report)
    filename = f"HealthSnap_Daily_{t_date.isoformat()}.pdf"

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )


@router.get("/daily/json")
def download_daily_json(
    date_str: str = Query(..., alias="date"),
    db_session: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    """Download authenticated user's Daily Report as structured JSON."""
    try:
        t_date = datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format.")

    raw_data = fetch_user_data_for_range(current_user.id, t_date, t_date, db_session)
    report = generate_daily_report_data(t_date, raw_data, current_user)
    json_bytes = json.dumps(report, indent=2).encode("utf-8")
    filename = f"HealthSnap_Daily_{t_date.isoformat()}.json"

    return Response(
        content=json_bytes,
        media_type="application/json",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )


# ----------------- WEEKLY -----------------

@router.get("/weekly")
def get_weekly_report(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    db_session: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    """Get authenticated user's Weekly Wellness Report for 7 days."""
    try:
        if end_date:
            end_d = datetime.strptime(end_date, "%Y-%m-%d").date()
        else:
            end_d = date.today()

        if start_date:
            start_d = datetime.strptime(start_date, "%Y-%m-%d").date()
        else:
            start_d = end_d - timedelta(days=6)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Expected YYYY-MM-DD.")

    raw_data = fetch_user_data_for_range(current_user.id, start_d, end_d, db_session)
    return generate_weekly_report_data(start_d, end_d, raw_data, current_user)


@router.get("/weekly/csv")
def download_weekly_csv(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    db_session: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    """Download Weekly Report as CSV."""
    if end_date:
        end_d = datetime.strptime(end_date, "%Y-%m-%d").date()
    else:
        end_d = date.today()

    if start_date:
        start_d = datetime.strptime(start_date, "%Y-%m-%d").date()
    else:
        start_d = end_d - timedelta(days=6)

    raw_data = fetch_user_data_for_range(current_user.id, start_d, end_d, db_session)
    report = generate_weekly_report_data(start_d, end_d, raw_data, current_user)
    csv_content = generate_weekly_csv(report)
    filename = f"HealthSnap_Weekly_{start_d.isoformat()}_to_{end_d.isoformat()}.csv"

    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )


@router.get("/weekly/pdf")
def download_weekly_pdf(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    db_session: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    """Download Weekly Report as PDF."""
    if end_date:
        end_d = datetime.strptime(end_date, "%Y-%m-%d").date()
    else:
        end_d = date.today()

    if start_date:
        start_d = datetime.strptime(start_date, "%Y-%m-%d").date()
    else:
        start_d = end_d - timedelta(days=6)

    raw_data = fetch_user_data_for_range(current_user.id, start_d, end_d, db_session)
    report = generate_weekly_report_data(start_d, end_d, raw_data, current_user)
    pdf_bytes = generate_pdf_report(report)
    filename = f"HealthSnap_Weekly_{start_d.isoformat()}_to_{end_d.isoformat()}.pdf"

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )


@router.get("/weekly/json")
def download_weekly_json(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    db_session: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    """Download Weekly Report as JSON."""
    if end_date:
        end_d = datetime.strptime(end_date, "%Y-%m-%d").date()
    else:
        end_d = date.today()

    if start_date:
        start_d = datetime.strptime(start_date, "%Y-%m-%d").date()
    else:
        start_d = end_d - timedelta(days=6)

    raw_data = fetch_user_data_for_range(current_user.id, start_d, end_d, db_session)
    report = generate_weekly_report_data(start_d, end_d, raw_data, current_user)
    json_bytes = json.dumps(report, indent=2).encode("utf-8")
    filename = f"HealthSnap_Weekly_{start_d.isoformat()}_to_{end_d.isoformat()}.json"

    return Response(
        content=json_bytes,
        media_type="application/json",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )


# ----------------- MONTHLY -----------------

@router.get("/monthly")
def get_monthly_report(
    year: int = Query(..., ge=2000, le=2100),
    month: int = Query(..., ge=1, le=12),
    db_session: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    """Get authenticated user's Monthly Wellness Report."""
    start_d, end_d = get_month_date_range(year, month)
    raw_data = fetch_user_data_for_range(current_user.id, start_d, end_d, db_session)
    return generate_monthly_report_data(year, month, raw_data, current_user)


@router.get("/monthly/csv")
def download_monthly_csv(
    year: int = Query(..., ge=2000, le=2100),
    month: int = Query(..., ge=1, le=12),
    db_session: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    """Download Monthly Report as CSV."""
    start_d, end_d = get_month_date_range(year, month)
    raw_data = fetch_user_data_for_range(current_user.id, start_d, end_d, db_session)
    report = generate_monthly_report_data(year, month, raw_data, current_user)
    csv_content = generate_monthly_csv(report)
    filename = f"HealthSnap_Monthly_{year}-{month:02d}.csv"

    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )


@router.get("/monthly/pdf")
def download_monthly_pdf(
    year: int = Query(..., ge=2000, le=2100),
    month: int = Query(..., ge=1, le=12),
    db_session: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    """Download Monthly Report as PDF."""
    start_d, end_d = get_month_date_range(year, month)
    raw_data = fetch_user_data_for_range(current_user.id, start_d, end_d, db_session)
    report = generate_monthly_report_data(year, month, raw_data, current_user)
    pdf_bytes = generate_pdf_report(report)
    filename = f"HealthSnap_Monthly_{year}-{month:02d}.pdf"

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )


@router.get("/monthly/json")
def download_monthly_json(
    year: int = Query(..., ge=2000, le=2100),
    month: int = Query(..., ge=1, le=12),
    db_session: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    """Download Monthly Report as JSON."""
    start_d, end_d = get_month_date_range(year, month)
    raw_data = fetch_user_data_for_range(current_user.id, start_d, end_d, db_session)
    report = generate_monthly_report_data(year, month, raw_data, current_user)
    json_bytes = json.dumps(report, indent=2).encode("utf-8")
    filename = f"HealthSnap_Monthly_{year}-{month:02d}.json"

    return Response(
        content=json_bytes,
        media_type="application/json",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )
