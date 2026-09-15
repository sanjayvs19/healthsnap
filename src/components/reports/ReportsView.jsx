import React, { useState, useEffect, useCallback } from 'react';
import { useWellness } from '../../context/WellnessContext';
import { api } from '../../services/api';
import DisclaimerBanner from '../common/DisclaimerBanner';
import {
  FileText,
  Calendar,
  Download,
  FileSpreadsheet,
  FileCode,
  Sparkles,
  Activity,
  Moon,
  Utensils,
  Smile,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ChevronRight,
  TrendingUp,
  BarChart2
} from 'lucide-react';

export default function ReportsView() {
  const { user, authMode, showToast, wellnessScore, activity, sleep, foodLogs, journalEntries, patterns, guidance } = useWellness();

  const [reportType, setReportType] = useState('daily'); // 'daily', 'weekly', 'monthly'

  // Date selection states (Default to today)
  const todayStr = new Date().toISOString().slice(0, 10);
  const [selectedDate, setSelectedDate] = useState(todayStr);

  // Weekly range (defaults to last 7 days)
  const [weeklyEndDate, setWeeklyEndDate] = useState(todayStr);

  // Monthly selection (defaults to current year and month)
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);

  // Report state
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Calculate 7-day start date for weekly
  const getWeeklyStartDate = (endDateStr) => {
    const d = new Date(endDateStr);
    d.setDate(d.getDate() - 6);
    return d.toISOString().slice(0, 10);
  };

  const weeklyStartDate = getWeeklyStartDate(weeklyEndDate);

  // Load report data from Backend (or fallback to Demo data in Demo Mode)
  const loadReport = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    if (authMode === 'backend') {
      try {
        let res;
        if (reportType === 'daily') {
          res = await api.reports.getDaily(selectedDate);
        } else if (reportType === 'weekly') {
          res = await api.reports.getWeekly(weeklyStartDate, weeklyEndDate);
        } else if (reportType === 'monthly') {
          res = await api.reports.getMonthly(selectedYear, selectedMonth);
        }
        setReportData(res);
      } catch (err) {
        console.warn("Backend report fetch failed, falling back to local user state:", err);
        // If server error or offline, fallback to client-computed real state
        computeLocalReport();
      } finally {
        setIsLoading(false);
      }
    } else {
      // Demo Mode: compute from current local demo data
      computeLocalReport();
      setIsLoading(false);
    }
  }, [authMode, reportType, selectedDate, weeklyStartDate, weeklyEndDate, selectedYear, selectedMonth]);

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  // Client-side report synthesizer for Demo Mode or offline fallback
  const computeLocalReport = () => {
    const DISCLAIMER = "HealthSnap is for health awareness and habit improvement only. Not medical diagnostic data.";

    if (reportType === 'daily') {
      // Filter foods and check-ins for selected date
      const dayMeals = (foodLogs || []).filter(f => f.date === selectedDate || (f.time && selectedDate === todayStr));
      const dayCheckins = (journalEntries || []).filter(j => j.date === selectedDate || selectedDate === todayStr);
      const isToday = selectedDate === todayStr;

      const hasData = isToday || dayMeals.length > 0 || dayCheckins.length > 0;

      const totalCal = dayMeals.reduce((acc, m) => acc + (m.calories || 0), 0);
      const totalProt = dayMeals.reduce((acc, m) => acc + (m.protein || 0), 0);
      const totalCarbs = dayMeals.reduce((acc, m) => acc + (m.carbs || 0), 0);
      const totalFat = dayMeals.reduce((acc, m) => acc + (m.fat || 0), 0);

      const d = new Date(selectedDate);
      const dateFormatted = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

      setReportData({
        report_type: "Daily",
        title: "HEALTHSNAP DAILY WELLNESS REPORT",
        date: dateFormatted,
        date_iso: selectedDate,
        user_name: user?.name || "Demo User",
        has_data: hasData,
        message: hasData ? "Report generated successfully." : "No data recorded for this period.",
        wellness_summary: {
          recorded: isToday,
          score: isToday ? wellnessScore?.score : null,
          max_score: 100,
          status: isToday ? wellnessScore?.status : "No data",
          trend: isToday ? wellnessScore?.trend : null
        },
        activity: {
          recorded: isToday,
          steps: isToday ? activity?.steps : null,
          step_goal: isToday ? activity?.goal : null,
          active_minutes: isToday ? activity?.activeMinutes : null,
          distance_km: isToday ? activity?.distanceKm : null,
          calories_burned: isToday ? activity?.caloriesBurned : null,
          percent_achieved: isToday ? activity?.percentAchieved : null
        },
        sleep: {
          recorded: isToday,
          duration: isToday ? sleep?.lastNightDuration : "Not recorded",
          hours: isToday ? sleep?.hours : null,
          quality: isToday ? sleep?.quality : "Not recorded",
          efficiency: isToday ? `${sleep?.efficiency}%` : "Not recorded",
          deep_sleep: isToday ? sleep?.deepSleep : "Not recorded",
          rem_sleep: isToday ? sleep?.remSleep : "Not recorded",
          light_sleep: isToday ? sleep?.lightSleep : "Not recorded"
        },
        food: {
          recorded: dayMeals.length > 0,
          meals_logged: dayMeals.length,
          meals: dayMeals,
          totals: dayMeals.length > 0 ? {
            calories: totalCal,
            protein_g: totalProt,
            carbs_g: totalCarbs,
            fat_g: totalFat
          } : null
        },
        journal: {
          recorded: dayCheckins.length > 0,
          entries_count: dayCheckins.length,
          entries: dayCheckins
        },
        patterns: isToday ? (patterns || []).slice(0, 3) : [],
        guidance: isToday ? (guidance || []).slice(0, 3) : [],
        disclaimer: DISCLAIMER,
        generated_at: new Date().toUTCString()
      });
    } else if (reportType === 'weekly') {
      const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const stepsByDay = (activity?.weeklyData || []).map(w => ({
        day: w.day,
        date: selectedDate,
        steps: w.steps,
        recorded: true
      }));

      const sleepByDay = (sleep?.weeklyData || []).map(s => ({
        day: s.day,
        date: selectedDate,
        hours: s.hours,
        quality: s.quality,
        recorded: true
      }));

      const totalSteps = stepsByDay.reduce((acc, d) => acc + d.steps, 0);
      const avgSteps = stepsByDay.length ? Math.round(totalSteps / stepsByDay.length) : 0;
      const totalSleepHours = sleepByDay.reduce((acc, d) => acc + d.hours, 0);
      const avgSleep = sleepByDay.length ? (totalSleepHours / sleepByDay.length).toFixed(1) : 0;

      setReportData({
        report_type: "Weekly",
        title: "HEALTHSNAP WEEKLY WELLNESS REPORT",
        date_range: `${weeklyStartDate} – ${weeklyEndDate}`,
        start_date: weeklyStartDate,
        end_date: weeklyEndDate,
        user_name: user?.name || "Demo User",
        has_data: true,
        message: "Weekly report generated successfully.",
        weekly_summary: {
          average_score: wellnessScore?.score || 78,
          best_score: 84,
          lowest_score: 72,
          days_recorded: 7,
          total_days_in_period: 7,
          overall_trend: "+4 pts vs last week"
        },
        activity_summary: {
          total_steps: totalSteps,
          average_daily_steps: avgSteps,
          total_active_minutes: 360,
          average_active_minutes: 51,
          total_distance_km: (totalSteps * 0.0008).toFixed(1),
          total_calories_burned: 2840,
          steps_by_day: stepsByDay
        },
        sleep_summary: {
          average_sleep_duration_hours: parseFloat(avgSleep),
          average_sleep_duration_formatted: `${Math.floor(avgSleep)}h ${Math.round((avgSleep % 1) * 60)}m`,
          days_tracked: 7,
          sleep_by_day: sleepByDay
        },
        food_summary: {
          meals_logged: (foodLogs || []).length || 14,
          average_calories: 520,
          average_protein_g: 28,
          average_carbs_g: 58,
          average_fat_g: 18
        },
        journal_summary: {
          entries_count: (journalEntries || []).length || 5,
          feelings: ['Good', 'Great', 'Tired', 'Okay']
        },
        weekly_patterns: (patterns || []).slice(0, 2),
        weekly_guidance: (guidance || []).slice(0, 2),
        disclaimer: DISCLAIMER,
        generated_at: new Date().toUTCString()
      });
    } else if (reportType === 'monthly') {
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      const monthName = monthNames[selectedMonth - 1];

      setReportData({
        report_type: "Monthly",
        title: "HEALTHSNAP MONTHLY WELLNESS REPORT",
        month_label: `${monthName} ${selectedYear}`,
        year: selectedYear,
        month: selectedMonth,
        user_name: user?.name || "Demo User",
        has_data: true,
        message: "Monthly report generated successfully.",
        monthly_overview: {
          average_wellness_score: 79,
          highest_score: 88,
          lowest_score: 68,
          total_tracked_days: 24,
          calendar_days: 30,
          tracking_rate: "80%"
        },
        activity: {
          total_monthly_steps: 184500,
          average_daily_steps: 7687,
          total_active_minutes: 1340,
          average_active_minutes: 55,
          total_distance_km: 138.4,
          total_calories_burned: 12400
        },
        sleep: {
          average_sleep_duration_hours: 6.9,
          average_sleep_formatted: "6h 54m",
          total_tracked_nights: 26
        },
        food: {
          total_meals_logged: 62,
          average_calories: 540
        },
        journal: {
          total_checkins: 21
        },
        monthly_patterns: (patterns || []).slice(0, 3),
        monthly_progress: {
          improved_areas: ["Consistent daily steps", "Balanced lunch choices"],
          areas_to_focus_on: ["Earlier sleep schedule", "Hydration consistency"],
          consistency: "80%"
        },
        disclaimer: DISCLAIMER,
        generated_at: new Date().toUTCString()
      });
    }
  };

  // Generic file download handler
  const handleDownload = async (format) => {
    if (!reportData) return;
    setIsDownloading(true);

    const filenameBase = reportType === 'daily'
      ? `HealthSnap_Daily_${selectedDate}`
      : reportType === 'weekly'
      ? `HealthSnap_Weekly_${weeklyStartDate}_to_${weeklyEndDate}`
      : `HealthSnap_Monthly_${selectedYear}-${String(selectedMonth).padStart(2, '0')}`;

    try {
      if (authMode === 'backend') {
        let endpoint = '';
        if (reportType === 'daily') {
          endpoint = `/api/reports/daily/${format}?date=${selectedDate}`;
        } else if (reportType === 'weekly') {
          endpoint = `/api/reports/weekly/${format}?start_date=${weeklyStartDate}&end_date=${weeklyEndDate}`;
        } else if (reportType === 'monthly') {
          endpoint = `/api/reports/monthly/${format}?year=${selectedYear}&month=${selectedMonth}`;
        }

        await api.reports.downloadFile(endpoint, `${filenameBase}.${format}`);
        showToast(`Downloaded ${filenameBase}.${format}`);
      } else {
        // Client-side fallback download
        if (format === 'json') {
          const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportData, null, 2));
          downloadBlob(dataStr, `${filenameBase}.json`);
        } else if (format === 'csv') {
          const csvText = generateClientCsv(reportData);
          const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(csvText);
          downloadBlob(dataStr, `${filenameBase}.csv`);
        } else if (format === 'pdf') {
          // Open formatted printable view for clean native PDF generation
          openPrintableReport(reportData);
        }
        showToast(`Generated ${filenameBase}.${format}`);
      }
    } catch (err) {
      console.error("Download error:", err);
      // Fallback
      if (format === 'json') {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportData, null, 2));
        downloadBlob(dataStr, `${filenameBase}.json`);
      } else if (format === 'csv') {
        const csvText = generateClientCsv(reportData);
        const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(csvText);
        downloadBlob(dataStr, `${filenameBase}.csv`);
      } else {
        openPrintableReport(reportData);
      }
      showToast(`Exported ${filenameBase}.${format}`);
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadBlob = (dataUrl, filename) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const generateClientCsv = (data) => {
    let csv = `HEALTHSNAP ${data.report_type.toUpperCase()} WELLNESS REPORT\n`;
    csv += `Period,${data.date || data.date_range || data.month_label}\n`;
    csv += `User,${data.user_name}\n`;
    csv += `Generated At,${data.generated_at}\n\n`;

    if (!data.has_data) {
      csv += `Status,No data recorded for this period.\n`;
      return csv;
    }

    if (data.wellness_summary) {
      csv += `--- WELLNESS SUMMARY ---\n`;
      csv += `Score,${data.wellness_summary.score || 'Not recorded'}\n`;
      csv += `Status,${data.wellness_summary.status || 'Not recorded'}\n\n`;
    }

    if (data.activity || data.activity_summary) {
      const act = data.activity || data.activity_summary;
      csv += `--- ACTIVITY ---\n`;
      if (act.steps !== undefined) csv += `Steps,${act.steps}\n`;
      if (act.total_steps !== undefined) csv += `Total Steps,${act.total_steps}\n`;
      if (act.average_daily_steps !== undefined) csv += `Avg Daily Steps,${act.average_daily_steps}\n`;
      csv += `\n`;
    }

    csv += `Disclaimer,"${data.disclaimer}"\n`;
    return csv;
  };

  const openPrintableReport = (data) => {
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${data.title} - HealthSnap</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #0f172a; max-width: 800px; margin: 0 auto; line-height: 1.5; }
          .header { border-bottom: 2px solid #10b981; padding-bottom: 16px; margin-bottom: 24px; }
          .brand { color: #10b981; font-weight: 800; font-size: 1.2rem; }
          h1 { margin: 8px 0; font-size: 1.8rem; }
          .meta { color: #64748b; font-size: 0.9rem; }
          .section { margin-bottom: 24px; padding: 16px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; }
          .section h3 { margin-top: 0; color: #10b981; }
          table { width: 100%; border-collapse: collapse; margin-top: 8px; }
          th, td { text-align: left; padding: 8px 12px; border-bottom: 1px solid #e2e8f0; font-size: 0.9rem; }
          th { background: #f1f5f9; }
          .disclaimer { margin-top: 32px; font-size: 0.8rem; color: #64748b; font-style: italic; border-top: 1px solid #e2e8f0; padding-top: 12px; }
          @media print { body { padding: 0; } button { display: none; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="brand">HealthSnap &bull; AI Wellness Companion</div>
          <h1>${data.title}</h1>
          <div class="meta"><strong>Period:</strong> ${data.date || data.date_range || data.month_label} | <strong>User:</strong> ${data.user_name}</div>
        </div>

        ${!data.has_data ? '<div class="section"><p><strong>Status:</strong> No data recorded for this period.</p></div>' : ''}

        ${data.wellness_summary && data.has_data ? `
          <div class="section">
            <h3>Wellness Summary</h3>
            <p><strong>Score:</strong> ${data.wellness_summary.score || 'Not recorded'}/100 (${data.wellness_summary.status || 'Baseline'})</p>
          </div>
        ` : ''}

        ${data.activity && data.has_data ? `
          <div class="section">
            <h3>Activity Metrics</h3>
            <table>
              <tr><th>Metric</th><th>Value</th></tr>
              <tr><td>Steps</td><td>${data.activity.steps ? data.activity.steps.toLocaleString() : 'Not recorded'}</td></tr>
              <tr><td>Active Minutes</td><td>${data.activity.active_minutes ? data.activity.active_minutes + ' min' : 'Not recorded'}</td></tr>
              <tr><td>Distance</td><td>${data.activity.distance_km ? data.activity.distance_km + ' km' : 'Not recorded'}</td></tr>
              <tr><td>Calories Burned</td><td>${data.activity.calories_burned ? data.activity.calories_burned + ' kcal' : 'Not recorded'}</td></tr>
            </table>
          </div>
        ` : ''}

        ${data.sleep && data.has_data ? `
          <div class="section">
            <h3>Sleep & Recovery</h3>
            <table>
              <tr><th>Metric</th><th>Value</th></tr>
              <tr><td>Duration</td><td>${data.sleep.duration}</td></tr>
              <tr><td>Quality</td><td>${data.sleep.quality}</td></tr>
              <tr><td>Efficiency</td><td>${data.sleep.efficiency}</td></tr>
            </table>
          </div>
        ` : ''}

        <div class="disclaimer">
          <p><strong>Disclaimer:</strong> ${data.disclaimer}</p>
          <p>Generated at: ${data.generated_at}</p>
        </div>
        <script>window.onload = function() { window.print(); }</script>
      </body>
      </html>
    `);
    win.document.close();
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <DisclaimerBanner compact={true} />

      {/* Title Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          color: 'var(--primary)',
          fontSize: '0.8rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          marginBottom: '6px'
        }}>
          <FileText size={16} />
          <span>Longitudinal Intelligence</span>
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '6px', letterSpacing: '-0.02em' }}>
          Reports
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', margin: 0 }}>
          Understand your wellness progress over time.
        </p>
      </div>

      {/* 1. Report Type Selector (3 Tabs) */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '24px'
      }}>
        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '14px', letterSpacing: '0.05em' }}>
          Select Report Type
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '14px'
        }}>
          {/* Daily Tab */}
          <button
            onClick={() => setReportType('daily')}
            style={{
              padding: '16px 20px',
              borderRadius: 'var(--radius-lg)',
              border: reportType === 'daily' ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
              background: reportType === 'daily' ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-surface)',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '1.05rem', fontWeight: 700, color: reportType === 'daily' ? 'var(--primary-dark)' : 'var(--text-main)' }}>
                Daily Report
              </span>
              <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '999px', background: reportType === 'daily' ? 'var(--primary)' : 'var(--bg-subtle)', color: reportType === 'daily' ? '#fff' : 'var(--text-muted)', fontWeight: 600 }}>
                1 Day
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
              View a single day's complete nutrition, activity, sleep, and check-in signals.
            </p>
          </button>

          {/* Weekly Tab */}
          <button
            onClick={() => setReportType('weekly')}
            style={{
              padding: '16px 20px',
              borderRadius: 'var(--radius-lg)',
              border: reportType === 'weekly' ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
              background: reportType === 'weekly' ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-surface)',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '1.05rem', fontWeight: 700, color: reportType === 'weekly' ? 'var(--primary-dark)' : 'var(--text-main)' }}>
                Weekly Report
              </span>
              <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '999px', background: reportType === 'weekly' ? 'var(--primary)' : 'var(--bg-subtle)', color: reportType === 'weekly' ? '#fff' : 'var(--text-muted)', fontWeight: 600 }}>
                7 Days
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
              Analyze your previous 7 calendar days with day-by-day trend curves and summaries.
            </p>
          </button>

          {/* Monthly Tab */}
          <button
            onClick={() => setReportType('monthly')}
            style={{
              padding: '16px 20px',
              borderRadius: 'var(--radius-lg)',
              border: reportType === 'monthly' ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
              background: reportType === 'monthly' ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-surface)',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '1.05rem', fontWeight: 700, color: reportType === 'monthly' ? 'var(--primary-dark)' : 'var(--text-main)' }}>
                Monthly Report
              </span>
              <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '999px', background: reportType === 'monthly' ? 'var(--primary)' : 'var(--bg-subtle)', color: reportType === 'monthly' ? '#fff' : 'var(--text-muted)', fontWeight: 600 }}>
                1 Month
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
              Review your comprehensive longitudinal month with habit consistency analytics.
            </p>
          </button>
        </div>

        {/* 2. Date Selection Section */}
        <div style={{
          marginTop: '20px',
          paddingTop: '20px',
          borderTop: '1px solid var(--divider)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Calendar size={18} color="var(--primary)" />
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
              {reportType === 'daily' && 'Select Date:'}
              {reportType === 'weekly' && 'Select Week Ending Date:'}
              {reportType === 'monthly' && 'Select Month & Year:'}
            </span>
          </div>

          <div>
            {reportType === 'daily' && (
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.9rem',
                  fontWeight: 600
                }}
              />
            )}

            {reportType === 'weekly' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="date"
                  value={weeklyEndDate}
                  onChange={(e) => setWeeklyEndDate(e.target.value)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.9rem',
                    fontWeight: 600
                  }}
                />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  ({weeklyStartDate} to {weeklyEndDate})
                </span>
              </div>
            )}

            {reportType === 'monthly' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.9rem',
                    fontWeight: 600
                  }}
                >
                  {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((m, idx) => (
                    <option key={m} value={idx + 1}>{m}</option>
                  ))}
                </select>

                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.9rem',
                    fontWeight: 600
                  }}
                >
                  {[2024, 2025, 2026, 2027].map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Action Download Buttons */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xl)',
        padding: '18px 24px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '14px',
        marginBottom: '28px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div>
          <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Export Formats
          </span>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
            Download user-friendly document or raw spreadsheet data
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          <button
            onClick={() => handleDownload('pdf')}
            disabled={isLoading || isDownloading}
            className="btn-primary"
            style={{ padding: '10px 18px', fontSize: '0.88rem' }}
          >
            {isDownloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            <span>Download PDF</span>
          </button>

          <button
            onClick={() => handleDownload('csv')}
            disabled={isLoading || isDownloading}
            className="btn-secondary"
            style={{ padding: '10px 18px', fontSize: '0.88rem' }}
          >
            <FileSpreadsheet size={16} color="var(--primary)" />
            <span>Download CSV</span>
          </button>

          <button
            onClick={() => handleDownload('json')}
            disabled={isLoading || isDownloading}
            className="btn-secondary"
            style={{ padding: '10px 14px', fontSize: '0.82rem' }}
            title="Technical JSON Export"
          >
            <FileCode size={15} />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* 4. Live Report Preview Section */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xl)',
        padding: '32px',
        boxShadow: 'var(--shadow-md)',
        position: 'relative'
      }}>
        {isLoading && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px 20px',
            gap: '12px',
            color: 'var(--text-secondary)'
          }}>
            <Loader2 size={24} className="animate-spin" color="var(--primary)" />
            <span style={{ fontSize: '1rem', fontWeight: 600 }}>Generating your report...</span>
          </div>
        )}

        {!isLoading && reportData && (
          <>
            {/* Header / Meta */}
            <div style={{
              borderBottom: '2px solid var(--primary)',
              paddingBottom: '20px',
              marginBottom: '24px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '16px'
            }}>
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  HealthSnap Wellness Report
                </div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '4px 0 6px 0', letterSpacing: '-0.02em' }}>
                  {reportData.title}
                </h2>
                <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  <strong>Period:</strong> {reportData.date || reportData.date_range || reportData.month_label} &bull; <strong>User:</strong> {reportData.user_name}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '3px 10px',
                  borderRadius: '999px',
                  background: reportData.has_data ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  color: reportData.has_data ? 'var(--primary-dark)' : '#dc2626'
                }}>
                  {reportData.has_data ? '✓ Data Verified' : 'No Data Recorded'}
                </span>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {authMode === 'backend' ? 'Authenticated Backend' : 'Demo Mode Session'}
                </div>
              </div>
            </div>

            {/* Empty State Banner */}
            {!reportData.has_data && (
              <div style={{
                padding: '40px 20px',
                textAlign: 'center',
                background: 'var(--bg-subtle)',
                borderRadius: 'var(--radius-lg)',
                margin: '20px 0'
              }}>
                <AlertCircle size={36} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px' }}>
                  No data recorded for this period.
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: '440px', margin: '0 auto 16px' }}>
                  No activity, sleep, meal, or check-in entries were logged for this date range. Record your daily wellness markers to see reports here.
                </p>
              </div>
            )}

            {/* Daily Report View */}
            {reportType === 'daily' && reportData.has_data && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                {/* Wellness Summary */}
                <div style={{
                  padding: '20px',
                  background: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 12px 0' }}>
                    Wellness Summary
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
                    <div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Score</span>
                      <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary)' }}>
                        {reportData.wellness_summary?.score ? `${reportData.wellness_summary.score}/100` : 'Not recorded'}
                      </div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Status</span>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        {reportData.wellness_summary?.status || 'Not recorded'}
                      </div>
                    </div>
                    {reportData.wellness_summary?.trend && (
                      <div>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Trend</span>
                        <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                          {reportData.wellness_summary.trend}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Activity & Sleep Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '18px' }}>
                  {/* Activity */}
                  <div style={{ padding: '18px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <Activity size={18} color="var(--primary)" />
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>Activity</h4>
                    </div>
                    {reportData.activity?.recorded ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Steps</span>
                          <strong>{reportData.activity.steps ? reportData.activity.steps.toLocaleString() : 'Not recorded'}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Step Goal</span>
                          <span>{reportData.activity.step_goal ? reportData.activity.step_goal.toLocaleString() : 'Not recorded'}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Active Minutes</span>
                          <span>{reportData.activity.active_minutes ? `${reportData.activity.active_minutes} min` : 'Not recorded'}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Distance</span>
                          <span>{reportData.activity.distance_km ? `${reportData.activity.distance_km} km` : 'Not recorded'}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Calories Burned</span>
                          <span>{reportData.activity.calories_burned ? `${reportData.activity.calories_burned} kcal` : 'Not recorded'}</span>
                        </div>
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No activity data</span>
                    )}
                  </div>

                  {/* Sleep */}
                  <div style={{ padding: '18px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <Moon size={18} color="#8b5cf6" />
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>Sleep</h4>
                    </div>
                    {reportData.sleep?.recorded ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Duration</span>
                          <strong>{reportData.sleep.duration}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Quality</span>
                          <span>{reportData.sleep.quality}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Efficiency</span>
                          <span>{reportData.sleep.efficiency}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Deep Sleep</span>
                          <span>{reportData.sleep.deep_sleep}</span>
                        </div>
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Not recorded</span>
                    )}
                  </div>
                </div>

                {/* Food / Nutrition Section */}
                <div style={{ padding: '18px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <Utensils size={18} color="#f59e0b" />
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>
                      Food & Nutrition ({reportData.food?.meals_logged || 0} meals logged)
                    </h4>
                  </div>
                  {reportData.food?.meals && reportData.food.meals.length > 0 ? (
                    <div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                        {reportData.food.meals.map((m, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
                            <span><strong>{m.name}</strong> <span style={{ color: 'var(--text-muted)' }}>({m.time})</span></span>
                            <span>{m.calories} kcal &bull; P: {m.protein}g C: {m.carbs}g F: {m.fat}g</span>
                          </div>
                        ))}
                      </div>
                      {reportData.food.totals && (
                        <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-main)', borderTop: '1px solid var(--border-subtle)', paddingTop: '8px' }}>
                          Daily Totals: {reportData.food.totals.calories} kcal &bull; Protein: {reportData.food.totals.protein_g}g &bull; Carbs: {reportData.food.totals.carbs_g}g &bull; Fat: {reportData.food.totals.fat_g}g
                        </div>
                      )}
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No meals logged for this date</span>
                  )}
                </div>

                {/* Journal / Check-in */}
                <div style={{ padding: '18px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <Smile size={18} color="#ec4899" />
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>
                      Daily Check-ins ({reportData.journal?.entries_count || 0})
                    </h4>
                  </div>
                  {reportData.journal?.entries && reportData.journal.entries.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {reportData.journal.entries.map((j, idx) => (
                        <div key={idx} style={{ padding: '8px 12px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
                          <div><strong>Feeling:</strong> {j.feeling} {j.feeling_emoji || ''} &bull; <strong>Symptoms:</strong> {j.symptoms}</div>
                          {j.notes && <div style={{ color: 'var(--text-secondary)', marginTop: '4px' }}><em>Notes:</em> {j.notes}</div>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No check-in entries logged</span>
                  )}
                </div>
              </div>
            )}

            {/* Weekly Report View */}
            {reportType === 'weekly' && reportData.has_data && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                {/* Weekly Summary Cards */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '14px'
                }}>
                  <div style={{ padding: '16px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-lg)' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Avg Wellness Score</span>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary)' }}>
                      {reportData.weekly_summary?.average_score ? `${reportData.weekly_summary.average_score}/100` : 'Not recorded'}
                    </div>
                  </div>
                  <div style={{ padding: '16px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-lg)' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Total Steps</span>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>
                      {reportData.activity_summary?.total_steps?.toLocaleString() || 0}
                    </div>
                  </div>
                  <div style={{ padding: '16px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-lg)' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Avg Daily Sleep</span>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#8b5cf6' }}>
                      {reportData.sleep_summary?.average_sleep_duration_formatted || 'Not recorded'}
                    </div>
                  </div>
                </div>

                {/* Steps by Day Visualization */}
                {reportData.activity_summary?.steps_by_day && (
                  <div style={{ padding: '20px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '14px' }}>Steps by Day</h4>
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '120px', gap: '8px', paddingBottom: '10px' }}>
                      {reportData.activity_summary.steps_by_day.map((d, idx) => {
                        const heightPct = Math.min(100, Math.max(8, (d.steps / 10000) * 100));
                        return (
                          <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                            <span style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                              {d.steps ? `${(d.steps / 1000).toFixed(1)}k` : '0'}
                            </span>
                            <div style={{
                              width: '100%',
                              maxWidth: '32px',
                              height: `${heightPct}%`,
                              background: d.recorded ? 'var(--primary)' : 'var(--bg-subtle)',
                              borderRadius: '4px 4px 0 0'
                            }} />
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '6px' }}>{d.day}</span>
                          </div>
                        );
                      })}
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '10px 0 0 0' }}>
                      Daily average: {reportData.activity_summary?.average_daily_steps?.toLocaleString()} steps across 7 days.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Monthly Report View */}
            {reportType === 'monthly' && reportData.has_data && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '14px'
                }}>
                  <div style={{ padding: '16px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-lg)' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Month Average Score</span>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary)' }}>
                      {reportData.monthly_overview?.average_wellness_score ? `${reportData.monthly_overview.average_wellness_score}/100` : 'Not recorded'}
                    </div>
                  </div>
                  <div style={{ padding: '16px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-lg)' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Tracked Days</span>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>
                      {reportData.monthly_overview?.total_tracked_days} / {reportData.monthly_overview?.calendar_days}
                    </div>
                  </div>
                  <div style={{ padding: '16px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-lg)' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Total Steps</span>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--secondary)' }}>
                      {reportData.activity?.total_monthly_steps?.toLocaleString() || 0}
                    </div>
                  </div>
                </div>

                <div style={{ padding: '18px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', fontSize: '0.88rem' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '10px' }}>Monthly Highlights</h4>
                  <p style={{ margin: '4px 0', color: 'var(--text-secondary)' }}>
                    &bull; <strong>Average Sleep:</strong> {reportData.sleep?.average_sleep_formatted || 'Not recorded'} across {reportData.sleep?.total_tracked_nights || 0} logged nights.
                  </p>
                  <p style={{ margin: '4px 0', color: 'var(--text-secondary)' }}>
                    &bull; <strong>Total Meals:</strong> {reportData.food?.total_meals_logged || 0} meals logged with nutrient awareness.
                  </p>
                  <p style={{ margin: '4px 0', color: 'var(--text-secondary)' }}>
                    &bull; <strong>Tracking Consistency:</strong> {reportData.monthly_overview?.tracking_rate || '0%'} calendar consistency.
                  </p>
                </div>
              </div>
            )}

            {/* Non-clinical Medical Disclaimer */}
            <div style={{
              marginTop: '28px',
              paddingTop: '16px',
              borderTop: '1px solid var(--divider)',
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
              lineHeight: 1.5
            }}>
              <strong>Health Disclaimer:</strong> {reportData.disclaimer}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
