"use client";

import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeatherIcon } from "@/components/ui/weather-icon";
import { formatRelativeDate } from "@/lib/utils";
import { DailyGuidance, WeatherData } from "@/types";
import {
    AlertTriangle,
    Clock,
    DollarSign,
    Flame,
    Loader2,
    Wheat,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function DashboardPage() {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [guidance, setGuidance] = useState<DailyGuidance | null>(null);
    const [farm, setFarm] = useState<any>(null);
    const [crops, setCrops] = useState<any[]>([]);
    const [user, setUser] = useState<any>({ level: 1, points: 0, streak: 0 });
    const [loading, setLoading] = useState(true);

    // Using demo user ID from seed data
    const userId = "user-1";

    const fetchDashboardData = async () => {
        try {
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";

            // Fetch user data
            const userRes = await fetch(
                `${backendUrl}/gamification?userId=${userId}`,
            );
            const userData = await userRes.json();
            if (userData.success) {
                setUser(userData.data.user);
            }

            // Fetch farms
            const farmsRes = await fetch(
                `${backendUrl}/farms?userId=${userId}`,
            );
            const farmsData = await farmsRes.json();

            if (farmsData.success && farmsData.data.length > 0) {
                const userFarm = farmsData.data[0];
                setFarm(userFarm);

                // Fetch crops for this farm
                const cropsRes = await fetch(
                    `${backendUrl}/crops?farmId=${userFarm.id}`,
                );
                const cropsData = await cropsRes.json();
                if (cropsData.success) {
                    setCrops(cropsData.data);
                }

                // Fetch weather data using farmId
                const weatherRes = await fetch(
                    `${backendUrl}/weather?farmId=${userFarm.id}`,
                );
                const weatherData = await weatherRes.json();
                if (weatherData.success) {
                    setWeather(weatherData.data);
                }

                // Fetch AI guidance
                const guidanceRes = await fetch(`${backendUrl}/ai/guidance`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        userId,
                        farmId: userFarm.id,
                        weatherData: weatherData.data,
                        cropData: cropsData.data || [],
                    }),
                });
                const guidanceData = await guidanceRes.json();
                if (guidanceData.success) {
                    setGuidance(guidanceData.data);
                }
            }
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
                    <p className="text-gray-600">
                        Loading your farm dashboard...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-green-600 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <Wheat className="h-8 w-8" />
                            <div>
                                <h1 className="text-3xl font-bold">
                                    Waffle Agri
                                </h1>
                                <p className="text-green-100 mt-1">
                                    {farm?.name || "Loading..."}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <div className="text-sm text-green-100">
                                    Level {user.level}
                                </div>
                                <div className="font-bold">
                                    {user.points} Points
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-green-100">
                                    Streak
                                </div>
                                <div className="font-bold flex items-center gap-1 justify-end">
                                    <Flame className="h-4 w-4" />
                                    {user.streak} days
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Alerts */}
                {guidance?.alerts && guidance.alerts.length > 0 && (
                    <div className="mb-6 space-y-3">
                        {guidance.alerts.map((alert) => (
                            <Alert
                                key={alert.id}
                                variant={
                                    alert.severity === "critical"
                                        ? "danger"
                                        : alert.severity === "warning"
                                          ? "warning"
                                          : "info"
                                }
                                title={alert.title}
                            >
                                {alert.message}
                            </Alert>
                        ))}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    {/* Weather Card */}
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle>Current Weather</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {weather ? (
                                <div className="space-y-4 text-gray-400">
                                    <div className="flex items-center justify-between">
                                        <WeatherIcon
                                            condition={
                                                weather.current.condition
                                            }
                                            size="lg"
                                        />
                                        <div className="text-right">
                                            <div className="text-4xl font-bold">
                                                {Math.round(
                                                    weather.current.temperature,
                                                )}
                                                °C
                                            </div>
                                            <div className="text-sm text-gray-800">
                                                Feels like{" "}
                                                {Math.round(
                                                    weather.current.feelsLike,
                                                )}
                                                °C
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <div className="text-gray-800">
                                                Humidity
                                            </div>
                                            <div className="font-semibold">
                                                {Math.round(
                                                    weather.current.humidity,
                                                )}
                                                %
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-gray-800">
                                                Wind
                                            </div>
                                            <div className="font-semibold">
                                                {Math.round(
                                                    weather.current.windSpeed,
                                                )}{" "}
                                                km/h
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-gray-800">
                                                Precipitation
                                            </div>
                                            <div className="font-semibold">
                                                {Math.round(
                                                    weather.current
                                                        .precipitation,
                                                )}{" "}
                                                mm
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-gray-800">
                                                UV Index
                                            </div>
                                            <div className="font-semibold">
                                                {weather.current.uvIndex}
                                            </div>
                                        </div>
                                    </div>
                                    {weather.alerts &&
                                        weather.alerts.length > 0 && (
                                            <div className="pt-3 border-t">
                                                <Badge
                                                    variant="warning"
                                                    className="flex items-center gap-1 w-fit"
                                                >
                                                    <AlertTriangle className="h-3 w-3" />
                                                    {weather.alerts.length}{" "}
                                                    Weather Alert(s)
                                                </Badge>
                                            </div>
                                        )}
                                </div>
                            ) : (
                                <p className="text-gray-500">
                                    Loading weather data...
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Daily Summary */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>AI Daily Guidance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {guidance ? (
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold text-gray-700 mb-2">
                                            Weather Summary
                                        </h4>
                                        <p className="text-gray-600">
                                            {guidance.weatherSummary}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-700 mb-2">
                                            Crop Health
                                        </h4>
                                        <p className="text-gray-600">
                                            {guidance.cropHealthSummary}
                                        </p>
                                    </div>
                                    <div className="pt-3 border-t">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">
                                                {guidance.tasks.length} tasks
                                                recommended
                                            </span>
                                            <Button size="sm">
                                                View All Tasks
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-500">
                                    Generating AI guidance...
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Today's Tasks */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Today's Recommended Tasks</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {guidance?.tasks && guidance.tasks.length > 0 ? (
                            <div className="space-y-3">
                                {guidance.tasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <input
                                            type="checkbox"
                                            className="mt-1 h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                                            defaultChecked={task.completed}
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-2">
                                                <h4 className="font-semibold text-gray-900">
                                                    {task.title}
                                                </h4>
                                                <Badge
                                                    variant={
                                                        task.priority ===
                                                        "urgent"
                                                            ? "danger"
                                                            : task.priority ===
                                                                "high"
                                                              ? "warning"
                                                              : "default"
                                                    }
                                                >
                                                    {task.priority}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-2">
                                                {task.description}
                                            </p>
                                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {task.estimatedDuration} min
                                                </span>
                                                {task.estimatedCost && (
                                                    <span className="flex items-center gap-1">
                                                        <DollarSign className="h-3 w-3" />
                                                        ฿{task.estimatedCost}
                                                    </span>
                                                )}
                                                <span className="ml-auto italic">
                                                    {task.reasoning}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-8">
                                No tasks for today. Great job! 🎉
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Farming Tips */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Farming Tips</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {guidance?.tips && guidance.tips.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {guidance.tips.map((tip) => (
                                    <div
                                        key={tip.id}
                                        className="p-4 bg-blue-50 rounded-lg border border-blue-200"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <h4 className="font-semibold text-blue-900">
                                                {tip.title}
                                            </h4>
                                            <Badge variant="info">
                                                {tip.category}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-blue-800">
                                            {tip.content}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No tips available</p>
                        )}
                    </CardContent>
                </Card>

                {/* Crops Overview */}
                <Card>
                    <CardHeader>
                        <CardTitle>Active Crops</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {crops.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">
                                No crops available
                            </p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-green-700">
                                {crops.map((crop: any) => (
                                    <div
                                        key={crop.id}
                                        className="p-4 bg-green-50 rounded-lg border border-green-200"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h4 className="font-semibold text-green-900 capitalize">
                                                    {crop.name}
                                                </h4>
                                                {crop.variety && (
                                                    <p className="text-sm text-green-700">
                                                        {crop.variety}
                                                    </p>
                                                )}
                                            </div>
                                            <Badge
                                                variant={
                                                    crop.status === "GROWING" ||
                                                    crop.status === "HEALTHY"
                                                        ? "success"
                                                        : crop.status ===
                                                                "FLOWERING" ||
                                                            crop.status ===
                                                                "FRUITING"
                                                          ? "warning"
                                                          : "danger"
                                                }
                                            >
                                                {crop.status
                                                    ?.toLowerCase()
                                                    .replace("_", " ")}
                                            </Badge>
                                        </div>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">
                                                    Area:
                                                </span>
                                                <span className="font-semibold">
                                                    {crop.areaSize} rai
                                                </span>
                                            </div>
                                            {crop.healthScore !== null && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">
                                                        Health:
                                                    </span>
                                                    <span className="font-semibold">
                                                        {crop.healthScore}%
                                                    </span>
                                                </div>
                                            )}
                                            {crop.expectedHarvestDate && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">
                                                        Harvest:
                                                    </span>
                                                    <span className="font-semibold">
                                                        {formatRelativeDate(
                                                            crop.expectedHarvestDate,
                                                        )}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
