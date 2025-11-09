import {
  User,
  Farm,
  Crop,
  FarmActivity,
  ResourceUsage,
  ProfitForecast,
  CostBreakdown,
} from "@/types";
import { POINTS, CROP_GROWTH_DAYS } from "./constants";

/**
 * Calculate user level based on points
 */
export function calculateLevel(points: number): number {
  return Math.floor(Math.sqrt(points / 100)) + 1;
}

/**
 * Calculate points needed for next level
 */
export function pointsForNextLevel(currentLevel: number): number {
  return Math.pow(currentLevel, 2) * 100;
}

/**
 * Check if user should receive streak bonus
 */
export function calculateStreakBonus(streak: number): number {
  if (streak === 30) return POINTS.STREAK_BONUS_30;
  if (streak === 7) return POINTS.STREAK_BONUS_7;
  if (streak === 3) return POINTS.STREAK_BONUS_3;
  return 0;
}

/**
 * Calculate crop growth progress percentage
 */
export function calculateGrowthProgress(crop: Crop): number {
  const totalDays = CROP_GROWTH_DAYS[crop.name.toLowerCase()] || 90;
  const daysPassed = Math.floor(
    (Date.now() - new Date(crop.plantingDate).getTime()) / (1000 * 60 * 60 * 24)
  );
  return Math.min(100, (daysPassed / totalDays) * 100);
}

/**
 * Calculate days until harvest
 */
export function daysUntilHarvest(crop: Crop): number {
  const harvestDate = new Date(crop.expectedHarvestDate);
  const today = new Date();
  const diffTime = harvestDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

/**
 * Calculate total resource costs
 */
export function calculateResourceCost(resources: ResourceUsage[]): number {
  return resources.reduce((total, resource) => total + resource.totalCost, 0);
}

/**
 * Calculate cost breakdown from activities
 */
export function calculateCostBreakdown(
  activities: FarmActivity[]
): CostBreakdown {
  const breakdown: CostBreakdown = {
    seeds: 0,
    fertilizer: 0,
    pesticides: 0,
    water: 0,
    labor: 0,
    equipment: 0,
    other: 0,
    total: 0,
  };

  activities.forEach((activity) => {
    activity.resources.forEach((resource) => {
      switch (resource.resourceType) {
        case "seed":
          breakdown.seeds += resource.totalCost;
          break;
        case "fertilizer":
          breakdown.fertilizer += resource.totalCost;
          break;
        case "pesticide":
          breakdown.pesticides += resource.totalCost;
          break;
        case "water":
          breakdown.water += resource.totalCost;
          break;
        case "labor":
          breakdown.labor += resource.totalCost;
          break;
        case "equipment":
          breakdown.equipment += resource.totalCost;
          break;
        default:
          breakdown.other += resource.totalCost;
      }
    });
  });

  breakdown.total =
    Object.values(breakdown).reduce((a, b) => a + b, 0) - breakdown.total;
  return breakdown;
}

/**
 * Estimate resource requirements based on crop and area
 */
export function estimateResourceRequirements(
  cropName: string,
  area: number
): { seeds: number; fertilizer: number; water: number; labor: number } {
  // Base requirements per unit area (simplified)
  const baseRequirements: Record<string, any> = {
    rice: { seeds: 30, fertilizer: 50, water: 1000, labor: 40 },
    corn: { seeds: 20, fertilizer: 40, water: 600, labor: 30 },
    cassava: { seeds: 40, fertilizer: 30, water: 400, labor: 35 },
    "sugar-cane": { seeds: 100, fertilizer: 60, water: 800, labor: 50 },
    vegetables: { seeds: 15, fertilizer: 35, water: 500, labor: 45 },
    default: { seeds: 25, fertilizer: 40, water: 600, labor: 35 },
  };

  const requirements =
    baseRequirements[cropName.toLowerCase()] || baseRequirements.default;

  return {
    seeds: requirements.seeds * area,
    fertilizer: requirements.fertilizer * area,
    water: requirements.water * area,
    labor: requirements.labor * area,
  };
}

/**
 * Calculate expected yield based on crop and area
 */
export function calculateExpectedYield(cropName: string, area: number): number {
  // Expected yield per unit area in kg (simplified)
  const yieldPerArea: Record<string, number> = {
    rice: 500,
    corn: 600,
    cassava: 800,
    "sugar-cane": 1200,
    vegetables: 400,
  };

  return (yieldPerArea[cropName.toLowerCase()] || 500) * area;
}

/**
 * Calculate profit forecast
 */
export function calculateProfitForecast(
  cropName: string,
  area: number,
  marketPrice: number,
  costs: CostBreakdown
): number {
  const expectedYield = calculateExpectedYield(cropName, area);
  const expectedRevenue = expectedYield * marketPrice;
  return expectedRevenue - costs.total;
}

/**
 * Format currency (Thai Baht)
 */
export function formatCurrency(
  amount: number,
  locale: string = "th-TH"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "THB",
  }).format(amount);
}

