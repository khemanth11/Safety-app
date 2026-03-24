// File: client/src/pages/Sentinel.js
import React, { useEffect, useState, useRef } from 'react';
import * as tf from "@tensorflow/tfjs"; 
import * as speechCommands from "@tensorflow-models/speech-commands";
import { useNavigate } from 'react-router-dom';

const Sentinel = () => {
  const navigate = useNavigate();
  const [model, setModel] = useState(null);
  const [action, setAction] = useState(null);
  const [labels, setLabels] = useState([]);
  const [listening, setListening] = useState(false);
  const recognizerRef = useRef(null);
  
  const locationRef = useRef({ latitude: 0, longitude: 0 });

  useEffect(() => {
    const loadModel = async () => {
      try { await tf.setBackend('webgl'); } catch { await tf.setBackend('cpu'); }
      await tf.ready();
      const recognizer = speechCommands.create("BROWSER_FFT");
      await recognizer.ensureModelLoaded();
      setModel(recognizer);
      setLabels(recognizer.wordLabels());
      recognizerRef.current = recognizer;
    };
    loadModel();
    return () => {
      if (recognizerRef.current?.isListening()) {
        recognizerRef.current.stopListening().catch(() => {});
      }
    };
  }, []);

  const startListening = () => {
    if (!model) return;
    setListening(true);

    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
            (pos) => {
                locationRef.current = {
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude
                };
            },
            (err) => console.log("Sentinel GPS Error:", err),
            { enableHighAccuracy: true }
        );
    }

    model.listen(result => {
      const { scores } = result;
      const max = Math.max(...scores);
      const idx = scores.indexOf(max);
      const word = labels[idx];

      if (max > 0.5) setAction(word);
      if (word === "stop" && max > 0.85) triggerPanic();
    }, {
      probabilityThreshold: 0.75,
      invokeCallbackOnNoiseAndUnknown: true,
      overlapFactor: 0.5
    });
  };

  const stopListening = async () => {
    if (!model || !listening) return;
    setListening(false);
    try {
      await model.stopListening();
    } catch (err) {
      console.log("Sentinel Stop Error:", err.message);
    }
  };

  const triggerPanic = async () => {
    await stopListening();
    navigate('/dashboard', { 
        state: { 
            autoSOS: true,
            preLocation: locationRef.current 
        } 
    });
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '20px' 
    }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '520px', padding: '32px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '1.75rem', margin: 0 }}>Sentinel AI</h1>
          <div className="status-bar" style={{ 
            margin: 0, 
            background: model ? 'rgba(16, 185, 129, 0.1)' : 'rgba(251, 191, 36, 0.1)',
            color: model ? 'var(--success)' : '#FBBF24',
            borderColor: model ? 'rgba(16, 185, 129, 0.2)' : 'rgba(251, 191, 36, 0.2)'
          }}>
            {model ? 'SYSTEM ONLINE' : 'INITIALIZING...'}
          </div>
        </header>

        <div style={{ marginBottom: '24px', textAlign: 'left' }}>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', letterSpacing: '0.05em' }}>MONITORING STATUS</label>
          <div style={{ 
            fontSize: '1.25rem', 
            fontWeight: '700', 
            color: listening ? 'var(--success)' : 'var(--danger)',
            marginTop: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            {listening && <span className="pulse-dot" style={{ width: '8px', height: '8px', background: 'var(--success)', borderRadius: '50%' }}></span>}
            {listening ? 'ACTIVE LISTENING' : 'SYSTEM STANDBY'}
          </div>
        </div>

        <div className="glass-panel" style={{ background: 'rgba(0,0,0,0.2)', padding: '24px', marginBottom: '32px', textAlign: 'center' }}>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', marginBottom: '12px' }}>LAST AUDITORY PATTERN</label>
          <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary)', letterSpacing: '0.1em' }}>
            {action ? action.toUpperCase() : '---'}
          </div>
        </div>

        {!listening ? (
          <button 
            className="spy-btn btn-primary" 
            onClick={startListening} 
            disabled={!model}
          >
            ACTIVATE SENTINEL
          </button>
        ) : (
          <button className="spy-btn btn-danger" onClick={stopListening}>
            DEACTIVATE SYSTEM
          </button>
        )}

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
            Trigger Keyword: <span style={{ color: 'var(--text-main)', fontWeight: '700' }}>"STOP"</span>
          </p>
          <button 
            onClick={() => navigate('/dashboard')} 
            style={{ 
              marginTop: '16px', 
              background: 'none', 
              border: 'none', 
              color: 'var(--primary)', 
              cursor: 'pointer', 
              fontSize: '0.9rem',
              fontWeight: '600'
            }}
          >
            Return to Control Center
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sentinel;