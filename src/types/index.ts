// User & Account Types
export type SubscriptionTier = "Free" | "Starter" | "Pro" | "Enterprise";

export interface User {
  id: string;
  email: string;
  name: string;
  phoneNumber?: string;
  language: "th" | "en" | "zh";
  subscriptionTier: SubscriptionTier;
  subscriptionExpiry?: Date;
  points: number;
  streak: number;
  level: number;
  badges: Badge[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriptionFeatures {
  tier: SubscriptionTier;
  maxFarms: number;
  aiGuidance: boolean;
  weatherAlerts: boolean;
  profitForecasting: boolean;
  marketPredictions: boolean;
  advancedAnalytics: boolean;
  prioritySupport: boolean;
  offlineMode: boolean;
}

// Farm Management Types
export interface Farm {
  id: string;
  userId: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
    province: string;
  };
  totalArea: number; // in rai or hectares
  crops: Crop[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Crop {
  id: string;
  farmId: string;
  name: string;
  variety: string;
  plantingDate: Date;
  expectedHarvestDate: Date;
  actualHarvestDate?: Date;
  area: number;
  status: "planning" | "planted" | "growing" | "harvested" | "failed";
  growthStage: GrowthStage;
  healthStatus: "excellent" | "good" | "fair" | "poor" | "critical";
}

export type GrowthStage =
  | "germination"
  | "seedling"
  | "vegetative"
  | "flowering"
  | "fruiting"
  | "ripening"
  | "harvest-ready";

// Logbook & Activity Types
export type ActivityType =
  | "watering"
  | "fertilizing"
  | "pesticide"
  | "weeding"
  | "harvesting"
  | "planting"
  | "pruning"
  | "inspection"
  | "other";

export interface FarmActivity {
  id: string;
  farmId: string;
  cropId?: string;
  type: ActivityType;
  title: string;
  description: string;
  date: Date;
  duration?: number; // in minutes
  resources: ResourceUsage[];
  laborHours?: number;
  cost?: number;
  notes?: string;
  photos?: string[]; // URLs to OBS storage
  createdAt: Date;
}

export interface ResourceUsage {
  resourceType:
    | "seed"
    | "fertilizer"
    | "pesticide"
    | "water"
    | "labor"
    | "equipment";
  name: string;
  quantity: number;
  unit: string;
  costPerUnit: number;
  totalCost: number;
}

// Resource Planning Types
export interface ResourcePlan {
  id: string;
  farmId: string;
  cropId: string;
  plannedResources: PlannedResource[];
  actualResources: ResourceUsage[];
  costEstimate: number;
  actualCost: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlannedResource {
  resourceType: ResourceUsage["resourceType"];
  name: string;
  estimatedQuantity: number;
  unit: string;
  estimatedCostPerUnit: number;
  estimatedTotalCost: number;
  applicationSchedule: Date[];
}

// Weather & AI Guidance Types
export interface WeatherData {
  location: {
    latitude: number;
    longitude: number;
  };
  current: CurrentWeather;
  hourly: HourlyWeather[];
  daily: DailyWeather[];
  alerts: WeatherAlert[];
  lastUpdated: Date;
}

export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  humidity: number;
  precipitation: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  cloudCover: number;
  uvIndex: number;
  visibility: number;
  condition: WeatherCondition;
}

export interface HourlyWeather {
  time: Date;
  temperature: number;
  precipitation: number;
  precipitationProbability: number;
  windSpeed: number;
  humidity: number;
  condition: WeatherCondition;
}

export interface DailyWeather {
  date: Date;
  temperatureMax: number;
  temperatureMin: number;
  precipitation: number;
  precipitationProbability: number;
  windSpeed: number;
  humidity: number;
  sunrise: Date;
  sunset: Date;
  condition: WeatherCondition;
}

export type WeatherCondition =
  | "clear"
  | "partly-cloudy"
  | "cloudy"
  | "rain"
  | "heavy-rain"
  | "thunderstorm"
  | "fog"
  | "hot"
  | "cold";

export interface WeatherAlert {
  id: string;
  severity: "info" | "warning" | "severe" | "extreme";
  type: "heat" | "cold" | "rain" | "storm" | "drought" | "flood" | "wind";
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  affectedAreas: string[];
  recommendations: string[];
}

// AI Daily Guidance Types
export interface DailyGuidance {
  id: string;
  userId: string;
  farmId: string;
  date: Date;
  tasks: RecommendedTask[];
  tips: FarmingTip[];
  alerts: Alert[];
  weatherSummary: string;
  cropHealthSummary: string;
  generatedAt: Date;
}

export interface RecommendedTask {
  id: string;
  priority: "low" | "medium" | "high" | "urgent";
  category: ActivityType;
  title: string;
  description: string;
  estimatedDuration: number; // in minutes
  estimatedCost?: number;
  deadline?: Date;
  resources?: string[];
  cropId?: string;
  completed: boolean;
  completedAt?: Date;
  reasoning: string; // AI explanation
}

export interface FarmingTip {
  id: string;
  category:
    | "weather"
    | "crop-care"
    | "pest-control"
    | "resource-optimization"
    | "market"
    | "general";
  title: string;
  content: string;
  relevanceScore: number;
  source: "ai" | "expert" | "historical";
}

export interface Alert {
  id: string;
  severity: "info" | "warning" | "critical";
  type: "weather" | "crop-health" | "pest" | "disease" | "resource" | "system";
  title: string;
  message: string;
  actionRequired?: string;
  timestamp: Date;
  read: boolean;
}

// Gamification Types
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  earnedAt: Date;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category:
    | "productivity"
    | "consistency"
    | "learning"
    | "resource-efficiency"
    | "sustainability";
  pointsReward: number;
  badge?: Badge;
  requirement: {
    type: string;
    target: number;
  };
  progress: number;
}

export interface Reward {
  id: string;
  type:
    | "subscription-upgrade"
    | "marketplace-discount"
    | "feature-unlock"
    | "badge";
  name: string;
  description: string;
  pointsCost: number;
  duration?: number; // in days for temporary upgrades
  discountPercentage?: number;
  available: boolean;
}

// Analytics & Forecasting Types
export interface ProfitForecast {
  farmId: string;
  cropId: string;
  period: "monthly" | "seasonal" | "yearly";
  estimatedRevenue: number;
  estimatedCosts: CostBreakdown;
  estimatedProfit: number;
  confidence: number; // 0-1
  factors: ForecastFactor[];
  generatedAt: Date;
}

export interface CostBreakdown {
  seeds: number;
  fertilizer: number;
  pesticides: number;
  water: number;
  labor: number;
  equipment: number;
  other: number;
  total: number;
}

export interface ForecastFactor {
  name: string;
  impact: "positive" | "negative" | "neutral";
  description: string;
  confidence: number;
}

export interface MarketPrediction {
  cropName: string;
  currentPrice: number;
  predictedPrices: PricePrediction[];
  trend: "rising" | "falling" | "stable";
  volatility: "low" | "medium" | "high";
  recommendation: string;
  lastUpdated: Date;
}

export interface PricePrediction {
  date: Date;
  predictedPrice: number;
  confidenceLow: number;
  confidenceHigh: number;
}

export interface FarmAnalytics {
  farmId: string;
  period: {
    start: Date;
    end: Date;
  };
  totalActivities: number;
  totalCosts: number;
  totalRevenue: number;
  totalProfit: number;
  resourceEfficiency: {
    waterUsage: number;
    fertilizerEfficiency: number;
    laborProductivity: number;
  };
  cropPerformance: CropPerformance[];
  recommendations: string[];
}

export interface CropPerformance {
  cropId: string;
  cropName: string;
  yield: number;
  expectedYield: number;
  efficiency: number; // actual/expected ratio
  profitMargin: number;
  healthScore: number;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type:
    | "weather"
    | "task"
    | "milestone"
    | "subscription"
    | "system"
    | "achievement";
  priority: "low" | "medium" | "high";
  title: string;
  message: string;
  actionUrl?: string;
  actionLabel?: string;
  read: boolean;
  sentAt: Date;
  readAt?: Date;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Huawei Cloud Integration Types
export interface ModelArtsRequest {
  userId: string;
  farmId: string;
  weatherData: WeatherData;
  cropData: Crop[];
  historicalActivities: FarmActivity[];
  resourceData: ResourcePlan[];
}

export interface ModelArtsResponse {
  guidance: DailyGuidance;
  forecast: ProfitForecast;
  marketPredictions: MarketPrediction[];
  processingTime: number;
}

export interface SMNNotificationPayload {
  topicUrn: string;
  message: string;
  subject: string;
  messageStructure?: string;
  tags?: Record<string, string>;
}
