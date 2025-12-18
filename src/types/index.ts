export interface Company {
  id: string;
  cnpj: string;
  razaoSocial: string;
  nomeFantasia?: string;
  createdAt: Date;
  totalFiles: number;
  totalProcessed: number;
}

export type FileStatus = 
  | 'pending'
  | 'uploading'
  | 'queued'
  | 'processing'
  | 'success'
  | 'warning'
  | 'error';

export interface ProcessingFile {
  id: string;
  name: string;
  size: number;
  companyId: string;
  status: FileStatus;
  progress: number;
  errorMessage?: string;
  warningMessage?: string;
  createdAt: Date;
  processedAt?: Date;
  xmlUrl?: string;
}

export interface ProcessingBatch {
  id: string;
  companyId: string;
  totalFiles: number;
  processedFiles: number;
  successFiles: number;
  warningFiles: number;
  errorFiles: number;
  status: 'processing' | 'completed' | 'completed_with_errors';
  startedAt: Date;
  completedAt?: Date;
  estimatedTimeRemaining?: number;
}

export interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  companyId?: string;
  batchId?: string;
}

export interface DashboardMetrics {
  totalFiles: number;
  totalProcessed: number;
  totalSuccess: number;
  totalErrors: number;
  totalPending: number;
  averageProcessingTime: number;
}

// Support Tickets
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketStatus = 'open' | 'in_progress' | 'waiting_response' | 'resolved' | 'closed';
export type TicketCategory = 'bug' | 'feature' | 'question' | 'billing' | 'other';

export interface TicketMessage {
  id: string;
  ticketId: string;
  content: string;
  isSupport: boolean;
  createdAt: Date;
  attachments?: string[];
}

export interface Ticket {
  id: string;
  subject: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  companyId?: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  messages: TicketMessage[];
}
