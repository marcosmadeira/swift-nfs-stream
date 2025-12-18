import { useState } from 'react';
import { Download, FileText, Search, Filter, CheckCircle2, Calendar, Package, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useCompany } from '@/contexts/CompanyContext';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface ConvertedFile {
  id: string;
  name: string;
  originalName: string;
  convertedAt: Date;
  size: number;
  hasWarning: boolean;
  warningMessage?: string;
}

const sampleFiles: ConvertedFile[] = [
  { id: '1', name: 'NFS-e_2024_001.xml', originalName: 'NFS-e_2024_001.pdf', convertedAt: new Date(Date.now() - 1 * 60 * 60 * 1000), size: 45000, hasWarning: false },
  { id: '2', name: 'NFS-e_2024_002.xml', originalName: 'NFS-e_2024_002.pdf', convertedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), size: 52000, hasWarning: false },
  { id: '3', name: 'NFS-e_2024_003.xml', originalName: 'NFS-e_2024_003.pdf', convertedAt: new Date(Date.now() - 3 * 60 * 60 * 1000), size: 38000, hasWarning: true, warningMessage: 'Data de emissão não identificada' },
  { id: '4', name: 'NFS-e_2024_004.xml', originalName: 'NFS-e_2024_004.pdf', convertedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), size: 61000, hasWarning: false },
  { id: '5', name: 'NFS-e_2024_005.xml', originalName: 'NFS-e_2024_005.pdf', convertedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), size: 44000, hasWarning: false },
  { id: '6', name: 'NFS-e_2024_006.xml', originalName: 'NFS-e_2024_006.pdf', convertedAt: new Date(Date.now() - 25 * 60 * 60 * 1000), size: 55000, hasWarning: true, warningMessage: 'CNPJ do tomador não identificado' },
  { id: '7', name: 'NFS-e_2024_007.xml', originalName: 'NFS-e_2024_007.pdf', convertedAt: new Date(Date.now() - 48 * 60 * 60 * 1000), size: 49000, hasWarning: false },
  { id: '8', name: 'NFS-e_2024_008.xml', originalName: 'NFS-e_2024_008.pdf', convertedAt: new Date(Date.now() - 72 * 60 * 60 * 1000), size: 42000, hasWarning: false },
];

export default function Downloads() {
  const { currentCompany } = useCompany();
  const [searchQuery, setSearchQuery] = useState('');
  const [periodFilter, setPeriodFilter] = useState<string>('all');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  const filteredFiles = sampleFiles.filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesPeriod = true;
    if (periodFilter !== 'all') {
      const now = Date.now();
      const fileTime = file.convertedAt.getTime();
      const hoursDiff = (now - fileTime) / (1000 * 60 * 60);
      
      if (periodFilter === 'today' && hoursDiff > 24) matchesPeriod = false;
      if (periodFilter === 'week' && hoursDiff > 168) matchesPeriod = false;
      if (periodFilter === 'month' && hoursDiff > 720) matchesPeriod = false;
    }
    
    return matchesSearch && matchesPeriod;
  });

  const toggleSelect = (id: string) => {
    setSelectedFiles((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedFiles.length === filteredFiles.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(filteredFiles.map((f) => f.id));
    }
  };

  const handleDownload = (fileId: string) => {
    const file = sampleFiles.find((f) => f.id === fileId);
    if (file) {
      toast({
        title: 'Download iniciado',
        description: `Baixando ${file.name}...`,
      });
    }
  };

  const handleBatchDownload = () => {
    if (selectedFiles.length === 0) {
      toast({
        title: 'Nenhum arquivo selecionado',
        description: 'Selecione ao menos um arquivo para baixar.',
        variant: 'destructive',
      });
      return;
    }
    
    toast({
      title: 'Preparando download',
      description: `Gerando ZIP com ${selectedFiles.length} arquivo(s)...`,
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const totalSize = filteredFiles.reduce((acc, f) => acc + f.size, 0);
  const filesWithWarnings = filteredFiles.filter((f) => f.hasWarning).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Downloads</h1>
          <p className="text-muted-foreground">
            Baixe os arquivos XML convertidos
          </p>
        </div>
        <Button
          onClick={handleBatchDownload}
          disabled={selectedFiles.length === 0}
          className="gap-2"
        >
          <Package className="h-4 w-4" />
          Baixar selecionados ({selectedFiles.length})
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 rounded-lg bg-success/10">
              <CheckCircle2 className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{filteredFiles.length}</p>
              <p className="text-sm text-muted-foreground">Arquivos disponíveis</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <Download className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{formatFileSize(totalSize)}</p>
              <p className="text-sm text-muted-foreground">Tamanho total</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 rounded-lg bg-warning/10">
              <AlertTriangle className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{filesWithWarnings}</p>
              <p className="text-sm text-muted-foreground">Com avisos</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar arquivo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={periodFilter} onValueChange={setPeriodFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filtrar por período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os períodos</SelectItem>
            <SelectItem value="today">Hoje</SelectItem>
            <SelectItem value="week">Última semana</SelectItem>
            <SelectItem value="month">Último mês</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Files List */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="text-left px-4 py-3 w-12">
                    <Checkbox
                      checked={selectedFiles.length === filteredFiles.length && filteredFiles.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </th>
                  <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">Arquivo</th>
                  <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3 hidden md:table-cell">Convertido em</th>
                  <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3 hidden sm:table-cell">Tamanho</th>
                  <th className="text-right text-sm font-medium text-muted-foreground px-4 py-3">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredFiles.map((file) => (
                  <tr
                    key={file.id}
                    className={cn(
                      'hover:bg-secondary/30 transition-colors',
                      selectedFiles.includes(file.id) && 'bg-primary/5'
                    )}
                  >
                    <td className="px-4 py-3">
                      <Checkbox
                        checked={selectedFiles.includes(file.id)}
                        onCheckedChange={() => toggleSelect(file.id)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <FileText className={cn(
                          'h-4 w-4 flex-shrink-0',
                          file.hasWarning ? 'text-warning' : 'text-success'
                        )} />
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{file.name}</p>
                          {file.hasWarning && (
                            <p className="text-xs text-warning flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              {file.warningMessage}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-sm text-muted-foreground">
                        {format(file.convertedAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-sm text-muted-foreground">
                        {formatFileSize(file.size)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(file.id)}
                        className="gap-2"
                      >
                        <Download className="h-4 w-4" />
                        <span className="hidden sm:inline">Baixar</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredFiles.length === 0 && (
            <div className="text-center py-12">
              <Download className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium mb-1">Nenhum arquivo disponível</h3>
              <p className="text-muted-foreground text-sm">
                Os arquivos convertidos aparecerão aqui
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
