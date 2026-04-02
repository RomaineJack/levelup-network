import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
export default async function HomePage() {
  const supabase = createClient();

  const { data: articles } = await supabase
    .from('articles')
    .select(`
      id, title, slug, excerpt, cover_image_url, 
      category_id, author_id, status, featured, 
      view_count, published_at, created_at,
      categories(name, slug, color),
      profiles(display_name, username)
    `)
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(6);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>

      {/* Hero */}
      <div style={{ marginBottom: 40 }}>
        <h1 className="font-display" style={{ fontSize: 48, fontWeight: 700, color: '#fff', letterSpacing: '.04em', marginBottom: 8 }}>
          YOUR ULTIMATE <span style={{ color: '#00ff88' }}>GAMING HUB</span>
        </h1>
        <p style={{ fontSize: 16, color: '#6b6b8a', maxWidth: 500 }}>
          News, reviews, guides and community for passionate gamers.
        </p>
      </div>

      {/* Articles Grid */}
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 className="font-display" style={{ fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: '.04em' }}>
          📈 LATEST ARTICLES
        </h2>
        <Link href="/articles" style={{ fontSize: 13, color: '#6b6b8a', textDecoration: 'none' }}>
          View all →
        </Link>
      </div>

      {!articles || articles.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: '#6b6b8a' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎮</div>
          <p style={{ fontSize: 18, marginBottom: 8 }}>No articles yet</p>
          <p style={{ fontSize: 14 }}>
            <Link href="/login" style={{ color: '#00ff88' }}>Sign in</Link> and go to the admin panel to publish your first article!
          </p>
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
                  {(article.categories as any) && (
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: (article.categories as any).color || '#00ff88', background: `${(article.categories as any).color}22`, padding: '2px 8px', borderRadius: 4, marginBottom: 8, display: 'inline-block' }}>
                      {(article.categories as any).name}
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
                  <div style={{ fontSize: 12, color: '#6b6b8a', display: 'flex', gap: 12 }}>
                    <span>{(article.profiles as any)?.display_name || (article.profiles as any)?.username || 'Staff'}</span>
                    <span>{new Date(article.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* CTA */}
      <div style={{ marginTop: 60, background: '#1a1a2e', border: '1px solid rgba(0,255,136,.2)', borderRadius: 16, padding: '48px 32px', textAlign: 'center' }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>⭐</div>
        <h2 className="font-display" style={{ fontSize: 32, fontWeight: 700, color: '#fff', letterSpacing: '.04em', marginBottom: 12 }}>
          JOIN THE COMMUNITY
        </h2>
        <p style={{ fontSize: 15, color: '#8888aa', marginBottom: 24, maxWidth: 480, margin: '0 auto 24px' }}>
          Create a free account to comment, like articles, and be part of the LevelUp Network community.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link href="/signup" style={{ padding: '10px 28px', background: '#00ff88', color: '#05050a', borderRadius: 8, fontWeight: 700, textDecoration: 'none', fontFamily: 'Rajdhani, sans-serif', letterSpacing: '.04em' }}>
            CREATE FREE ACCOUNT
          </Link>
          <Link href="/articles" style={{ padding: '10px 28px', border: '1px solid #252540', color: '#ccc', borderRadius: 8, textDecoration: 'none' }}>
            Browse Articles
          </Link>
        </div>
      </div>
    </div>
  );
}