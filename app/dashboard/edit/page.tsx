'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EditProfilePage() {
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (data) {
        setDisplayName(data.display_name || '');
        setUsername(data.username || '');
        setBio(data.bio || '');
      }
      setFetching(false);
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    if (!username.trim()) { setError('Username is required'); return; }
    setLoading(true);
    setError('');
    setSuccess(false);

    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase
      .from('profiles')
      .update({
        display_name: displayName.trim() || null,
        username: username.trim().toLowerCase().replace(/[^a-z0-9_]/g, ''),
        bio: bio.trim() || null,
      })
      .eq('id', user!.id);

    if (error) {
      setError(error.message.includes('unique') ? 'Username already taken' : error.message);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  if (fetching) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
      <p style={{ color: '#6b6b8a' }}>Loading...</p>
    </div>
  );

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
        <Link href="/dashboard" style={{ color: '#6b6b8a', textDecoration: 'none', fontSize: 14 }}>← Back</Link>
        <h1 className="font-display" style={{ fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: '.04em' }}>EDIT PROFILE</h1>
      </div>

      <div style={{ background: '#111120', border: '1px solid #252540', borderRadius: 14, padding: 28 }}>
        {error && (
          <div style={{ background: 'rgba(255,107,53,.1)', border: '1px solid rgba(255,107,53,.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 18, color: '#ff6b35', fontSize: 13 }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ background: 'rgba(0,255,136,.1)', border: '1px solid rgba(0,255,136,.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 18, color: '#00ff88', fontSize: 13 }}>
            Profile updated successfully!
          </div>
        )}

        <div style={{ marginBottom: 18 }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#6b6b8a', marginBottom: 8 }}>Display Name</label>
          <input
            type="text"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            placeholder="Your public name"
            maxLength={50}
            style={{ width: '100%', background: '#0a0a12', border: '1px solid #252540', borderRadius: 8, padding: '12px 16px', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: 18 }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#6b6b8a', marginBottom: 8 }}>Username</label>
          <div style={{ display: 'flex' }}>
            <span style={{ background: '#1a1a2e', border: '1px solid #252540', borderRight: 'none', borderRadius: '8px 0 0 8px', padding: '12px 14px', color: '#6b6b8a', fontSize: 14 }}>@</span>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
              placeholder="your_username"
              maxLength={30}
              style={{ flex: 1, background: '#0a0a12', border: '1px solid #252540', borderRadius: '0 8px 8px 0', padding: '12px 16px', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <p style={{ fontSize: 11, color: '#6b6b8a', marginTop: 5 }}>Only lowercase letters, numbers and underscores</p>
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#6b6b8a', marginBottom: 8 }}>Bio</label>
          <textarea
            value={bio}
            onChange={e => setBio(e.target.value)}
            placeholder="Tell the community about yourself..."
            rows={3}
            maxLength={200}
            style={{ width: '100%', background: '#0a0a12', border: '1px solid #252540', borderRadius: 8, padding: '12px 16px', color: '#fff', fontSize: 14, resize: 'none', outline: 'none', boxSizing: 'border-box' }}
          />
          <p style={{ fontSize: 11, color: '#6b6b8a', textAlign: 'right', marginTop: 4 }}>{bio.length}/200</p>
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          style={{ width: '100%', padding: 12, background: '#00ff88', color: '#05050a', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, fontFamily: 'Rajdhani, sans-serif', letterSpacing: '.05em', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'SAVING...' : 'SAVE CHANGES'}
        </button>
      </div>
    </div>
  );
}
