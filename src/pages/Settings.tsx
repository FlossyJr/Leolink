import React, { useState } from 'react';
import Layout from '../components/Layout/Layout';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';
import './Settings.css';

function Settings() {
  const { user, refreshUser } = useAuth();
  const [activeSection, setActiveSection] = useState<'profile' | 'account' | 'privacy' | 'notifications'>('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    privateProfile: false,
    showEmail: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSettingToggle = (setting: keyof typeof settings) => {
    setSettings({ ...settings, [setting]: !settings[setting] });
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    setMessage(null);
    
    try {
      await userService.updateUser(user.id, {
        name: formData.name,
        email: formData.email,
      });
      
      // Atualizar contexto do usuário
      if (refreshUser) {
        await refreshUser();
      }
      
      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      setMessage({ type: 'error', text: error.response?.data?.message || 'Erro ao atualizar perfil' });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }
    alert('Senha alterada com sucesso!');
  };

  return (
    <Layout>
      <div className="settings-page">
        <header className="settings-header">
          <h1>⚙️ Configurações</h1>
          <p className="settings-subtitle">Gerencie suas preferências</p>
        </header>

        <div className="settings-container">
          <aside className="settings-menu">
            <button
              className={`menu-item ${activeSection === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveSection('profile')}
            >
              <span className="menu-icon">👤</span>
              <span>Perfil</span>
            </button>
            <button
              className={`menu-item ${activeSection === 'account' ? 'active' : ''}`}
              onClick={() => setActiveSection('account')}
            >
              <span className="menu-icon">🔐</span>
              <span>Conta</span>
            </button>
            <button
              className={`menu-item ${activeSection === 'privacy' ? 'active' : ''}`}
              onClick={() => setActiveSection('privacy')}
            >
              <span className="menu-icon">🛡️</span>
              <span>Privacidade</span>
            </button>
            <button
              className={`menu-item ${activeSection === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveSection('notifications')}
            >
              <span className="menu-icon">🔔</span>
              <span>Notificações</span>
            </button>
          </aside>

          <main className="settings-content">
            {activeSection === 'profile' && (
              <div className="settings-section">
                <h2>Informações do Perfil</h2>
                
                {message && (
                  <div className={`message ${message.type}`}>
                    {message.text}
                  </div>
                )}
                
                <form onSubmit={handleSaveProfile}>
                  <div className="form-group">
                    <label>Nome completo</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="settings-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="settings-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Bio</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      className="settings-textarea"
                      placeholder="Conte um pouco sobre você..."
                      rows={4}
                    />
                  </div>

                  <button type="submit" className="btn-save" disabled={loading}>
                    {loading ? 'Salvando...' : 'Salvar alterações'}
                  </button>
                </form>
              </div>
            )}

            {activeSection === 'account' && (
              <div className="settings-section">
                <h2>Segurança da Conta</h2>
                <form onSubmit={handleChangePassword}>
                  <div className="form-group">
                    <label>Senha atual</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      className="settings-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Nova senha</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className="settings-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Confirmar nova senha</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="settings-input"
                    />
                  </div>

                  <button type="submit" className="btn-save">
                    Alterar senha
                  </button>
                </form>

                <div className="danger-zone">
                  <h3>Zona de Perigo</h3>
                  <p>Ações irreversíveis</p>
                  <button className="btn-danger">Desativar conta</button>
                  <button className="btn-danger">Excluir conta</button>
                </div>
              </div>
            )}

            {activeSection === 'privacy' && (
              <div className="settings-section">
                <h2>Privacidade</h2>
                
                <div className="setting-item">
                  <div className="setting-info">
                    <h3>Perfil privado</h3>
                    <p>Apenas seguidores aprovados podem ver seus posts</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.privateProfile}
                      onChange={() => handleSettingToggle('privateProfile')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h3>Mostrar email no perfil</h3>
                    <p>Outros usuários poderão ver seu email</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.showEmail}
                      onChange={() => handleSettingToggle('showEmail')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            )}

            {activeSection === 'notifications' && (
              <div className="settings-section">
                <h2>Notificações</h2>
                
                <div className="setting-item">
                  <div className="setting-info">
                    <h3>Notificações por email</h3>
                    <p>Receba notificações importantes por email</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.emailNotifications}
                      onChange={() => handleSettingToggle('emailNotifications')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h3>Notificações push</h3>
                    <p>Receba notificações em tempo real no navegador</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.pushNotifications}
                      onChange={() => handleSettingToggle('pushNotifications')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </Layout>
  );
}

export default Settings;
