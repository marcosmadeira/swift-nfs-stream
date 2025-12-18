import { useState, useEffect } from 'react';
import { FileText, Filter, Search, RefreshCw, CheckCircle2, AlertTriangle, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useCompany } from '@/contexts/CompanyContext';
import { ProcessingFile, FileStatus } from '@/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Sample processing data
const sampleFiles: ProcessingFile[] = [
  { id: '1', name: 'NFS-e_2024_001.pdf', size: 256000, companyId: '1', status: 'success', progress: 100, createdAt: new Date(), processedAt: new Date() },
  { id: '2', name: 'NFS-e_2024_002.pdf', size: 312000, companyId: '1', status: 'success', progress: 100, createdAt: new Date(), processedAt: new Date() },
  { id: '3', name: 'NFS-e_2024_003.pdf', size: 198000, companyId: '1', status: 'warning', progress: 100, warningMessage: 'Data de emissão não identificada', createdAt: new Date(), processedAt: new Date() },
  { id: '4', name: 'NFS-e_2024_004.pdf', size: 445000, companyId: '1', status: 'processing', progress: 67, createdAt: new Date() },
  { id: '5', name: 'NFS-e_2024_005.pdf', size: 287000, companyId: '1', status: 'queued', progress: 0, createdAt: new Date() },
  { id: '6', name: 'NFS-e_2024_006.pdf', size: 523000, companyId: '1', status: 'queued', progress: 0, createdAt: new Date() },
  { id: '7', name: 'NFS-e_2024_007.pdf', size: 178000, companyId: '1', status: 'error', progress: 0, errorMessage: 'Arquivo corrompido ou protegido', createdAt: new Date() },
  { id: '8', name: 'NFS-e_2024_008.pdf', size: 234000, companyId: '1', status: 'queued', progress: 0, createdAt: new Date() },
];

export default function Processing() {
  const { currentCompany } = useCompany();
  const [files, setFiles] = useState<ProcessingFile[]>(sampleFiles);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Simulate processing progress
  useEffect(() => {
    const interval = setInterval(() => {
      setFiles((prev) =>
        prev.map((file) => {
          if (file.status === 'processing' && file.progress < 100) {
            const newProgress = Math.min(file.progress + Math.random() * 10, 100);
            if (newProgress >= 100) {
              return { ...file, status: 'success' as FileStatus, progress: 100, processedAt: new Date() };
            }
            return { ...file, progress: newProgress };
          }
          if (file.status === 'queued') {
            const processingFiles = prev.filter((f) => f.status === 'processing');
            if (processingFiles.length < 2) {
              return { ...file, status: 'processing' as FileStatus, progress: 5 };
            }
          }
          return file;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || file.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: files.length,
    success: files.filter((f) => f.status === 'success').length,
    warning: files.filter((f) => f.status === 'warning').length,
    error: files.filter((f) => f.status === 'error').length,
    processing: files.filter((f) => f.status === 'processing' || f.status === 'queued').length,
  };

  const overallProgress = Math.round(
    (files.filter((f) => f.status === 'success' || f.status === 'warning' || f.status === 'error').length / files.length) * 100
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Processamento</h1>
          <p className="text-muted-foreground">
            Acompanhe o status de conversão dos seus arquivos
          </p>
        </div>
        <Button variant="outline" onClick={handleRefresh} className="gap-2">
          <RefreshCw className={cn('h-4 w-4', isRefreshing && 'animate-spin')} />
          Atualizar
        </Button>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Progresso geral</CardTitle>
          <CardDescription>
            Processamento de {currentCompany?.nomeFantasia || 'empresa'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">
              {stats.total - stats.processing} de {stats.total} arquivos processados
            </span>
            <span className="font-medium">{overallProgress}%</span>
          </div>
          <ProgressBar value={overallProgress} size="lg" animated={stats.processing > 0} />
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-success-bg">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <div>
                <p className="text-lg font-bold text-success">{stats.success}</p>
                <p className="text-xs text-success/80">Convertidos</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-warning-bg">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <div>
                <p className="text-lg font-bold text-warning">{stats.warning}</p>
                <p className="text-xs text-warning/80">Com avisos</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-error-bg">
              <XCircle className="h-5 w-5 text-error" />
              <div>
                <p className="text-lg font-bold text-error">{stats.error}</p>
                <p className="text-xs text-error/80">Com erro</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-info-bg">
              <Clock className="h-5 w-5 text-info" />
              <div>
                <p className="text-lg font-bold text-info">{stats.processing}</p>
                <p className="text-xs text-info/80">Na fila</p>
              </div>
            </div>
          </div>

          {stats.processing > 0 && (
            <div className="flex items-center justify-between pt-4 border-t">
              <span className="text-sm text-muted-foreground">Tempo estimado restante</span>
              <span className="text-sm font-medium">~{Math.ceil(stats.processing * 0.5)} minutos</span>
            </div>
          )}
        </CardContent>
      </Card>

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
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="success">Convertidos</SelectItem>
            <SelectItem value="warning">Com avisos</SelectItem>
            <SelectItem value="error">Com erro</SelectItem>
            <SelectItem value="processing">Processando</SelectItem>
            <SelectItem value="queued">Na fila</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Files Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">Arquivo</th>
                  <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3 hidden sm:table-cell">Data</th>
                  <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">Progresso</th>
                  <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{file.name}</p>
                          {file.errorMessage && (
                            <p className="text-xs text-error">{file.errorMessage}</p>
                          )}
                          {file.warningMessage && (
                            <p className="text-xs text-warning">{file.warningMessage}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-sm text-muted-foreground">
                        {format(file.createdAt, "dd/MM HH:mm", { locale: ptBR })}
                      </span>
                    </td>
                    <td className="px-4 py-3 w-32">
                      {(file.status === 'processing' || file.status === 'queued') ? (
                        <ProgressBar 
                          value={file.progress} 
                          size="sm" 
                          animated={file.status === 'processing'} 
                        />
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          {file.status === 'success' || file.status === 'warning' ? '100%' : '-'}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={file.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredFiles.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">Nenhum arquivo encontrado</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
