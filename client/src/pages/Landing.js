// File: client/src/pages/Landing.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      navigate('/'); 
    }
  }, [navigate]);

  return (
    <div className="auth-container glass-panel">
      <div style={{ 
        fontSize: '64px', 
        marginBottom: '24px',
        filter: 'drop-shadow(0 0 20px var(--primary-glow))' 
      }}>
        🛡️
      </div>
      <h1 style={{ marginBottom: '8px' }}>GHOST PROTOCOL</h1>
      <p style={{ marginBottom: '48px', letterSpacing: '0.1em', fontWeight: '500' }}>
        ELITE SECURITY NETWORK
      </p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <button 
          className="spy-btn btn-primary"
          onClick={() => navigate('/login')}
        >
          ACCESS SYSTEM
        </button>

        <button 
          className="spy-btn btn-secondary"
          onClick={() => navigate('/register')}
        >
          ENROLL NOW
        </button>
      </div>
      
      <div style={{ 
        marginTop: '40px', 
        paddingTop: '24px',
        borderTop: '1px solid var(--glass-border)',
        fontSize: '11px', 
        color: 'var(--text-dim)',
        letterSpacing: '0.05em'
      }}>
        SYSTEM VERSION 2.1.0 // FULLY ENCRYPTED
      </div>
    </div>
  );
};

export default Landing;