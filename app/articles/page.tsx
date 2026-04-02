'use client';
import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function ArticlesPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchCategories = useCallback(async () => {
    const { data } = await supabase.from('categories').select('*').order('name');
    setCategories(data || []);
  }, [supabase]);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from('articles')
      .select(`id, title, slug, excerpt, cover_image_url, created_at, categories(name, color, slug), profiles(display_name, username)`)
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (activeCategory) {
      query = query.eq('categories.slug', activeCategory);
    }

    if (search.trim()) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`);
    }

    const { data } = await query;

    // Filter by category client-side since Supabase join filtering is tricky
    let filtered = data || [];
    if (activeCategory) {
      filtered = filtered.filter((a: any) => a.categories?.slug === activeCategory);
    }

    setArticles(filtered);
    setLoading(false);
  }, [supabase, search, activeCategory]);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  useEffect(() => {
    const timeout = setTimeout(fetchArticles, 300);
    return () => clearTimeout(timeout);
  }, [fetchArticles]);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 className="font-display" style={{ fontSize: 36, fontWeight: 700, color: '#fff', letterSpacing: '.04em', marginBottom: 6 }}>ALL ARTICLES</h1>
        <p style={{ color: '#6b6b8a', fontSize: 14 }}>{articles.length} articles found</p>
      </div>

      {/* Search Bar */}
      <div style={{ position: 'relative', marginBottom: 20, maxWidth: 480 }}>
        <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: '#6b6b8a' }}>🔍</span>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search articles..."
          style={{ width: '100%', background: '#111120', border: '1px solid #252540', borderRadius: 10, padding: '12px 16px 12px 44px', color: '#fff', fontSize: 15, outline: 'none', boxSizing: 'border-box', transition: 'border-color .2s' }}
          onFocus={e => e.target.style.borderColor = '#00ff88'}
          onBlur={e => e.target.style.borderColor = '#252540'}
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#6b6b8a', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}
          >
            ×
          </button>
        )}
      </div>

      {/* Category Filters */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
        <button
          onClick={() => setActiveCategory('')}
          style={{ padding: '6px 16px', borderRadius: 20, fontSize: 12, fontWeight: 700, fontFamily: 'Rajdhani, sans-serif', cursor: 'pointer', border: '1px solid', borderColor: activeCategory === '' ? '#00ff88' : '#252540', background: activeCategory === '' ? '#00ff88' : 'transparent', color: activeCategory === '' ? '#05050a' : '#6b6b8a' }}
        >
          All
        </button>
        {categories.map((cat: any) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(activeCategory === cat.slug ? '' : cat.slug)}
            style={{ padding: '6px 16px', borderRadius: 20, fontSize: 12, fontWeight: 700, fontFamily: 'Rajdhani, sans-serif', cursor: 'pointer', border: '1px solid', borderColor: activeCategory === cat.slug ? cat.color : '#252540', background: activeCategory === cat.slug ? `${cat.color}22` : 'transparent', color: activeCategory === cat.slug ? cat.color : '#6b6b8a' }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Results */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#6b6b8a' }}>
          <p>Searching...</p>
        </div>
      ) : articles.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: '#6b6b8a' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <p style={{ fontSize: 18, marginBottom: 8 }}>No articles found</p>
          <p style={{ fontSize: 14 }}>
            {search ? `No results for "${search}"` : 'No articles in this category yet'}
          </p>
          {(search || activeCategory) && (
            <button
              onClick={() => { setSearch(''); setActiveCategory(''); }}
              style={{ marginTop: 16, padding: '8px 20px', background: '#00ff88', color: '#05050a', border: 'none', borderRadius: 8, fontWeight: 700, fontFamily: 'Rajdhani, sans-serif', cursor: 'pointer', fontSize: 13 }}
            >
              Clear filters
            </button>
          )}
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
                    {/* Highlight search term in title */}
                    {search ? (
                      <span dangerouslySetInnerHTML={{
                        __html: article.title.replace(
                          new RegExp(`(${search})`, 'gi'),
                          '<mark style="background:rgba(0,255,136,.25);color:#00ff88;border-radius:2px;padding:0 2px">$1</mark>'
                        )
                      }} />
                    ) : article.title}
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