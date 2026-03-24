// File: client/src/pages/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '', email: '', password: '', safePin: '', panicPin: '', adminPin: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.post('https://ghost-backend-fq2h.onrender.com/api/auth/register', formData);
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'REGISTRATION FAILED: Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container glass-panel" style={{ maxWidth: '480px' }}>
      <h2 style={{ marginBottom: '24px' }}>SECURE ENROLLMENT</h2>
      
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

      <form onSubmit={handleRegister}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <input className="spy-input" name="username" placeholder="CODENAME" onChange={handleChange} required />
          <input className="spy-input" name="email" type="email" placeholder="EMAIL" onChange={handleChange} required />
        </div>
        <input className="spy-input" name="password" type="password" placeholder="PASSWORD" onChange={handleChange} required />

        <div style={{ 
          margin: '24px 0', 
          background: 'rgba(255, 255, 255, 0.03)', 
          padding: '20px', 
          borderRadius: '16px',
          border: '1px solid var(--glass-border)'
        }}>
          <p style={{ margin: '0 0 16px 0', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '600', textAlign: 'left' }}>
            SECURITY ACCESS CODES
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            <div style={{ textAlign: 'left' }}>
              <label style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginLeft: '4px' }}>SAFE</label>
              <input className="spy-input" name="safePin" placeholder="1234" onChange={handleChange} required />
            </div>
            <div style={{ textAlign: 'left' }}>
              <label style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginLeft: '4px' }}>PANIC</label>
              <input className="spy-input" name="panicPin" placeholder="9999" onChange={handleChange} required />
            </div>
            <div style={{ textAlign: 'left' }}>
              <label style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginLeft: '4px' }}>ADMIN</label>
              <input className="spy-input" name="adminPin" placeholder="5555" onChange={handleChange} required />
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          className="spy-btn btn-primary"
          disabled={loading}
        >
          {loading ? 'INITIALIZING...' : 'INITIALIZE PROFILE'}
        </button>
      </form>

      <button 
        className="spy-btn btn-secondary" 
        onClick={() => navigate('/login')}
        style={{ marginTop: '16px' }}
      >
        ALREADY ENROLLED? LOGIN
      </button>
    </div>
  );
};

export default Register;