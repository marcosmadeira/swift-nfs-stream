import { Building2, ChevronDown, Plus, Check } from 'lucide-react';
import { useCompany } from '@/contexts/CompanyContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

export function CompanySwitcher() {
  const { companies, currentCompany, setCurrentCompany } = useCompany();
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-64 justify-between border-border/50 bg-card hover:bg-secondary"
        >
          <div className="flex items-center gap-2 truncate">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">
              {currentCompany?.nomeFantasia || currentCompany?.razaoSocial || 'Selecione uma empresa'}
            </span>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
          Empresas cadastradas
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {companies.map((company) => (
          <DropdownMenuItem
            key={company.id}
            onClick={() => setCurrentCompany(company)}
            className={cn(
              'flex items-center justify-between cursor-pointer',
              currentCompany?.id === company.id && 'bg-secondary'
            )}
          >
            <div className="flex flex-col gap-0.5">
              <span className="font-medium text-sm">
                {company.nomeFantasia || company.razaoSocial}
              </span>
              <span className="text-xs text-muted-foreground">{company.cnpj}</span>
            </div>
            {currentCompany?.id === company.id && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => navigate('/empresas/nova')}
          className="cursor-pointer text-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar empresa
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