/**
 * Format date relative to now
 */
export function formatRelativeDate(date: Date): string {
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays === -1) return "Yesterday";
  if (diffDays > 0 && diffDays <= 7) return `In ${diffDays} days`;
  if (diffDays < 0 && diffDays >= -7) return `${Math.abs(diffDays)} days ago`;

  return date.toLocaleDateString();
}

/**
 * Calculate farm health score
 */
export function calculateFarmHealthScore(crops: Crop[]): number {
  if (crops.length === 0) return 0;

  const healthScores: Record<string, number> = {
    excellent: 100,
    good: 80,
    fair: 60,
    poor: 40,
    critical: 20,
  };

  const totalScore = crops.reduce((sum, crop) => {
    return sum + (healthScores[crop.healthStatus] || 50);
  }, 0);

  return Math.round(totalScore / crops.length);
}

/**
 * Determine weather condition severity
 */
export function getWeatherSeverity(
  temperature: number,
  precipitation: number,
  windSpeed: number
): "normal" | "caution" | "warning" | "danger" {
  if (
    temperature > 38 ||
    temperature < 10 ||
    precipitation > 50 ||
    windSpeed > 60
  ) {
    return "danger";
  }
  if (
    temperature > 35 ||
    temperature < 15 ||
    precipitation > 30 ||
    windSpeed > 40
  ) {
    return "warning";
  }
  if (
    temperature > 33 ||
    temperature < 18 ||
    precipitation > 15 ||
    windSpeed > 25
  ) {
    return "caution";
  }
  return "normal";
}

/**
 * Generate task ID
 */
export function generateId(prefix: string = ""): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 9);
  return prefix
    ? `${prefix}_${timestamp}_${randomStr}`
    : `${timestamp}_${randomStr}`;
}

/**
 * Check if feature is available for subscription tier
 */
export function hasFeatureAccess(
  userTier: string,
  requiredTier: string
): boolean {
  const tierLevels = { Free: 0, Starter: 1, Pro: 2, Enterprise: 3 };
  return (
    (tierLevels[userTier as keyof typeof tierLevels] || 0) >=
    (tierLevels[requiredTier as keyof typeof tierLevels] || 0)
  );
}

/**
 * Calculate resource efficiency score
 */
export function calculateResourceEfficiency(
  actualUsage: number,
  plannedUsage: number
): number {
  if (plannedUsage === 0) return 100;
  const efficiency = (plannedUsage / actualUsage) * 100;
  return Math.min(100, Math.max(0, efficiency));
}

/**
 * Group activities by date
 */
export function groupActivitiesByDate(
  activities: FarmActivity[]
): Record<string, FarmActivity[]> {
  return activities.reduce((groups, activity) => {
    const dateKey = new Date(activity.date).toISOString().split("T")[0];
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(activity);
    return groups;
  }, {} as Record<string, FarmActivity[]>);
}

/**
 * Calculate water requirements based on weather
 */
export function adjustWaterRequirements(
  baseRequirement: number,
  temperature: number,
  precipitation: number,
  humidity: number
): number {
  let adjusted = baseRequirement;

  // Increase for high temperature
  if (temperature > 35) adjusted *= 1.3;
  else if (temperature > 30) adjusted *= 1.15;

  // Decrease for recent precipitation
  if (precipitation > 20) adjusted *= 0.5;
  else if (precipitation > 10) adjusted *= 0.7;

  // Adjust for humidity
  if (humidity < 40) adjusted *= 1.2;
  else if (humidity > 80) adjusted *= 0.9;

  return Math.round(adjusted);
}
