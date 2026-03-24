// File: client/src/pages/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.post('https://ghost-backend-fq2h.onrender.com/api/auth/login', {
        email,
        password
      });

      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/');
    } catch (err) {
      setError('ACCESS DENIED: Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container glass-panel">
      <h2 style={{ marginBottom: '24px' }}>VERIFY IDENTITY</h2>
      
      {error && (
        <div style={{ 
          background: 'rgba(239, 68, 68, 0.1)', 
          color: 'var(--danger)', 
          padding: '12px', 
          borderRadius: '8px',
          fontSize: '0.9rem',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          marginBottom: '20px' 
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleLogin}>
        <div style={{ textAlign: 'left', marginBottom: '8px' }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginLeft: '4px' }}>AGENT EMAIL</label>
        </div>
        <input
          className="spy-input"
          type="email"
          placeholder="email@ghost.protocol"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <div style={{ textAlign: 'left', marginBottom: '8px', marginTop: '16px' }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginLeft: '4px' }}>SECRET KEY</label>
        </div>
        <input
          className="spy-input"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button 
          type="submit" 
          className="spy-btn btn-primary"
          disabled={loading}
          style={{ marginTop: '32px' }}
        >
          {loading ? 'AUTHENTICATING...' : 'AUTHENTICATE'}
        </button>
      </form>

      <button 
        className="spy-btn btn-secondary" 
        onClick={() => navigate('/register')}
        style={{ marginTop: '16px' }}
      >
        REQUEST CLEARANCE
      </button>
    </div>
  );
};

export default Login;