import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const FakeCall = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('standby');
  const audioRef = useRef(null);

  useEffect(() => {
    // Standard high-quality ringtone
    audioRef.current = new Audio(
      'https://www.orangefreesounds.com/wp-content/uploads/2020/09/Iphone-12-ringtone.mp3'
    );
    audioRef.current.loop = true;

    if (step === 'standby') {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
      const timer = setTimeout(() => setStep('incoming'), 5000);
      return () => clearTimeout(timer);
    }

    if (step === 'incoming') {
      audioRef.current.play().catch(() => {});
      if (navigator.vibrate) {
        navigator.vibrate([500, 1000, 500, 1000]);
      }
    }

    return () => {
      if (audioRef.current) audioRef.current.pause();
      if (navigator.vibrate) navigator.vibrate(0);
    };
  }, [step]);

  const answerCall = () => {
    if (audioRef.current) audioRef.current.pause();
    if (navigator.vibrate) navigator.vibrate(0);
    setStep('active');
  };

  const endCall = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
    navigate('/dashboard');
  };

  if (step === 'standby') {
    return <div style={{ width: '100vw', height: '100vh', background: 'black' }} />;
  }

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'black',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden'
    }}>
      <div style={{
        width: '100%',
        height: '100%',
        maxWidth: '430px', /* iPhone 15 Pro Max width */
        background: 'linear-gradient(180deg, #1C1C1E 0%, #000000 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '80px 40px 60px',
        color: 'white',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
      }}>
        {/* TOP SECTION */}
        <div style={{ textAlign: 'center' }}>
          {step === 'incoming' && (
            <div style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.6)', marginBottom: '8px', letterSpacing: '0.05em' }}>
              Incoming Call
            </div>
          )}
          <div style={{ fontSize: '2.5rem', fontWeight: '400', marginBottom: '4px' }}>HOME</div>
          <div style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.4)', fontWeight: '300' }}>
            {step === 'active' ? '00:01' : 'Mobile'}
          </div>
        </div>

        {/* CONTROLS (Active only) */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '20px', 
          opacity: step === 'active' ? 1 : 0,
          transition: 'opacity 0.5s ease'
        }}>
          {[
            { icon: '🎤', label: 'mute' },
            { icon: '⌨️', label: 'keypad' },
            { icon: '🔊', label: 'speaker' },
            { icon: '➕', label: 'add call' },
            { icon: '🎥', label: 'FaceTime' },
            { icon: '👤', label: 'contacts' }
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div style={{ 
                width: '72px', 
                height: '72px', 
                borderRadius: '50%', 
                background: 'rgba(255,255,255,0.1)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '1.75rem'
              }}>
                {item.icon}
              </div>
              <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)' }}>{item.label}</span>
            </div>
          ))}
        </div>

        {/* ACTION BUTTONS */}
        <div style={{ 
          display: 'flex', 
          justifyContent: step === 'incoming' ? 'space-between' : 'center',
          padding: '0 20px'
        }}>
          {step === 'incoming' ? (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <button 
                  onClick={endCall} 
                  style={{ 
                    width: '75px', 
                    height: '75px', 
                    borderRadius: '50%', 
                    background: '#FF3B30', 
                    border: 'none', 
                    color: 'white', 
                    fontSize: '2rem', 
                    cursor: 'pointer' 
                  }}
                >
                  ✕
                </button>
                <span style={{ fontSize: '0.85rem' }}>Decline</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <button
                  onClick={answerCall}
                  style={{ 
                    width: '75px', 
                    height: '75px', 
                    borderRadius: '50%', 
                    background: '#34C759', 
                    border: 'none', 
                    color: 'white', 
                    fontSize: '2rem', 
                    cursor: 'pointer',
                    animation: 'ring-pulse 2s infinite'
                  }}
                >
                  📞
                </button>
                <span style={{ fontSize: '0.85rem' }}>Accept</span>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <button 
                onClick={endCall} 
                style={{ 
                  width: '75px', 
                  height: '75px', 
                  borderRadius: '50%', 
                  background: '#FF3B30', 
                  border: 'none', 
                  color: 'white', 
                  fontSize: '2rem', 
                  cursor: 'pointer' 
                }}
              >
                📞
              </button>
              <span style={{ fontSize: '0.85rem', color: 'white' }}>End</span>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes ring-pulse {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(52, 199, 89, 0.7); }
          70% { transform: scale(1.05); box-shadow: 0 0 0 20px rgba(52, 199, 89, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(52, 199, 89, 0); }
        }
      `}</style>
    </div>
  );
};

export default FakeCall;
