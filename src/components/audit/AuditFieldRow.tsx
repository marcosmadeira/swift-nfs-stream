import { useState } from 'react';
import { Check, X, Edit2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { AuditConfidenceBadge } from './AuditConfidenceBadge';
import { AuditField } from '@/types/audit';
import { cn } from '@/lib/utils';

interface AuditFieldRowProps {
  field: AuditField;
  isSelected: boolean;
  isApproved: boolean;
  isRejected: boolean;
  onSelect: (fieldName: string, selected: boolean) => void;
  onApprove: (fieldName: string) => void;
  onReject: (fieldName: string) => void;
  onEdit: (fieldName: string, newValue: string) => void;
}

const sourceLabels = {
  ocr: 'OCR',
  pattern: 'Padrão',
  ai_inference: 'IA',
  database: 'Base de Dados',
};

export function AuditFieldRow({ 
  field, 
  isSelected, 
  isApproved, 
  isRejected,
  onSelect, 
  onApprove, 
  onReject, 
  onEdit 
}: AuditFieldRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(field.extractedValue);

  const handleSaveEdit = () => {
    onEdit(field.field, editValue);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditValue(field.extractedValue);
    setIsEditing(false);
  };

  return (
    <tr className={cn(
      'hover:bg-secondary/30 transition-colors group',
      field.needsReview && 'bg-warning/5',
      isApproved && 'bg-success/5',
      isRejected && 'bg-error/5'
    )}>
      <td className="px-4 py-3">
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onSelect(field.field, !!checked)}
        />
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{field.label}</span>
          {field.needsReview && !isApproved && !isRejected && (
            <Tooltip>
              <TooltipTrigger>
                <AlertTriangle className="h-4 w-4 text-warning" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Este campo precisa de revisão</p>
                {field.suggestion && <p className="text-xs mt-1">Sugestão: {field.suggestion}</p>}
              </TooltipContent>
            </Tooltip>
          )}
          {isApproved && (
            <span className="text-xs px-1.5 py-0.5 bg-success/20 text-success rounded">Aprovado</span>
          )}
          {isRejected && (
            <span className="text-xs px-1.5 py-0.5 bg-error/20 text-error rounded">Rejeitado</span>
          )}
        </div>
        <span className="text-xs text-muted-foreground">{field.field}</span>
      </td>
      <td className="px-4 py-3">
        <span className="text-sm text-muted-foreground truncate max-w-[150px] block">
          {field.originalValue || '-'}
        </span>
      </td>
      <td className="px-4 py-3">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="h-8 text-sm"
            />
            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={handleSaveEdit}>
              <Check className="h-4 w-4 text-success" />
            </Button>
            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={handleCancelEdit}>
              <X className="h-4 w-4 text-error" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{field.extractedValue}</span>
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 className="h-3 w-3" />
            </Button>
          </div>
        )}
      </td>
      <td className="px-4 py-3">
        <AuditConfidenceBadge 
          confidence={field.confidence} 
          score={field.confidenceScore} 
          size="sm" 
        />
      </td>
      <td className="px-4 py-3">
        <Tooltip>
          <TooltipTrigger>
            <span className="text-xs px-2 py-1 bg-secondary rounded-full">
              {sourceLabels[field.source]}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>Dado extraído via {sourceLabels[field.source]}</p>
          </TooltipContent>
        </Tooltip>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant={isApproved ? 'default' : 'ghost'}
                className={cn(
                  'h-7 w-7',
                  isApproved ? 'bg-success hover:bg-success/90' : 'hover:bg-success/20 hover:text-success'
                )}
                onClick={() => onApprove(field.field)}
              >
                <Check className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Aprovar valor</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant={isRejected ? 'default' : 'ghost'}
                className={cn(
                  'h-7 w-7',
                  isRejected ? 'bg-error hover:bg-error/90' : 'hover:bg-error/20 hover:text-error'
                )}
                onClick={() => onReject(field.field)}
              >
                <X className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Rejeitar valor</TooltipContent>
          </Tooltip>
        </div>
      </td>
    </tr>
  );
}
