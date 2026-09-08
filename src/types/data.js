// Initial Seed & Mock Data for HealthSnap Prototype

export const INITIAL_USER = {
  name: "Alex Morgan",
  email: "alex.morgan@healthsnap.ai",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
  goals: [
    "Improve sleep",
    "Increase activity",
    "Improve food habits",
    "Maintain healthy routine"
  ],
  settings: {
    notifications: true,
    edgeAi: true,
    dataSharing: false,
    darkMode: false
  }
};

export const INITIAL_WELLNESS_SCORE = {
  score: 78,
  max: 100,
  status: "Good",
  trend: "+4 pts vs last week",
  subScores: {
    activity: 80,
    sleep: 72,
    nutrition: 82,
    journal: 78
  }
};

export const INITIAL_ACTIVITY = {
  steps: 6420,
  goal: 8000,
  activeMinutes: 48,
  activeGoal: 60,
  distanceKm: 4.3,
  caloriesBurned: 412,
  percentAchieved: 80,
  weeklyData: [
    { day: "Mon", steps: 7800, activeMin: 55 },
    { day: "Tue", steps: 6200, activeMin: 42 },
    { day: "Wed", steps: 8400, activeMin: 62 },
    { day: "Thu", steps: 5900, activeMin: 38 },
    { day: "Fri", steps: 7100, activeMin: 50 },
    { day: "Sat", steps: 9200, activeMin: 74 },
    { day: "Sun", steps: 6420, activeMin: 48 }
  ],
  hourlyDistribution: [
    { hour: "8am", steps: 650 },
    { hour: "10am", steps: 1100 },
    { hour: "12pm", steps: 1450 },
    { hour: "2pm", steps: 920 },
    { hour: "4pm", steps: 1300 },
    { hour: "6pm", steps: 1000 }
  ]
};

export const INITIAL_SLEEP = {
  lastNightDuration: "6h 30m",
  hours: 6.5,
  goalDuration: "7–8h",
  quality: "Good",
  efficiency: 84,
  deepSleep: "1h 45m",
  remSleep: "1h 20m",
  lightSleep: "3h 25m",
  weeklyData: [
    { day: "Mon", duration: "7h 10m", hours: 7.17, quality: "Good" },
    { day: "Tue", duration: "6h 40m", hours: 6.67, quality: "Fair" },
    { day: "Wed", duration: "7h 30m", hours: 7.50, quality: "Optimal" },
    { day: "Thu", duration: "6h 20m", hours: 6.33, quality: "Fair" },
    { day: "Fri", duration: "6h 50m", hours: 6.83, quality: "Good" },
    { day: "Sat", duration: "8h 00m", hours: 8.00, quality: "Optimal" },
    { day: "Sun", duration: "6h 30m", hours: 6.50, quality: "Good" }
  ],
  awarenessMessage: "Your sleep duration has been slightly below your target on several days. Consider establishing a 30-minute wind-down routine."
};

export const FOOD_PRESETS = [
  {
    id: "preset-1",
    name: "Mediterranean Grilled Chicken & Quinoa",
    category: "Balanced Lunch",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=700&q=80",
    detectedItems: ["Grilled Chicken Breast", "Quinoa", "Steamed Broccoli & Carrots", "Cherry Tomatoes", "Olive Oil Drizzle"],
    calories: 620,
    protein: 32,
    carbs: 70,
    fat: 18,
    fiber: 7,
    suggestion: "Your meal contains a solid protein source. Consider adding more colorful vegetables and maintaining balanced portions."
  },
  {
    id: "preset-2",
    name: "Avocado & Poached Egg Sourdough Toast",
    category: "Nutrient-Dense Breakfast",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=700&q=80",
    detectedItems: ["Artisan Sourdough", "Fresh Avocado Mash", "Poached Egg", "Microgreens", "Chia Seeds"],
    calories: 480,
    protein: 19,
    carbs: 45,
    fat: 24,
    fiber: 9,
    suggestion: "Rich in beneficial monounsaturated fatty acids and bioavailable egg protein. Provides lasting morning fullness."
  },
  {
    id: "preset-3",
    name: "Atlantic Salmon & Roasted Asparagus",
    category: "High Protein Dinner",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=700&q=80",
    detectedItems: ["Wild Atlantic Salmon", "Charred Asparagus", "Wild Rice Blend", "Lemon Dill Infusion"],
    calories: 560,
    protein: 38,
    carbs: 38,
    fat: 22,
    fiber: 6,
    suggestion: "High in Omega-3 fatty acids that support cellular recovery and lower glycemic carbohydrates for evening satiety."
  },
  {
    id: "preset-4",
    name: "Antioxidant Berry & Chia Oatmeal Bowl",
    category: "Fiber-Rich Morning Fuel",
    image: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=700&q=80",
    detectedItems: ["Organic Rolled Oats", "Wild Blueberries", "Blackberries", "Chia Seeds", "Unsweetened Almond Milk"],
    calories: 420,
    protein: 15,
    carbs: 64,
    fat: 11,
    fiber: 11,
    suggestion: "High soluble beta-glucan fiber supports smooth glucose release and sustained energy throughout the morning."
  }
];

