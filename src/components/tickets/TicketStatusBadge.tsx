import { Badge } from '@/components/ui/badge';
import { TicketStatus, TicketPriority, TicketCategory } from '@/types';
import { cn } from '@/lib/utils';

const statusConfig: Record<TicketStatus, { label: string; className: string }> = {
  open: { label: 'Aberto', className: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  in_progress: { label: 'Em Andamento', className: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
  waiting_response: { label: 'Aguardando Resposta', className: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
  resolved: { label: 'Resolvido', className: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
  closed: { label: 'Fechado', className: 'bg-muted text-muted-foreground border-border' },
};

const priorityConfig: Record<TicketPriority, { label: string; className: string }> = {
  low: { label: 'Baixa', className: 'bg-slate-500/10 text-slate-500 border-slate-500/20' },
  medium: { label: 'Média', className: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  high: { label: 'Alta', className: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
  urgent: { label: 'Urgente', className: 'bg-destructive/10 text-destructive border-destructive/20' },
};

const categoryConfig: Record<TicketCategory, { label: string }> = {
  bug: { label: 'Bug' },
  feature: { label: 'Sugestão' },
  question: { label: 'Dúvida' },
  billing: { label: 'Financeiro' },
  other: { label: 'Outro' },
};

export function TicketStatusBadge({ status }: { status: TicketStatus }) {
  const config = statusConfig[status];
  return (
    <Badge variant="outline" className={cn('font-medium', config.className)}>
      {config.label}
    </Badge>
  );
}

export function TicketPriorityBadge({ priority }: { priority: TicketPriority }) {
  const config = priorityConfig[priority];
  return (
    <Badge variant="outline" className={cn('font-medium', config.className)}>
      {config.label}
    </Badge>
  );
}

export function TicketCategoryBadge({ category }: { category: TicketCategory }) {
  const config = categoryConfig[category];
  return (
    <Badge variant="secondary" className="font-medium">
      {config.label}
    </Badge>
  );
}
