'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { logActivity } from '@/lib/logActivity';


export default function NewArticlePage() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('draft');
  const [coverUrl, setCoverUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const genSlug = (val: string) => {
    setSlug(val.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-'));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError('Image must be under 5MB'); return; }
    const ext = file.name.split('.').pop();
    const filename = `articles/${Date.now()}.${ext}`;
    const { data, error } = await supabase.storage.from('article-images').upload(filename, file);
    if (error) { setError(error.message); return; }
    const { data: urlData } = supabase.storage.from('article-images').getPublicUrl(data.path);
    setCoverUrl(urlData.publicUrl);
  };

  const handleSave = async (saveStatus: string) => {
    if (!title.trim()) { setError('Title is required'); return; }
    if (!slug.trim()) { setError('Slug is required'); return; }
    setLoading(true);
    setError('');

    const { data: { user } } = await supabase.auth.getUser();

    const { data: catData } = await supabase
      .from('categories')
      .select('id')
      .eq('name', category)
      .single();

    const { error } = await supabase.from('articles').insert({
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim() || null,
      content_text: content,
      cover_image_url: coverUrl || null,
      category_id: catData?.id || null,
      author_id: user?.id,
      status: saveStatus,
      published_at: saveStatus === 'published' ? new Date().toISOString() : null,
    });

    await logActivity(
  saveStatus === 'published' ? 'article_published' : 'article_updated',
  saveStatus === 'published'
    ? `Published article: "${title.trim()}"`
    : `Saved draft: "${title.trim()}"`,
  { slug: slug.trim() }
);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/admin/articles');
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 className="font-display" style={{ fontSize: 32, fontWeight: 700, color: '#fff', letterSpacing: '.04em' }}>NEW ARTICLE</h1>
        <p style={{ color: '#6b6b8a', fontSize: 14, marginTop: 4 }}>Create and publish a new article</p>
      </div>

      {error && (
        <div style={{ background: 'rgba(255,107,53,.1)', border: '1px solid rgba(255,107,53,.3)', borderRadius: 8, padding: '12px 16px', marginBottom: 20, color: '#ff6b35', fontSize: 14 }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20 }}>
        {/* Main */}
        <div>
          <input
            type="text"
            value={title}
            onChange={e => { setTitle(e.target.value); genSlug(e.target.value); }}
            placeholder="Article title..."
            style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid #252540', padding: '10px 0', fontSize: 24, fontWeight: 700, fontFamily: 'Rajdhani, sans-serif', color: '#fff', outline: 'none', marginBottom: 14, boxSizing: 'border-box' }}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <span style={{ fontSize: 13, color: '#6b6b8a' }}>/articles/</span>
            <input
              type="text"
              value={slug}
              onChange={e => setSlug(e.target.value)}
              style={{ flex: 1, background: '#111120', border: '1px solid #252540', borderRadius: 6, padding: '6px 12px', color: '#aaa', fontSize: 13, fontFamily: 'monospace', outline: 'none' }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#888', marginBottom: 8 }}>Excerpt</label>
            <textarea
              value={excerpt}
              onChange={e => setExcerpt(e.target.value)}
              placeholder="Brief description shown in article previews..."
              rows={2}
              maxLength={300}
              style={{ width: '100%', background: '#111120', border: '1px solid #252540', borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 14, resize: 'none', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#888', marginBottom: 8 }}>Content</label>
            <div style={{ background: '#0a0a12', border: '1px solid #252540', borderRadius: 10, overflow: 'hidden' }}>
             {/* Toolbar */}
              <div style={{ display: 'flex', gap: 3, padding: '8px 12px', background: '#111120', borderBottom: '1px solid #252540', flexWrap: 'wrap', alignItems: 'center' }}>
                {['B', 'I', 'U', '|', 'H1', 'H2', 'H3', '|', '≡', '""'].map((btn, i) =>
                  btn === '|'
                    ? <div key={i} style={{ width: 1, background: '#252540', height: 22, margin: '0 4px' }} />
                    : <button key={i} style={{ padding: '4px 8px', borderRadius: 4, fontSize: 12, color: '#6b6b8a', cursor: 'pointer', border: 'none', background: 'transparent' }}>{btn}</button>
                )}
                <div style={{ width: 1, background: '#252540', height: 22, margin: '0 4px' }} />
                <button
                  type="button"
                  onClick={() => {
                    const url = prompt('Paste YouTube URL:');
                    if (url) {
                      const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
                      if (match) {
                        setContent(prev => prev + `\n\n[youtube:${match[1]}]\n\n`);
                      } else {
                        alert('Please paste a valid YouTube URL');
                      }
                    }
                  }}
                  style={{ padding: '4px 10px', borderRadius: 4, fontSize: 12, color: '#ff6b35', cursor: 'pointer', border: '1px solid rgba(255,107,53,.3)', background: 'rgba(255,107,53,.1)' }}
                >
                  ▶ YouTube
                </button>
    </div>
    <textarea
      value={content}
      onChange={e => setContent(e.target.value)}
      placeholder={"You can write multiple paragraphs.\nAdd as much content as you want!"}
      rows={18}
      style={{ width: '100%', background: 'transparent', border: 'none', padding: '16px', color: '#c8c8e0', fontSize: 15, lineHeight: 1.8, resize: 'none', outline: 'none', fontFamily: 'Exo 2, sans-serif', boxSizing: 'border-box' }}
    />
  </div>
</div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Publish */}
          <div style={{ background: '#111120', border: '1px solid #252540', borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ padding: '10px 14px', background: '#1a1a2e', borderBottom: '1px solid #252540', fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#6b6b8a' }}>Publish</div>
            <div style={{ padding: 14 }}>
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                style={{ width: '100%', background: '#0a0a12', border: '1px solid #252540', borderRadius: 6, padding: '8px 12px', color: '#fff', fontSize: 13, marginBottom: 12, outline: 'none' }}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => handleSave('draft')}
                  disabled={loading}
                  style={{ flex: 1, padding: '8px', background: 'transparent', border: '1px solid #252540', borderRadius: 6, color: '#6b6b8a', fontSize: 12, cursor: 'pointer', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700 }}
                >
                  Save Draft
                </button>
                <button
                  onClick={() => handleSave('published')}
                  disabled={loading}
                  style={{ flex: 1, padding: '8px', background: '#00ff88', border: 'none', borderRadius: 6, color: '#05050a', fontSize: 12, cursor: 'pointer', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700 }}
                >
                  {loading ? '...' : 'Publish'}
                </button>
              </div>
            </div>
          </div>

          {/* Cover Image */}
          <div style={{ background: '#111120', border: '1px solid #252540', borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ padding: '10px 14px', background: '#1a1a2e', borderBottom: '1px solid #252540', fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#6b6b8a' }}>Cover Image</div>
            <div style={{ padding: 14 }}>
              {coverUrl && (
                <img src={coverUrl} alt="Cover" style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 6, marginBottom: 10, border: '1px solid #252540' }} />
              )}
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px', border: '1px dashed #252540', borderRadius: 6, cursor: 'pointer', color: '#6b6b8a', fontSize: 13, marginBottom: 8 }}>
                📤 Upload Image
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
              </label>
              <input
                type="url"
                value={coverUrl}
                onChange={e => setCoverUrl(e.target.value)}
                placeholder="Or paste image URL..."
                style={{ width: '100%', background: '#0a0a12', border: '1px solid #252540', borderRadius: 6, padding: '8px 10px', color: '#fff', fontSize: 12, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          {/* Category */}
          <div style={{ background: '#111120', border: '1px solid #252540', borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ padding: '10px 14px', background: '#1a1a2e', borderBottom: '1px solid #252540', fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#6b6b8a' }}>Category</div>
            <div style={{ padding: 14 }}>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                style={{ width: '100%', background: '#0a0a12', border: '1px solid #252540', borderRadius: 6, padding: '8px 12px', color: '#fff', fontSize: 13, outline: 'none' }}
              >
                <option value="">No category</option>
                {['News', 'Reviews', 'Guides', 'Esports', 'Hardware', 'Indie', 'Retro', 'Opinion'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}