'use client';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { logActivity } from '@/lib/logActivity';

export default function DeleteArticleButton({ id, title }: { id: string; title?: string }) {
  const router = useRouter();
  const supabase = createClient();

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this article? This cannot be undone.')) return;
    const { error } = await supabase.from('articles').delete().eq('id', id);
    if (error) {
      alert('Failed to delete: ' + error.message);
    } else {
      await logActivity(
        'article_deleted',
        `Deleted article: "${title || 'Untitled'}"`,
        { articleId: id }
      );
      router.refresh();
    }
  };

  return (
    <button
      onClick={handleDelete}
      style={{ fontSize: 12, color: '#ff6b35', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
    >
      Delete
    </button>
  );
}