import { NextResponse } from "next/server";
import {
  WeatherData,
  CurrentWeather,
  HourlyWeather,
  DailyWeather,
  WeatherCondition,
  WeatherAlert,
} from "@/types";

// Mock Pangu-Weather API integration
// In production, this would call the actual Huawei Pangu-Weather API

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get("lat") || "13.7563");
    const lon = parseFloat(searchParams.get("lon") || "100.5018");

    // Simulate API call to Pangu-Weather
    const weatherData = await fetchPanguWeather(lat, lon);

    return NextResponse.json({
      success: true,
      data: weatherData,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Weather API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch weather data",
        timestamp: new Date(),
      },
      { status: 500 }
    );
  }
}

async function fetchPanguWeather(
  lat: number,
  lon: number
): Promise<WeatherData> {
  // Mock implementation - replace with actual Pangu-Weather API call
  // const response = await fetch(`${process.env.PANGU_WEATHER_API_URL}/forecast`, {
  //   headers: {
  //     'Authorization': `Bearer ${process.env.HUAWEI_API_KEY}`,
  //   },
  // });

  // Mock data for prototype
  const now = new Date();

  const currentWeather: CurrentWeather = {
    temperature: 32 + Math.random() * 5,
    feelsLike: 35 + Math.random() * 5,
    humidity: 60 + Math.random() * 20,
    precipitation: Math.random() * 10,
    windSpeed: 10 + Math.random() * 10,
    windDirection: Math.random() * 360,
    pressure: 1010 + Math.random() * 10,
    cloudCover: Math.random() * 100,
    uvIndex: Math.floor(Math.random() * 11),
    visibility: 5 + Math.random() * 5,
    condition: determineCondition(32, 5, 60),
  };

  const hourly: HourlyWeather[] = Array.from({ length: 24 }, (_, i) => ({
    time: new Date(now.getTime() + i * 3600000),
    temperature: 28 + Math.random() * 8,
    precipitation: Math.random() * 15,
    precipitationProbability: Math.random() * 100,
    windSpeed: 8 + Math.random() * 12,
    humidity: 55 + Math.random() * 25,
    condition: determineCondition(30, Math.random() * 15, 60),
  }));

  const daily: DailyWeather[] = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(now.getTime() + i * 86400000);
    return {
      date,
      temperatureMax: 33 + Math.random() * 5,
      temperatureMin: 24 + Math.random() * 4,
      precipitation: Math.random() * 30,
      precipitationProbability: Math.random() * 100,
      windSpeed: 10 + Math.random() * 15,
      humidity: 60 + Math.random() * 20,
      sunrise: new Date(date.setHours(6, 0, 0)),
      sunset: new Date(date.setHours(18, 30, 0)),
      condition: determineCondition(33, Math.random() * 30, 65),
    };
  });

  const alerts: WeatherAlert[] = [];

  // Add alert if extreme conditions
  if (currentWeather.temperature > 38) {
    alerts.push({
      id: "heat-warning-1",
      severity: "warning",
      type: "heat",
      title: "Extreme Heat Warning",
      description:
        "Temperatures expected to exceed 38°C. Take precautions for crops and outdoor activities.",
      startTime: now,
      endTime: new Date(now.getTime() + 86400000),
      affectedAreas: ["Central Region"],
      recommendations: [
        "Increase watering frequency",
        "Provide shade for sensitive crops",
        "Avoid midday fieldwork",
      ],
    });
  }

  return {
    location: { latitude: lat, longitude: lon },
    current: currentWeather,
    hourly,
    daily,
    alerts,
    lastUpdated: now,
  };
}

function determineCondition(
  temp: number,
  precip: number,
  humidity: number
): WeatherCondition {
  if (temp > 38) return "hot";
  if (temp < 15) return "cold";
  if (precip > 20) return "heavy-rain";
  if (precip > 5) return "rain";
  if (humidity < 40) return "clear";
  if (humidity > 80) return "cloudy";
  return "partly-cloudy";
}
