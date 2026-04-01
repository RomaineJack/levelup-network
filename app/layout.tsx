import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'LevelUp Network — Your Ultimate Gaming Hub',
  description: 'The latest gaming news, reviews, guides, and community.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profile = null;
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('display_name, username, role')
      .eq('id', user.id)
      .single();
    profile = data;
  }

  return (
    <html lang="en">
      <body>
        <header style={{
          position: 'sticky', top: 0, zIndex: 100,
          background: 'rgba(10,10,18,.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid #252540',
          padding: '0 24px', height: '64px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{ width: 32, height: 32, background: '#00ff88', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🎮</div>
            <span className="font-display" style={{ fontSize: 20, fontWeight: 700, color: '#fff', letterSpacing: '.05em' }}>
              LEVEL<span style={{ color: '#00ff88' }}>UP</span>
            </span>
          </Link>
          <nav style={{ display: 'flex', gap: 4 }}>
            {[['/', 'Home'], ['/articles', 'Articles'], ['/about', 'About'], ['/contact', 'Contact']].map(([href, label]) => (
              <Link key={href} href={href} style={{ padding: '6px 12px', color: '#888', fontSize: 13, fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, letterSpacing: '.04em', textDecoration: 'none' }}>
                {label}
              </Link>
            ))}
          </nav>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            {user && profile ? (
              <>
                <Link href="/dashboard" style={{ fontSize: 13, color: '#888', textDecoration: 'none' }}>
                  👤 {profile.display_name || profile.username}
                </Link>
                {['admin', 'editor'].includes(profile.role) && (
                  <Link href="/admin" style={{ fontSize: 12, fontWeight: 700, color: '#00ff88', textDecoration: 'none', fontFamily: 'Rajdhani, sans-serif', letterSpacing: '.04em' }}>
                    ADMIN
                  </Link>
                )}
                <form action="/auth/signout" method="POST">
                  <button type="submit" style={{ fontSize: 12, color: '#888', background: 'none', border: 'none', cursor: 'pointer', padding: '6px 12px' }}>
                    Sign Out
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login" style={{ fontSize: 13, color: '#888', textDecoration: 'none' }}>Log In</Link>
                <Link href="/signup" style={{ fontSize: 12, fontWeight: 700, background: '#00ff88', color: '#05050a', padding: '7px 18px', borderRadius: 7, textDecoration: 'none', fontFamily: 'Rajdhani, sans-serif', letterSpacing: '.06em' }}>
                  JOIN FREE
                </Link>
              </>
            )}
          </div>
        </header>
        <main style={{ minHeight: 'calc(100vh - 64px)' }}>
          {children}
        </main>
        <footer style={{ background: '#0a0a12', borderTop: '1px solid #252540', padding: '40px 24px 24px', marginTop: 60 }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 28, height: 28, background: '#00ff88', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🎮</div>
              <span className="font-display" style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>LEVEL<span style={{ color: '#00ff88' }}>UP</span></span>
            </div>
            <p style={{ fontSize: 12, color: '#6b6b8a' }}>© {new Date().getFullYear()} LevelUp Network. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}