export const INITIAL_FOOD_LOGS = [
  {
    id: "log-1",
    timestamp: "Today, 8:15 AM",
    title: "Avocado & Poached Egg Toast",
    calories: 480,
    protein: 19,
    carbs: 45,
    fat: 24,
    status: "Balanced"
  },
  {
    id: "log-2",
    timestamp: "Today, 1:20 PM",
    title: "Grilled Chicken & Quinoa",
    calories: 620,
    protein: 32,
    carbs: 70,
    fat: 18,
    status: "High Protein"
  }
];

export const SPEAK_PRESETS = [
  {
    id: "speak-1",
    label: "Tiredness & Poor Sleep",
    transcription: "I didn't sleep well last night and I'm feeling tired today.",
    understanding: {
      sleep: "Poor",
      energy: "Low",
      mood: "Tired",
      stressLevel: "Moderate"
    },
    guidance: "Your recent input suggests that you may benefit from maintaining a consistent sleep routine, avoiding late caffeine, and taking a short restful break."
  },
  {
    id: "speak-2",
    label: "Morning Workout & Slight Tension",
    transcription: "Went for a 35-minute jog this morning. Feeling energetic overall, but my calves and lower back feel a bit tight.",
    understanding: {
      activity: "Aerobic Jogging",
      energy: "High",
      mood: "Energized",
      tension: "Mild musculoskeletal tightness"
    },
    guidance: "Great cardiovascular start! Gentle mobility stretching and replenishing electrolytes will assist muscle relaxation."
  },
  {
    id: "speak-3",
    label: "Work Stress & Skipped Meal",
    transcription: "Work was overwhelming today, skipped lunch because of back-to-back meetings, and I've developed a dull headache.",
    understanding: {
      nutrition: "Skipped Meal (Low Fuel)",
      energy: "Depleted",
      mood: "Stressed",
      discomfort: "Headache observation"
    },
    guidance: "Irregular meal timing and prolonged screen focus can trigger tension headaches. Drink 400ml water and eat a wholesome snack."
  },
  {
    id: "speak-4",
    label: "Refreshed & Rested",
    transcription: "I got a solid 8 hours of sleep last night and I feel calm, refreshed, and ready to tackle my wellness goals.",
    understanding: {
      sleep: "Optimal (8h)",
      energy: "High",
      mood: "Calm & Positive",
      stressLevel: "Low"
    },
    guidance: "Your wellness signals indicate optimal physical and mental recovery. Harness this positive momentum for your afternoon step goal."
  }
];

export const INITIAL_JOURNAL_ENTRIES = [
  {
    id: "entry-1",
    timestamp: "Today, 2:30 PM",
    feeling: "Tired",
    feelingEmoji: "🥱",
    symptoms: "Mild afternoon fatigue, eyes feeling slightly strained from screen work",
    severity: "Moderate",
    duration: "1–3 hours",
    notes: "Drank 1 coffee at 9 AM."
  },
  {
    id: "entry-2",
    timestamp: "Yesterday, 8:45 PM",
    feeling: "Stressed",
    feelingEmoji: "😰",
    symptoms: "Headache for 2 hours after long workday",
    severity: "Moderate",
    duration: "1–3 hours",
    notes: "Took a warm shower and went to bed early."
  },
  {
    id: "entry-3",
    timestamp: "3 days ago, 10:00 AM",
    feeling: "Great",
    feelingEmoji: "😄",
    symptoms: "No symptoms reported",
    severity: "Mild",
    duration: "Less than 1 hour",
    notes: "Felt well rested after morning walk."
  }
];

