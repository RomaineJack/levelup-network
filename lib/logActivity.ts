import { createClient } from '@/lib/supabase/client';

export async function logActivity(
  action: string,
  description: string,
  metadata?: Record<string, unknown>
) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  await supabase.from('activity_log').insert({
    action,
    description,
    user_id: user?.id || null,
    metadata: metadata || null,
  });
}