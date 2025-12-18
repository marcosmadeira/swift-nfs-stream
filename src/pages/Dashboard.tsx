import { FileText, CheckCircle2, XCircle, Clock, ArrowRight, Activity } from 'lucide-react';
import { MetricCard } from '@/components/ui/MetricCard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { useCompany } from '@/contexts/CompanyContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const recentProcessing = [
  { id: '1', name: 'NFS-e_Janeiro_001.pdf', status: 'success' as const, time: '2 min atrás' },
  { id: '2', name: 'NFS-e_Janeiro_002.pdf', status: 'success' as const, time: '2 min atrás' },
  { id: '3', name: 'NFS-e_Janeiro_003.pdf', status: 'warning' as const, time: '3 min atrás' },
  { id: '4', name: 'NFS-e_Janeiro_004.pdf', status: 'processing' as const, time: 'agora' },
  { id: '5', name: 'NFS-e_Janeiro_005.pdf', status: 'queued' as const, time: 'agora' },
];

export default function Dashboard() {
  const { currentCompany } = useCompany();
  const navigate = useNavigate();

  const metrics = {
    total: currentCompany?.totalFiles || 0,
    processed: currentCompany?.totalProcessed || 0,
    pending: (currentCompany?.totalFiles || 0) - (currentCompany?.totalProcessed || 0),
    successRate: currentCompany?.totalFiles ? Math.round((currentCompany.totalProcessed / currentCompany.totalFiles) * 100) : 0,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral do processamento de {currentCompany?.nomeFantasia || currentCompany?.razaoSocial || 'sua empresa'}
          </p>
        </div>
        <Button onClick={() => navigate('/upload')} className="gap-2">
          Enviar arquivos
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total de arquivos"
          value={metrics.total.toLocaleString('pt-BR')}
          icon={FileText}
          description="Arquivos enviados este mês"
        />
        <MetricCard
          title="Convertidos com sucesso"
          value={metrics.processed.toLocaleString('pt-BR')}
          icon={CheckCircle2}
          variant="success"
          trend={{ value: 12, isPositive: true }}
        />
        <MetricCard
          title="Aguardando processamento"
          value={metrics.pending.toLocaleString('pt-BR')}
          icon={Clock}
          variant="warning"
        />
        <MetricCard
          title="Taxa de sucesso"
          value={`${metrics.successRate}%`}
          icon={Activity}
          description="Conversões bem-sucedidas"
        />
      </div>

      {/* Active Processing & Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Active Processing */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Processamento ativo</CardTitle>
                <CardDescription>
                  Lote atual em processamento
                </CardDescription>
              </div>
              <StatusBadge status="processing" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progresso geral</span>
                <span className="font-medium">127 de 150 arquivos</span>
              </div>
              <ProgressBar value={127} max={150} size="lg" animated />
            </div>
            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="text-center p-3 bg-success-bg rounded-lg">
                <p className="text-2xl font-bold text-success">118</p>
                <p className="text-xs text-success/80">Convertidos</p>
              </div>
              <div className="text-center p-3 bg-warning-bg rounded-lg">
                <p className="text-2xl font-bold text-warning">6</p>
                <p className="text-xs text-warning/80">Com avisos</p>
              </div>
              <div className="text-center p-3 bg-error-bg rounded-lg">
                <p className="text-2xl font-bold text-error">3</p>
                <p className="text-xs text-error/80">Com erro</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-sm text-muted-foreground">Tempo estimado restante</span>
              <span className="text-sm font-medium">~3 minutos</span>
            </div>
            <Button variant="outline" className="w-full" onClick={() => navigate('/processamento')}>
              Ver detalhes
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Atividade recente</CardTitle>
                <CardDescription>
                  Últimos arquivos processados
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/processamento')}>
                Ver todos
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentProcessing.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{file.time}</p>
                    </div>
                  </div>
                  <StatusBadge status={file.status} size="sm" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ações rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            <Button
              variant="outline"
              className="h-auto py-4 flex-col gap-2"
              onClick={() => navigate('/upload')}
            >
              <FileText className="h-5 w-5" />
              <span>Enviar novos arquivos</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex-col gap-2"
              onClick={() => navigate('/downloads')}
            >
              <CheckCircle2 className="h-5 w-5" />
              <span>Baixar convertidos</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex-col gap-2"
              onClick={() => navigate('/empresas')}
            >
              <Activity className="h-5 w-5" />
              <span>Gerenciar empresas</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
