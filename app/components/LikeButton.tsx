'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LikeButton({ articleId }: { articleId: string }) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      // Get like count
      const { count } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('article_id', articleId);
      setCount(count || 0);

      // Check if user liked it
      if (user) {
        const { data } = await supabase
          .from('likes')
          .select('id')
          .eq('article_id', articleId)
          .eq('user_id', user.id)
          .single();
        setLiked(!!data);
      }
    };
    fetchData();
  }, [articleId, supabase]);

  const handleLike = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (loading) return;
    setLoading(true);

    // Optimistic update
    setLiked(!liked);
    setCount(liked ? count - 1 : count + 1);

    if (liked) {
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('article_id', articleId)
        .eq('user_id', user.id);
      if (error) {
        setLiked(true);
        setCount(count);
      }
    } else {
      const { error } = await supabase
        .from('likes')
        .insert({ article_id: articleId, user_id: user.id });
      if (error) {
        setLiked(false);
        setCount(count);
      }
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 20px',
        borderRadius: 8,
        border: '1px solid',
        borderColor: liked ? 'rgba(255,107,53,.5)' : '#252540',
        background: liked ? 'rgba(255,107,53,.1)' : 'transparent',
        color: liked ? '#ff6b35' : '#6b6b8a',
        fontSize: 14,
        fontFamily: 'Rajdhani, sans-serif',
        fontWeight: 700,
        cursor: loading ? 'not-allowed' : 'pointer',
        transition: 'all .2s',
        letterSpacing: '.04em',
      }}
      onMouseEnter={e => {
        if (!liked) {
          (e.target as HTMLButtonElement).style.borderColor = 'rgba(255,107,53,.4)';
          (e.target as HTMLButtonElement).style.color = '#ff6b35';
        }
      }}
      onMouseLeave={e => {
        if (!liked) {
          (e.target as HTMLButtonElement).style.borderColor = '#252540';
          (e.target as HTMLButtonElement).style.color = '#6b6b8a';
        }
      }}
    >
      <span style={{ fontSize: 18, lineHeight: 1 }}>{liked ? '❤️' : '🤍'}</span>
      <span>{count} {count === 1 ? 'Like' : 'Likes'}</span>
    </button>
  );
}