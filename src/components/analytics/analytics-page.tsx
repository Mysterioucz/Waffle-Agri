"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProfitForecast, MarketPrediction } from "@/types";
import { formatCurrency } from "@/lib/utils";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Minus,
  DollarSign,
  PieChart,
  Activity,
  Lightbulb,
  Loader2,
  Wheat,
  Sprout,
  Leaf,
  CheckCircle,
  AlertTriangle,
  Info,
} from "lucide-react";

export default function AnalyticsPage() {
  const [profitForecast, setProfitForecast] = useState<ProfitForecast | null>(
    null
  );
  const [marketPrediction, setMarketPrediction] =
    useState<MarketPrediction | null>(null);
  const [crops, setCrops] = useState<any[]>([]);
  const [selectedCropId, setSelectedCropId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const userId = "user-1";
  const farmId = "farm-1";

  // Fetch crops on component mount
  useEffect(() => {
    fetchCrops();
  }, []);

  // Fetch analytics when selected crop changes
  useEffect(() => {
    if (selectedCropId && crops.length > 0) {
      fetchAnalytics();
    }
  }, [selectedCropId]);

  const fetchCrops = async () => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
      const cropsRes = await fetch(`${backendUrl}/crops?farmId=${farmId}`);
      const cropsData = await cropsRes.json();

      if (cropsData.success && cropsData.data.length > 0) {
        setCrops(cropsData.data);
        setSelectedCropId(cropsData.data[0].id); // Select first crop by default
      }
    } catch (error) {
      console.error("Error fetching crops:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
      const selectedCrop = crops.find((c) => c.id === selectedCropId);

      if (!selectedCrop) {
        setLoading(false);
        return;
      }

      // Fetch profit forecast with cropId
      const forecastRes = await fetch(
        `${backendUrl}/analytics/profit-forecast?cropId=${selectedCropId}`
      );
      const forecastData = await forecastRes.json();
      if (forecastData.success) {
        setProfitForecast(forecastData.data);
      }

      // Fetch market prediction with cropId
      const marketRes = await fetch(
        `${backendUrl}/analytics/market-prediction?cropId=${selectedCropId}`
      );
      const marketData = await marketRes.json();
      if (marketData.success) {
        setMarketPrediction(marketData.data);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "rising":
        return "text-green-600";
      case "falling":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "rising":
        return <TrendingUp className="h-5 w-5 inline" />;
      case "falling":
        return <TrendingDown className="h-5 w-5 inline" />;
      default:
        return <Minus className="h-5 w-5 inline" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-8 w-8" />
            <div>
              <h1 className="text-3xl font-bold">Analytics & Forecasting</h1>
              <p className="text-blue-100 mt-1">
                AI-powered insights for optimal farm management
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Crop Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Crop for Analysis
          </label>
          {crops.length === 0 ? (
            <p className="text-gray-500">No crops available</p>
          ) : (
            <div className="flex gap-3 flex-wrap">
              {crops.map((crop) => {
                // Get icon based on crop name
                const getCropIcon = (name: string) => {
                  const nameLower = name.toLowerCase();
                  if (nameLower.includes("rice")) return Wheat;
                  if (nameLower.includes("corn")) return Sprout;
                  return Leaf;
                };
                const CropIcon = getCropIcon(crop.name);

                return (
                  <Button
                    key={crop.id}
                    variant={selectedCropId === crop.id ? "primary" : "outline"}
                    onClick={() => setSelectedCropId(crop.id)}
                    className="flex items-center gap-2"
                  >
                    <CropIcon className="h-4 w-4" />
                    {crop.name} ({crop.areaSize} rai)
                  </Button>
                );
              })}
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Analyzing data...</p>
          </div>
        ) : (
          <>
            {/* Profit Forecast */}
            {profitForecast && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>
                    Profit Forecast -{" "}
                    {crops.find((c) => c.id === selectedCropId)?.name || ""}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="text-center p-6 bg-green-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-2">
                        Expected Revenue
                      </div>
                      <div className="text-3xl font-bold text-green-600">
                        {formatCurrency(profitForecast.estimatedRevenue)}
                      </div>
                    </div>
                    <div className="text-center p-6 bg-red-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-2">
                        Total Costs
                      </div>
                      <div className="text-3xl font-bold text-red-600">
                        {formatCurrency(profitForecast.estimatedCosts.total)}
                      </div>
                    </div>
                    <div className="text-center p-6 bg-blue-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-2">
                        Expected Profit
                      </div>
                      <div className="text-3xl font-bold text-blue-600">
                        {formatCurrency(profitForecast.estimatedProfit)}
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        {Math.round(profitForecast.confidence * 100)}%
                        confidence
                      </div>
                    </div>
                  </div>

                  {/* Cost Breakdown */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-4">
                      Cost Breakdown
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(profitForecast.estimatedCosts)
                        .filter(([key]) => key !== "total")
                        .map(([key, value]) => (
                          <div key={key} className="p-4 bg-gray-50 rounded-lg">
                            <div className="text-sm text-gray-600 capitalize mb-1">
                              {key.replace("-", " ")}
                            </div>
                            <div className="text-lg font-semibold text-gray-900">
                              {formatCurrency(value)}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Forecast Factors */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">
                      Key Factors
                    </h4>
                    <div className="space-y-3">
                      {profitForecast.factors.map((factor, idx) => {
                        const getImpactIcon = () => {
                          if (factor.impact === "positive") return CheckCircle;
                          if (factor.impact === "negative")
                            return AlertTriangle;
                          return Info;
                        };
                        const ImpactIcon = getImpactIcon();

                        return (
                          <div
                            key={idx}
                            className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="mt-0.5">
                              <ImpactIcon
                                className={`h-6 w-6 ${
                                  factor.impact === "positive"
                                    ? "text-green-600"
                                    : factor.impact === "negative"
                                    ? "text-yellow-600"
                                    : "text-blue-600"
                                }`}
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h5 className="font-semibold text-gray-900">
                                  {factor.name}
                                </h5>
                                <Badge
                                  variant={
                                    factor.impact === "positive"
                                      ? "success"
                                      : factor.impact === "negative"
                                      ? "warning"
                                      : "info"
                                  }
                                >
                                  {factor.impact}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">
                                {factor.description}
                              </p>
                              <div className="text-xs text-gray-500 mt-1">
                                {Math.round(factor.confidence * 100)}%
                                confidence
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Market Prediction */}
            {marketPrediction && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>
                    Market Price Prediction - {marketPrediction.cropName}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="text-center p-6 bg-purple-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-2">
                        Current Price
                      </div>
                      <div className="text-3xl font-bold text-purple-600">
                        {formatCurrency(marketPrediction.currentPrice)}/kg
                      </div>
                    </div>
                    <div className="text-center p-6 bg-orange-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-2">
                        Market Trend
                      </div>
                      <div
                        className={`text-3xl font-bold ${getTrendColor(
                          marketPrediction.trend
                        )}`}
                      >
                        {getTrendIcon(marketPrediction.trend)}{" "}
                        {marketPrediction.trend}
                      </div>
                    </div>
                    <div className="text-center p-6 bg-yellow-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-2">
                        Volatility
                      </div>
                      <div className="text-3xl font-bold text-yellow-600 capitalize">
                        {marketPrediction.volatility}
                      </div>
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="h-5 w-5 text-blue-600" />
                      <h4 className="font-semibold text-blue-900">
                        AI Recommendation
                      </h4>
                    </div>
                    <p className="text-blue-800">
                      {marketPrediction.recommendation}
                    </p>
                  </div>

                  {/* Price Chart (Mock visualization) */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">
                      12-Month Price Forecast
                    </h4>
                    <div className="space-y-2">
                      {marketPrediction.predictedPrices
                        .slice(0, 6)
                        .map((prediction, idx) => (
                          <div key={idx} className="flex items-center gap-4">
                            <div className="w-32 text-sm text-gray-600">
                              {new Date(prediction.date).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </div>
                            <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
                              <div
                                className="bg-green-600 h-full flex items-center justify-end px-3 text-white text-sm font-semibold"
                                style={{
                                  width: `${
                                    (prediction.predictedPrice /
                                      (marketPrediction.currentPrice * 1.5)) *
                                    100
                                  }%`,
                                }}
                              >
                                {formatCurrency(prediction.predictedPrice)}/kg
                              </div>
                            </div>
                            <div className="w-24 text-sm text-gray-500 text-right">
                              ±
                              {formatCurrency(
                                prediction.confidenceHigh -
                                  prediction.predictedPrice
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Farm Performance Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Farm Performance Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">
                      Total Revenue (Est.)
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      ฿45,000
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      +15% vs last season
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">
                      Total Costs
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      ฿18,500
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      -8% vs last season
                    </div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">
                      Profit Margin
                    </div>
                    <div className="text-2xl font-bold text-purple-600">
                      59%
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      +12% improvement
                    </div>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">
                      Resource Efficiency
                    </div>
                    <div className="text-2xl font-bold text-orange-600">
                      87%
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Above target (85%)
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
}
