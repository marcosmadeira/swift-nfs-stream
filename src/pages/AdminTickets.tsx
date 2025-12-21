import React, { useState } from 'react';
import { useTickets } from '@/contexts/TicketContext';
import { Ticket, TicketStatus, TicketPriority, TicketCategory } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Search, 
  Filter, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  User,
  Building2,
  Calendar,
  Send,
  ArrowUpDown,
  BarChart3,
  Timer,
  TrendingUp,
  TrendingDown,
  Users,
  Inbox,
  RefreshCw,
  Eye,
  ChevronRight
} from 'lucide-react';
import { TicketStatusBadge, TicketPriorityBadge, TicketCategoryBadge } from '@/components/tickets/TicketStatusBadge';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MetricCard } from '@/components/ui/MetricCard';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const AdminTickets = () => {
  const { tickets, updateTicketStatus, addMessage } = useTickets();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'status'>('date');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Métricas
  const totalTickets = tickets.length;
  const openTickets = tickets.filter(t => t.status === 'open').length;
  const inProgressTickets = tickets.filter(t => t.status === 'in_progress').length;
  const resolvedTickets = tickets.filter(t => t.status === 'resolved').length;
  const closedTickets = tickets.filter(t => t.status === 'closed').length;
  const highPriorityTickets = tickets.filter(t => t.priority === 'high' || t.priority === 'urgent').length;
  
  // Tempo médio de resposta (simulado)
  const avgResponseTime = '2h 15min';
  const avgResolutionTime = '1d 4h';
  
  // Taxa de resolução
  const resolutionRate = totalTickets > 0 
    ? Math.round(((resolvedTickets + closedTickets) / totalTickets) * 100) 
    : 0;

  // Filtrar tickets
  const getFilteredTickets = () => {
    let filtered = [...tickets];

    // Filtro por aba
    if (activeTab !== 'all') {
      filtered = filtered.filter(t => t.status === activeTab);
    }

    // Filtro por busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(t => 
        t.id.toLowerCase().includes(term) ||
        t.subject.toLowerCase().includes(term) ||
        t.description.toLowerCase().includes(term)
      );
    }

    // Filtro por status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(t => t.status === statusFilter);
    }

    // Filtro por prioridade
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(t => t.priority === priorityFilter);
    }

    // Filtro por categoria
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(t => t.category === categoryFilter);
    }

    // Ordenação
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
      if (sortBy === 'priority') {
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      if (sortBy === 'status') {
        const statusOrder = { open: 0, in_progress: 1, resolved: 2, closed: 3 };
        return statusOrder[a.status] - statusOrder[b.status];
      }
      return 0;
    });

    return filtered;
  };

  const filteredTickets = getFilteredTickets();

  const handleStatusChange = (ticketId: string, newStatus: TicketStatus) => {
    updateTicketStatus(ticketId, newStatus);
    if (selectedTicket?.id === ticketId) {
      setSelectedTicket({ ...selectedTicket, status: newStatus });
    }
    toast.success('Status atualizado com sucesso');
  };

  const handleSendReply = () => {
    if (!selectedTicket || !replyContent.trim()) return;
    
    addMessage(selectedTicket.id, replyContent.trim(), true);
    setReplyContent('');
    
    // Atualizar o ticket selecionado
    const updatedTicket = tickets.find(t => t.id === selectedTicket.id);
    if (updatedTicket) {
      setSelectedTicket({
        ...updatedTicket,
        messages: [
          ...updatedTicket.messages,
          {
            id: `msg-${Date.now()}`,
            ticketId: selectedTicket.id,
            content: replyContent.trim(),
            isSupport: true,
            createdAt: new Date(),
          }
        ]
      });
    }
    
    // Se estava aberto, mover para em andamento
    if (selectedTicket.status === 'open') {
      handleStatusChange(selectedTicket.id, 'in_progress');
    }
    
    toast.success('Resposta enviada com sucesso');
  };

  const getStatusIcon = (status: TicketStatus) => {
    switch (status) {
      case 'open': return <Inbox className="h-4 w-4" />;
      case 'in_progress': return <RefreshCw className="h-4 w-4" />;
      case 'resolved': return <CheckCircle2 className="h-4 w-4" />;
      case 'closed': return <CheckCircle2 className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Central de Suporte</h1>
          <p className="text-muted-foreground">Gerencie todos os tickets de suporte dos clientes</p>
        </div>
        <Button variant="outline" onClick={() => window.location.reload()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <MetricCard
          title="Total de Tickets"
          value={totalTickets}
          icon={<MessageSquare className="h-5 w-5" />}
        />
        <MetricCard
          title="Aguardando"
          value={openTickets}
          icon={<Inbox className="h-5 w-5" />}
          className={openTickets > 0 ? 'border-warning/50 bg-warning/5' : ''}
        />
        <MetricCard
          title="Em Andamento"
          value={inProgressTickets}
          icon={<RefreshCw className="h-5 w-5" />}
          className="border-info/50 bg-info/5"
        />
        <MetricCard
          title="Resolvidos"
          value={resolvedTickets}
          icon={<CheckCircle2 className="h-5 w-5" />}
          className="border-success/50 bg-success/5"
        />
        <MetricCard
          title="Taxa Resolução"
          value={`${resolutionRate}%`}
          icon={<TrendingUp className="h-5 w-5" />}
          trend={{ value: 5, isPositive: true }}
        />
        <MetricCard
          title="Alta Prioridade"
          value={highPriorityTickets}
          icon={<AlertCircle className="h-5 w-5" />}
          className={highPriorityTickets > 0 ? 'border-destructive/50 bg-destructive/5' : ''}
        />
      </div>

      {/* Tempo médio */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-card/50">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Timer className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tempo Médio de Resposta</p>
              <p className="text-2xl font-bold text-foreground">{avgResponseTime}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="p-3 rounded-lg bg-success/10">
              <Clock className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tempo Médio de Resolução</p>
              <p className="text-2xl font-bold text-foreground">{avgResolutionTime}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Lista */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Tickets */}
        <div className="lg:col-span-2 space-y-4">
          {/* Tabs de Status */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all" className="text-xs md:text-sm">
                Todos ({totalTickets})
              </TabsTrigger>
              <TabsTrigger value="open" className="text-xs md:text-sm">
                Abertos ({openTickets})
              </TabsTrigger>
              <TabsTrigger value="in_progress" className="text-xs md:text-sm">
                Andamento ({inProgressTickets})
              </TabsTrigger>
              <TabsTrigger value="resolved" className="text-xs md:text-sm">
                Resolvidos ({resolvedTickets})
              </TabsTrigger>
              <TabsTrigger value="closed" className="text-xs md:text-sm">
                Fechados ({closedTickets})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Barra de Busca e Filtros */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por ID, assunto ou descrição..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Prioridade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="urgent">Urgente</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="medium">Média</SelectItem>
                      <SelectItem value="low">Baixa</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="bug">Bug</SelectItem>
                      <SelectItem value="feature">Sugestão</SelectItem>
                      <SelectItem value="question">Dúvida</SelectItem>
                      <SelectItem value="other">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={(v) => setSortBy(v as 'date' | 'priority' | 'status')}>
                    <SelectTrigger className="w-[130px]">
                      <ArrowUpDown className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Ordenar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Data</SelectItem>
                      <SelectItem value="priority">Prioridade</SelectItem>
                      <SelectItem value="status">Status</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista */}
          <Card>
            <ScrollArea className="h-[500px]">
              <div className="divide-y divide-border">
                {filteredTickets.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum ticket encontrado</p>
                  </div>
                ) : (
                  filteredTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className={cn(
                        "p-4 hover:bg-muted/50 cursor-pointer transition-colors",
                        selectedTicket?.id === ticket.id && "bg-muted/50 border-l-2 border-l-primary"
                      )}
                      onClick={() => setSelectedTicket(ticket)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono text-muted-foreground">{ticket.id}</span>
                            <TicketPriorityBadge priority={ticket.priority} />
                            <TicketCategoryBadge category={ticket.category} />
                          </div>
                          <h4 className="font-medium text-foreground truncate">{ticket.subject}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                            {ticket.description}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDistanceToNow(new Date(ticket.updatedAt), { 
                                addSuffix: true, 
                                locale: ptBR 
                              })}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="h-3 w-3" />
                              {ticket.messages.length} mensagens
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <TicketStatusBadge status={ticket.status} />
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </Card>
        </div>

        {/* Painel de Detalhes */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4 h-[700px] flex flex-col">
            {selectedTicket ? (
              <>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-mono text-muted-foreground">{selectedTicket.id}</p>
                      <CardTitle className="text-lg mt-1">{selectedTicket.subject}</CardTitle>
                    </div>
                    <Select 
                      value={selectedTicket.status} 
                      onValueChange={(v) => handleStatusChange(selectedTicket.id, v as TicketStatus)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Aberto</SelectItem>
                        <SelectItem value="in_progress">Em Andamento</SelectItem>
                        <SelectItem value="resolved">Resolvido</SelectItem>
                        <SelectItem value="closed">Fechado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <TicketPriorityBadge priority={selectedTicket.priority} />
                    <TicketCategoryBadge category={selectedTicket.category} />
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(selectedTicket.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </span>
                  </div>
                </CardHeader>

                <Separator />

                {/* Mensagens */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {selectedTicket.messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          "p-3 rounded-lg text-sm",
                          message.isSupport
                            ? "bg-primary/10 ml-4 border-l-2 border-primary"
                            : "bg-muted mr-4"
                        )}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center text-xs",
                            message.isSupport 
                              ? "bg-primary text-primary-foreground" 
                              : "bg-muted-foreground/20 text-muted-foreground"
                          )}>
                            {message.isSupport ? 'S' : 'C'}
                          </div>
                          <span className="font-medium text-foreground">
                            {message.isSupport ? 'Suporte' : 'Cliente'}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(message.createdAt), "dd/MM 'às' HH:mm", { locale: ptBR })}
                          </span>
                        </div>
                        <p className="text-foreground/90 whitespace-pre-wrap">{message.content}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <Separator />

                {/* Área de Resposta */}
                <div className="p-4">
                  <Textarea
                    placeholder="Digite sua resposta..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="min-h-[80px] resize-none mb-3"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange(selectedTicket.id, 'resolved')}
                        disabled={selectedTicket.status === 'resolved' || selectedTicket.status === 'closed'}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Resolver
                      </Button>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={handleSendReply}
                      disabled={!replyContent.trim()}
                    >
                      <Send className="h-4 w-4 mr-1" />
                      Enviar
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Selecione um ticket para visualizar</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminTickets;
