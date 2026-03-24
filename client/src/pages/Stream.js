// File: client/src/pages/Stream.js
import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

const Stream = () => {
    const userVideo = useRef();
    const socketRef = useRef();
    const streamRef = useRef();
    const [status, setStatus] = useState("⚠️ INITIALIZING...");
    const [logs, setLogs] = useState([]);
    const navigate = useNavigate();

    const addLog = (msg) => {
        setLogs(prev => [`${new Date().toLocaleTimeString().split(' ')[0]} ${msg}`, ...prev].slice(0, 10));
    };

    let userId = "anonymous";
    try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (userInfo && userInfo._id) userId = userInfo._id;
    } catch (e) {}

    const startCall = React.useCallback(async (socket, roomId) => {
        addLog("🚀 Starting P2P Handshake...");
        try {
            const pc = new RTCPeerConnection({
                iceServers: [{ urls: 'stun:stun1.l.google.com:19302' }]
            });

            streamRef.current.getTracks().forEach(track =>
                pc.addTrack(track, streamRef.current)
            );

            pc.onicecandidate = e => {
                if (e.candidate) socket.emit("ice_candidate", { candidate: e.candidate, roomId });
            };

            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            socket.emit("offer", { offer, roomId });
            addLog("📤 Offer Sent");

            socket.on("answer", ans =>
                pc.setRemoteDescription(new RTCSessionDescription(ans))
            );
            socket.on("ice_candidate", can =>
                pc.addIceCandidate(new RTCIceCandidate(can))
            );
        } catch (err) {
            addLog(`❌ P2P Error: ${err.message}`);
        }
    }, []);

    useEffect(() => {
        const init = async () => {
            addLog(`🚀 APP STARTED. ID: ${userId}`);

            try {
                addLog("🔌 Connecting to Server...");
                const socket = io('https://ghost-backend-fq2h.onrender.com');
                socketRef.current = socket;

                socket.on('connect', () => {
                    setStatus("CONNECTED");
                    addLog(`✅ Connected! Socket ID: ${socket.id}`);
                    socket.emit("join_room", userId);
                });

                socket.on("user_joined", (viewerId) => {
                    setStatus("BROADCASTING");
                    addLog(`👤 Viewer Detected: ${viewerId}`);
                    startCall(socket, userId);
                });

                socket.on("answer", () => addLog("🤝 Answer Received"));
            } catch (err) {
                setStatus("SOCKET ERROR");
                addLog(`Socket Failed: ${err.message}`);
            }

            try {
                addLog("📷 Requesting Camera...");
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { width: 640, height: 640 },
                    audio: true
                });
                streamRef.current = stream;
                if (userVideo.current) userVideo.current.srcObject = stream;
                addLog("✅ Camera Active");
            } catch (err) {
                setStatus("CAMERA DENIED");
                alert("Allow camera permissions");
            }
        };

        init();
        return () => socketRef.current && socketRef.current.disconnect();
    }, [userId, startCall]);

    return (
        <div style={{ minHeight: '100vh', padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', paddingTop: '40px' }}>
                <div style={{ flex: '1.5', minWidth: '320px' }}>
                    <div className="glass-panel" style={{ padding: '24px', paddingBottom: '32px' }}>
                        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <div>
                                <h1 style={{ fontSize: '1.5rem', margin: 0 }}>GHOST EYE</h1>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>ID: {userId}</p>
                            </div>
                            <div style={{ 
                                padding: '6px 12px', 
                                background: status === 'BROADCASTING' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.05)',
                                color: status === 'BROADCASTING' ? 'var(--danger)' : 'var(--text-dim)',
                                borderRadius: '8px',
                                fontSize: '0.8rem',
                                fontWeight: '700',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                {status === 'BROADCASTING' && <span style={{ width: '8px', height: '8px', background: 'var(--danger)', borderRadius: '50%' }}></span>}
                                {status}
                            </div>
                        </header>

                        <div style={{ 
                            width: '100%', 
                            aspectRatio: '1', 
                            background: '#000', 
                            borderRadius: '16px', 
                            overflow: 'hidden',
                            border: '1px solid var(--glass-border)',
                            boxShadow: '0 0 40px rgba(0,0,0,0.5)',
                            position: 'relative'
                        }}>
                            <video
                                ref={userVideo}
                                autoPlay
                                playsInline
                                muted
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            {status === 'BROADCASTING' && (
                                <div style={{ 
                                    position: 'absolute', 
                                    top: '16px', 
                                    left: '16px', 
                                    background: 'var(--danger)', 
                                    color: 'white', 
                                    fontSize: '0.7rem', 
                                    fontWeight: '800', 
                                    padding: '4px 8px', 
                                    borderRadius: '4px' 
                                }}>
                                    LIVE
                                </div>
                            )}
                        </div>

                        <button 
                            onClick={() => navigate('/dashboard')} 
                            className="spy-btn btn-danger"
                            style={{ marginTop: '24px' }}
                        >
                            TERMINATE BROADCAST
                        </button>
                    </div>
                </div>

                <div style={{ flex: '1', minWidth: '300px' }}>
                    <div className="glass-panel" style={{ height: '100%', padding: '24px', display: 'flex', flexDirection: 'column' }}>
                        <h2 style={{ fontSize: '1rem', marginBottom: '20px', color: 'var(--primary)' }}>SYSTEM TELEMETRY</h2>
                        <div style={{ 
                            flex: 1, 
                            background: 'rgba(0,0,0,0.3)', 
                            borderRadius: '12px', 
                            padding: '16px',
                            fontFamily: 'monospace',
                            fontSize: '0.8rem',
                            color: 'var(--text-dim)',
                            overflowY: 'auto',
                            maxHeight: '400px'
                        }}>
                            {logs.length === 0 ? (
                                <div style={{ opacity: 0.5 }}>Waiting for system logs...</div>
                            ) : (
                                logs.map((l, i) => (
                                    <div key={i} style={{ marginBottom: '8px', borderLeft: '2px solid rgba(255,255,255,0.1)', paddingLeft: '8px' }}>
                                        {l}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Stream;
