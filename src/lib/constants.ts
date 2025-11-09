import { SubscriptionFeatures, SubscriptionTier } from "@/types";

// Subscription Tier Features
export const SUBSCRIPTION_FEATURES: Record<
    SubscriptionTier,
    SubscriptionFeatures
> = {
    Free: {
        tier: "Free",
        maxFarms: 1,
        aiGuidance: false,
        weatherAlerts: true,
        profitForecasting: false,
        marketPredictions: false,
        advancedAnalytics: false,
        prioritySupport: false,
        offlineMode: false,
    },
    Starter: {
        tier: "Starter",
        maxFarms: 3,
        aiGuidance: true,
        weatherAlerts: true,
        profitForecasting: true,
        marketPredictions: false,
        advancedAnalytics: false,
        prioritySupport: false,
        offlineMode: true,
    },
    Pro: {
        tier: "Pro",
        maxFarms: 10,
        aiGuidance: true,
        weatherAlerts: true,
        profitForecasting: true,
        marketPredictions: true,
        advancedAnalytics: true,
        prioritySupport: true,
        offlineMode: true,
    },
    Enterprise: {
        tier: "Enterprise",
        maxFarms: -1, // unlimited
        aiGuidance: true,
        weatherAlerts: true,
        profitForecasting: true,
        marketPredictions: true,
        advancedAnalytics: true,
        prioritySupport: true,
        offlineMode: true,
    },
};

// Gamification Points
export const POINTS = {
    DAILY_LOGIN: 10,
    TASK_COMPLETED: 20,
    ACTIVITY_LOGGED: 15,
    STREAK_BONUS_3: 50,
    STREAK_BONUS_7: 100,
    STREAK_BONUS_30: 500,
    CROP_HARVESTED: 100,
    FIRST_FARM_CREATED: 50,
    PROFILE_COMPLETED: 30,
} as const;

// Reward Costs
export const REWARD_COSTS = {
    STARTER_7_DAYS: 500,
    STARTER_30_DAYS: 1500,
    PRO_7_DAYS: 1000,
    PRO_30_DAYS: 3000,
    MARKETPLACE_DISCOUNT_10: 200,
    MARKETPLACE_DISCOUNT_20: 500,
} as const;

// Badge Definitions
export const BADGES = {
    FIRST_STEPS: {
        name: "First Steps",
        description: "Created your first farm",
        icon: "🌱",
        rarity: "common" as const,
    },
    DEDICATED_FARMER: {
        name: "Dedicated Farmer",
        description: "Maintained a 7-day streak",
        icon: "🔥",
        rarity: "rare" as const,
    },
    GREEN_THUMB: {
        name: "Green Thumb",
        description: "Successfully harvested 10 crops",
        icon: "👍",
        rarity: "epic" as const,
    },
    WEATHER_WISE: {
        name: "Weather Wise",
        description: "Used weather predictions for 30 days",
        icon: "🌤️",
        rarity: "rare" as const,
    },
    PROFIT_MASTER: {
        name: "Profit Master",
        description: "Achieved 90% profit forecast accuracy",
        icon: "💰",
        rarity: "legendary" as const,
    },
    ECO_WARRIOR: {
        name: "Eco Warrior",
        description: "Optimized resource usage for 30 days",
        icon: "♻️",
        rarity: "epic" as const,
    },
} as const;

// Crop Growth Durations (in days)
export const CROP_GROWTH_DAYS: Record<string, number> = {
    rice: 120,
    corn: 90,
    cassava: 240,
    "sugar-cane": 365,
    vegetables: 60,
    "chili-pepper": 90,
    mango: 120,
    durian: 180,
};

// Weather Alert Thresholds
export const WEATHER_THRESHOLDS = {
    EXTREME_HEAT: 38, // Celsius
    EXTREME_COLD: 10,
    HEAVY_RAIN: 50, // mm/day
    HIGH_WIND: 60, // km/h
    DROUGHT_DAYS: 14,
} as const;

// Activity Duration Estimates (minutes)
export const ACTIVITY_DURATIONS: Record<string, number> = {
    watering: 30,
    fertilizing: 45,
    pesticide: 60,
    weeding: 90,
    harvesting: 120,
    planting: 60,
    pruning: 45,
    inspection: 30,
    other: 60,
};

// API Endpoints (Huawei Cloud)
export const HUAWEI_CLOUD_ENDPOINTS = {
    PANGU_WEATHER: process.env.PANGU_WEATHER_API_URL || "",
    MODEL_ARTS: process.env.MODEL_ARTS_API_URL || "",
    FUNCTION_GRAPH: process.env.FUNCTION_GRAPH_API_URL || "",
    SMN: process.env.SMN_API_URL || "",
    OBS: process.env.OBS_API_URL || "",
    RDS: process.env.RDS_API_URL || "",
    DLI: process.env.DLI_API_URL || "",
} as const;

// Language Translations Keys
export const SUPPORTED_LANGUAGES = ["th", "en", "zh"] as const;

// Default Values
export const DEFAULTS = {
    LANGUAGE: "th" as const,
    SUBSCRIPTION_TIER: "Free" as const,
    POINTS: 0,
    STREAK: 0,
    LEVEL: 1,
    PAGE_SIZE: 20,
    WEATHER_UPDATE_INTERVAL: 3600000, // 1 hour in ms
    AI_GUIDANCE_GENERATION_TIME: "06:00", // 6 AM
} as const;

// Alert Priority Colors
export const ALERT_COLORS = {
    info: "blue",
    warning: "yellow",
    critical: "red",
    severe: "red",
    extreme: "red",
} as const;

// Crop Health Status Colors
export const HEALTH_COLORS = {
    excellent: "green",
    good: "green",
    fair: "yellow",
    poor: "orange",
    critical: "red",
} as const;
