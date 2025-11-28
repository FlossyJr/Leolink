import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Register.css';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (password.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres');
      return;
    }

    // Validar complexidade da senha
    const passwordRegex = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
    if (!passwordRegex.test(password)) {
      setError('A senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número ou caractere especial');
      return;
    }

    setLoading(true);

    try {
      await register(name, email, password, confirmPassword); // confirmPassword local é mapeado para passwordConfirmation
      navigate('/feed');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-logo">
          <img 
            src="/logo.svg" 
            alt="LeoLink" 
            className="logo-icon"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = '/favicon.ico';
            }}
          />
        </div>
        <h1 className="register-title">Cadastro</h1>
        <p className="register-subtitle">Crie sua conta no LeoLink</p>
        
        <form onSubmit={handleSubmit} className="register-form">
          {error && <div className="error-message">{error}</div>}
          
          <input
            type="text"
            placeholder="Nome completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
            className="register-input"
          />
          
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className="register-input"
          />
          
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            className="register-input"
          />
          
          <input
            type="password"
            placeholder="Confirmar senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={loading}
            className="register-input"
          />
          
          <button type="submit" disabled={loading} className="register-button">
            {loading ? 'Criando conta...' : 'Cadastrar'}
          </button>
        </form>
        
        <div className="register-footer">
          <p>Já tem uma conta? <Link to="/login" className="register-link">Faça login</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Register;
