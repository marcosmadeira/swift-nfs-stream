import { cn } from '@/lib/utils';
import { ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react';
import { AuditConfidence } from '@/types/audit';

interface AuditConfidenceBadgeProps {
  confidence: AuditConfidence;
  score?: number;
  size?: 'sm' | 'md' | 'lg';
}

const confidenceConfig = {
  high: {
    label: 'Alta Confiança',
    icon: ShieldCheck,
    className: 'bg-success/10 text-success border-success/20',
  },
  medium: {
    label: 'Média Confiança',
    icon: ShieldAlert,
    className: 'bg-warning/10 text-warning border-warning/20',
  },
  low: {
    label: 'Baixa Confiança',
    icon: ShieldX,
    className: 'bg-error/10 text-error border-error/20',
  },
};

export function AuditConfidenceBadge({ confidence, score, size = 'md' }: AuditConfidenceBadgeProps) {
  const config = confidenceConfig[confidence];
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-2.5 py-1 gap-1.5',
    lg: 'text-base px-3 py-1.5 gap-2',
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border font-medium',
        config.className,
        sizeClasses[size]
      )}
    >
      <Icon className={iconSizes[size]} />
      <span>{config.label}</span>
      {score !== undefined && (
        <span className="opacity-70">({score}%)</span>
      )}
    </div>
  );
}