export const INITIAL_PATTERNS = [
  {
    id: "pattern-1",
    title: "Sleep + Activity Correlation",
    tags: ["Sleep", "Activity"],
    signalIcons: ["😴", "🏃"],
    correlation: "High (0.76)",
    summary: "Your activity has been lower on days when your sleep duration is below your usual level.",
    detail: "On nights with less than 6.5 hours of sleep, daily step count drops on average by 22% and afternoon active minutes decrease significantly.",
    type: "observation",
    color: "emerald"
  },
  {
    id: "pattern-2",
    title: "Food + Activity Balance",
    tags: ["Food", "Activity"],
    signalIcons: ["📸", "🏃"],
    correlation: "Moderate (0.64)",
    summary: "Your recent meals and activity levels show an opportunity to improve daily balance.",
    detail: "Days with complex carbohydrate breakfasts (like quinoa or oatmeal) coincided with 35% higher stamina during mid-day activities.",
    type: "observation",
    color: "blue"
  },
  {
    id: "pattern-3",
    title: "Wellness Journal: Consecutive Fatigue",
    tags: ["Voice", "Journal"],
    signalIcons: ["🎤", "📝"],
    correlation: "Notable (3 logs)",
    summary: "You reported tiredness on multiple days this week.",
    detail: "Reports of mid-afternoon low energy coincided with screen time extending past 4 continuous hours without hydration breaks.",
    type: "observation",
    color: "amber"
  },
  {
    id: "pattern-4",
    title: "Hydration & Energy Stability",
    tags: ["Food", "Wellness"],
    signalIcons: ["💧", "⚡"],
    correlation: "Positive Trend",
    summary: "Consistent morning hydration correlates with stable afternoon energy ratings.",
    detail: "When morning fluids exceeded 1 liter, afternoon journal fatigue ratings dropped from Moderate to Mild/None.",
    type: "observation",
    color: "purple"
  }
];

export const INITIAL_GUIDANCE = [
  {
    id: "guide-1",
    title: "Improve Sleep",
    category: "Rest & Recovery",
    icon: "Moon",
    description: "Try maintaining a consistent sleep schedule. Aim to wind down at 10:45 PM tonight without blue light.",
    actionLabel: "Set Sleep Reminder",
    completed: false,
    streak: "3 days"
  },
  {
    id: "guide-2",
    title: "Stay Active",
    category: "Daily Movement",
    icon: "Footprints",
    description: "Consider adding a short 15-minute walk to your afternoon routine to hit your 8,000 step goal.",
    actionLabel: "Start 15m Walk",
    completed: true,
    streak: "5 days"
  },
  {
    id: "guide-3",
    title: "Balanced Meals",
    category: "Nutritional Awareness",
    icon: "Salad",
    description: "Try including vegetables and protein in your meals. Adding broccoli or leafy greens supports steady satiety.",
    actionLabel: "View Meal Ideas",
    completed: false,
    streak: "2 days"
  },
  {
    id: "guide-4",
    title: "Stay Hydrated",
    category: "Hydration Habits",
    icon: "Droplets",
    description: "Remember to maintain regular water intake. Drinking 1 glass every 2 hours keeps your focus sharp.",
    actionLabel: "Log +250ml Water",
    completed: false,
    streak: "4 days"
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: "notif-1",
    type: "pattern",
    title: "Wellness Pattern Detected",
    message: "Your sleep has been below your target for 3 days. Consider prioritizing an earlier bedtime tonight.",
    time: "25 min ago",
    read: false,
    icon: "BellRing"
  },
  {
    id: "notif-2",
    type: "suggestion",
    title: "Daily Activity Suggestion",
    message: "You're at 6,420 steps (80% of goal). A quick 15-minute walk will complete your goal!",
    time: "2 hours ago",
    read: false,
    icon: "Lightbulb"
  },
  {
    id: "notif-3",
    type: "food",
    title: "Food Diary Reminder",
    message: "Log your afternoon meal or snack to keep your nutritional awareness updated.",
    time: "4 hours ago",
    read: true,
    icon: "Camera"
  }
];

export const TRENDS_DATA = {
  "7d": [
    { day: "Mon", score: 72, steps: 7800, sleepHours: 7.1, mood: "Good" },
    { day: "Tue", score: 75, steps: 6200, sleepHours: 6.6, mood: "Okay" },
    { day: "Wed", score: 78, steps: 8400, sleepHours: 7.5, mood: "Great" },
    { day: "Thu", score: 74, steps: 5900, sleepHours: 6.3, mood: "Tired" },
    { day: "Fri", score: 81, steps: 7100, sleepHours: 6.8, mood: "Good" },
    { day: "Sat", score: 79, steps: 9200, sleepHours: 8.0, mood: "Great" },
    { day: "Sun", score: 78, steps: 6420, sleepHours: 6.5, mood: "Good" }
  ],
  "30d": [
    { period: "Week 1", score: 71, steps: 6800, sleepHours: 6.4 },
    { period: "Week 2", score: 74, steps: 7100, sleepHours: 6.7 },
    { period: "Week 3", score: 76, steps: 7500, sleepHours: 6.9 },
    { period: "Week 4", score: 78, steps: 7200, sleepHours: 6.8 }
  ],
  "3m": [
    { period: "Month 1", score: 68, steps: 6200, sleepHours: 6.2 },
    { period: "Month 2", score: 73, steps: 6900, sleepHours: 6.6 },
    { period: "Month 3", score: 78, steps: 7400, sleepHours: 6.9 }
  ]
};
