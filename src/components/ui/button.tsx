import React from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    children: React.ReactNode;
    isLoading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
    primary: "bg-green-600 hover:bg-green-700 text-white",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white",
    outline: "border-2 border-green-600 text-green-600 hover:bg-green-50",
    ghost: "text-gray-700 hover:bg-gray-100",
    danger: "bg-red-600 hover:bg-red-700 text-white",
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
};

export function Button({
    variant = "primary",
    size = "md",
    children,
    isLoading = false,
    disabled,
    className = "",
    ...props
}: ButtonProps) {
    return (
        <button
            className={`
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        rounded-lg font-medium transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
        ${className}
      `}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                        />s
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                    Loading...
                </span>
            ) : (
                children
            )}
        </button>
    );
}
