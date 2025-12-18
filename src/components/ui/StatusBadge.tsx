import { cn } from '@/lib/utils';
import { FileStatus } from '@/types';
import { Clock, Loader2, CheckCircle2, AlertTriangle, XCircle, Upload } from 'lucide-react';

interface StatusBadgeProps {
  status: FileStatus;
  size?: 'sm' | 'md';
  showIcon?: boolean;
}

const statusConfig = {
  pending: {
    label: 'Aguardando',
    icon: Clock,
    className: 'status-pending',
  },
  uploading: {
    label: 'Enviando',
    icon: Upload,
    className: 'status-info',
  },
  queued: {
    label: 'Na fila',
    icon: Clock,
    className: 'status-pending',
  },
  processing: {
    label: 'Processando',
    icon: Loader2,
    className: 'status-info',
  },
  success: {
    label: 'Convertido',
    icon: CheckCircle2,
    className: 'status-success',
  },
  warning: {
    label: 'Com avisos',
    icon: AlertTriangle,
    className: 'status-warning',
  },
  error: {
    label: 'Erro',
    icon: XCircle,
    className: 'status-error',
  },
};

export function StatusBadge({ status, size = 'md', showIcon = true }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'status-badge',
        config.className,
        size === 'sm' && 'text-[10px] px-2 py-0.5'
      )}
    >
      {showIcon && (
        <Icon
          className={cn(
            'flex-shrink-0',
            size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5',
            status === 'processing' && 'animate-spin'
          )}
        />
      )}
      {config.label}
    </span>
  );
}
