import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  INITIAL_USER,
  EMPTY_USER,
  INITIAL_WELLNESS_SCORE,
  EMPTY_WELLNESS_SCORE,
  INITIAL_ACTIVITY,
  EMPTY_ACTIVITY,
  INITIAL_SLEEP,
  EMPTY_SLEEP,
  INITIAL_FOOD_LOGS,
  EMPTY_FOOD_LOGS,
  INITIAL_JOURNAL_ENTRIES,
  EMPTY_JOURNAL_ENTRIES,
  INITIAL_PATTERNS,
  EMPTY_PATTERNS,
  INITIAL_GUIDANCE,
  EMPTY_GUIDANCE,
  INITIAL_NOTIFICATIONS,
  EMPTY_NOTIFICATIONS
} from '../types/data';
import { api, tokenStorage } from '../services/api';

const WellnessContext = createContext();

const STORAGE_KEY = 'healthsnap_wellness_data_v1';
const ACTIVE_USER_KEY = 'healthsnap_active_user_email';

// Scoped storage: each account gets its own keys so users never see another account's data.
const scopedKey = (suffix, email) => {
  const e = (email || localStorage.getItem(ACTIVE_USER_KEY) || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_.@-]/g, '_');
  return e ? `${STORAGE_KEY}_${e}_${suffix}` : `${STORAGE_KEY}_${suffix}`;
};

