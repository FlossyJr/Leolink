import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Sidebar.css';

interface MenuItem {
  icon: string;
  label: string;
  path: string;
}

const menuItems: MenuItem[] = [
  { icon: '🏠', label: 'Feed', path: '/feed' },
  { icon: '👤', label: 'Perfil', path: '/profile' },
  { icon: '🔍', label: 'Explorar', path: '/explore' },
  { icon: '💬', label: 'Mensagens', path: '/messages' },
  { icon: '🔔', label: 'Notificações', path: '/notifications' },
  { icon: '⚙️', label: 'Configurações', path: '/settings' },
];

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo" onClick={() => navigate('/feed')}>
        <div className="logo-container">
          <img 
            src="/logo.svg" 
            alt="LeoLink" 
            className="logo-image"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = '/favicon.ico';
            }}
          />
        </div>
        <span className="logo-full-text">LeoLink</span>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <div
            key={item.path}
            className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <span className="menu-icon">{item.icon}</span>
            <span className="menu-text">{item.label}</span>
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="menu-item logout" onClick={handleLogout}>
          <span className="menu-icon">🚪</span>
          <span className="menu-text">Sair</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
