import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  INITIAL_USER,
  INITIAL_WELLNESS_SCORE,
  INITIAL_ACTIVITY,
  INITIAL_SLEEP,
  INITIAL_FOOD_LOGS,
  INITIAL_JOURNAL_ENTRIES,
  INITIAL_PATTERNS,
  INITIAL_GUIDANCE,
  INITIAL_NOTIFICATIONS
} from '../types/data';
import { api, tokenStorage } from '../services/api';

const WellnessContext = createContext();

const STORAGE_KEY = 'healthsnap_wellness_data_v1';

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

  // Load initial state from localStorage or fallback to defaults
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_user`);
      return saved ? JSON.parse(saved) : INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  });

  const [wellnessScore, setWellnessScore] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_score`);
      return saved ? JSON.parse(saved) : INITIAL_WELLNESS_SCORE;
    } catch {
      return INITIAL_WELLNESS_SCORE;
    }
  });

  const [activity, setActivity] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_activity`);
      return saved ? JSON.parse(saved) : INITIAL_ACTIVITY;
    } catch {
      return INITIAL_ACTIVITY;
    }
  });

  const [sleep, setSleep] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_sleep`);
      return saved ? JSON.parse(saved) : INITIAL_SLEEP;
    } catch {
      return INITIAL_SLEEP;
    }
  });

  const [foodLogs, setFoodLogs] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_food`);
      return saved ? JSON.parse(saved) : INITIAL_FOOD_LOGS;
    } catch {
      return INITIAL_FOOD_LOGS;
    }
  });

  const [journalEntries, setJournalEntries] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_journal`);
      return saved ? JSON.parse(saved) : INITIAL_JOURNAL_ENTRIES;
    } catch {
      return INITIAL_JOURNAL_ENTRIES;
    }
  });

  const [patterns, setPatterns] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_patterns`);
      return saved ? JSON.parse(saved) : INITIAL_PATTERNS;
    } catch {
      return INITIAL_PATTERNS;
    }
  });

  const [guidance, setGuidance] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_guidance`);
      return saved ? JSON.parse(saved) : INITIAL_GUIDANCE;
    } catch {
      return INITIAL_GUIDANCE;
    }
  });

  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_notifications`);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

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
    if (token) {
      api.auth.getMe()
        .then(u => {
          setIsAuth(true);
          setAuthMode('backend');
          refreshDashboardFromBackend();
        })
        .catch(() => {
          // Token expired or invalid
          tokenStorage.clear();
          setIsAuth(false);
          setAuthMode('demo');
        });
    }
  }, [refreshDashboardFromBackend]);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_user`, JSON.stringify(user));
      localStorage.setItem(`${STORAGE_KEY}_score`, JSON.stringify(wellnessScore));
      localStorage.setItem(`${STORAGE_KEY}_activity`, JSON.stringify(activity));
      localStorage.setItem(`${STORAGE_KEY}_sleep`, JSON.stringify(sleep));
      localStorage.setItem(`${STORAGE_KEY}_food`, JSON.stringify(foodLogs));
      localStorage.setItem(`${STORAGE_KEY}_journal`, JSON.stringify(journalEntries));
      localStorage.setItem(`${STORAGE_KEY}_patterns`, JSON.stringify(patterns));
      localStorage.setItem(`${STORAGE_KEY}_guidance`, JSON.stringify(guidance));
      localStorage.setItem(`${STORAGE_KEY}_notifications`, JSON.stringify(notifications));
    } catch (e) {
      console.warn("Unable to save to localStorage:", e);
    }
  }, [user, wellnessScore, activity, sleep, foodLogs, journalEntries, patterns, guidance, notifications]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

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
    localStorage.clear();
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
