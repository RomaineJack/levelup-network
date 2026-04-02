'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { logActivity } from '@/lib/logActivity';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { setError('Password must be at least 8 characters'); return; }
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: name } }
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      await logActivity('user_joined', `New user joined: ${name || email}`);
      setDone(true);
    }
  };

  if (done) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)' }}>
      <div style={{ textAlign: 'center', maxWidth: 400 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
        <h2 className="font-display" style={{ fontSize: 28, color: '#fff', marginBottom: 8 }}>CHECK YOUR EMAIL</h2>
        <p style={{ color: '#6b6b8a', marginBottom: 20 }}>We sent a confirmation link to <strong style={{ color: '#fff' }}>{email}</strong></p>
        <Link href="/login" style={{ color: '#00ff88' }}>Back to Sign In</Link>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 48, height: 48, background: '#00ff88', borderRadius: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 14 }}>🎮</div>
          <h1 className="font-display" style={{ fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: '.05em', marginBottom: 4 }}>JOIN FREE</h1>
          <p style={{ fontSize: 14, color: '#6b6b8a' }}>Create your gamer account</p>
        </div>
        <div style={{ background: '#111120', border: '1px solid #252540', borderRadius: 16, padding: 32 }}>
          <form onSubmit={handleSignup}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#888', marginBottom: 8 }}>Display Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                placeholder="GamerTag42"
                style={{ width: '100%', background: '#0a0a12', border: '1px solid #252540', borderRadius: 8, padding: '12px 16px', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#888', marginBottom: 8 }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                style={{ width: '100%', background: '#0a0a12', border: '1px solid #252540', borderRadius: 8, padding: '12px 16px', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#888', marginBottom: 8 }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="Min 8 characters"
                style={{ width: '100%', background: '#0a0a12', border: '1px solid #252540', borderRadius: 8, padding: '12px 16px', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            {error && <p style={{ color: '#ff6b35', fontSize: 13, marginBottom: 14 }}>{error}</p>}
            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: 12, background: '#00ff88', color: '#05050a', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 700, fontFamily: 'Rajdhani, sans-serif', letterSpacing: '.05em', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
            </button>
          </form>
          <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #252540', textAlign: 'center', fontSize: 13, color: '#6b6b8a' }}>
            Already have an account? <Link href="/login" style={{ color: '#00ff88', textDecoration: 'none' }}>Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
}