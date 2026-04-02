'use client';
import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { logActivity } from '@/lib/logActivity';

const BANNED_WORDS = [
  'fuck', 'shit', 'ass', 'bitch', 'bastard', 'damn', 'crap',
  'nigger', 'nigga', 'faggot', 'retard', 'cunt', 'whore', 'slut',
  'dick', 'cock', 'pussy', 'asshole', 'motherfucker', 'bullshit'
];

function containsBannedWord(text: string): boolean {
  const lower = text.toLowerCase();
  return BANNED_WORDS.some(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    return regex.test(lower);
  });
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  profiles: { display_name: string | null; username: string } | null;
}

export default function Comments({ articleId, articleTitle }: { articleId: string; articleTitle?: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);
  const [fetching, setFetching] = useState(true);
  const supabase = createClient();

  const fetchComments = useCallback(async () => {
    const { data } = await supabase
      .from('comments')
      .select(`id, content, created_at, profiles(display_name, username)`)
      .eq('article_id', articleId)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });
    setComments((data || []) as unknown as Comment[]);
    setFetching(false);
  }, [articleId, supabase]);

  useEffect(() => {
    fetchComments();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, [fetchComments, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setError('');

    if (containsBannedWord(content)) {
      setError('Your comment contains inappropriate language. Please revise and try again.');
      return;
    }

    setLoading(true);

    const { error } = await supabase.from('comments').insert({
      article_id: articleId,
      author_id: user.id,
      content: content.trim(),
      status: 'approved',
    });

    if (error) {
      setError('Failed to post comment. Please try again.');
    } else {
      await logActivity(
        'comment_posted',
        `New comment on "${articleTitle || 'an article'}"`,
        { articleId }
      );
      setContent('');
      fetchComments();
    }
    setLoading(false);
  };

  return (
    <div style={{ marginTop: 48 }}>
      <h3 className="font-display" style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
        💬 Comments <span style={{ fontSize: 16, color: '#6b6b8a', fontFamily: 'monospace' }}>({comments.length})</span>
      </h3>

      {user ? (
        <form onSubmit={handleSubmit} style={{ marginBottom: 28 }}>
          {error && (
            <div style={{ background: 'rgba(255,107,53,.1)', border: '1px solid rgba(255,107,53,.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 12, color: '#ff6b35', fontSize: 13 }}>
              {error}
            </div>
          )}
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Share your thoughts..."
            rows={3}
            maxLength={1000}
            style={{ width: '100%', background: '#111120', border: '1px solid #252540', borderRadius: 8, padding: '12px 16px', color: '#fff', fontSize: 14, resize: 'none', outline: 'none', boxSizing: 'border-box', marginBottom: 10 }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: '#6b6b8a' }}>{content.length}/1000</span>
            <button
              type="submit"
              disabled={loading || !content.trim()}
              style={{ padding: '8px 20px', background: '#00ff88', color: '#05050a', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, fontFamily: 'Rajdhani, sans-serif', letterSpacing: '.04em', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading || !content.trim() ? 0.6 : 1 }}
            >
              {loading ? 'POSTING...' : 'POST COMMENT'}
            </button>
          </div>
        </form>
      ) : (
        <div style={{ background: '#111120', border: '1px solid #252540', borderRadius: 10, padding: 20, textAlign: 'center', marginBottom: 24 }}>
          <p style={{ color: '#6b6b8a', fontSize: 14, marginBottom: 12 }}>Sign in to join the conversation</p>
          <a href="/login" style={{ padding: '8px 24px', background: '#00ff88', color: '#05050a', borderRadius: 8, fontWeight: 700, textDecoration: 'none', fontFamily: 'Rajdhani, sans-serif', fontSize: 13 }}>
            Sign In
          </a>
        </div>
      )}

      {fetching ? (
        <p style={{ color: '#6b6b8a', fontSize: 14 }}>Loading comments...</p>
      ) : comments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '32px 0', color: '#6b6b8a' }}>
          <p>No comments yet. Be the first!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {comments.map(comment => (
            <div key={comment.id} style={{ display: 'flex', gap: 14 }}>
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(0,255,136,.1)', border: '1px solid rgba(0,255,136,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#00ff88', fontFamily: 'Rajdhani, sans-serif', flexShrink: 0 }}>
                {(comment.profiles?.display_name || comment.profiles?.username || 'U')[0].toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>
                    {comment.profiles?.display_name || comment.profiles?.username || 'Anonymous'}
                  </span>
                  <span style={{ fontSize: 12, color: '#6b6b8a' }}>
                    {new Date(comment.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <div style={{ background: '#111120', border: '1px solid #252540', borderRadius: 8, padding: '12px 16px' }}>
                  <p style={{ fontSize: 14, color: '#c8c8e0', lineHeight: 1.65 }}>{comment.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}