import React from "react";
import { WeatherCondition } from "@/types";

interface WeatherIconProps {
  condition: WeatherCondition;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const iconMap: Record<WeatherCondition, string> = {
  clear: "☀️",
  "partly-cloudy": "⛅",
  cloudy: "☁️",
  rain: "🌧️",
  "heavy-rain": "⛈️",
  thunderstorm: "⚡",
  fog: "🌫️",
  hot: "🔥",
  cold: "❄️",
};

const sizeStyles = {
  sm: "text-2xl",
  md: "text-4xl",
  lg: "text-6xl",
};

export function WeatherIcon({
  condition,
  size = "md",
  className = "",
}: WeatherIconProps) {
  return (
    <span className={`${sizeStyles[size]} ${className}`}>
      {iconMap[condition]}
    </span>
  );
}
