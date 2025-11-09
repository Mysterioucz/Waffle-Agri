interface ProgressProps {
    value: number;
    max?: number;
    className?: string;
    showLabel?: boolean;
    color?: "green" | "blue" | "yellow" | "red";
}

const colorStyles = {
    green: "bg-green-600",
    blue: "bg-blue-600",
    yellow: "bg-yellow-600",
    red: "bg-red-600",
};

export function Progress({
    value,
    max = 100,
    className = "",
    showLabel = false,
    color = "green",
}: ProgressProps) {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    return (
        <div className={`w-full ${className}`}>
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div
                    className={`h-full ${colorStyles[color]} transition-all duration-300`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
            {showLabel && (
                <div className="text-xs text-gray-600 mt-1 text-right">
                    {percentage.toFixed(0)}%
                </div>
            )}
        </div>
    );
}
