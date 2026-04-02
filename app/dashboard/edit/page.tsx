'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const PRESET_AVATARS = [
  { emoji: '🎮', label: 'Gamer' },
  { emoji: '⚔️', label: 'Warrior' },
  { emoji: '🏆', label: 'Champion' },
  { emoji: '🚀', label: 'Rocket' },
  { emoji: '🐉', label: 'Dragon' },
  { emoji: '👾', label: 'Alien' },
  { emoji: '🔥', label: 'Fire' },
  { emoji: '⚡', label: 'Lightning' },
  { emoji: '🌟', label: 'Star' },
  { emoji: '💀', label: 'Skull' },
  { emoji: '🦊', label: 'Fox' },
  { emoji: '🐺', label: 'Wolf' },
];

export default function EditProfilePage() {
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [userId, setUserId] = useState('');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      setUserId(user.id);
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (data) {
        setDisplayName(data.display_name || '');
        setUsername(data.username || '');
        setBio(data.bio || '');
        setAvatarUrl(data.avatar_url || '');
      }
      setFetching(false);
    };
    fetchProfile();
  }, []);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { setError('Image must be under 2MB'); return; }
    setUploading(true);
    setError('');
    const ext = file.name.split('.').pop();
    const filename = `${userId}/avatar.${ext}`;
    const { data, error } = await supabase.storage.from('avatars').upload(filename, file, { upsert: true });
    if (error) {
      setError('Upload failed: ' + error.message);
    } else {
      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(data.path);
      setAvatarUrl(urlData.publicUrl);
      setSelectedEmoji('');
    }
    setUploading(false);
  };

  const selectEmoji = (emoji: string) => {
    setSelectedEmoji(emoji);
    setAvatarUrl('');
  };

  const handleSave = async () => {
    if (!username.trim()) { setError('Username is required'); return; }
    setLoading(true);
    setError('');
    setSuccess(false);

    const finalAvatar = selectedEmoji ? null : avatarUrl || null;

    const { error } = await supabase
      .from('profiles')
      .update({
        display_name: displayName.trim() || null,
        username: username.trim().toLowerCase().replace(/[^a-z0-9_]/g, ''),
        bio: bio.trim() || null,
        avatar_url: finalAvatar,
      })
      .eq('id', userId);

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

  const currentAvatar = selectedEmoji || avatarUrl;

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
        <Link href="/dashboard" style={{ color: '#6b6b8a', textDecoration: 'none', fontSize: 14 }}>← Back</Link>
        <h1 className="font-display" style={{ fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: '.04em' }}>EDIT PROFILE</h1>
      </div>

      <div style={{ background: '#111120', border: '1px solid #252540', borderRadius: 14, padding: 28 }}>
        {error && (
          <div style={{ background: 'rgba(255,107,53,.1)', border: '1px solid rgba(255,107,53,.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 18, color: '#ff6b35', fontSize: 13 }}>{error}</div>
        )}
        {success && (
          <div style={{ background: 'rgba(0,255,136,.1)', border: '1px solid rgba(0,255,136,.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 18, color: '#00ff88', fontSize: 13 }}>Profile updated successfully!</div>
        )}

        {/* Avatar Preview */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(0,255,136,.1)', border: '2px solid rgba(0,255,136,.3)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, overflow: 'hidden', fontSize: 36 }}>
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : selectedEmoji ? (
              selectedEmoji
            ) : (
              <span style={{ fontSize: 28, fontWeight: 700, color: '#00ff88', fontFamily: 'Rajdhani, sans-serif' }}>
                {(displayName || username || 'U')[0].toUpperCase()}
              </span>
            )}
          </div>
          <p style={{ fontSize: 12, color: '#6b6b8a' }}>Your profile picture</p>
        </div>

        {/* Upload own photo */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#6b6b8a', marginBottom: 8 }}>Upload Your Own Photo</label>
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px', border: '1px dashed #252540', borderRadius: 8, cursor: 'pointer', color: uploading ? '#00ff88' : '#6b6b8a', fontSize: 13, transition: 'all .2s' }}>
            {uploading ? '⏳ Uploading...' : '📤 Choose Photo (max 2MB)'}
            <input type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: 'none' }} disabled={uploading} />
          </label>
        </div>

        {/* Preset avatars */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#6b6b8a', marginBottom: 10 }}>Or Pick a Gaming Avatar</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
            {PRESET_AVATARS.map(({ emoji, label }) => (
              <button
                key={emoji}
                onClick={() => selectEmoji(emoji)}
                title={label}
                style={{ width: '100%', aspectRatio: '1', background: selectedEmoji === emoji ? 'rgba(0,255,136,.15)' : '#0a0a12', border: `1px solid ${selectedEmoji === emoji ? '#00ff88' : '#252540'}`, borderRadius: 8, fontSize: 24, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .15s' }}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Display Name */}
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

        {/* Username */}
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
        </div>

        {/* Bio */}
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