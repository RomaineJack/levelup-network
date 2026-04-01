import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import DeleteArticleButton from './articles/DeleteArticleButton';

export default async function AdminArticlesPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: articles } = await supabase
    .from('articles')
    .select(`id, title, slug, status, created_at, categories(name, color)`)
    .order('created_at', { ascending: false });

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 className="font-display" style={{ fontSize: 32, fontWeight: 700, color: '#fff', letterSpacing: '.04em' }}>ARTICLES</h1>
          <p style={{ color: '#6b6b8a', fontSize: 14, marginTop: 4 }}>{articles?.length || 0} total articles</p>
        </div>
        <Link href="/admin/articles/new" style={{ padding: '10px 20px', background: '#00ff88', color: '#05050a', borderRadius: 8, fontWeight: 700, textDecoration: 'none', fontFamily: 'Rajdhani, sans-serif', letterSpacing: '.04em', fontSize: 14 }}>
          + New Article
        </Link>
      </div>

      <div style={{ background: '#111120', border: '1px solid #252540', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#1a1a2e' }}>
              {['Title', 'Category', 'Status', 'Date', 'Actions'].map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#6b6b8a', borderBottom: '1px solid #252540' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!articles || articles.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#6b6b8a' }}>
                  No articles yet. <Link href="/admin/articles/new" style={{ color: '#00ff88' }}>Create your first one</Link>
                </td>
              </tr>
            ) : (
              articles.map((article: any) => (
                <tr key={article.id} style={{ borderBottom: '1px solid #252540' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <p style={{ fontSize: 14, color: '#fff', fontWeight: 500 }}>{article.title}</p>
                    <p style={{ fontSize: 11, color: '#6b6b8a', fontFamily: 'monospace', marginTop: 2 }}>{article.slug}</p>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {article.categories ? (
                      <span style={{ fontSize: 12, color: (article.categories as any).color || '#00ff88' }}>{(article.categories as any).name}</span>
                    ) : <span style={{ color: '#6b6b8a', fontSize: 12 }}>—</span>}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 4, fontFamily: 'monospace', background: article.status === 'published' ? 'rgba(0,255,136,.12)' : 'rgba(107,107,138,.2)', color: article.status === 'published' ? '#00ff88' : '#6b6b8a' }}>
                      {article.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: '#6b6b8a' }}>
                    {new Date(article.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <Link href={`/articles/${article.slug}`} style={{ fontSize: 12, color: '#6b6b8a', textDecoration: 'none' }}>View</Link>
                      <Link href={`/admin/articles/${article.id}/edit`} style={{ fontSize: 12, color: '#00e5ff', textDecoration: 'none' }}>Edit</Link>
                      <DeleteArticleButton id={article.id} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}