import React, { createContext, useContext, useState, useEffect } from 'react';
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

const WellnessContext = createContext();

const STORAGE_KEY = 'healthsnap_wellness_data_v1';

export function WellnessProvider({ children }) {
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

  // Navigation & session state
  const [isAuth, setIsAuth] = useState(false);
  const [activeView, setActiveView] = useState('landing');
  const [theme, setTheme] = useState('light');
  const [toastMessage, setToastMessage] = useState(null);

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

  // Add Food Log
  const addFoodLog = (meal) => {
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

    // Recalculate score dynamically (+1 point for good awareness)
    setWellnessScore(prev => ({
      ...prev,
      score: Math.min(100, prev.score + 1),
      trend: "+5 pts vs last week"
    }));

    showToast(`📸 ${meal.name || 'Meal'} logged to food diary!`);
  };

  // Add Journal Entry
  const addJournalEntry = (entry) => {
    const newEntry = {
      id: `journal-${Date.now()}`,
      timestamp: 'Just now',
      ...entry
    };
    setJournalEntries(prev => [newEntry, ...prev]);

    // Add a notification about the entry
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
  };

  // Add Voice Log
  const addVoiceLog = (transcript, understanding) => {
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
  };

  // Quick activity adder
  const logQuickSteps = (stepAmount) => {
    setActivity(prev => {
      const newSteps = prev.steps + stepAmount;
      const newPercent = Math.min(100, Math.round((newSteps / prev.goal) * 100));
      return {
        ...prev,
        steps: newSteps,
        percentAchieved: newPercent,
        distanceKm: parseFloat((prev.distanceKm + (stepAmount * 0.00075)).toFixed(1)),
        caloriesBurned: prev.caloriesBurned + Math.round(stepAmount * 0.04)
      };
    });
    showToast(`🏃 Added +${stepAmount.toLocaleString()} steps! Keep moving!`);
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
  const updateGoals = (newGoals) => {
    setUser(prev => ({
      ...prev,
      goals: newGoals
    }));
    showToast("Wellness goals updated.");
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
        guidance,
        notifications,
        isAuth,
        setIsAuth,
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
        exportData
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