const loadState = (suffix, fallback) => {
  try {
    const saved = localStorage.getItem(scopedKey(suffix));
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

const dateKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const timeToMinutes = (str) => {
  const m = String(str || '').trim().match(/^(\d{1,2}):(\d{2})\s*(am|pm)$/i);
  if (!m) return null;
  let h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  if (h === 12) h = 0;
  if (m[3].toLowerCase() === 'pm') h += 12;
  return h * 60 + min;
};

export function WellnessProvider({ children }) {
  // Session & Auth state
  const [authMode, setAuthMode] = useState(() => {
    return tokenStorage.get() ? 'backend' : 'demo';
  });
  const [isAuth, setIsAuth] = useState(() => {
    return !!tokenStorage.get();
  });
  const [activeView, setActiveView] = useState('landing');
  const [theme, setTheme] = useState('light');
  const [toastMessage, setToastMessage] = useState(null);

  // Wake-up reminder state
  const [wakeNotificationsEnabled, setWakeNotificationsEnabled] = useState(() => {
    return localStorage.getItem('healthsnap_wakeup_enabled') !== 'false';
  });
  const [wakeReminderActive, setWakeReminderActive] = useState(false);
  const [wakeReminderTime, setWakeReminderTime] = useState('');

  // Wake-up history (one entry per day)
  const [wakeHistory, setWakeHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('healthsnap_wakeup_logs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Load initial state from localStorage (scoped per active user) or fallback to defaults.
  // A scoped session means a real account is active: fall back to EMPTY data so each
  // email starts with its own clean slate instead of the shared demo seed.
  const isScopedSession = () => !!localStorage.getItem(ACTIVE_USER_KEY);

  const [user, setUser] = useState(() => loadState('user', isScopedSession() ? EMPTY_USER : INITIAL_USER));

  const [wellnessScore, setWellnessScore] = useState(() => loadState('score', isScopedSession() ? EMPTY_WELLNESS_SCORE : INITIAL_WELLNESS_SCORE));

  const [activity, setActivity] = useState(() => loadState('activity', isScopedSession() ? EMPTY_ACTIVITY : INITIAL_ACTIVITY));

  const [sleep, setSleep] = useState(() => loadState('sleep', isScopedSession() ? EMPTY_SLEEP : INITIAL_SLEEP));

  const [foodLogs, setFoodLogs] = useState(() => loadState('food', isScopedSession() ? EMPTY_FOOD_LOGS : INITIAL_FOOD_LOGS));

  const [journalEntries, setJournalEntries] = useState(() => loadState('journal', isScopedSession() ? EMPTY_JOURNAL_ENTRIES : INITIAL_JOURNAL_ENTRIES));

  const [patterns, setPatterns] = useState(() => loadState('patterns', isScopedSession() ? EMPTY_PATTERNS : INITIAL_PATTERNS));

  const [guidance, setGuidance] = useState(() => loadState('guidance', isScopedSession() ? EMPTY_GUIDANCE : INITIAL_GUIDANCE));

  const [notifications, setNotifications] = useState(() => loadState('notifications', isScopedSession() ? EMPTY_NOTIFICATIONS : INITIAL_NOTIFICATIONS));

  // Function to refresh all dashboard data from FastAPI backend
  const refreshDashboardFromBackend = useCallback(async () => {
    if (!tokenStorage.get()) return;
    try {
      const data = await api.dashboard.get();
      if (data) {
        if (data.user) {
          setUser(prev => ({
            ...prev,
            id: data.user.id,
            name: data.user.full_name,
            email: data.user.email,
            avatar: data.user.avatar_url || prev.avatar,
            goals: data.user.goals?.length ? data.user.goals : prev.goals,
            settings: data.user.settings && Object.keys(data.user.settings).length ? data.user.settings : prev.settings
          }));
        }
        if (data.wellnessScore) setWellnessScore(data.wellnessScore);
        if (data.activity) setActivity(data.activity);
        if (data.sleep) setSleep(data.sleep);
        if (data.foodLogs && data.foodLogs.length) setFoodLogs(data.foodLogs);
        if (data.journalEntries && data.journalEntries.length) setJournalEntries(data.journalEntries);
        if (data.patterns && data.patterns.length) setPatterns(data.patterns);
        if (data.guidance && data.guidance.length) setGuidance(data.guidance);
        if (data.notifications && data.notifications.length) setNotifications(data.notifications);
      }
    } catch (err) {
      console.warn("Could not load dashboard from backend:", err.message);
    }
  }, []);

  // Check auth session on startup
  useEffect(() => {
    const token = tokenStorage.get();
    if (!token) return;
    api.auth.getMe()
      .then(u => {
        setIsAuth(true);
        setAuthMode('backend');
        refreshDashboardFromBackend();
      })
      .catch(err => {
        const status = err?.status;
        if (status === 401 || status === 403) {
          // Token genuinely invalid or expired
          tokenStorage.clear();
          setIsAuth(false);
          setAuthMode('demo');
        } else {
          // Backend unreachable or transient error: keep the session and use
          // cached scoped data instead of logging the user out on reload.
          console.warn("Backend unreachable on reload; staying signed in with cached data:", err.message);
          setIsAuth(true);
          setAuthMode('demo');
        }
      });
  }, [refreshDashboardFromBackend]);

  // Sync to localStorage (scoped per active user)
  useEffect(() => {
    try {
      localStorage.setItem(scopedKey('user'), JSON.stringify(user));
      localStorage.setItem(scopedKey('score'), JSON.stringify(wellnessScore));
      localStorage.setItem(scopedKey('activity'), JSON.stringify(activity));
      localStorage.setItem(scopedKey('sleep'), JSON.stringify(sleep));
      localStorage.setItem(scopedKey('food'), JSON.stringify(foodLogs));
      localStorage.setItem(scopedKey('journal'), JSON.stringify(journalEntries));
      localStorage.setItem(scopedKey('patterns'), JSON.stringify(patterns));
      localStorage.setItem(scopedKey('guidance'), JSON.stringify(guidance));
      localStorage.setItem(scopedKey('notifications'), JSON.stringify(notifications));
    } catch (e) {
      console.warn("Unable to save to localStorage:", e);
    }
  }, [user, wellnessScore, activity, sleep, foodLogs, journalEntries, patterns, guidance, notifications]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Daily reset: at the start of each new day, clear daily metrics (steps, sleep,
  // food, journal, score) so every day starts fresh. Scoped per account (and
  // skipped for demo mode so the sample seed stays intact). Profile/goals persist.
  const runDailyResetCheck = useCallback(() => {
    if (authMode !== 'backend' || !user?.email) return;
    const today = dateKey(new Date());
    const lastReset = localStorage.getItem(scopedKey('lastResetDate', user.email)) || '';
    if (lastReset === today) return;
    localStorage.setItem(scopedKey('lastResetDate', user.email), today);
    setActivity(EMPTY_ACTIVITY);
    setSleep(EMPTY_SLEEP);
    setFoodLogs(EMPTY_FOOD_LOGS);
    setJournalEntries(EMPTY_JOURNAL_ENTRIES);
    setWellnessScore(EMPTY_WELLNESS_SCORE);
    setPatterns(EMPTY_PATTERNS);
    setNotifications(EMPTY_NOTIFICATIONS);
    showToast("🌅 New day! Daily metrics reset for a fresh start.");
  }, [authMode, user?.email]);

  // Run the daily reset on mount, whenever the active account changes (login), and
  // periodically so an app left open across midnight also resets.
  useEffect(() => {
    runDailyResetCheck();
  }, [runDailyResetCheck]);

  useEffect(() => {
    const interval = setInterval(runDailyResetCheck, 60000);
    return () => clearInterval(interval);
  }, [runDailyResetCheck]);

  // Switch storage + state scope when a different account signs in.
  // Each email loads only its own saved data; brand-new accounts start empty.
  const switchUserScope = useCallback((email) => {
    if (email) {
      localStorage.setItem(ACTIVE_USER_KEY, email.trim().toLowerCase());
    } else {
      localStorage.removeItem(ACTIVE_USER_KEY);
    }
    setUser(loadState('user', EMPTY_USER));
    setWellnessScore(loadState('score', EMPTY_WELLNESS_SCORE));
    setActivity(loadState('activity', EMPTY_ACTIVITY));
    setSleep(loadState('sleep', EMPTY_SLEEP));
    setFoodLogs(loadState('food', EMPTY_FOOD_LOGS));
    setJournalEntries(loadState('journal', EMPTY_JOURNAL_ENTRIES));
    setPatterns(loadState('patterns', EMPTY_PATTERNS));
    setGuidance(loadState('guidance', EMPTY_GUIDANCE));
    setNotifications(loadState('notifications', EMPTY_NOTIFICATIONS));
  }, []);

  const pushWakeEntry = (entry) => {
    setWakeHistory(prev => [entry, ...prev.filter(e => e.date !== entry.date)].slice(0, 30));
  };

  useEffect(() => {
    try {
      localStorage.setItem('healthsnap_wakeup_logs', JSON.stringify(wakeHistory));
    } catch (e) {
      console.warn("Unable to save wake-up history:", e);
    }
  }, [wakeHistory]);

  // Wake-up reminder scheduler: checks every 30s while the app is open
  useEffect(() => {
    if (!wakeNotificationsEnabled) return;

    const checkWakeUp = () => {
      const match = String(sleep.wakeUp || '').trim().match(/^(\d{1,2}):(\d{2})\s*(am|pm)$/i);
      if (!match) return;
      let hour = parseInt(match[1], 10);
      const minute = parseInt(match[2], 10);
      if (hour === 12) hour = 0;
      if (match[3].toLowerCase() === 'pm') hour += 12;

      const now = new Date();
      const todayKey = dateKey(now);
      const wakeToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0);
      const windowEnd = new Date(wakeToday.getTime() + 3 * 60 * 60 * 1000);

      // Mark as missed if the wake-up window has passed without confirmation
      if (now > windowEnd && localStorage.getItem('healthsnap_wakeup_date') !== todayKey) {
        if (localStorage.getItem('healthsnap_missed_date') !== todayKey) {
          localStorage.setItem('healthsnap_missed_date', todayKey);
          const snoozes = todayKey === localStorage.getItem('healthsnap_snooze_date')
            ? Number(localStorage.getItem('healthsnap_snooze_count') || '0')
            : 0;
          pushWakeEntry({
            date: todayKey,
            scheduled: String(sleep.wakeUp || ''),
            actual: null,
            differenceMin: null,
            lateMin: null,
            earlyMin: null,
            onTime: false,
            missed: true,
            snoozes,
            recordedAt: now.toISOString()
          });
        }
        return;
      }

      if (now < wakeToday || now > windowEnd) return;

      // Already confirmed today
      if (localStorage.getItem('healthsnap_wakeup_date') === todayKey) return;

      let forceDue = false;
      const snoozeUntil = localStorage.getItem('healthsnap_snooze_until');
      if (snoozeUntil) {
        if (now.getTime() < Number(snoozeUntil)) return;
        localStorage.removeItem('healthsnap_snooze_until');
        forceDue = true;
      }

      // Already showed the reminder today (and wasn't snoozed)
      if (!forceDue && localStorage.getItem('healthsnap_asked_date') === todayKey) return;

      localStorage.setItem('healthsnap_asked_date', todayKey);
      setWakeReminderActive(true);
      setWakeReminderTime(sleep.wakeUp);

      setNotifications(prev => [
        {
          id: `wakeup-${Date.now()}`,
          type: 'wakeup',
          title: '⏰ Wake-Up Reminder',
          message: `It's around ${sleep.wakeUp}. Tap "I'm awake" in the reminder to start your day!`,
          time: 'Now',
          read: false,
          icon: 'Bell'
        },
        ...prev
      ]);

      try {
        if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
          new Notification('Good morning! 🌅', {
            body: `Your wake-up time (${sleep.wakeUp}) has arrived. Open HealthSnap to log your wake-up.`,
            tag: 'healthsnap-wakeup'
          });
        }
      } catch (e) {
        console.warn("Browser notification failed:", e.message);
      }
    };

    checkWakeUp();
    const intervalId = setInterval(checkWakeUp, 30000);
    return () => clearInterval(intervalId);
  }, [wakeNotificationsEnabled, sleep.wakeUp]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Add Food Log (connected to backend if authenticated)
  const addFoodLog = async (meal) => {
    const newLog = {
      id: `food-${Date.now()}`,
      timestamp: 'Just now',
      title: meal.name || meal.title,
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fat: meal.fat,
      status: meal.category || 'Nutrient Balanced'
    };
    setFoodLogs(prev => [newLog, ...prev]);

    // Recalculate score dynamically (+1 point for awareness)
    setWellnessScore(prev => ({
      ...prev,
      score: Math.min(100, prev.score + 1),
      trend: "+5 pts vs last week"
    }));

    showToast(`📸 ${meal.name || meal.title || 'Meal'} logged to food diary!`);

    if (authMode === 'backend') {
      try {
        await api.food.logMeal({
          title: meal.name || meal.title,
          category: meal.category || 'Balanced Meal',
          image_url: meal.image || null,
          calories: meal.calories,
          protein: meal.protein,
          carbs: meal.carbs,
          fat: meal.fat,
          fiber: meal.fiber,
          status: meal.category || 'Nutrient Balanced',
          detected_items: meal.detectedItems || [],
          suggestion: meal.suggestion || ''
        });
      } catch (e) {
        console.warn("Backend food log sync failed:", e.message);
      }
    }
  };

  // Add Journal Entry (connected to backend if authenticated)
  const addJournalEntry = async (entry) => {
    const newEntry = {
      id: `journal-${Date.now()}`,
      timestamp: 'Just now',
      ...entry
    };
    setJournalEntries(prev => [newEntry, ...prev]);

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        type: 'journal',
        title: 'Wellness Log Recorded',
        message: `Logged: feeling ${entry.feeling} with ${entry.severity} severity notes.`,
        time: 'Just now',
        read: false,
        icon: 'FileText'
      },
      ...prev
    ]);

    showToast("📝 Wellness entry recorded successfully!");

    if (authMode === 'backend') {
      try {
        await api.wellness.createSelfReport({
          feeling: entry.feeling,
          feeling_emoji: entry.feelingEmoji || '🙂',
          symptoms: entry.symptoms,
          severity: entry.severity,
          duration: entry.duration,
          notes: entry.notes
        });
      } catch (e) {
        console.warn("Backend self-report sync failed:", e.message);
      }
    }
  };

  // Add Voice Log (connected to backend if authenticated)
  const addVoiceLog = async (transcript, understanding) => {
    const newEntry = {
      id: `voice-${Date.now()}`,
      timestamp: 'Just now',
      feeling: understanding.mood || 'Tired',
      feelingEmoji: understanding.mood === 'Energized' ? '⚡' : '🥱',
      symptoms: transcript,
      severity: understanding.stressLevel === 'Low' ? 'Mild' : 'Moderate',
      duration: 'Logged via Voice',
      notes: `AI Extracted Tags: Energy: ${understanding.energy || 'Normal'}, Sleep: ${understanding.sleep || 'Noted'}`
    };
    setJournalEntries(prev => [newEntry, ...prev]);

    showToast("🎤 Voice log analyzed and added to wellness history!");

    if (authMode === 'backend') {
      try {
        await api.voice.transcribe({
          transcript,
          autoSaveJournal: true
        });
      } catch (e) {
        console.warn("Backend voice sync failed:", e.message);
      }
    }
  };

  // Log / update last night sleep (connected to backend if authenticated)
  const logSleep = async (data) => {
    const hours = Math.max(0, Math.min(24, data.hours ?? sleep.hours));
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    const durationStr = `${h}h ${String(m).padStart(2, '0')}m`;
    const quality = data.quality || sleep.quality;
    const efficiency = data.efficiency ?? sleep.efficiency;
    const deepSleep = data.deepSleep || sleep.deepSleep;
    const remSleep = data.remSleep || sleep.remSleep;
    const lightSleep = data.lightSleep || sleep.lightSleep;

    setSleep(prev => {
      const weeklyData = (prev.weeklyData || []).map((d, i) => {
        if (i === prev.weeklyData.length - 1) {
          return { ...d, hours: Math.round(hours * 100) / 100, duration: durationStr, quality };
        }
        return d;
      });
      return {
        ...prev,
        hours: Math.round(hours * 100) / 100,
        lastNightDuration: durationStr,
        quality,
        efficiency,
        ...(data.bedtime ? { bedtime: data.bedtime } : {}),
        ...(data.wakeUp ? { wakeUp: data.wakeUp } : {}),
        deepSleep,
        remSleep,
        lightSleep,
        weeklyData
      };
    });

    showToast(`🌙 Sleep updated: ${durationStr}`);

    if (authMode === 'backend') {
      try {
        await api.sleep.log({
          hours,
          duration_str: durationStr,
          quality,
          efficiency,
          deep_sleep: deepSleep,
          rem_sleep: remSleep,
          light_sleep: lightSleep
        });
      } catch (e) {
        console.warn("Backend sleep sync failed:", e.message);
      }
    }
  };

  // Wake-up reminder controls
  const enableWakeNotifications = async () => {
    try {
      if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
        await Notification.requestPermission();
      }
    } catch (e) {
      console.warn("Notification permission request failed:", e.message);
    }
    localStorage.setItem('healthsnap_wakeup_enabled', 'true');
    setWakeNotificationsEnabled(true);
    showToast('⏰ Wake-up reminders enabled.');
  };

  const disableWakeNotifications = () => {
    localStorage.setItem('healthsnap_wakeup_enabled', 'false');
    setWakeNotificationsEnabled(false);
    setWakeReminderActive(false);
    localStorage.removeItem('healthsnap_snooze_until');
    showToast('Wake-up reminders turned off.');
  };

  const logWakeUp = () => {
    setWakeReminderActive(false);
    const now = new Date();
    const timeLabel = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    const scheduled = String(sleep.wakeUp || timeLabel);
    const actualMin = now.getHours() * 60 + now.getMinutes();
    const schedMin = timeToMinutes(scheduled);
    const todayKey = dateKey(now);
    const snoozes = todayKey === localStorage.getItem('healthsnap_snooze_date')
      ? Number(localStorage.getItem('healthsnap_snooze_count') || '0')
      : 0;

    localStorage.setItem('healthsnap_wakeup_date', todayKey);
    localStorage.removeItem('healthsnap_snooze_until');
    localStorage.removeItem('healthsnap_asked_date');
    localStorage.removeItem('healthsnap_missed_date');
    localStorage.removeItem('healthsnap_snooze_count');
    localStorage.removeItem('healthsnap_snooze_date');

    const diff = schedMin === null ? null : actualMin - schedMin;
    pushWakeEntry({
      date: todayKey,
      scheduled,
      actual: timeLabel,
      differenceMin: diff,
      lateMin: diff !== null && diff > 15 ? diff : null,
      earlyMin: diff !== null && diff < 0 ? -diff : null,
      onTime: diff !== null && diff >= -15 && diff <= 15,
      missed: false,
      snoozes,
      recordedAt: now.toISOString()
    });

    setNotifications(prev => [
      {
        id: `wakeup-logged-${Date.now()}`,
        type: 'wakeup',
        title: '🌅 Wake-Up Logged',
        message: `You logged your wake-up at ${timeLabel}${diff !== null && diff > 15 ? ` — ${diff} minutes late` : ''}. Great start to your day!`,
        time: 'Now',
        read: false,
        icon: 'Sun'
      },
      ...prev
    ]);
    showToast(`🌅 Good morning! Wake-up logged at ${timeLabel}.`);
  };

  const snoozeWakeUp = (minutes = 10) => {
    setWakeReminderActive(false);
    const todayKey = dateKey(new Date());
    const count = todayKey === localStorage.getItem('healthsnap_snooze_date')
      ? Number(localStorage.getItem('healthsnap_snooze_count') || '0')
      : 0;
    localStorage.setItem('healthsnap_snooze_date', todayKey);
    localStorage.setItem('healthsnap_snooze_count', String(count + 1));
    localStorage.setItem('healthsnap_snooze_until', String(Date.now() + minutes * 60 * 1000));
    showToast(`😴 Snoozed. I'll remind you again in ${minutes} minutes.`);
  };

  // Quick activity adder
  const logQuickSteps = async (stepAmount) => {
    let updatedSteps = 0;
    let updatedGoal = 8000;
    let updatedMin = 48;
    let updatedKm = 4.3;
    let updatedCal = 412;

    setActivity(prev => {
      const newSteps = prev.steps + stepAmount;
      const newPercent = Math.min(100, Math.round((newSteps / prev.goal) * 100));
      updatedSteps = newSteps;
      updatedGoal = prev.goal;
      updatedMin = prev.activeMinutes + Math.round(stepAmount / 100);
      updatedKm = parseFloat((prev.distanceKm + (stepAmount * 0.00075)).toFixed(1));
      updatedCal = prev.caloriesBurned + Math.round(stepAmount * 0.04);

      return {
        ...prev,
        steps: newSteps,
        percentAchieved: newPercent,
        activeMinutes: updatedMin,
        distanceKm: updatedKm,
        caloriesBurned: updatedCal
      };
    });

    showToast(`🏃 Added +${stepAmount.toLocaleString()} steps! Keep moving!`);

    if (authMode === 'backend') {
      try {
        await api.activity.log({
          steps: updatedSteps,
          goal: updatedGoal,
          active_minutes: updatedMin,
          distance_km: updatedKm,
          calories_burned: updatedCal
        });
      } catch (e) {
        console.warn("Backend activity sync failed:", e.message);
      }
    }
  };

  // Toggle habit checkbox
  const toggleGuidanceHabit = (id) => {
    setGuidance(prev =>
      prev.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
    showToast("✨ Wellness habit progress updated!");
  };

  // Mark single notification read
  const markNotificationRead = (id) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // Mark all notifications read
  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast("All notifications marked as read.");
  };

  // Update user goals
  const updateGoals = async (newGoals) => {
    setUser(prev => ({
      ...prev,
      goals: newGoals
    }));
    showToast("Wellness goals updated.");

    if (authMode === 'backend') {
      try {
        await api.users.updateProfile({ goals: newGoals });
      } catch (e) {
        console.warn("Backend goals sync failed:", e.message);
      }
    }
  };

  // Reset to default seed
  const resetToDefaultData = () => {
    setUser(INITIAL_USER);
    setWellnessScore(INITIAL_WELLNESS_SCORE);
    setActivity(INITIAL_ACTIVITY);
    setSleep(INITIAL_SLEEP);
    setFoodLogs(INITIAL_FOOD_LOGS);
    setJournalEntries(INITIAL_JOURNAL_ENTRIES);
    setPatterns(INITIAL_PATTERNS);
    setGuidance(INITIAL_GUIDANCE);
    setNotifications(INITIAL_NOTIFICATIONS);
    localStorage.clear();
    showToast("🔄 Data reset to pristine demo values.");
  };

  // Logout function
  const logout = async () => {
    if (authMode === 'backend') {
      await api.auth.logout();
    }
    tokenStorage.clear();
    setIsAuth(false);
    setAuthMode('demo');
    setUser(INITIAL_USER);
    setActiveView('landing');
    showToast("Logged out successfully.");
  };

  // Permanently delete account & associated local data
  const deleteAccount = async () => {
    if (authMode === 'backend') {
      try {
        await api.users.deleteAccount();
      } catch (err) {
        console.warn("Backend delete account API not active; safely wiping local credentials.", err);
      }
    }
    tokenStorage.clear();
    // Wipe only the current account's scoped data; other accounts stay intact
    const activeEmail = localStorage.getItem(ACTIVE_USER_KEY);
    if (activeEmail) {
      localStorage.removeItem(ACTIVE_USER_KEY);
      ['user', 'score', 'activity', 'sleep', 'food', 'journal', 'patterns', 'guidance', 'notifications']
        .forEach(suffix => localStorage.removeItem(scopedKey(suffix, activeEmail)));
    } else {
      localStorage.clear();
    }
    setIsAuth(false);
    setAuthMode('demo');
    setUser(INITIAL_USER);
    setActiveView('landing');
    showToast("Account and stored data have been permanently removed.");
  };

  // Export data as JSON file download
  const exportData = () => {
    const exportBundle = {
      exportedAt: new Date().toISOString(),
      user,
      wellnessScore,
      activity,
      sleep,
      foodLogs,
      journalEntries,
      patterns,
      guidance,
      disclaimer: "HealthSnap is for health awareness and habit improvement only. Not medical diagnostic data."
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportBundle, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `HealthSnap_Wellness_Export_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("📥 Exported your complete wellness dataset as JSON.");
  };

  return (
    <WellnessContext.Provider
      value={{
        user,
        setUser,
        wellnessScore,
        activity,
        sleep,
        foodLogs,
        journalEntries,
        patterns,
        setPatterns,
        guidance,
        notifications,
        isAuth,
        setIsAuth,
        authMode,
        setAuthMode,
        switchUserScope,
        activeView,
        setActiveView,
        theme,
        toggleTheme,
        toastMessage,
        showToast,
        addFoodLog,
        addJournalEntry,
        addVoiceLog,
        logQuickSteps,
        logSleep,
        wakeNotificationsEnabled,
        enableWakeNotifications,
        disableWakeNotifications,
        wakeReminderActive,
        wakeReminderTime,
        wakeHistory,
        logWakeUp,
        snoozeWakeUp,
        toggleGuidanceHabit,
        markNotificationRead,
        markAllNotificationsRead,
        updateGoals,
        resetToDefaultData,
        logout,
        deleteAccount,
        exportData,
        refreshDashboardFromBackend
      }}
    >
      {children}
    </WellnessContext.Provider>
  );
}

export function useWellness() {
  const context = useContext(WellnessContext);
  if (!context) {
    throw new Error('useWellness must be used within a WellnessProvider');
  }
  return context;
}
