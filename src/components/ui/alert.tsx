import React from "react";
import { Info, AlertTriangle, AlertCircle, CheckCircle } from "lucide-react";

type AlertVariant = "info" | "warning" | "danger" | "success";

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<
  AlertVariant,
  { container: string; Icon: React.ComponentType<{ className?: string }> }
> = {
  info: {
    container: "bg-blue-50 border-blue-200 text-blue-900",
    Icon: Info,
  },
  warning: {
    container: "bg-yellow-50 border-yellow-200 text-yellow-900",
    Icon: AlertTriangle,
  },
  danger: {
    container: "bg-red-50 border-red-200 text-red-900",
    Icon: AlertCircle,
  },
  success: {
    container: "bg-green-50 border-green-200 text-green-900",
    Icon: CheckCircle,
  },
};

export function Alert({
  variant = "info",
  title,
  children,
  className = "",
}: AlertProps) {
  const styles = variantStyles[variant];
  const Icon = styles.Icon;

  return (
    <div className={`border rounded-lg p-4 ${styles.container} ${className}`}>
      <div className="flex items-start gap-3">
        <Icon className="h-5 w-5 mt-0.5" />
        <div className="flex-1">
          {title && <h4 className="font-semibold mb-1">{title}</h4>}
          <div className="text-sm">{children}</div>
        </div>
      </div>
    </div>
  );
}
