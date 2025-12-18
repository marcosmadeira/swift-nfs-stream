import React, { createContext, useContext, useState, useCallback } from 'react';
import { Notification } from '@/types';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const initialNotifications: Notification[] = [
  {
    id: '1',
    type: 'success',
    title: 'Processamento concluído',
    message: '150 arquivos de Alpha Tech foram convertidos com sucesso.',
    read: false,
    createdAt: new Date(Date.now() - 5 * 60 * 1000),
    companyId: '1',
  },
  {
    id: '2',
    type: 'warning',
    title: 'Conversão parcial',
    message: '12 arquivos de Beta Commerce apresentaram avisos durante a conversão.',
    read: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
    companyId: '2',
  },
  {
    id: '3',
    type: 'info',
    title: 'Novo lote em processamento',
    message: 'Iniciado processamento de 89 arquivos para Gamma Services.',
    read: true,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    companyId: '3',
  },
];

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = useCallback((data: Omit<Notification, 'id' | 'read' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...data,
      id: Date.now().toString(),
      read: false,
      createdAt: new Date(),
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const clearNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      clearNotification,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
