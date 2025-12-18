import { useState } from 'react';
import { Building2, Plus, Search, MoreHorizontal, Pencil, Trash2, FileText } from 'lucide-react';
import { useCompany } from '@/contexts/CompanyContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from '@/hooks/use-toast';

export default function Companies() {
  const { companies, currentCompany, setCurrentCompany, addCompany, deleteCompany } = useCompany();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    cnpj: '',
    razaoSocial: '',
    nomeFantasia: '',
  });

  const filteredCompanies = companies.filter(
    (company) =>
      company.razaoSocial.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.nomeFantasia?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.cnpj.includes(searchQuery)
  );

  const handleCreate = () => {
    if (!formData.cnpj || !formData.razaoSocial) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha o CNPJ e a Razão Social.',
        variant: 'destructive',
      });
      return;
    }
    addCompany(formData);
    setFormData({ cnpj: '', razaoSocial: '', nomeFantasia: '' });
    setIsCreateOpen(false);
    toast({
      title: 'Empresa cadastrada',
      description: 'A empresa foi adicionada com sucesso.',
    });
  };

  const handleDelete = () => {
    if (selectedCompany) {
      deleteCompany(selectedCompany);
      setIsDeleteOpen(false);
      setSelectedCompany(null);
      toast({
        title: 'Empresa removida',
        description: 'A empresa foi removida com sucesso.',
      });
    }
  };

  const handleSelectCompany = (companyId: string) => {
    const company = companies.find((c) => c.id === companyId);
    if (company) {
      setCurrentCompany(company);
      navigate('/');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Empresas</h1>
          <p className="text-muted-foreground">
            Gerencie as empresas do seu escritório
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nova empresa
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome, CNPJ..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Companies Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCompanies.map((company) => (
          <Card
            key={company.id}
            className={`card-interactive cursor-pointer ${
              currentCompany?.id === company.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => handleSelectCompany(company.id)}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold truncate">
                      {company.nomeFantasia || company.razaoSocial}
                    </p>
                    <p className="text-sm text-muted-foreground">{company.cnpj}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/empresas/${company.id}/editar`);
                      }}
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCompany(company.id);
                        setIsDeleteOpen(true);
                      }}
                      className="text-error focus:text-error"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="mt-4 pt-4 border-t space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Arquivos enviados</span>
                  <span className="font-medium">{company.totalFiles.toLocaleString('pt-BR')}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Processados</span>
                  <span className="font-medium text-success">
                    {company.totalProcessed.toLocaleString('pt-BR')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Cadastrada em</span>
                  <span className="font-medium">
                    {format(company.createdAt, "dd/MM/yyyy", { locale: ptBR })}
                  </span>
                </div>
              </div>

              {currentCompany?.id === company.id && (
                <div className="mt-3 pt-3 border-t">
                  <span className="text-xs text-primary font-medium flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    Empresa selecionada
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCompanies.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium mb-1">Nenhuma empresa encontrada</h3>
          <p className="text-muted-foreground text-sm">
            {searchQuery
              ? 'Tente ajustar sua busca'
              : 'Comece adicionando sua primeira empresa'}
          </p>
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova empresa</DialogTitle>
            <DialogDescription>
              Adicione uma nova empresa ao seu escritório
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cnpj">CNPJ *</Label>
              <Input
                id="cnpj"
                placeholder="00.000.000/0000-00"
                value={formData.cnpj}
                onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="razaoSocial">Razão Social *</Label>
              <Input
                id="razaoSocial"
                placeholder="Nome completo da empresa"
                value={formData.razaoSocial}
                onChange={(e) => setFormData({ ...formData, razaoSocial: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nomeFantasia">Nome Fantasia</Label>
              <Input
                id="nomeFantasia"
                placeholder="Nome comercial (opcional)"
                value={formData.nomeFantasia}
                onChange={(e) => setFormData({ ...formData, nomeFantasia: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreate}>Cadastrar empresa</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir empresa</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta empresa? Esta ação não pode ser desfeita.
              Todos os arquivos e histórico de processamento serão removidos.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Excluir empresa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
