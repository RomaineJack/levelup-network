import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Comments from '../../components/Comments';
import LikeButton from '../../components/LikeButton';

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const supabase = createClient();

  const { data: article } = await supabase
    .from('articles')
    .select(`*, categories(name, color), profiles(display_name, username)`)
    .eq('slug', params.slug)
    .eq('status', 'published')
    .single();

  if (!article) notFound();

  return (
    <div style={{ maxWidth: 780, margin: '0 auto', padding: '32px 24px' }}>

      {/* Breadcrumb */}
      <div style={{ display: 'flex', gap: 8, fontSize: 13, color: '#6b6b8a', marginBottom: 20 }}>
        <Link href="/" style={{ color: '#6b6b8a', textDecoration: 'none' }}>Home</Link>
        <span>/</span>
        <Link href="/articles" style={{ color: '#6b6b8a', textDecoration: 'none' }}>Articles</Link>
        {article.categories && (
          <>
            <span>/</span>
            <span style={{ color: (article.categories as any).color }}>{(article.categories as any).name}</span>
          </>
        )}
      </div>

      {/* Category Badge */}
      {article.categories && (
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', padding: '3px 10px', borderRadius: 4, color: (article.categories as any).color, background: `${(article.categories as any).color}22`, marginBottom: 14, display: 'inline-block' }}>
          {(article.categories as any).name}
        </span>
      )}

      {/* Title */}
      <h1 className="font-display" style={{ fontSize: 40, fontWeight: 700, color: '#fff', lineHeight: 1.2, letterSpacing: '.02em', marginBottom: 14, marginTop: 10 }}>
        {article.title}
      </h1>

      {/* Excerpt */}
      {article.excerpt && (
        <p style={{ fontSize: 17, color: '#8888aa', lineHeight: 1.7, marginBottom: 20 }}>{article.excerpt}</p>
      )}

      {/* Meta */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: 13, color: '#6b6b8a', paddingBottom: 20, borderBottom: '1px solid #252540', marginBottom: 24 }}>
        <span>👤 {(article.profiles as any)?.display_name || (article.profiles as any)?.username || 'Staff'}</span>
        <span>📅 {new Date(article.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </div>

      {/* Cover Image */}
      {article.cover_image_url && (
        <img src={article.cover_image_url} alt={article.title} style={{ width: '100%', height: 380, objectFit: 'cover', borderRadius: 12, border: '1px solid #252540', marginBottom: 32 }} />
      )}

      {/* Content */}
      <div style={{ fontSize: 16, lineHeight: 1.85, color: '#c8c8e0', marginBottom: 32 }}>
        {article.content_text ? (
  article.content_text.split('\n\n').filter(Boolean).map((para: string, i: number) => {
    const youtubeMatch = para.trim().match(/^\[youtube:([a-zA-Z0-9_-]+)\]$/);
    if (youtubeMatch) {
      return (
        <div key={i} style={{ marginBottom: 24, borderRadius: 12, overflow: 'hidden', aspectRatio: '16/9' }}>
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${youtubeMatch[1]}`}
            title="YouTube video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ display: 'block', borderRadius: 12, border: '1px solid #252540' }}
          />
        </div>
      );
    }
    return <p key={i} style={{ marginBottom: 20 }}>{para}</p>;
  })
) : (
  <p style={{ color: '#6b6b8a' }}>No content yet.</p>
)}
      </div>

{/* Like + Back */}
<div style={{ paddingTop: 24, borderTop: '1px solid #252540', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
  <Link href="/articles" style={{ fontSize: 14, color: '#00ff88', textDecoration: 'none' }}>← Back to Articles</Link>
  <LikeButton articleId={article.id} />
</div>

    </div>
  );
}