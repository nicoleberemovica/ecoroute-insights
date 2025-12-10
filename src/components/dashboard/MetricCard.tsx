import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: number;
  changeLabel?: string;
  icon: ReactNode;
  variant?: "default" | "primary" | "success" | "warning";
  delay?: number;
}

export function MetricCard({
  title,
  value,
  unit,
  change,
  changeLabel,
  icon,
  variant = "default",
  delay = 0,
}: MetricCardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={cn(
        "relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md",
        variant === "primary" && "border-primary/20 bg-primary/5",
        variant === "success" && "border-success/20 bg-success/5",
        variant === "warning" && "border-warning/20 bg-warning/5"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-display font-bold tracking-tight">
              {typeof value === "number" ? value.toLocaleString() : value}
            </span>
            {unit && (
              <span className="text-sm font-medium text-muted-foreground">
                {unit}
              </span>
            )}
          </div>
        </div>
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl",
            variant === "default" && "bg-secondary text-secondary-foreground",
            variant === "primary" && "bg-primary/10 text-primary",
            variant === "success" && "bg-success/10 text-success",
            variant === "warning" && "bg-warning/10 text-warning"
          )}
        >
          {icon}
        </div>
      </div>

      {change !== undefined && (
        <div className="mt-4 flex items-center gap-2">
          <div
            className={cn(
              "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
              isPositive && "bg-destructive/10 text-destructive",
              isNegative && "bg-success/10 text-success",
              !isPositive && !isNegative && "bg-muted text-muted-foreground"
            )}
          >
            {isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : isNegative ? (
              <TrendingDown className="h-3 w-3" />
            ) : (
              <Minus className="h-3 w-3" />
            )}
            {Math.abs(change)}%
          </div>
          {changeLabel && (
            <span className="text-xs text-muted-foreground">{changeLabel}</span>
          )}
        </div>
      )}
    </motion.div>
  );
}