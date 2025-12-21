import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon | React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'success' | 'warning' | 'error';
  className?: string;
}

const variantStyles = {
  default: 'bg-primary/10 text-primary',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  error: 'bg-error/10 text-error',
};

export function MetricCard({ title, value, description, icon, trend, variant = 'default', className }: MetricCardProps) {
  const isReactNode = React.isValidElement(icon);
  
  return (
    <div className={cn("metric-card group hover:border-primary/20 transition-colors", className)}>
      <div className="flex items-start justify-between">
        <div className={cn('p-2 rounded-lg', variantStyles[variant])}>
          {isReactNode ? icon : React.createElement(icon as LucideIcon, { className: "h-5 w-5" })}
        </div>
        {trend && (
          <span
            className={cn(
              'text-xs font-medium',
              trend.isPositive ? 'text-success' : 'text-error'
            )}
          >
            {trend.isPositive ? '+' : ''}{trend.value}%
          </span>
        )}
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold tracking-tight">{value}</p>
        <p className="text-sm text-muted-foreground mt-0.5">{title}</p>
      </div>
      {description && (
        <p className="text-xs text-muted-foreground mt-2 border-t pt-2">{description}</p>
      )}
    </div>
  );
}
