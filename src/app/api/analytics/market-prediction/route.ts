import { NextResponse } from "next/server";
import { MarketPrediction, PricePrediction } from "@/types";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cropName = searchParams.get("crop") || "rice";
    const cropId = searchParams.get("cropId");

    // If cropId provided, fetch from database
    if (cropId) {
      const prediction = await prisma.marketPrediction.findFirst({
        where: { cropId },
        include: { predictedPrices: true },
        orderBy: { createdAt: "desc" },
      });

      if (prediction) {
        const apiFormat = {
          cropName: prediction.cropName,
          currentPrice: prediction.currentPrice,
          predictedPrices: prediction.predictedPrices.map((p) => ({
            date: new Date(p.month),
            predictedPrice: p.price,
            confidenceLow: p.price * (1 - (1 - p.confidence) * 0.5),
            confidenceHigh: p.price * (1 + (1 - p.confidence) * 0.5),
          })),
          trend: prediction.trend.toLowerCase(),
          volatility: "medium",
          recommendation: prediction.recommendation,
          lastUpdated: prediction.createdAt,
        };

        return NextResponse.json({
          success: true,
          data: apiFormat,
          timestamp: new Date(),
          source: "database",
        });
      }
    }

    const prediction = await generateMarketPrediction(cropName);

    return NextResponse.json({
      success: true,
      data: prediction,
      timestamp: new Date(),
      source: "generated",
    });
  } catch (error) {
    console.error("Market Prediction API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate market prediction",
        timestamp: new Date(),
      },
      { status: 500 }
    );
  }
}

async function generateMarketPrediction(
  cropName: string
): Promise<MarketPrediction> {
  // Mock market prediction using time series analysis
  // In production, use DLI/MRS for big data analytics

  const basePrices: Record<string, number> = {
    rice: 12,
    corn: 8,
    cassava: 3,
    "sugar-cane": 1.2,
    vegetables: 25,
    "chili-pepper": 40,
  };

  const currentPrice = basePrices[cropName.toLowerCase()] || 10;
  const volatility = Math.random() * 0.3; // 0-30% volatility

  // Generate 12 months of predictions
  const predictedPrices: PricePrediction[] = [];
  const now = new Date();

  for (let i = 0; i < 12; i++) {
    const date = new Date(now);
    date.setMonth(date.getMonth() + i);

    // Simulate seasonal price fluctuations
    const seasonalFactor = 1 + Math.sin((i / 12) * Math.PI * 2) * 0.15;
    const randomFactor = 1 + (Math.random() - 0.5) * volatility;
    const trendFactor = 1 + i * 0.01; // Slight upward trend

    const predictedPrice =
      currentPrice * seasonalFactor * randomFactor * trendFactor;
    const confidence = 0.95 - i * 0.03; // Confidence decreases over time

    predictedPrices.push({
      date,
      predictedPrice: Math.round(predictedPrice * 100) / 100,
      confidenceLow:
        Math.round(predictedPrice * (1 - confidence * volatility) * 100) / 100,
      confidenceHigh:
        Math.round(predictedPrice * (1 + confidence * volatility) * 100) / 100,
    });
  }

  // Determine trend
  const firstPrice = predictedPrices[0].predictedPrice;
  const lastPrice = predictedPrices[predictedPrices.length - 1].predictedPrice;
  const priceDiff = lastPrice - firstPrice;
  const trend =
    priceDiff > currentPrice * 0.05
      ? "rising"
      : priceDiff < -currentPrice * 0.05
      ? "falling"
      : "stable";

  const volatilityLevel =
    volatility > 0.2 ? "high" : volatility > 0.1 ? "medium" : "low";

  const recommendation =
    trend === "rising"
      ? `Consider holding ${cropName} for better prices. Market trend is positive.`
      : trend === "falling"
      ? `Consider selling ${cropName} soon. Market prices may decrease.`
      : `${cropName} prices are stable. Good time for planned sales.`;

  return {
    cropName,
    currentPrice,
    predictedPrices,
    trend,
    volatility: volatilityLevel,
    recommendation,
    lastUpdated: now,
  };
}
