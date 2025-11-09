import { NextResponse } from "next/server";
import { ProfitForecast, CostBreakdown, ForecastFactor } from "@/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { farmId, cropId, cropName, area, historicalData } = body;

    const forecast = await generateProfitForecast(
      farmId,
      cropId,
      cropName,
      area,
      historicalData
    );

    return NextResponse.json({
      success: true,
      data: forecast,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Profit Forecast API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate profit forecast",
        timestamp: new Date(),
      },
      { status: 500 }
    );
  }
}

async function generateProfitForecast(
  farmId: string,
  cropId: string,
  cropName: string,
  area: number,
  historicalData: any
): Promise<ProfitForecast> {
  // Mock AI/ML-based profit forecasting
  // In production, use ModelArts for prediction

  const basePrices: Record<string, number> = {
    rice: 12,
    corn: 8,
    cassava: 3,
    "sugar-cane": 1.2,
    vegetables: 25,
    "chili-pepper": 40,
  };

  const baseYields: Record<string, number> = {
    rice: 500,
    corn: 600,
    cassava: 800,
    "sugar-cane": 1200,
    vegetables: 400,
    "chili-pepper": 300,
  };

  const pricePerKg = basePrices[cropName.toLowerCase()] || 10;
  const yieldPerArea = baseYields[cropName.toLowerCase()] || 500;

  // Calculate costs
  const costs: CostBreakdown = {
    seeds: area * 500,
    fertilizer: area * 800,
    pesticides: area * 300,
    water: area * 400,
    labor: area * 1200,
    equipment: area * 200,
    other: area * 100,
    total: 0,
  };
  costs.total = Object.values(costs).reduce((a, b) => a + b, 0) - costs.total;

  // Calculate revenue and profit
  const expectedYield = yieldPerArea * area;
  const estimatedRevenue = expectedYield * pricePerKg;
  const estimatedProfit = estimatedRevenue - costs.total;

  // Forecast factors
  const factors: ForecastFactor[] = [
    {
      name: "Market Demand",
      impact: "positive",
      description: "High demand for " + cropName + " in current market",
      confidence: 0.85,
    },
    {
      name: "Weather Conditions",
      impact: "neutral",
      description: "Normal weather patterns expected for growing season",
      confidence: 0.75,
    },
    {
      name: "Input Costs",
      impact: "negative",
      description: "Slight increase in fertilizer prices",
      confidence: 0.8,
    },
    {
      name: "Historical Performance",
      impact: "positive",
      description: "Your farm has shown consistent yields",
      confidence: 0.9,
    },
  ];

  return {
    farmId,
    cropId,
    period: "seasonal",
    estimatedRevenue,
    estimatedCosts: costs,
    estimatedProfit,
    confidence: 0.82,
    factors,
    generatedAt: new Date(),
  };
}
