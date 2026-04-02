import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import DeleteArticleButton from './articles/DeleteArticleButton';

export default async function AdminPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, display_name, username')
    .eq('id', user.id)
    .single();

  if (!profile || !['admin', 'editor'].includes(profile.role)) {
    redirect('/');
  }

  const [
    { count: totalArticles },
    { count: pendingComments },
    { count: totalUsers },
    { data: recentArticles },
  ] = await Promise.all([
    supabase.from('articles').select('*', { count: 'exact', head: true }),
    supabase.from('comments').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('articles').select('id, title, slug, status, created_at').order('created_at', { ascending: false }).limit(5),
  ]);

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 className="font-display" style={{ fontSize: 32, fontWeight: 700, color: '#fff', letterSpacing: '.04em' }}>
            ADMIN DASHBOARD
          </h1>
          <p style={{ color: '#6b6b8a', fontSize: 14, marginTop: 4 }}>
            Welcome back, {profile.display_name || profile.username}
          </p>
        </div>
        <Link href="/admin/articles/new" style={{ padding: '10px 20px', background: '#00ff88', color: '#05050a', borderRadius: 8, fontWeight: 700, textDecoration: 'none', fontFamily: 'Rajdhani, sans-serif', letterSpacing: '.04em', fontSize: 14 }}>
          + New Article
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 28 }}>
        {[
          { icon: '📄', label: 'Total Articles', value: totalArticles || 0, color: '#00e5ff' },
          { icon: '💬', label: 'Pending Comments', value: pendingComments || 0, color: '#ff6b35' },
          { icon: '👥', label: 'Total Members', value: totalUsers || 0, color: '#00ff88' },
        ].map(({ icon, label, value, color }) => (
          <div key={label} className="gaming-card" style={{ borderRadius: 10, padding: 20 }}>
            <div style={{ fontSize: 20, marginBottom: 10 }}>{icon}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#fff', fontFamily: 'monospace', marginBottom: 4 }}>{value}</div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#6b6b8a' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 28 }}>
        {[
          { href: '/admin/articles', label: '📝 Manage Articles' },
          { href: '/admin/articles/new', label: '✏️ New Article' },
          { href: '/admin/comments', label: '💬 Manage Comments' },
          { href: '/admin/users', label: '👥 Manage Users' },
        ].map(({ href, label }) => (
          <Link key={href} href={href} style={{ padding: '12px 16px', background: '#111120', border: '1px solid #252540', borderRadius: 8, color: '#aaa', textDecoration: 'none', fontSize: 13, textAlign: 'center' }}>
            {label}
          </Link>
        ))}
      </div>

      {/* Recent Articles */}
      <div className="gaming-card" style={{ borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid #252540', background: '#1a1a2e', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="font-display" style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>Recent Articles</span>
          <Link href="/admin/articles" style={{ fontSize: 12, color: '#6b6b8a', textDecoration: 'none' }}>View all</Link>
        </div>
        {!recentArticles || recentArticles.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6b6b8a' }}>
            <p>No articles yet.</p>
            <Link href="/admin/articles/new" style={{ color: '#00ff88', fontSize: 14 }}>Create your first article →</Link>
          </div>
        ) : (
          recentArticles.map((article: any) => (
            <div key={article.id} style={{ padding: '12px 18px', borderBottom: '1px solid #252540', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: 14, color: '#fff', fontWeight: 500 }}>{article.title}</p>
                <p style={{ fontSize: 11, color: '#6b6b8a', marginTop: 2 }}>{new Date(article.created_at).toLocaleDateString()}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, fontFamily: 'monospace', background: article.status === 'published' ? 'rgba(0,255,136,.12)' : 'rgba(107,107,138,.2)', color: article.status === 'published' ? '#00ff88' : '#6b6b8a' }}>
                  {article.status}
                </span>
                <Link href={`/admin/articles/${article.id}/edit`} style={{ fontSize: 12, color: '#6b6b8a', textDecoration: 'none' }}>Edit</Link>
                <DeleteArticleButton id={article.id} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}