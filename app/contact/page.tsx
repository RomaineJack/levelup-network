'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setLoading(true);
    setError('');

    const { error } = await supabase.from('contact_submissions').insert({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim() || null,
      message: message.trim(),
    });

    if (error) {
      setError('Failed to send message. Please try again.');
      setLoading(false);
    } else {
      setSent(true);
    }
  };

  if (sent) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)' }}>
      <div style={{ textAlign: 'center', maxWidth: 400 }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
        <h2 className="font-display" style={{ fontSize: 28, color: '#fff', marginBottom: 10 }}>MESSAGE RECEIVED!</h2>
        <p style={{ color: '#6b6b8a', marginBottom: 20 }}>We will get back to you at <strong style={{ color: '#fff' }}>{email}</strong> within 48 hours.</p>
        <button onClick={() => { setSent(false); setName(''); setEmail(''); setSubject(''); setMessage(''); }} style={{ color: '#00ff88', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}>
          Send another message
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px' }}>
      <div style={{ marginBottom: 36 }}>
        <h1 className="font-display" style={{ fontSize: 48, fontWeight: 700, color: '#fff', letterSpacing: '.04em', marginBottom: 10 }}>
          GET IN <span style={{ color: '#00ff88' }}>TOUCH</span>
        </h1>
        <p style={{ fontSize: 16, color: '#8888aa', maxWidth: 520 }}>Questions, pitches, partnerships — we read everything. Usually respond within 48 hours.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 32 }}>
        <div style={{ background: '#111120', border: '1px solid #252540', borderRadius: 16, padding: 32 }}>
          {error && (
            <div style={{ background: 'rgba(255,107,53,.1)', border: '1px solid rgba(255,107,53,.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 18, color: '#ff6b35', fontSize: 13 }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#6b6b8a', marginBottom: 8 }}>Name *</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="John Doe" style={{ width: '100%', background: '#0a0a12', border: '1px solid #252540', borderRadius: 8, padding: '12px 16px', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#6b6b8a', marginBottom: 8 }}>Email *</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" style={{ width: '100%', background: '#0a0a12', border: '1px solid #252540', borderRadius: 8, padding: '12px 16px', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#6b6b8a', marginBottom: 8 }}>Subject</label>
              <select value={subject} onChange={e => setSubject(e.target.value)} style={{ width: '100%', background: '#0a0a12', border: '1px solid #252540', borderRadius: 8, padding: '12px 16px', color: '#fff', fontSize: 14, outline: 'none' }}>
                <option value="">Select a reason...</option>
                <option>General Inquiry</option>
                <option>Write for Us</option>
                <option>Advertising</option>
                <option>Press / Review Copies</option>
                <option>Report an Issue</option>
                <option>Other</option>
              </select>
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#6b6b8a', marginBottom: 8 }}>Message *</label>
              <textarea value={message} onChange={e => setMessage(e.target.value)} required placeholder="What is on your mind?" rows={6} maxLength={2000} style={{ width: '100%', background: '#0a0a12', border: '1px solid #252540', borderRadius: 8, padding: '12px 16px', color: '#fff', fontSize: 14, resize: 'none', outline: 'none', boxSizing: 'border-box' }} />
              <p style={{ fontSize: 11, color: '#6b6b8a', textAlign: 'right', marginTop: 4 }}>{message.length}/2000</p>
            </div>
            <button type="submit" disabled={loading} style={{ width: '100%', padding: 12, background: '#00ff88', color: '#05050a', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, fontFamily: 'Rajdhani, sans-serif', letterSpacing: '.05em', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'SENDING...' : 'SEND MESSAGE'}
            </button>
          </form>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: '#111120', border: '1px solid #252540', borderRadius: 12, padding: 20 }}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>📧</div>
            <h3 className="font-display" style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Email Us</h3>
            <p style={{ fontSize: 13, color: '#00ff88', marginBottom: 4 }}>romainecontact@levelupgg.net</p>
            <p style={{ fontSize: 12, color: '#6b6b8a' }}>For press and business inquiries</p>
          </div>
          <div style={{ background: '#111120', border: '1px solid #252540', borderRadius: 12, padding: 20 }}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>🐦</div>
            <h3 className="font-display" style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Twitter</h3>
            <p style={{ fontSize: 13, color: '#00ff88', marginBottom: 4 }}>@LevelUpGG</p>
            <p style={{ fontSize: 12, color: '#6b6b8a' }}>Follow for breaking news</p>
          </div>
          <div style={{ background: '#111120', border: '1px solid #252540', borderRadius: 12, padding: 20 }}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>💜</div>
            <h3 className="font-display" style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Discord</h3>
            <a href="https://discord.gg/9NMeQ2py4f" target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: '#00ff88', marginBottom: 4, display: 'block', textDecoration: 'none' }}>Join our Discord</a>
            <p style={{ fontSize: 12, color: '#6b6b8a' }}>Chat with other gamers</p>
          </div>
          <div style={{ background: '#111120', border: '1px solid #252540', borderRadius: 12, padding: 20 }}>
            <h3 className="font-display" style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 12 }}>Response Times</h3>
            {[['General', '48 hours'], ['Press/Review', '24 hours'], ['Partnerships', '72 hours']].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                <span style={{ color: '#6b6b8a' }}>{k}</span>
                <span style={{ color: '#fff' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}