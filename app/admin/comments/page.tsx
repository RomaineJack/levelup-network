'use client';
import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { logActivity } from '@/lib/logActivity';

interface Comment {
  id: string;
  content: string;
  status: string;
  created_at: string;
  article_id: string;
  profiles: { username: string; display_name: string | null } | null;
  articles: { title: string; slug: string } | null;
}

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const supabase = createClient();

  const fetchComments = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from('comments')
      .select(`id, content, status, created_at, article_id, profiles(username, display_name), articles(title, slug)`)
      .order('created_at', { ascending: false })
      .limit(50);

    if (filter !== 'all') query = query.eq('status', filter);

    const { data } = await query;
    setComments((data || []) as unknown as Comment[]);
    setLoading(false);
  }, [filter, supabase]);

  useEffect(() => { fetchComments(); }, [fetchComments]);

  const deleteComment = async (id: string, articleTitle?: string) => {
    if (!confirm('Delete this comment permanently?')) return;
    const { error } = await supabase.from('comments').delete().eq('id', id);
    if (error) {
      alert('Failed to delete comment');
    } else {
      await logActivity('comment_deleted', `Deleted a comment on "${articleTitle || 'an article'}"`);
      setComments(prev => prev.filter(c => c.id !== id));
    }
  };

  const filters = ['all', 'approved', 'pending'];

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 className="font-display" style={{ fontSize: 32, fontWeight: 700, color: '#fff', letterSpacing: '.04em' }}>COMMENTS</h1>
        <p style={{ color: '#6b6b8a', fontSize: 14, marginTop: 4 }}>Manage and delete user comments</p>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{ padding: '6px 16px', borderRadius: 20, fontSize: 12, fontWeight: 700, fontFamily: 'Rajdhani, sans-serif', cursor: 'pointer', border: '1px solid', borderColor: filter === f ? '#00ff88' : '#252540', background: filter === f ? '#00ff88' : 'transparent', color: filter === f ? '#05050a' : '#6b6b8a' }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: '#6b6b8a' }}>Loading comments...</p>
      ) : comments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#6b6b8a' }}>
          <p>No comments found</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {comments.map(comment => (
            <div key={comment.id} style={{ background: '#111120', border: '1px solid #252540', borderRadius: 10, padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#00e5ff' }}>
                      @{comment.profiles?.username}
                    </span>
                    <span style={{ fontSize: 12, color: '#6b6b8a' }}>on</span>
                    <span style={{ fontSize: 12, color: '#00ff88' }}>
                      {comment.articles?.title}
                    </span>
                    <span style={{ fontSize: 11, color: '#6b6b8a' }}>
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                    <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, fontFamily: 'monospace', background: comment.status === 'approved' ? 'rgba(0,255,136,.12)' : 'rgba(255,204,0,.12)', color: comment.status === 'approved' ? '#00ff88' : '#ffcc00' }}>
                      {comment.status}
                    </span>
                  </div>
                  <p style={{ fontSize: 14, color: '#c8c8e0', lineHeight: 1.65 }}>{comment.content}</p>
                </div>
                <button
                  onClick={() => deleteComment(comment.id, comment.articles?.title)}
                  style={{ padding: '6px 14px', background: 'rgba(255,107,53,.1)', border: '1px solid rgba(255,107,53,.3)', color: '#ff6b35', borderRadius: 6, fontSize: 12, fontWeight: 700, fontFamily: 'Rajdhani, sans-serif', cursor: 'pointer', flexShrink: 0 }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}