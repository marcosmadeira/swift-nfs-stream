import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Ticket, TicketMessage, TicketPriority, TicketStatus, TicketCategory } from '@/types';

interface TicketContextType {
  tickets: Ticket[];
  addTicket: (ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'messages' | 'status'>) => Ticket;
  updateTicketStatus: (ticketId: string, status: TicketStatus) => void;
  addMessage: (ticketId: string, content: string, isSupport?: boolean) => void;
  getTicketById: (ticketId: string) => Ticket | undefined;
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

// Mock data
const mockTickets: Ticket[] = [
  {
    id: 'TKT-001',
    subject: 'Erro ao processar NFS-e com múltiplas páginas',
    description: 'Alguns arquivos PDF com mais de 5 páginas estão retornando erro na conversão. O erro aparece como "Formato não reconhecido".',
    category: 'bug',
    priority: 'high',
    status: 'in_progress',
    companyId: '1',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    messages: [
      {
        id: 'msg-1',
        ticketId: 'TKT-001',
        content: 'Alguns arquivos PDF com mais de 5 páginas estão retornando erro na conversão.',
        isSupport: false,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'msg-2',
        ticketId: 'TKT-001',
        content: 'Olá! Identificamos o problema e estamos trabalhando na correção. Poderia enviar um exemplo do arquivo que está com erro?',
        isSupport: true,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    ],
  },
  {
    id: 'TKT-002',
    subject: 'Como exportar relatório de conversões?',
    description: 'Preciso gerar um relatório mensal com todas as conversões realizadas. Existe essa funcionalidade?',
    category: 'question',
    priority: 'low',
    status: 'resolved',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    resolvedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    messages: [
      {
        id: 'msg-3',
        ticketId: 'TKT-002',
        content: 'Preciso gerar um relatório mensal com todas as conversões realizadas.',
        isSupport: false,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'msg-4',
        ticketId: 'TKT-002',
        content: 'Você pode acessar os relatórios na seção Downloads > Relatórios. Lá você encontra opções de exportação em CSV e PDF.',
        isSupport: true,
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      },
    ],
  },
  {
    id: 'TKT-003',
    subject: 'Solicitação de nova funcionalidade: integração com ERP',
    description: 'Gostaria de sugerir uma integração direta com sistemas ERP para envio automático dos XMLs convertidos.',
    category: 'feature',
    priority: 'medium',
    status: 'open',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    messages: [
      {
        id: 'msg-5',
        ticketId: 'TKT-003',
        content: 'Gostaria de sugerir uma integração direta com sistemas ERP para envio automático dos XMLs convertidos.',
        isSupport: false,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    ],
  },
];

export function TicketProvider({ children }: { children: ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);

  const addTicket = (ticketData: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'messages' | 'status'>) => {
    const newTicket: Ticket = {
      ...ticketData,
      id: `TKT-${String(tickets.length + 1).padStart(3, '0')}`,
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: [
        {
          id: `msg-${Date.now()}`,
          ticketId: `TKT-${String(tickets.length + 1).padStart(3, '0')}`,
          content: ticketData.description,
          isSupport: false,
          createdAt: new Date(),
        },
      ],
    };
    setTickets((prev) => [newTicket, ...prev]);
    return newTicket;
  };

  const updateTicketStatus = (ticketId: string, status: TicketStatus) => {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === ticketId
          ? {
              ...ticket,
              status,
              updatedAt: new Date(),
              resolvedAt: status === 'resolved' || status === 'closed' ? new Date() : ticket.resolvedAt,
            }
          : ticket
      )
    );
  };

  const addMessage = (ticketId: string, content: string, isSupport = false) => {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === ticketId
          ? {
              ...ticket,
              updatedAt: new Date(),
              messages: [
                ...ticket.messages,
                {
                  id: `msg-${Date.now()}`,
                  ticketId,
                  content,
                  isSupport,
                  createdAt: new Date(),
                },
              ],
            }
          : ticket
      )
    );
  };

  const getTicketById = (ticketId: string) => {
    return tickets.find((ticket) => ticket.id === ticketId);
  };

  return (
    <TicketContext.Provider
      value={{
        tickets,
        addTicket,
        updateTicketStatus,
        addMessage,
        getTicketById,
      }}
    >
      {children}
    </TicketContext.Provider>
  );
}

export function useTickets() {
  const context = useContext(TicketContext);
  if (context === undefined) {
    throw new Error('useTickets must be used within a TicketProvider');
  }
  return context;
}
