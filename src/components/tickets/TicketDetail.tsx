import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowLeft, Send, User, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Ticket } from '@/types';
import { useTickets } from '@/contexts/TicketContext';
import { TicketStatusBadge, TicketPriorityBadge, TicketCategoryBadge } from './TicketStatusBadge';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface TicketDetailProps {
  ticket: Ticket;
  onBack: () => void;
}

export function TicketDetail({ ticket, onBack }: TicketDetailProps) {
  const { addMessage } = useTickets();
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    setIsSending(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    addMessage(ticket.id, newMessage);
    setNewMessage('');
    setIsSending(false);
    toast.success('Mensagem enviada');
  };

  const isResolved = ticket.status === 'resolved' || ticket.status === 'closed';

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold">{ticket.id}</h2>
            <TicketStatusBadge status={ticket.status} />
            <TicketPriorityBadge priority={ticket.priority} />
            <TicketCategoryBadge category={ticket.category} />
          </div>
          <p className="text-muted-foreground mt-1">{ticket.subject}</p>
        </div>
      </div>

      {/* Info Card */}
      <Card className="mb-4">
        <CardHeader className="py-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Informações do Ticket</CardTitle>
        </CardHeader>
        <CardContent className="py-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Criado em</span>
              <p className="font-medium">{format(ticket.createdAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Última atualização</span>
              <p className="font-medium">{format(ticket.updatedAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
            </div>
            {ticket.resolvedAt && (
              <div>
                <span className="text-muted-foreground">Resolvido em</span>
                <p className="font-medium">{format(ticket.resolvedAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
              </div>
            )}
            <div>
              <span className="text-muted-foreground">Mensagens</span>
              <p className="font-medium">{ticket.messages.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Messages */}
      <Card className="flex-1 flex flex-col min-h-0">
        <CardHeader className="py-3 border-b">
          <CardTitle className="text-sm font-medium">Conversação</CardTitle>
        </CardHeader>
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {ticket.messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex gap-3',
                  message.isSupport ? 'flex-row' : 'flex-row-reverse'
                )}
              >
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className={message.isSupport ? 'bg-primary text-primary-foreground' : 'bg-muted'}>
                    {message.isSupport ? <Headphones className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={cn(
                    'max-w-[70%] rounded-lg px-4 py-3',
                    message.isSupport
                      ? 'bg-muted text-foreground'
                      : 'bg-primary text-primary-foreground'
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className={cn(
                    'text-xs mt-2',
                    message.isSupport ? 'text-muted-foreground' : 'text-primary-foreground/70'
                  )}>
                    {format(message.createdAt, "dd/MM 'às' HH:mm", { locale: ptBR })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        {/* Reply Input */}
        {!isResolved && (
          <>
            <Separator />
            <div className="p-4">
              <div className="flex gap-3">
                <Textarea
                  placeholder="Digite sua mensagem..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="min-h-[80px] resize-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.ctrlKey) {
                      handleSendMessage();
                    }
                  }}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || isSending}
                  className="self-end"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Pressione Ctrl+Enter para enviar
              </p>
            </div>
          </>
        )}
        
        {isResolved && (
          <div className="p-4 bg-muted/50 text-center">
            <p className="text-sm text-muted-foreground">
              Este ticket foi {ticket.status === 'resolved' ? 'resolvido' : 'fechado'}. 
              Para novas questões, abra um novo ticket.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
