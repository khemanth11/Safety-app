// File: client/src/pages/Settings.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
    const [contacts, setContacts] = useState([]);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const userId = userInfo ? userInfo._id : null;

    const fetchContacts = React.useCallback(async () => {
        try {
            const res = await axios.get(`https://ghost-backend-fq2h.onrender.com/api/users/contacts?userId=${userId}`);
            setContacts(res.data);
        } catch (error) {
            console.error("Fetch error:", error);
        }
    }, [userId]);

    useEffect(() => {
        if (userId) fetchContacts();
    }, [userId, fetchContacts]);

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!name || !phone) return;
        setLoading(true);
        try {
            const res = await axios.post('https://ghost-backend-fq2h.onrender.com/api/users/contacts', {
                userId,
                name,
                phone
            });
            setContacts(res.data);
            setName('');
            setPhone('');
        } catch (error) {
            alert("Failed to add contact");
        }
        setLoading(false);
    };

    const handleDelete = async (contactId) => {
        if(!window.confirm("Delete this contact?")) return;

        try {
            const res = await axios.delete(`https://ghost-backend-fq2h.onrender.com/api/users/contacts/${contactId}`, {
                data: { userId } 
            });
            setContacts(res.data);
        } catch (error) {
            console.error("Delete failed:", error);
            alert("Could not delete contact.");
        }
    };

    return (
        <div style={{ minHeight: '100vh', padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
            <header style={{ marginBottom: '48px', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>IDENTITY SETTINGS</h1>
                <p style={{ color: 'var(--text-dim)', letterSpacing: '0.1em' }}>MANAGE SECURITY CONTACTS</p>
            </header>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
                {/* ADD CONTACT FORM */}
                <div className="glass-panel" style={{ padding: '24px' }}>
                    <h2 style={{ fontSize: '1rem', marginBottom: '24px', color: 'var(--primary)' }}>ADD EMERGENCY CONTACT</h2>
                    <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginLeft: '4px' }}>CONTACT NAME</label>
                            <input 
                                className="spy-input"
                                type="text" 
                                placeholder="e.g. Guardian" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginLeft: '4px' }}>PHONE / SECURE ID</label>
                            <input 
                                className="spy-input"
                                type="tel" 
                                placeholder="+1 (555) 000-0000" 
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                        <button type="submit" disabled={loading} className="spy-btn btn-primary" style={{ marginTop: '12px' }}>
                            {loading ? "SAVING..." : "AUTHORIZE CONTACT"}
                        </button>
                    </form>
                </div>

                {/* CONTACT LIST */}
                <div className="glass-panel" style={{ padding: '24px' }}>
                    <h2 style={{ fontSize: '1rem', marginBottom: '24px', color: 'var(--primary)' }}>SECURE CONTACT LIST</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {contacts.map((c) => (
                            <div key={c._id} className="glass-panel" style={{ 
                                background: 'rgba(255,255,255,0.03)', 
                                padding: '16px', 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                borderRadius: '12px'
                            }}>
                                <div style={{ textAlign: 'left' }}>
                                    <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>{c.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '2px' }}>{c.phone || c.value}</div>
                                </div>
                                <button 
                                    onClick={() => handleDelete(c._id)} 
                                    style={{ 
                                        background: 'rgba(239, 68, 68, 0.1)', 
                                        border: 'none', 
                                        color: 'var(--danger)', 
                                        width: '32px', 
                                        height: '32px', 
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                        {contacts.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '40px 0', opacity: 0.5 }}>
                                <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📡</div>
                                <p style={{ fontSize: '0.8rem' }}>No secure contacts found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '48px' }}>
                <button 
                  onClick={() => navigate('/dashboard')} 
                  className="spy-btn btn-secondary"
                  style={{ maxWidth: '240px', margin: '0 auto' }}
                >
                    BACK TO CONTROL CENTER
                </button>
            </div>
        </div>
    );
};

export default Settings;