import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Clean existing data (optional - be careful in production!)
  console.log("🧹 Cleaning existing data...");
  await prisma.userReward.deleteMany();
  await prisma.userAchievement.deleteMany();
  await prisma.userBadge.deleteMany();
  await prisma.resourceUsage.deleteMany();
  await prisma.farmActivity.deleteMany();
  await prisma.predictedPrice.deleteMany();
  await prisma.marketPrediction.deleteMany();
  await prisma.costBreakdown.deleteMany();
  await prisma.forecastFactor.deleteMany();
  await prisma.profitForecast.deleteMany();
  await prisma.aIGuidance.deleteMany();
  await prisma.weather.deleteMany();
  await prisma.crop.deleteMany();
  await prisma.farm.deleteMany();
  await prisma.reward.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.user.deleteMany();

  // ============================================
  // 1. Create Users
  // ============================================
  console.log("👤 Creating users...");
  const user1 = await prisma.user.create({
    data: {
      id: "user-1",
      email: "farmer@example.com",
      name: "John Smith",
      phone: "+66-123-456-789",
      subscriptionTier: "PRO",
      points: 1250,
      streak: 7,
      level: 5,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      id: "user-2",
      email: "farmer2@example.com",
      name: "Sarah Johnson",
      phone: "+66-987-654-321",
      subscriptionTier: "BASIC",
      points: 450,
      streak: 3,
      level: 2,
    },
  });

  console.log(`✅ Created ${2} users`);

  // ============================================
  // 2. Create Farms
  // ============================================
  console.log("🏡 Creating farms...");
  const farm1 = await prisma.farm.create({
    data: {
      id: "farm-1",
      name: "Green Valley Farm",
      location: "Chiang Mai, Thailand",
      totalArea: 10.5,
      soilType: "LOAM",
      userId: user1.id,
    },
  });

  const farm2 = await prisma.farm.create({
    data: {
      id: "farm-2",
      name: "Sunrise Organic Farm",
      location: "Nakhon Pathom, Thailand",
      totalArea: 5.2,
      soilType: "CLAY",
      userId: user2.id,
    },
  });

  console.log(`✅ Created ${2} farms`);

  // ============================================
  // 3. Create Crops
  // ============================================
  console.log("🌾 Creating crops...");
  const crop1 = await prisma.crop.create({
    data: {
      id: "crop-1",
      name: "Jasmine Rice",
      variety: "Khao Hom Mali",
      plantingDate: new Date("2024-06-01"),
      expectedHarvest: new Date("2024-11-15"),
      area: 5.0,
      status: "GROWING",
      healthScore: 85,
      farmId: farm1.id,
    },
  });

  const crop2 = await prisma.crop.create({
    data: {
      id: "crop-2",
      name: "Corn",
      variety: "Sweet Corn",
      plantingDate: new Date("2024-07-15"),
      expectedHarvest: new Date("2024-10-30"),
      area: 3.0,
      status: "READY_TO_HARVEST",
      healthScore: 92,
      farmId: farm1.id,
    },
  });

  const crop3 = await prisma.crop.create({
    data: {
      id: "crop-3",
      name: "Vegetables",
      variety: "Mixed Greens",
      plantingDate: new Date("2024-08-01"),
      expectedHarvest: new Date("2024-11-01"),
      area: 2.0,
      status: "GROWING",
      healthScore: 88,
      farmId: farm1.id,
    },
  });

  console.log(`✅ Created ${3} crops`);

  // ============================================
  // 4. Create Weather Data
  // ============================================
  console.log("🌤️ Creating weather data...");
  const today = new Date();
  const weatherData = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    const conditions = ["CLEAR", "PARTLY_CLOUDY", "CLOUDY", "RAIN"];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];

    weatherData.push({
      farmId: farm1.id,
      date: date,
      condition: condition as any,
      temperature: 28 + Math.random() * 6,
      humidity: 60 + Math.random() * 30,
      rainfall: condition === "RAIN" ? 10 + Math.random() * 40 : 0,
      windSpeed: 5 + Math.random() * 15,
      pressure: 1010 + Math.random() * 10,
      source: "Pangu-Weather",
    });
  }

  await prisma.weather.createMany({ data: weatherData });
  console.log(`✅ Created ${weatherData.length} weather records`);

  // ============================================
  // 5. Create Farm Activities
  // ============================================
  console.log("📝 Creating farm activities...");
  const activity1 = await prisma.farmActivity.create({
    data: {
      id: "activity-1",
      farmId: farm1.id,
      cropId: crop1.id,
      userId: user1.id,
      type: "WATERING",
      title: "Morning Watering",
      description: "Watered rice field section A",
      date: new Date(),
      duration: 45,
      laborHours: 1,
      cost: 50,
      resources: {
        create: [
          {
            resourceType: "WATER",
            name: "Irrigation water",
            quantity: 1000,
            unit: "liters",
            costPerUnit: 0.05,
            totalCost: 50,
          },
        ],
      },
    },
  });

  const activity2 = await prisma.farmActivity.create({
    data: {
      id: "activity-2",
      farmId: farm1.id,
      userId: user1.id,
      type: "FERTILIZING",
      title: "Applied NPK Fertilizer",
      description: "Applied balanced fertilizer to vegetable plot",
      date: new Date(Date.now() - 86400000),
      duration: 60,
      laborHours: 1.5,
      cost: 500,
      resources: {
        create: [
          {
            resourceType: "FERTILIZER",
            name: "NPK 16-16-16",
            quantity: 20,
            unit: "kg",
            costPerUnit: 25,
            totalCost: 500,
          },
        ],
      },
    },
  });

  const activity3 = await prisma.farmActivity.create({
    data: {
      id: "activity-3",
      farmId: farm1.id,
      cropId: crop2.id,
      userId: user1.id,
      type: "PESTICIDE",
      title: "Pest Control Treatment",
      description: "Applied organic pesticide for corn borer prevention",
      date: new Date(Date.now() - 172800000),
      duration: 30,
      laborHours: 0.5,
      cost: 150,
      resources: {
        create: [
          {
            resourceType: "PESTICIDE",
            name: "Organic Neem Oil",
            quantity: 2,
            unit: "liters",
            costPerUnit: 75,
            totalCost: 150,
          },
        ],
      },
    },
  });

  console.log(`✅ Created ${3} farm activities with resources`);

  // ============================================
  // 6. Create AI Guidance
  // ============================================
  console.log("🤖 Creating AI guidance...");
  const guidances = await prisma.aIGuidance.createMany({
    data: [
      {
        userId: user1.id,
        category: "WATERING",
        title: "Increase Watering Frequency",
        message:
          "Weather forecast shows low rainfall for the next 5 days. Consider increasing irrigation frequency to maintain soil moisture levels.",
        priority: "HIGH",
        actionable: true,
        deadline: new Date(Date.now() + 2 * 86400000),
        confidence: 0.92,
        source: "ModelArts-Pangu",
        isRead: false,
      },
      {
        userId: user1.id,
        category: "HARVESTING",
        title: "Optimal Harvest Window",
        message:
          "Your corn crop is at peak maturity. Harvest within the next 3-5 days for maximum yield and quality.",
        priority: "URGENT",
        actionable: true,
        deadline: new Date(Date.now() + 3 * 86400000),
        confidence: 0.95,
        source: "ModelArts-Pangu",
        isRead: false,
      },
      {
        userId: user1.id,
        category: "WEATHER_ALERT",
        title: "Heavy Rain Expected",
        message:
          "Heavy rainfall predicted in 48 hours. Ensure proper drainage in rice fields to prevent waterlogging.",
        priority: "HIGH",
        actionable: true,
        deadline: new Date(Date.now() + 2 * 86400000),
        confidence: 0.88,
        source: "Pangu-Weather",
        isRead: true,
      },
      {
        userId: user1.id,
        category: "PEST_CONTROL",
        title: "Monitor for Pests",
        message:
          "Current weather conditions are favorable for pest development. Conduct daily inspections.",
        priority: "MEDIUM",
        actionable: true,
        confidence: 0.78,
        source: "ModelArts-Pangu",
        isRead: false,
      },
    ],
  });

  console.log(`✅ Created ${guidances.count} AI guidance entries`);

  // ============================================
  // 7. Create Profit Forecasts
  // ============================================
  console.log("💰 Creating profit forecasts...");
  const profitForecast1 = await prisma.profitForecast.create({
    data: {
      cropId: crop1.id,
      cropName: "Rice",
      period: "Q4 2024",
      estimatedRevenue: 125000,
      estimatedCost: 45000,
      estimatedProfit: 80000,
      confidence: 0.85,
      factors: {
        create: [
          {
            name: "Weather Conditions",
            description:
              "Favorable weather patterns expected for the harvest period",
            impact: "POSITIVE",
            confidence: 0.88,
          },
          {
            name: "Market Demand",
            description: "High demand for jasmine rice in export markets",
            impact: "POSITIVE",
            confidence: 0.92,
          },
          {
            name: "Input Costs",
            description: "Fertilizer prices remain stable",
            impact: "NEUTRAL",
            confidence: 0.85,
          },
        ],
      },
      breakdown: {
        create: [
          { category: "Seeds", amount: 5000, percentage: 11.1 },
          { category: "Fertilizer", amount: 12000, percentage: 26.7 },
          { category: "Pesticides", amount: 3000, percentage: 6.7 },
          { category: "Labor", amount: 18000, percentage: 40.0 },
          { category: "Equipment", amount: 5000, percentage: 11.1 },
          { category: "Other", amount: 2000, percentage: 4.4 },
        ],
      },
    },
  });

  const profitForecast2 = await prisma.profitForecast.create({
    data: {
      cropId: crop2.id,
      cropName: "Corn",
      period: "Q4 2024",
      estimatedRevenue: 45000,
      estimatedCost: 18000,
      estimatedProfit: 27000,
      confidence: 0.82,
      factors: {
        create: [
          {
            name: "Market Price",
            description: "Sweet corn prices are trending upward",
            impact: "POSITIVE",
            confidence: 0.79,
          },
          {
            name: "Crop Health",
            description: "Excellent crop health indicators",
            impact: "POSITIVE",
            confidence: 0.95,
          },
        ],
      },
      breakdown: {
        create: [
          { category: "Seeds", amount: 3000, percentage: 16.7 },
          { category: "Fertilizer", amount: 5000, percentage: 27.8 },
          { category: "Pesticides", amount: 2000, percentage: 11.1 },
          { category: "Labor", amount: 6000, percentage: 33.3 },
          { category: "Other", amount: 2000, percentage: 11.1 },
        ],
      },
    },
  });

  console.log(`✅ Created ${2} profit forecasts with factors and breakdowns`);

  // ============================================
  // 8. Create Market Predictions
  // ============================================
  console.log("📈 Creating market predictions...");
  const marketPrediction1 = await prisma.marketPrediction.create({
    data: {
      cropId: crop1.id,
      cropName: "Rice",
      region: "Central Thailand",
      currentPrice: 15.5,
      trend: "INCREASING",
      confidence: 0.87,
      recommendation:
        "Market conditions are favorable. Consider holding inventory for 2-3 weeks to maximize returns as prices are expected to rise by 8-12%.",
      source: "ModelArts-Market-Analysis",
      predictedPrices: {
        create: [
          { month: "Nov 2024", price: 16.2, confidence: 0.89 },
          { month: "Dec 2024", price: 16.8, confidence: 0.85 },
          { month: "Jan 2025", price: 17.1, confidence: 0.82 },
          { month: "Feb 2025", price: 16.9, confidence: 0.78 },
          { month: "Mar 2025", price: 17.3, confidence: 0.75 },
          { month: "Apr 2025", price: 17.8, confidence: 0.72 },
        ],
      },
    },
  });

  const marketPrediction2 = await prisma.marketPrediction.create({
    data: {
      cropId: crop2.id,
      cropName: "Corn",
      region: "Central Thailand",
      currentPrice: 12.0,
      trend: "STABLE",
      confidence: 0.81,
      recommendation:
        "Prices are expected to remain stable. Sell at current rates or within the next 2 weeks.",
      source: "ModelArts-Market-Analysis",
      predictedPrices: {
        create: [
          { month: "Nov 2024", price: 12.1, confidence: 0.85 },
          { month: "Dec 2024", price: 12.0, confidence: 0.83 },
          { month: "Jan 2025", price: 11.9, confidence: 0.8 },
          { month: "Feb 2025", price: 12.2, confidence: 0.77 },
          { month: "Mar 2025", price: 12.3, confidence: 0.74 },
          { month: "Apr 2025", price: 12.1, confidence: 0.71 },
        ],
      },
    },
  });

  console.log(`✅ Created ${2} market predictions with price forecasts`);

  // ============================================
  // 9. Create Badges
  // ============================================
  console.log("🏅 Creating badges...");
  const badge1 = await prisma.badge.create({
    data: {
      name: "First Steps",
      description: "Created your first farm",
      icon: "sprout",
      rarity: "COMMON",
      requirement: "Create your first farm profile",
    },
  });

  const badge2 = await prisma.badge.create({
    data: {
      name: "Dedicated Farmer",
      description: "Maintained a 7-day streak",
      icon: "flame",
      rarity: "RARE",
      requirement: "Log activities for 7 consecutive days",
    },
  });

  const badge3 = await prisma.badge.create({
    data: {
      name: "Harvest Master",
      description: "Successfully harvested 10 crops",
      icon: "trophy",
      rarity: "EPIC",
      requirement: "Complete 10 successful harvests",
    },
  });

  const badge4 = await prisma.badge.create({
    data: {
      name: "AI Expert",
      description: "Followed 50 AI recommendations",
      icon: "star",
      rarity: "LEGENDARY",
      requirement: "Successfully implement 50 AI guidance suggestions",
    },
  });

  console.log(`✅ Created ${4} badges`);

  // ============================================
  // 10. Assign Badges to Users
  // ============================================
  console.log("🎖️ Assigning badges to users...");
  await prisma.userBadge.createMany({
    data: [
      {
        userId: user1.id,
        badgeId: badge1.id,
        earnedAt: new Date("2024-09-01"),
      },
      {
        userId: user1.id,
        badgeId: badge2.id,
        earnedAt: new Date("2024-11-01"),
      },
    ],
  });

  console.log(`✅ Assigned badges to users`);

  // ============================================
  // 11. Create Achievements
  // ============================================
  console.log("🎯 Creating achievements...");
  const achievement1 = await prisma.achievement.create({
    data: {
      name: "Green Thumb",
      description: "Successfully harvest 10 crops",
      category: "PRODUCTIVITY",
      pointsReward: 200,
      requirementType: "harvest",
      requirementTarget: 10,
    },
  });

  const achievement2 = await prisma.achievement.create({
    data: {
      name: "Consistent Logger",
      description: "Log activities for 30 consecutive days",
      category: "CONSISTENCY",
      pointsReward: 300,
      requirementType: "daily-log",
      requirementTarget: 30,
    },
  });

  const achievement3 = await prisma.achievement.create({
    data: {
      name: "Efficiency Expert",
      description: "Reduce resource costs by 20%",
      category: "EFFICIENCY",
      pointsReward: 500,
      requirementType: "cost-reduction",
      requirementTarget: 20,
    },
  });

  console.log(`✅ Created ${3} achievements`);

  // ============================================
  // 12. Create User Achievements
  // ============================================
  console.log("📊 Creating user achievement progress...");
  await prisma.userAchievement.createMany({
    data: [
      {
        userId: user1.id,
        achievementId: achievement1.id,
        progress: 3,
        completed: false,
      },
      {
        userId: user1.id,
        achievementId: achievement2.id,
        progress: 15,
        completed: false,
      },
      {
        userId: user1.id,
        achievementId: achievement3.id,
        progress: 8,
        completed: false,
      },
    ],
  });

  console.log(`✅ Created user achievement progress`);

  // ============================================
  // 13. Create Rewards
  // ============================================
  console.log("🎁 Creating rewards...");
  const reward1 = await prisma.reward.create({
    data: {
      name: "Pro Subscription (1 Month)",
      description: "Upgrade to Pro tier for 1 month with all premium features",
      type: "SUBSCRIPTION_UPGRADE",
      pointsCost: 1000,
      duration: 30,
      available: true,
    },
  });

  const reward2 = await prisma.reward.create({
    data: {
      name: "Expert Consultation",
      description: "30-minute video call with agricultural expert",
      type: "EXPERT_CONSULTATION",
      pointsCost: 800,
      duration: null,
      available: true,
    },
  });

  const reward3 = await prisma.reward.create({
    data: {
      name: "Advanced Analytics Access",
      description: "Unlock advanced analytics features for 3 months",
      type: "PREMIUM_FEATURE",
      pointsCost: 1500,
      duration: 90,
      available: true,
    },
  });

  const reward4 = await prisma.reward.create({
    data: {
      name: "Supply Discount Voucher",
      description: "15% discount on farming supplies purchase",
      type: "DISCOUNT",
      pointsCost: 500,
      duration: 60,
      available: true,
    },
  });

  console.log(`✅ Created ${4} rewards`);

  console.log("\n✅ Database seeding completed successfully!");
  console.log("\n📊 Summary:");
  console.log(`   - ${2} Users`);
  console.log(`   - ${2} Farms`);
  console.log(`   - ${3} Crops`);
  console.log(`   - ${weatherData.length} Weather Records`);
  console.log(`   - ${3} Farm Activities`);
  console.log(`   - ${guidances.count} AI Guidance Entries`);
  console.log(`   - ${2} Profit Forecasts`);
  console.log(`   - ${2} Market Predictions`);
  console.log(`   - ${4} Badges`);
  console.log(`   - ${3} Achievements`);
  console.log(`   - ${4} Rewards`);
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
