export type AuditConfidence = 'high' | 'medium' | 'low';

export interface AuditField {
  field: string;
  label: string;
  originalValue: string;
  extractedValue: string;
  confidence: AuditConfidence;
  confidenceScore: number; // 0-100
  source: 'ocr' | 'pattern' | 'ai_inference' | 'database';
  needsReview: boolean;
  suggestion?: string;
}

export interface AuditedFile {
  id: string;
  originalFileName: string;
  xmlFileName: string;
  processedAt: Date;
  overallConfidence: number;
  fields: AuditField[];
  xmlPreview: string;
  
  // NFS-e specific fields
  numeroNota?: string;
  dataEmissao?: string;
  cnpjPrestador?: string;
  razaoSocialPrestador?: string;
  cnpjTomador?: string;
  razaoSocialTomador?: string;
  valorServicos?: number;
  valorDeducoes?: number;
  valorPis?: number;
  valorCofins?: number;
  valorInss?: number;
  valorIr?: number;
  valorCsll?: number;
  valorIss?: number;
  aliquotaIss?: number;
  baseCalculo?: number;
  codigoServico?: string;
  discriminacao?: string;
  municipioPrestacao?: string;
}

export interface CopilotMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  context?: {
    fileId?: string;
    fieldName?: string;
    auditData?: Partial<AuditedFile>;
  };
}
