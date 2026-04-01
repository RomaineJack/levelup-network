import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 className="font-display" style={{ fontSize: 32, fontWeight: 700, color: '#fff', letterSpacing: '.04em' }}>MY ACCOUNT</h1>
          <p style={{ color: '#6b6b8a', fontSize: 14, marginTop: 4 }}>Manage your profile and account settings</p>
        </div>
        {['admin', 'editor'].includes(profile?.role) && (
          <Link href="/admin" style={{ padding: '8px 16px', background: '#00ff88', color: '#05050a', borderRadius: 8, fontWeight: 700, textDecoration: 'none', fontFamily: 'Rajdhani, sans-serif', fontSize: 13 }}>
            Admin Panel
          </Link>
        )}
      </div>

      {/* Profile Card */}
      <div style={{ background: '#111120', border: '1px solid #252540', borderRadius: 14, padding: 28, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid #252540' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(0,255,136,.1)', border: '2px solid rgba(0,255,136,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700, color: '#00ff88', fontFamily: 'Rajdhani, sans-serif', flexShrink: 0 }}>
            {(profile?.display_name || profile?.username || 'U')[0].toUpperCase()}
          </div>
          <div>
            <p style={{ fontSize: 22, fontWeight: 700, color: '#fff', fontFamily: 'Rajdhani, sans-serif' }}>{profile?.display_name || profile?.username}</p>
            <p style={{ fontSize: 13, color: '#6b6b8a', marginTop: 2 }}>{user.email}</p>
            <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: 'rgba(0,255,136,.1)', color: '#00ff88', fontFamily: 'monospace', marginTop: 6, display: 'inline-block' }}>
              {profile?.role}
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#6b6b8a', marginBottom: 6 }}>Display Name</label>
            <p style={{ fontSize: 15, color: '#fff' }}>{profile?.display_name || '—'}</p>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#6b6b8a', marginBottom: 6 }}>Username</label>
            <p style={{ fontSize: 15, color: '#fff', fontFamily: 'monospace' }}>@{profile?.username}</p>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#6b6b8a', marginBottom: 6 }}>Email</label>
            <p style={{ fontSize: 15, color: '#fff' }}>{user.email}</p>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#6b6b8a', marginBottom: 6 }}>Member Since</label>
            <p style={{ fontSize: 15, color: '#fff' }}>{new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <Link href="/dashboard/edit" style={{ padding: '10px 20px', border: '1px solid #252540', color: '#aaa', borderRadius: 8, textDecoration: 'none', fontSize: 13, display: 'inline-block' }}>
            ✏️ Edit Profile
          </Link>
        </div>
      </div>

      {/* Sign Out */}
      <div style={{ background: '#111120', border: '1px solid #252540', borderRadius: 14, padding: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Sign Out</h3>
        <p style={{ fontSize: 13, color: '#6b6b8a', marginBottom: 14 }}>Sign out of your account on this device.</p>
        <form action="/auth/signout" method="POST">
          <button type="submit" style={{ padding: '8px 20px', background: 'rgba(255,107,53,.1)', border: '1px solid rgba(255,107,53,.3)', color: '#ff6b35', borderRadius: 8, fontSize: 13, cursor: 'pointer', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700 }}>
            Sign Out
          </button>
        </form>
      </div>
    </div>
  );
}