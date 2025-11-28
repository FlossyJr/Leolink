import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import './Notifications.css';

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention';
  user: {
    name: string;
    avatar: string;
  };
  message: string;
  timestamp: string;
  read: boolean;
}

function Notifications() {
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento de notificações
    const loadNotifications = async () => {
      setLoading(true);
      // Dados mockados - substituir por chamada real da API quando implementada
      setTimeout(() => {
        setNotifications([
          {
            id: '1',
            type: 'like',
            user: { name: 'João Silva', avatar: 'J' },
            message: 'curtiu seu post',
            timestamp: '5 min',
            read: false,
          },
          {
            id: '2',
            type: 'comment',
            user: { name: 'Maria Santos', avatar: 'M' },
            message: 'comentou no seu post',
            timestamp: '10 min',
            read: false,
          },
          {
            id: '3',
            type: 'follow',
            user: { name: 'Pedro Costa', avatar: 'P' },
            message: 'começou a seguir você',
            timestamp: '1 hora',
            read: true,
          },
        ]);
        setLoading(false);
      }, 500);
    };

    loadNotifications();
  }, []);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'like':
        return '❤️';
      case 'comment':
        return '💬';
      case 'follow':
        return '👤';
      case 'mention':
        return '@';
      default:
        return '🔔';
    }
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const filteredNotifications = activeTab === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Layout>
      <div className="notifications-page">
        <header className="notifications-header">
          <div className="header-title">
            <h1>🔔 Notificações</h1>
            {unreadCount > 0 && (
              <span className="unread-count">{unreadCount} novas</span>
            )}
          </div>
          {unreadCount > 0 && (
            <button className="btn-mark-read" onClick={markAllAsRead}>
              ✓ Marcar todas como lidas
            </button>
          )}
        </header>

        <div className="notifications-tabs">
          <button
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            Todas
          </button>
          <button
            className={`tab-btn ${activeTab === 'unread' ? 'active' : ''}`}
            onClick={() => setActiveTab('unread')}
          >
            Não lidas {unreadCount > 0 && `(${unreadCount})`}
          </button>
        </div>

        <div className="notifications-list">
          {filteredNotifications.length === 0 ? (
            <div className="empty-notifications">
              <span className="empty-icon">🔔</span>
              <h3>Nenhuma notificação</h3>
              <p>
                {activeTab === 'unread'
                  ? 'Você está em dia com suas notificações!'
                  : 'Você ainda não tem notificações'}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification-item ${!notification.read ? 'unread' : ''}`}
              >
                <div className="notification-icon">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="notification-avatar">
                  {notification.user.avatar}
                </div>
                <div className="notification-content">
                  <p>
                    <strong>{notification.user.name}</strong> {notification.message}
                  </p>
                  <span className="notification-time">{notification.timestamp}</span>
                </div>
                {!notification.read && <div className="unread-dot"></div>}
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Notifications;
