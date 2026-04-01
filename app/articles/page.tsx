import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function ArticlesPage() {
  const supabase = createClient();

  const { data: articles } = await supabase
    .from('articles')
    .select(`id, title, slug, excerpt, cover_image_url, created_at, categories(name, color), profiles(display_name, username)`)
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 className="font-display" style={{ fontSize: 36, fontWeight: 700, color: '#fff', letterSpacing: '.04em', marginBottom: 6 }}>ALL ARTICLES</h1>
        <p style={{ color: '#6b6b8a', fontSize: 14 }}>{articles?.length || 0} articles published</p>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
        <Link href="/articles" style={{ padding: '6px 16px', borderRadius: 20, fontSize: 12, fontWeight: 700, fontFamily: 'Rajdhani, sans-serif', background: '#00ff88', color: '#05050a', textDecoration: 'none' }}>
          All
        </Link>
        {(categories || []).map((cat: any) => (
          <Link key={cat.id} href={`/articles?category=${cat.slug}`} style={{ padding: '6px 16px', borderRadius: 20, fontSize: 12, fontWeight: 700, fontFamily: 'Rajdhani, sans-serif', border: '1px solid #252540', color: '#6b6b8a', textDecoration: 'none' }}>
            {cat.name}
          </Link>
        ))}
      </div>

      {!articles || articles.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: '#6b6b8a' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎮</div>
          <p style={{ fontSize: 18 }}>No articles published yet</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {articles.map((article: any) => (
            <Link key={article.id} href={`/articles/${article.slug}`} style={{ textDecoration: 'none' }}>
              <div className="gaming-card" style={{ borderRadius: 12, overflow: 'hidden', height: '100%' }}>
                <div style={{ height: 160, background: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, overflow: 'hidden' }}>
                  {article.cover_image_url
                    ? <img src={article.cover_image_url} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : '🎮'
                  }
                </div>
                <div style={{ padding: 16 }}>
                  {article.categories && (
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: article.categories.color, background: `${article.categories.color}22`, padding: '2px 8px', borderRadius: 4, marginBottom: 8, display: 'inline-block' }}>
                      {article.categories.name}
                    </span>
                  )}
                  <h3 className="font-display" style={{ fontSize: 16, fontWeight: 700, color: '#fff', lineHeight: 1.35, marginBottom: 8, marginTop: 6 }}>
                    {article.title}
                  </h3>
                  {article.excerpt && (
                    <p style={{ fontSize: 13, color: '#6b6b8a', lineHeight: 1.6, marginBottom: 12 }}>
                      {article.excerpt.slice(0, 100)}...
                    </p>
                  )}
                  <div style={{ fontSize: 12, color: '#6b6b8a', display: 'flex', gap: 12, paddingTop: 12, borderTop: '1px solid #252540' }}>
                    <span>{article.profiles?.display_name || article.profiles?.username || 'Staff'}</span>
                    <span>{new Date(article.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}