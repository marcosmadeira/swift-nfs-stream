import { useState } from 'react';
import { 
  FileText, Search, Filter, Download, CheckCircle2, AlertTriangle, 
  ShieldCheck, ChevronRight, Eye, FileCode, FileDown, CheckCheck, XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { AuditConfidenceBadge } from '@/components/audit/AuditConfidenceBadge';
import { AuditFieldRow } from '@/components/audit/AuditFieldRow';
import { AICopilot } from '@/components/copilot/AICopilot';
import { AuditedFile, AuditField } from '@/types/audit';
import { generateAuditPDF, generateBatchAuditPDF } from '@/utils/auditPdfGenerator';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

// Sample audit data
const generateSampleAuditFields = (): AuditField[] => [
  { field: 'numero_nota', label: 'Número da Nota', originalValue: '2024001234', extractedValue: '2024001234', confidence: 'high', confidenceScore: 98, source: 'ocr', needsReview: false },
  { field: 'data_emissao', label: 'Data de Emissão', originalValue: '15/01/2024', extractedValue: '2024-01-15', confidence: 'high', confidenceScore: 95, source: 'pattern', needsReview: false },
  { field: 'cnpj_prestador', label: 'CNPJ Prestador', originalValue: '12.345.678/0001-90', extractedValue: '12345678000190', confidence: 'high', confidenceScore: 99, source: 'ocr', needsReview: false },
  { field: 'razao_social_prestador', label: 'Razão Social Prestador', originalValue: 'EMPRESA TECH LTDA', extractedValue: 'EMPRESA TECH LTDA', confidence: 'high', confidenceScore: 92, source: 'ocr', needsReview: false },
  { field: 'cnpj_tomador', label: 'CNPJ Tomador', originalValue: '98.765.432/0001-10', extractedValue: '98765432000110', confidence: 'medium', confidenceScore: 78, source: 'ai_inference', needsReview: true, suggestion: 'Verificar dígito verificador' },
  { field: 'razao_social_tomador', label: 'Razão Social Tomador', originalValue: 'CLIENTE CORP S.A.', extractedValue: 'CLIENTE CORP S.A.', confidence: 'high', confidenceScore: 94, source: 'ocr', needsReview: false },
  { field: 'valor_servicos', label: 'Valor dos Serviços', originalValue: 'R$ 15.000,00', extractedValue: '15000.00', confidence: 'high', confidenceScore: 97, source: 'pattern', needsReview: false },
  { field: 'valor_deducoes', label: 'Deduções', originalValue: 'R$ 0,00', extractedValue: '0.00', confidence: 'high', confidenceScore: 100, source: 'pattern', needsReview: false },
  { field: 'base_calculo', label: 'Base de Cálculo', originalValue: 'R$ 15.000,00', extractedValue: '15000.00', confidence: 'high', confidenceScore: 96, source: 'pattern', needsReview: false },
  { field: 'aliquota_iss', label: 'Alíquota ISS', originalValue: '5%', extractedValue: '5.00', confidence: 'high', confidenceScore: 99, source: 'pattern', needsReview: false },
  { field: 'valor_iss', label: 'Valor ISS', originalValue: 'R$ 750,00', extractedValue: '750.00', confidence: 'high', confidenceScore: 98, source: 'pattern', needsReview: false },
  { field: 'codigo_servico', label: 'Código do Serviço', originalValue: '1.01', extractedValue: '1.01', confidence: 'low', confidenceScore: 62, source: 'ai_inference', needsReview: true, suggestion: 'Código pode estar no formato antigo LC 116' },
  { field: 'discriminacao', label: 'Discriminação', originalValue: 'Serviços de consultoria...', extractedValue: 'Serviços de consultoria em tecnologia da informação conforme contrato nº 123/2024', confidence: 'medium', confidenceScore: 85, source: 'ocr', needsReview: false },
  { field: 'municipio_prestacao', label: 'Município', originalValue: 'São Paulo - SP', extractedValue: '3550308', confidence: 'high', confidenceScore: 91, source: 'database', needsReview: false },
  { field: 'valor_pis', label: 'Valor PIS', originalValue: 'R$ 97,50', extractedValue: '97.50', confidence: 'high', confidenceScore: 94, source: 'pattern', needsReview: false },
  { field: 'valor_cofins', label: 'Valor COFINS', originalValue: 'R$ 450,00', extractedValue: '450.00', confidence: 'high', confidenceScore: 94, source: 'pattern', needsReview: false },
];

const sampleAuditedFiles: AuditedFile[] = [
  {
    id: '1',
    originalFileName: 'NFS-e_2024_001.pdf',
    xmlFileName: 'NFS-e_2024_001.xml',
    processedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    overallConfidence: 94,
    fields: generateSampleAuditFields(),
    xmlPreview: `<?xml version="1.0" encoding="UTF-8"?>
<CompNfse xmlns="http://www.abrasf.org.br/nfse.xsd">
  <Nfse>
    <InfNfse>
      <Numero>2024001234</Numero>
      <CodigoVerificacao>ABCD1234</CodigoVerificacao>
      <DataEmissao>2024-01-15T10:30:00</DataEmissao>
      <ValoresNfse>
        <BaseCalculo>15000.00</BaseCalculo>
        <Aliquota>5.00</Aliquota>
        <ValorIss>750.00</ValorIss>
      </ValoresNfse>
    </InfNfse>
  </Nfse>
</CompNfse>`,
    numeroNota: '2024001234',
    dataEmissao: '2024-01-15',
    cnpjPrestador: '12345678000190',
    razaoSocialPrestador: 'EMPRESA TECH LTDA',
    valorServicos: 15000,
    valorIss: 750,
    aliquotaIss: 5,
  },
  {
    id: '2',
    originalFileName: 'NFS-e_2024_002.pdf',
    xmlFileName: 'NFS-e_2024_002.xml',
    processedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    overallConfidence: 87,
    fields: generateSampleAuditFields().map(f => 
      f.field === 'codigo_servico' ? { ...f, confidenceScore: 55, confidence: 'low' as const, needsReview: true } : f
    ),
    xmlPreview: '<?xml version="1.0"?><nfse>...</nfse>',
    numeroNota: '2024001235',
    dataEmissao: '2024-01-16',
    cnpjPrestador: '12345678000190',
    razaoSocialPrestador: 'EMPRESA TECH LTDA',
    valorServicos: 8500,
    valorIss: 425,
    aliquotaIss: 5,
  },
  {
    id: '3',
    originalFileName: 'NFS-e_2024_003.pdf',
    xmlFileName: 'NFS-e_2024_003.xml',
    processedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    overallConfidence: 72,
    fields: generateSampleAuditFields().map(f => ({
      ...f,
      confidence: f.confidenceScore > 90 ? 'high' as const : f.confidenceScore > 70 ? 'medium' as const : 'low' as const,
      needsReview: f.confidenceScore < 80,
    })),
    xmlPreview: '<?xml version="1.0"?><nfse>...</nfse>',
    numeroNota: '2024001236',
    dataEmissao: '2024-01-17',
    cnpjPrestador: '98765432000110',
    razaoSocialPrestador: 'OUTRO PRESTADOR ME',
    valorServicos: 3200,
    valorIss: 160,
    aliquotaIss: 5,
  },
];

export default function Audit() {
  const { toast } = useToast();
  const [files] = useState<AuditedFile[]>(sampleAuditedFiles);
  const [selectedFile, setSelectedFile] = useState<AuditedFile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [confidenceFilter, setConfidenceFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('fields');
  
  // Batch selection and approval state
  const [selectedFields, setSelectedFields] = useState<Set<string>>(new Set());
  const [approvedFields, setApprovedFields] = useState<Set<string>>(new Set());
  const [rejectedFields, setRejectedFields] = useState<Set<string>>(new Set());

  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.originalFileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.numeroNota?.includes(searchQuery);
    const matchesConfidence = confidenceFilter === 'all' ||
      (confidenceFilter === 'high' && file.overallConfidence >= 90) ||
      (confidenceFilter === 'medium' && file.overallConfidence >= 70 && file.overallConfidence < 90) ||
      (confidenceFilter === 'low' && file.overallConfidence < 70);
    return matchesSearch && matchesConfidence;
  });

  const stats = {
    total: files.length,
    highConfidence: files.filter((f) => f.overallConfidence >= 90).length,
    mediumConfidence: files.filter((f) => f.overallConfidence >= 70 && f.overallConfidence < 90).length,
    lowConfidence: files.filter((f) => f.overallConfidence < 70).length,
    needsReview: files.filter((f) => f.fields.some((field) => field.needsReview)).length,
  };

  const getConfidenceLevel = (score: number): 'high' | 'medium' | 'low' => {
    if (score >= 90) return 'high';
    if (score >= 70) return 'medium';
    return 'low';
  };

  const handleSelectField = (fieldName: string, selected: boolean) => {
    setSelectedFields(prev => {
      const next = new Set(prev);
      if (selected) {
        next.add(fieldName);
      } else {
        next.delete(fieldName);
      }
      return next;
    });
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected && selectedFile) {
      setSelectedFields(new Set(selectedFile.fields.map(f => f.field)));
    } else {
      setSelectedFields(new Set());
    }
  };

  const handleApproveField = (fieldName: string) => {
    setApprovedFields(prev => {
      const next = new Set(prev);
      next.add(fieldName);
      return next;
    });
    setRejectedFields(prev => {
      const next = new Set(prev);
      next.delete(fieldName);
      return next;
    });
    toast({
      title: 'Campo aprovado',
      description: `O campo foi marcado como validado.`,
    });
  };

  const handleRejectField = (fieldName: string) => {
    setRejectedFields(prev => {
      const next = new Set(prev);
      next.add(fieldName);
      return next;
    });
    setApprovedFields(prev => {
      const next = new Set(prev);
      next.delete(fieldName);
      return next;
    });
    toast({
      title: 'Campo rejeitado',
      description: `O campo foi marcado para correção manual.`,
      variant: 'destructive',
    });
  };

  const handleBatchApprove = () => {
    if (selectedFields.size === 0) {
      toast({
        title: 'Nenhum campo selecionado',
        description: 'Selecione pelo menos um campo para aprovar.',
        variant: 'destructive',
      });
      return;
    }
    
    setApprovedFields(prev => {
      const next = new Set(prev);
      selectedFields.forEach(f => next.add(f));
      return next;
    });
    setRejectedFields(prev => {
      const next = new Set(prev);
      selectedFields.forEach(f => next.delete(f));
      return next;
    });
    
    toast({
      title: 'Campos aprovados em lote',
      description: `${selectedFields.size} campos foram marcados como validados.`,
    });
    setSelectedFields(new Set());
  };

  const handleBatchReject = () => {
    if (selectedFields.size === 0) {
      toast({
        title: 'Nenhum campo selecionado',
        description: 'Selecione pelo menos um campo para rejeitar.',
        variant: 'destructive',
      });
      return;
    }
    
    setRejectedFields(prev => {
      const next = new Set(prev);
      selectedFields.forEach(f => next.add(f));
      return next;
    });
    setApprovedFields(prev => {
      const next = new Set(prev);
      selectedFields.forEach(f => next.delete(f));
      return next;
    });
    
    toast({
      title: 'Campos rejeitados em lote',
      description: `${selectedFields.size} campos foram marcados para correção.`,
      variant: 'destructive',
    });
    setSelectedFields(new Set());
  };

  const handleEditField = (fieldName: string, newValue: string) => {
    toast({
      title: 'Campo editado',
      description: `O valor do campo "${fieldName}" foi alterado para "${newValue}".`,
    });
  };

  const handleDownloadXml = (file: AuditedFile) => {
    toast({
      title: 'Download iniciado',
      description: `Baixando ${file.xmlFileName}...`,
    });
  };

  const handleGeneratePDF = () => {
    if (!selectedFile) return;
    
    generateAuditPDF(selectedFile, approvedFields, rejectedFields);
    toast({
      title: 'Relatório gerado',
      description: `O relatório de auditoria foi baixado com sucesso.`,
    });
  };

  const handleGenerateBatchPDF = () => {
    generateBatchAuditPDF(files);
    toast({
      title: 'Relatório em lote gerado',
      description: `O relatório de auditoria de ${files.length} arquivos foi baixado.`,
    });
  };

  // Reset selections when changing file
  const handleSelectFile = (file: AuditedFile) => {
    setSelectedFile(file);
    setSelectedFields(new Set());
    setApprovedFields(new Set());
    setRejectedFields(new Set());
  };

  const allSelected = selectedFile ? selectedFields.size === selectedFile.fields.length : false;
  const someSelected = selectedFields.size > 0 && !allSelected;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Auditoria de Dados</h1>
          <p className="text-muted-foreground">
            Valide os dados extraídos e verifique a confiabilidade do processamento
          </p>
        </div>
        <Button onClick={handleGenerateBatchPDF} className="gap-2">
          <FileDown className="h-4 w-4" />
          Relatório em Lote
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Processados</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-8 w-8 text-success" />
              <div>
                <p className="text-2xl font-bold text-success">{stats.highConfidence}</p>
                <p className="text-xs text-muted-foreground">Alta Confiança</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-warning" />
              <div>
                <p className="text-2xl font-bold text-warning">{stats.mediumConfidence}</p>
                <p className="text-xs text-muted-foreground">Média Confiança</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-error" />
              <div>
                <p className="text-2xl font-bold text-error">{stats.lowConfidence}</p>
                <p className="text-xs text-muted-foreground">Baixa Confiança</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Eye className="h-8 w-8 text-info" />
              <div>
                <p className="text-2xl font-bold text-info">{stats.needsReview}</p>
                <p className="text-xs text-muted-foreground">Requer Revisão</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por arquivo ou número da nota..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={confidenceFilter} onValueChange={setConfidenceFilter}>
          <SelectTrigger className="w-full sm:w-56">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filtrar por confiança" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os níveis</SelectItem>
            <SelectItem value="high">Alta Confiança (≥90%)</SelectItem>
            <SelectItem value="medium">Média Confiança (70-89%)</SelectItem>
            <SelectItem value="low">Baixa Confiança (&lt;70%)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Files Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* File List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Arquivos Processados</CardTitle>
            <CardDescription>{filteredFiles.length} arquivos encontrados</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              <div className="divide-y">
                {filteredFiles.map((file) => (
                  <button
                    key={file.id}
                    onClick={() => handleSelectFile(file)}
                    className={`w-full p-4 text-left hover:bg-secondary/50 transition-colors ${
                      selectedFile?.id === file.id ? 'bg-secondary' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate">{file.originalFileName}</p>
                        <p className="text-xs text-muted-foreground">
                          Nota: {file.numeroNota}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(file.processedAt, "dd/MM/yyyy HH:mm", { locale: ptBR })}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <AuditConfidenceBadge
                          confidence={getConfidenceLevel(file.overallConfidence)}
                          score={file.overallConfidence}
                          size="sm"
                        />
                        {file.fields.some((f) => f.needsReview) && (
                          <Badge variant="outline" className="text-xs">
                            Requer revisão
                          </Badge>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground absolute right-2 top-1/2 -translate-y-1/2" />
                  </button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* File Details */}
        <Card className="lg:col-span-2">
          {selectedFile ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileCode className="h-5 w-5" />
                      {selectedFile.xmlFileName}
                    </CardTitle>
                    <CardDescription>
                      Original: {selectedFile.originalFileName} | Processado em{' '}
                      {format(selectedFile.processedAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <AuditConfidenceBadge
                      confidence={getConfidenceLevel(selectedFile.overallConfidence)}
                      score={selectedFile.overallConfidence}
                    />
                    <Button variant="outline" size="sm" onClick={() => handleDownloadXml(selectedFile)}>
                      <Download className="h-4 w-4 mr-2" />
                      XML
                    </Button>
                    <Button variant="default" size="sm" onClick={handleGeneratePDF}>
                      <FileDown className="h-4 w-4 mr-2" />
                      PDF
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                    <TabsTrigger
                      value="fields"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                    >
                      Campos Extraídos
                    </TabsTrigger>
                    <TabsTrigger
                      value="xml"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                    >
                      Visualizar XML
                    </TabsTrigger>
                    <TabsTrigger
                      value="summary"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                    >
                      Resumo Fiscal
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="fields" className="m-0">
                    {/* Batch Actions Bar */}
                    <div className="flex items-center justify-between px-4 py-2 bg-secondary/30 border-b">
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                          {selectedFields.size > 0 
                            ? `${selectedFields.size} campo(s) selecionado(s)` 
                            : 'Selecione campos para ações em lote'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleBatchApprove}
                          disabled={selectedFields.size === 0}
                          className="gap-1"
                        >
                          <CheckCheck className="h-4 w-4 text-success" />
                          Aprovar Selecionados
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleBatchReject}
                          disabled={selectedFields.size === 0}
                          className="gap-1"
                        >
                          <XCircle className="h-4 w-4 text-error" />
                          Rejeitar Selecionados
                        </Button>
                      </div>
                    </div>
                    
                    <ScrollArea className="h-[350px]">
                      <table className="w-full">
                        <thead className="bg-secondary/50 sticky top-0">
                          <tr>
                            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-2 w-10">
                              <Checkbox
                                checked={allSelected}
                                ref={(el) => {
                                  if (el) {
                                    (el as any).indeterminate = someSelected;
                                  }
                                }}
                                onCheckedChange={(checked) => handleSelectAll(!!checked)}
                              />
                            </th>
                            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-2">Campo</th>
                            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-2">Original</th>
                            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-2">Extraído</th>
                            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-2">Confiança</th>
                            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-2">Fonte</th>
                            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-2">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {selectedFile.fields.map((field) => (
                            <AuditFieldRow
                              key={field.field}
                              field={field}
                              isSelected={selectedFields.has(field.field)}
                              isApproved={approvedFields.has(field.field)}
                              isRejected={rejectedFields.has(field.field)}
                              onSelect={handleSelectField}
                              onApprove={handleApproveField}
                              onReject={handleRejectField}
                              onEdit={handleEditField}
                            />
                          ))}
                        </tbody>
                      </table>
                    </ScrollArea>
                    
                    {/* Status Summary */}
                    <div className="flex items-center justify-between px-4 py-2 border-t bg-secondary/20 text-sm">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4 text-success" />
                          <span>{approvedFields.size} aprovados</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <XCircle className="h-4 w-4 text-error" />
                          <span>{rejectedFields.size} rejeitados</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <AlertTriangle className="h-4 w-4 text-warning" />
                          <span>{selectedFile.fields.length - approvedFields.size - rejectedFields.size} pendentes</span>
                        </span>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="xml" className="m-0">
                    <ScrollArea className="h-[400px]">
                      <pre className="p-4 text-xs bg-secondary/30 font-mono overflow-x-auto">
                        <code>{selectedFile.xmlPreview}</code>
                      </pre>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="summary" className="m-0 p-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Dados da Nota
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Número:</span>
                            <span className="font-medium">{selectedFile.numeroNota}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Data Emissão:</span>
                            <span className="font-medium">{selectedFile.dataEmissao}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">CNPJ Prestador:</span>
                            <span className="font-medium font-mono">{selectedFile.cnpjPrestador}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Prestador:</span>
                            <span className="font-medium">{selectedFile.razaoSocialPrestador}</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4" />
                          Valores
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Valor Serviços:</span>
                            <span className="font-medium">
                              {selectedFile.valorServicos?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Alíquota ISS:</span>
                            <span className="font-medium">{selectedFile.aliquotaIss}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Valor ISS:</span>
                            <span className="font-medium">
                              {selectedFile.valorIss?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tax Credits Preview */}
                    <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
                      <h4 className="font-semibold text-sm flex items-center gap-2 mb-3">
                        <ShieldCheck className="h-4 w-4 text-primary" />
                        Projeção de Créditos (Reforma Tributária)
                      </h4>
                      <p className="text-xs text-muted-foreground mb-3">
                        Estimativa de créditos no novo modelo IBS/CBS baseado nos valores desta nota.
                      </p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Crédito IBS estimado:</span>
                          <span className="font-medium text-primary">
                            {((selectedFile.valorServicos || 0) * 0.17).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Crédito CBS estimado:</span>
                          <span className="font-medium text-primary">
                            {((selectedFile.valorServicos || 0) * 0.088).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex flex-col items-center justify-center h-[500px] text-center">
              <FileCode className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <h3 className="font-semibold text-lg mb-2">Selecione um arquivo</h3>
              <p className="text-muted-foreground text-sm max-w-sm">
                Escolha um arquivo processado na lista ao lado para visualizar os dados extraídos e realizar a auditoria.
              </p>
            </CardContent>
          )}
        </Card>
      </div>

      {/* AI Copilot */}
      <AICopilot
        context={
          selectedFile
            ? {
                fileId: selectedFile.id,
                auditData: {
                  numeroNota: selectedFile.numeroNota,
                  dataEmissao: selectedFile.dataEmissao,
                  cnpjPrestador: selectedFile.cnpjPrestador,
                  razaoSocialPrestador: selectedFile.razaoSocialPrestador,
                  valorServicos: selectedFile.valorServicos,
                  valorIss: selectedFile.valorIss,
                  aliquotaIss: selectedFile.aliquotaIss,
                },
              }
            : undefined
        }
      />
    </div>
  );
}
