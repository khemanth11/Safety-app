// File: client/src/pages/Watch.js
import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';

const Watch = () => {
    const { id } = useParams();
    const videoRef = useRef();
    const [status, setStatus] = useState("SEARCHING SIGNAL...");
    const [showPlayBtn, setShowPlayBtn] = useState(false);

    useEffect(() => {
        const socket = io('https://ghost-backend-fq2h.onrender.com');
        const pc = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun1.l.google.com:19302' }]
        });

        socket.on('connect', () => {
            socket.emit("join_room", id);
            setStatus("ESTABLISHING LINK...");
        });

        pc.ontrack = (event) => {
            if (videoRef.current) {
                videoRef.current.srcObject = event.streams[0];
                videoRef.current.muted = true;
                videoRef.current.play()
                    .then(() => setStatus("LIVE FEED"))
                    .catch(() => setShowPlayBtn(true));
            }
        };

        socket.on("offer", async (offer) => {
            await pc.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            socket.emit("answer", { answer, roomId: id });
        });

        pc.onicecandidate = (e) => {
            if (e.candidate) socket.emit("ice_candidate", { candidate: e.candidate, roomId: id });
        };

        socket.on("ice_candidate", (c) =>
            pc.addIceCandidate(new RTCIceCandidate(c)).catch(() => {})
        );

        return () => {
            socket.disconnect();
            pc.close();
        };
    }, [id]);

    const handlePlay = () => {
        if (videoRef.current) {
            videoRef.current.muted = false;
            videoRef.current.play();
            setShowPlayBtn(false);
            setStatus("LIVE AUDIO/VIDEO");
        }
    };

    return (
        <div style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          padding: '20px' 
        }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '800px', padding: '32px', textAlign: 'center' }}>
                <header style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>SURVEILLANCE MONITOR</h1>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', letterSpacing: '0.1em' }}>BROADCAST ID: {id}</p>
                </header>

                <div style={{ 
                    width: '100%', 
                    aspectRatio: '16/9', 
                    background: '#000', 
                    borderRadius: '20px', 
                    overflow: 'hidden',
                    border: '1px solid var(--glass-border)',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                    position: 'relative',
                    marginBottom: '24px'
                }}>
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        controls
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    
                    <div style={{ 
                        position: 'absolute', 
                        top: '20px', 
                        left: '20px', 
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 12px',
                        background: 'rgba(0,0,0,0.6)',
                        backdropFilter: 'blur(4px)',
                        borderRadius: '6px',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <span style={{ 
                          width: '8px', 
                          height: '8px', 
                          background: status.includes('LIVE') ? 'var(--danger)' : 'var(--text-dim)', 
                          borderRadius: '50%',
                          animation: status.includes('LIVE') ? 'pulse-ring 2s infinite' : 'none'
                        }}></span>
                        <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'white' }}>{status}</span>
                    </div>
                </div>

                {showPlayBtn && (
                    <button onClick={handlePlay} className="spy-btn btn-primary" style={{ maxWidth: '300px', margin: '0 auto 24px' }}>
                        🔊 ENABLE AUDIO FEED
                    </button>
                )}

                <div style={{ 
                    padding: '20px', 
                    background: 'rgba(255,255,255,0.03)', 
                    borderRadius: '12px',
                    fontSize: '0.85rem',
                    color: 'var(--text-dim)',
                    lineHeight: '1.6'
                }}>
                    <span style={{ color: 'var(--primary)', fontWeight: '700' }}>SECURITY NOTICE:</span> You are viewing an authorized emergency broadcast channel. All data is end-to-end encrypted under GHOST PROTOCOL v2.1.
                </div>
            </div>
        </div>
    );
};

export default Watch;
