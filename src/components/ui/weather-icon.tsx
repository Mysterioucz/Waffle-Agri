import { WeatherCondition } from "@/types";
import {
    Cloud,
    CloudDrizzle,
    CloudFog,
    CloudLightning,
    CloudRain,
    CloudSun,
    Snowflake,
    Sun,
    Thermometer,
} from "lucide-react";
import React from "react";

interface WeatherIconProps {
    condition: WeatherCondition;
    size?: "sm" | "md" | "lg";
    className?: string;
}

const iconMap: Record<
    WeatherCondition,
    React.ComponentType<{ className?: string }>
> = {
    clear: Sun,
    "partly-cloudy": CloudSun,
    cloudy: Cloud,
    rain: CloudRain,
    "heavy-rain": CloudDrizzle,
    thunderstorm: CloudLightning,
    fog: CloudFog,
    hot: Thermometer,
    cold: Snowflake,
};

const sizeStyles = {
    sm: "h-6 w-6",
    md: "h-10 w-10",
    lg: "h-16 w-16",
};

export function WeatherIcon({
    condition,
    size = "md",
    className = "",
}: WeatherIconProps) {
    const Icon = iconMap[condition];

    return <Icon className={`${sizeStyles[size]} ${className}`} />;
}
