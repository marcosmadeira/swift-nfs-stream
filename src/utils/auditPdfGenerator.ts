import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AuditedFile, AuditField } from '@/types/audit';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const sourceLabels: Record<string, string> = {
  ocr: 'OCR',
  pattern: 'Padrão',
  ai_inference: 'IA',
  database: 'Base de Dados',
};

const confidenceLabels: Record<string, string> = {
  high: 'Alta',
  medium: 'Média',
  low: 'Baixa',
};

export function generateAuditPDF(file: AuditedFile, approvedFields: Set<string>, rejectedFields: Set<string>): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header
  doc.setFillColor(37, 99, 235); // Primary blue
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Alivee', 14, 20);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Relatório de Auditoria NFS-e', 14, 30);
  
  // Date
  doc.setFontSize(10);
  doc.text(`Gerado em: ${format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`, pageWidth - 14, 30, { align: 'right' });
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  
  // File Info Section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Informações do Arquivo', 14, 55);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const infoY = 65;
  const lineHeight = 7;
  
  doc.text(`Arquivo Original: ${file.originalFileName}`, 14, infoY);
  doc.text(`Arquivo XML: ${file.xmlFileName}`, 14, infoY + lineHeight);
  doc.text(`Processado em: ${format(file.processedAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`, 14, infoY + lineHeight * 2);
  doc.text(`Confiança Geral: ${file.overallConfidence}%`, 14, infoY + lineHeight * 3);
  
  // Nota Details
  doc.text(`Número da Nota: ${file.numeroNota || '-'}`, pageWidth / 2, infoY);
  doc.text(`Data Emissão: ${file.dataEmissao || '-'}`, pageWidth / 2, infoY + lineHeight);
  doc.text(`CNPJ Prestador: ${formatCNPJ(file.cnpjPrestador || '')}`, pageWidth / 2, infoY + lineHeight * 2);
  doc.text(`Prestador: ${file.razaoSocialPrestador || '-'}`, pageWidth / 2, infoY + lineHeight * 3);
  
  // Statistics
  const statsY = infoY + lineHeight * 5;
  doc.setFillColor(240, 240, 240);
  doc.rect(14, statsY - 5, pageWidth - 28, 25, 'F');
  
  const approved = approvedFields.size;
  const rejected = rejectedFields.size;
  const pending = file.fields.length - approved - rejected;
  const needsReview = file.fields.filter(f => f.needsReview).length;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Resumo da Auditoria', 14, statsY + 3);
  doc.setFont('helvetica', 'normal');
  doc.text(`Total de Campos: ${file.fields.length}`, 14, statsY + 12);
  doc.text(`Aprovados: ${approved}`, 70, statsY + 12);
  doc.text(`Rejeitados: ${rejected}`, 110, statsY + 12);
  doc.text(`Pendentes: ${pending}`, 155, statsY + 12);
  
  // Fields Table
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Campos Extraídos', 14, statsY + 35);
  
  const tableData = file.fields.map((field) => {
    let status = 'Pendente';
    if (approvedFields.has(field.field)) status = '✓ Aprovado';
    if (rejectedFields.has(field.field)) status = '✗ Rejeitado';
    
    return [
      field.label,
      truncateText(field.originalValue || '-', 25),
      truncateText(field.extractedValue, 25),
      `${confidenceLabels[field.confidence]} (${field.confidenceScore}%)`,
      sourceLabels[field.source],
      status,
    ];
  });
  
  autoTable(doc, {
    startY: statsY + 40,
    head: [['Campo', 'Original', 'Extraído', 'Confiança', 'Fonte', 'Status']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [37, 99, 235],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 8,
    },
    columnStyles: {
      0: { cellWidth: 35 },
      1: { cellWidth: 30 },
      2: { cellWidth: 35 },
      3: { cellWidth: 30 },
      4: { cellWidth: 25 },
      5: { cellWidth: 25 },
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    didParseCell: function(data) {
      if (data.section === 'body' && data.column.index === 5) {
        const status = data.cell.raw as string;
        if (status.includes('Aprovado')) {
          data.cell.styles.textColor = [22, 163, 74]; // Green
        } else if (status.includes('Rejeitado')) {
          data.cell.styles.textColor = [220, 38, 38]; // Red
        } else {
          data.cell.styles.textColor = [156, 163, 175]; // Gray
        }
      }
    },
  });
  
  // Fiscal Summary (new page if needed)
  const finalY = (doc as any).lastAutoTable.finalY || 200;
  
  if (finalY > 220) {
    doc.addPage();
    addFiscalSummary(doc, file, 20);
  } else {
    addFiscalSummary(doc, file, finalY + 15);
  }
  
  // Footer on all pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Página ${i} de ${pageCount} | Alivee - Conversor NFS-e | Relatório de Auditoria`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }
  
  // Save
  const fileName = `auditoria_${file.numeroNota || file.id}_${format(new Date(), 'yyyyMMdd_HHmm')}.pdf`;
  doc.save(fileName);
}

