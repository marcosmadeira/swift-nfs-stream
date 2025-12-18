import { useState, useCallback } from 'react';
import { Upload as UploadIcon, FileText, X, CheckCircle2, AlertCircle, Loader2, FolderUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useCompany } from '@/contexts/CompanyContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { ProcessingFile, FileStatus } from '@/types';

export default function Upload() {
  const { currentCompany } = useCompany();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<ProcessingFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return { valid: false, error: 'Apenas arquivos PDF são aceitos' };
    }
    if (file.size > 10 * 1024 * 1024) {
      return { valid: false, error: 'Arquivo excede 10MB' };
    }
    return { valid: true };
  };

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles);
    const processedFiles: ProcessingFile[] = fileArray.map((file) => {
      const validation = validateFile(file);
      return {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        size: file.size,
        companyId: currentCompany?.id || '',
        status: validation.valid ? 'pending' : 'error',
        progress: 0,
        errorMessage: validation.error,
        createdAt: new Date(),
      };
    });

    setFiles((prev) => [...prev, ...processedFiles]);
    
    const validCount = processedFiles.filter(f => f.status !== 'error').length;
    const invalidCount = processedFiles.length - validCount;
    
    if (invalidCount > 0) {
      toast({
        title: `${invalidCount} arquivo(s) inválido(s)`,
        description: 'Verifique os arquivos marcados com erro.',
        variant: 'destructive',
      });
    }
  }, [currentCompany]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  }, [addFiles]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
    }
  }, [addFiles]);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setFiles([]);
    setUploadProgress(0);
  }, []);

  const startUpload = useCallback(async () => {
    if (!currentCompany) {
      toast({
        title: 'Selecione uma empresa',
        description: 'É necessário selecionar uma empresa antes de enviar arquivos.',
        variant: 'destructive',
      });
      return;
    }

    const validFiles = files.filter(f => f.status === 'pending');
    if (validFiles.length === 0) {
      toast({
        title: 'Nenhum arquivo válido',
        description: 'Adicione arquivos PDF válidos para continuar.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);

    // Simulate upload and processing
    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      
      // Update status to uploading
      setFiles((prev) =>
        prev.map((f) =>
          f.id === file.id ? { ...f, status: 'uploading' as FileStatus, progress: 0 } : f
        )
      );

      // Simulate upload progress
      for (let p = 0; p <= 100; p += 20) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        setFiles((prev) =>
          prev.map((f) =>
            f.id === file.id ? { ...f, progress: p } : f
          )
        );
      }

      // Update to queued
      setFiles((prev) =>
        prev.map((f) =>
          f.id === file.id ? { ...f, status: 'queued' as FileStatus, progress: 100 } : f
        )
      );

      setUploadProgress(Math.round(((i + 1) / validFiles.length) * 100));
    }

    setIsUploading(false);
    
    addNotification({
      type: 'info',
      title: 'Upload concluído',
      message: `${validFiles.length} arquivos foram enviados e estão na fila de processamento.`,
      companyId: currentCompany.id,
    });

    toast({
      title: 'Upload concluído',
      description: `${validFiles.length} arquivos enviados para processamento.`,
    });

    // Redirect to processing page
    setTimeout(() => {
      navigate('/processamento');
    }, 1500);
  }, [files, currentCompany, addNotification, navigate]);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const validFilesCount = files.filter(f => f.status !== 'error').length;
  const errorFilesCount = files.filter(f => f.status === 'error').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Upload de arquivos</h1>
        <p className="text-muted-foreground">
          Envie NFS-e em PDF para converter em XML
        </p>
      </div>

      {/* Company Warning */}
      {!currentCompany && (
        <Card className="border-warning bg-warning-bg">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-warning flex-shrink-0" />
            <p className="text-sm text-warning-foreground">
              Selecione uma empresa no topo da página antes de enviar arquivos.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Upload Zone */}
      <Card>
        <CardContent className="p-6">
          <div
            className={cn(
              'upload-zone',
              isDragging && 'dragover border-primary bg-primary/5'
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".pdf"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
              disabled={isUploading}
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="flex flex-col items-center gap-4">
                <div className={cn(
                  'p-4 rounded-full transition-colors',
                  isDragging ? 'bg-primary/20' : 'bg-secondary'
                )}>
                  <FolderUp className={cn(
                    'h-8 w-8 transition-colors',
                    isDragging ? 'text-primary' : 'text-muted-foreground'
                  )} />
                </div>
                <div className="text-center">
                  <p className="text-lg font-medium">
                    Arraste arquivos PDF ou clique para selecionar
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Aceita múltiplos arquivos • Máximo 10MB por arquivo
                  </p>
                </div>
              </div>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Files List */}
      {files.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Arquivos selecionados</CardTitle>
                <CardDescription>
                  {validFilesCount} arquivo(s) válido(s)
                  {errorFilesCount > 0 && `, ${errorFilesCount} com erro`}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={clearAll} disabled={isUploading}>
                  Limpar tudo
                </Button>
                <Button
                  size="sm"
                  onClick={startUpload}
                  disabled={isUploading || validFilesCount === 0}
                  className="gap-2"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <UploadIcon className="h-4 w-4" />
                      Enviar {validFilesCount} arquivo(s)
                    </>
                  )}
                </Button>
              </div>
            </div>
            {isUploading && (
              <div className="mt-4">
                <ProgressBar value={uploadProgress} showLabel animated />
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {files.map((file) => (
                <div
                  key={file.id}
                  className={cn(
                    'flex items-center justify-between p-3 rounded-lg transition-colors',
                    file.status === 'error' ? 'bg-error-bg' : 'bg-secondary/50'
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <FileText className={cn(
                      'h-5 w-5 flex-shrink-0',
                      file.status === 'error' ? 'text-error' : 'text-muted-foreground'
                    )} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)}
                        </span>
                        {file.errorMessage && (
                          <span className="text-xs text-error">{file.errorMessage}</span>
                        )}
                      </div>
                      {(file.status === 'uploading') && (
                        <div className="mt-2">
                          <ProgressBar value={file.progress} size="sm" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <StatusBadge status={file.status} size="sm" />
                    {!isUploading && (
                      <button
                        onClick={() => removeFile(file.id)}
                        className="p-1 hover:bg-secondary rounded transition-colors"
                      >
                        <X className="h-4 w-4 text-muted-foreground" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Dicas para um processamento eficiente</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
              Use arquivos PDF originais, não digitalizados, para melhor qualidade
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
              Agrupe arquivos do mesmo período ou empresa para facilitar a organização
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
              O processamento é assíncrono, você pode continuar usando o sistema
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
