import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import './Messages.css';

interface Message {
  id: string;
  userId: string;
  userName: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
}

interface ChatMessage {
  id: string;
  content: string;
  sent: boolean;
  timestamp: string;
}

function Messages() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento de conversas
    const loadConversations = async () => {
      setLoading(true);
      setTimeout(() => {
        setMessages([
          {
            id: '1',
            userId: 'user1',
            userName: 'João Silva',
            avatar: 'J',
            lastMessage: 'Oi! Como você está?',
            timestamp: '10:30',
            unread: true,
          },
          {
            id: '2',
            userId: 'user2',
            userName: 'Maria Santos',
            avatar: 'M',
            lastMessage: 'Obrigada pela ajuda!',
            timestamp: 'Ontem',
            unread: false,
          },
        ]);
        setLoading(false);
      }, 500);
    };

    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      // Carregar mensagens do chat selecionado
      setChatMessages([
        { id: '1', content: 'Oi! Como você está?', sent: false, timestamp: '10:30' },
        { id: '2', content: 'Estou bem, obrigado! E você?', sent: true, timestamp: '10:31' },
        { id: '3', content: 'Também estou bem! Viu meu último post?', sent: false, timestamp: '10:32' },
      ]);
    }
  }, [selectedChat]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      content: newMessage,
      sent: true,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages([...chatMessages, newMsg]);
    setNewMessage('');
  };

  return (
    <Layout>
      <div className="messages-page">
        <div className="messages-container">
          <aside className="conversations-list">
            <header className="conversations-header">
              <h2>💬 Mensagens</h2>
              <button className="btn-new-message">+ Nova</button>
            </header>

            <div className="search-conversations">
              <input
                type="text"
                placeholder="Buscar conversas..."
                className="search-input"
              />
            </div>

            <div className="conversations">
              {messages.length === 0 ? (
                <div className="empty-conversations">
                  <span className="empty-icon">💬</span>
                  <p>Nenhuma conversa ainda</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`conversation-item ${selectedChat === msg.id ? 'active' : ''} ${msg.unread ? 'unread' : ''}`}
                    onClick={() => setSelectedChat(msg.id)}
                  >
                    <div className="conversation-avatar">{msg.avatar}</div>
                    <div className="conversation-info">
                      <div className="conversation-header">
                        <span className="conversation-name">{msg.userName}</span>
                        <span className="conversation-time">{msg.timestamp}</span>
                      </div>
                      <p className="conversation-preview">{msg.lastMessage}</p>
                    </div>
                    {msg.unread && <div className="unread-badge"></div>}
                  </div>
                ))
              )}
            </div>
          </aside>

          <main className="chat-area">
            {selectedChat ? (
              <>
                <header className="chat-header">
                  <div className="chat-user-info">
                    <div className="chat-avatar">
                      {messages.find(m => m.id === selectedChat)?.avatar}
                    </div>
                    <div>
                      <h3>{messages.find(m => m.id === selectedChat)?.userName}</h3>
                      <span className="chat-status">Online</span>
                    </div>
                  </div>
                </header>

                <div className="chat-messages">
                  <div className="chat-messages-content">
                    {chatMessages.map((msg) => (
                      <div key={msg.id} className={`message ${msg.sent ? 'sent' : 'received'}`}>
                        {!msg.sent && <div className="message-avatar">
                          {messages.find(m => m.id === selectedChat)?.avatar}
                        </div>}
                        <div className="message-content">
                          <p>{msg.content}</p>
                          <span className="message-time">{msg.timestamp}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <footer className="chat-input-area">
                  <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '12px', width: '100%' }}>
                    <input
                      type="text"
                      placeholder="Escrever mensagem..."
                      className="chat-input"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button type="submit" className="btn-send">Enviar</button>
                  </form>
                </footer>
              </>
            ) : (
              <div className="no-chat-selected">
                <span className="no-chat-icon">💬</span>
                <h3>Selecione uma conversa</h3>
                <p>Escolha uma conversa para ver as mensagens</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </Layout>
  );
}

export default Messages;