function addFiscalSummary(doc: jsPDF, file: AuditedFile, startY: number): void {
  const pageWidth = doc.internal.pageSize.getWidth();
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Resumo Fiscal', 14, startY);
  
  // Values box
  doc.setFillColor(248, 250, 252);
  doc.rect(14, startY + 5, (pageWidth - 28) / 2 - 5, 50, 'F');
  doc.rect(pageWidth / 2 + 5, startY + 5, (pageWidth - 28) / 2 - 5, 50, 'F');
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Valores da Nota', 18, startY + 15);
  
  doc.setFont('helvetica', 'normal');
  doc.text(`Valor Serviços: ${formatCurrency(file.valorServicos || 0)}`, 18, startY + 25);
  doc.text(`Base de Cálculo: ${formatCurrency(file.valorServicos || 0)}`, 18, startY + 33);
  doc.text(`Alíquota ISS: ${file.aliquotaIss || 0}%`, 18, startY + 41);
  doc.text(`Valor ISS: ${formatCurrency(file.valorIss || 0)}`, 18, startY + 49);
  
  // Tax Credits (Reforma Tributária)
  doc.setFont('helvetica', 'bold');
  doc.text('Projeção Créditos (Reforma Tributária)', pageWidth / 2 + 10, startY + 15);
  
  doc.setFont('helvetica', 'normal');
  const ibsCredit = (file.valorServicos || 0) * 0.17;
  const cbsCredit = (file.valorServicos || 0) * 0.088;
  
  doc.text(`Crédito IBS estimado: ${formatCurrency(ibsCredit)}`, pageWidth / 2 + 10, startY + 25);
  doc.text(`Crédito CBS estimado: ${formatCurrency(cbsCredit)}`, pageWidth / 2 + 10, startY + 33);
  doc.text(`Total Créditos: ${formatCurrency(ibsCredit + cbsCredit)}`, pageWidth / 2 + 10, startY + 41);
  
  // Disclaimer
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text(
    '* Valores de IBS/CBS são estimativas baseadas nas alíquotas previstas na reforma tributária.',
    14,
    startY + 65
  );
}

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatCNPJ(cnpj: string): string {
  if (!cnpj || cnpj.length !== 14) return cnpj;
  return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

export function generateBatchAuditPDF(files: AuditedFile[]): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Alivee', 14, 20);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Relatório de Auditoria em Lote', 14, 30);
  doc.text(`Gerado em: ${format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`, pageWidth - 14, 30, { align: 'right' });
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  
  // Summary
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Resumo Geral', 14, 55);
  
  const highConf = files.filter(f => f.overallConfidence >= 90).length;
  const medConf = files.filter(f => f.overallConfidence >= 70 && f.overallConfidence < 90).length;
  const lowConf = files.filter(f => f.overallConfidence < 70).length;
  const totalValue = files.reduce((sum, f) => sum + (f.valorServicos || 0), 0);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Total de Arquivos: ${files.length}`, 14, 65);
  doc.text(`Alta Confiança: ${highConf}`, 14, 72);
  doc.text(`Média Confiança: ${medConf}`, 70, 72);
  doc.text(`Baixa Confiança: ${lowConf}`, 130, 72);
  doc.text(`Valor Total: ${formatCurrency(totalValue)}`, 14, 79);
  
  // Files Table
  const tableData = files.map(file => [
    file.numeroNota || '-',
    file.dataEmissao || '-',
    file.razaoSocialPrestador || '-',
    formatCurrency(file.valorServicos || 0),
    `${file.overallConfidence}%`,
    file.fields.filter(f => f.needsReview).length > 0 ? 'Sim' : 'Não',
  ]);
  
  autoTable(doc, {
    startY: 90,
    head: [['Nota', 'Data', 'Prestador', 'Valor', 'Confiança', 'Revisão']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [37, 99, 235],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    columnStyles: {
      0: { cellWidth: 25 },
      2: { cellWidth: 50 },
      3: { cellWidth: 30 },
      4: { cellWidth: 25 },
      5: { cellWidth: 20 },
    },
  });
  
  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Página ${i} de ${pageCount} | Alivee - Conversor NFS-e | Relatório de Auditoria em Lote`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }
  
  doc.save(`auditoria_lote_${format(new Date(), 'yyyyMMdd_HHmm')}.pdf`);
}
