'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    setError(error.message);
    setLoading(false);
  } else {
    router.push('/');
    router.refresh();
  }
};

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 48, height: 48, background: '#00ff88', borderRadius: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 14 }}>🎮</div>
          <h1 className="font-display" style={{ fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: '.05em', marginBottom: 4 }}>SIGN IN</h1>
          <p style={{ fontSize: 14, color: '#6b6b8a' }}>Welcome back, gamer</p>
        </div>

        <div style={{ background: '#111120', border: '1px solid #252540', borderRadius: 16, padding: 32 }}>
          <form onSubmit={handleLogin}>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#888' }}>Password</label>
                <Link href="/forgot-password" style={{ fontSize: 12, color: '#6b6b8a', textDecoration: 'none' }}>Forgot password?</Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{ width: '100%', background: '#0a0a12', border: '1px solid #252540', borderRadius: 8, padding: '12px 16px', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            {error && <p style={{ color: '#ff6b35', fontSize: 13, marginBottom: 14 }}>{error}</p>}
            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: 12, background: '#00ff88', color: '#05050a', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 700, fontFamily: 'Rajdhani, sans-serif', letterSpacing: '.05em', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'SIGNING IN...' : 'SIGN IN'}
            </button>
          </form>
          <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #252540', textAlign: 'center', fontSize: 13, color: '#6b6b8a' }}>
            Don't have an account? <Link href="/signup" style={{ color: '#00ff88', textDecoration: 'none' }}>Join Free</Link>
          </div>
        </div>
      </div>
    </div>
  );
}