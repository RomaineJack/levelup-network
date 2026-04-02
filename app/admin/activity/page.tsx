'use client';
import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Activity {
  id: string;
  action: string;
  description: string;
  created_at: string;
  metadata: any;
  profiles: { username: string; display_name: string | null } | null;
}

const ACTION_ICONS: Record<string, string> = {
  article_published: '📰',
  article_updated: '✏️',
  article_deleted: '🗑️',
  comment_posted: '💬',
  comment_deleted: '🗑️',
  user_role_changed: '👥',
  user_joined: '🎮',
};

const ACTION_COLORS: Record<string, string> = {
  article_published: '#00ff88',
  article_updated: '#00e5ff',
  article_deleted: '#ff6b35',
  comment_posted: '#00e5ff',
  comment_deleted: '#ffcc00',
  user_role_changed: '#ff00aa',
  user_joined: '#00ff88',
};

export default function ActivityPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const supabase = createClient();

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from('activity_log')
      .select(`id, action, description, created_at, metadata, profiles(username, display_name)`)
      .order('created_at', { ascending: false })
      .limit(100);

    if (filter !== 'all') {
      query = query.eq('action', filter);
    }

    const { data } = await query;
    setActivities((data || []) as unknown as Activity[]);
    setLoading(false);
  }, [filter, supabase]);

  useEffect(() => { fetchActivities(); }, [fetchActivities]);

  const filters = [
    { value: 'all', label: 'All Activity' },
    { value: 'article_published', label: '📰 Published' },
    { value: 'article_updated', label: '✏️ Updated' },
    { value: 'article_deleted', label: '🗑️ Deleted' },
    { value: 'comment_deleted', label: '💬 Comments' },
    { value: 'user_role_changed', label: '👥 Roles' },
    { value: 'user_joined', label: '🎮 New Users' },
  ];

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 className="font-display" style={{ fontSize: 32, fontWeight: 700, color: '#fff', letterSpacing: '.04em' }}>
          ACTIVITY LOG
        </h1>
        <p style={{ color: '#6b6b8a', fontSize: 14, marginTop: 4 }}>
          Every update and change on LevelUp Network
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {filters.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            style={{ padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700, fontFamily: 'Rajdhani, sans-serif', cursor: 'pointer', border: '1px solid', borderColor: filter === value ? '#00ff88' : '#252540', background: filter === value ? '#00ff88' : 'transparent', color: filter === value ? '#05050a' : '#6b6b8a' }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Activity Feed */}
      {loading ? (
        <p style={{ color: '#6b6b8a', textAlign: 'center', padding: '60px 0' }}>Loading activity...</p>
      ) : activities.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: '#6b6b8a' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
          <p style={{ fontSize: 18 }}>No activity yet</p>
          <p style={{ fontSize: 14, marginTop: 8 }}>Actions will appear here as you use the site</p>
        </div>
      ) : (
        <div style={{ position: 'relative' }}>
          {/* Timeline line */}
          <div style={{ position: 'absolute', left: 19, top: 0, bottom: 0, width: 1, background: '#252540' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {activities.map((activity, index) => {
              const icon = ACTION_ICONS[activity.action] || '📌';
              const color = ACTION_COLORS[activity.action] || '#6b6b8a';
              const isLast = index === activities.length - 1;

              return (
                <div key={activity.id} style={{ display: 'flex', gap: 16, paddingBottom: isLast ? 0 : 20 }}>
                  {/* Icon */}
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: `${color}15`, border: `1px solid ${color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0, position: 'relative', zIndex: 1 }}>
                    {icon}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, background: '#111120', border: '1px solid #252540', borderRadius: 10, padding: '12px 16px', marginTop: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', gap: 12, marginBottom: 6 }}>
                      <p style={{ fontSize: 14, color: '#fff', lineHeight: 1.5 }}>
                        {activity.description}
                      </p>
                      <span style={{ fontSize: 11, color: '#6b6b8a', flexShrink: 0, fontFamily: 'monospace' }}>
                        {formatTime(activity.created_at)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, fontFamily: 'monospace', padding: '2px 8px', borderRadius: 4, background: `${color}15`, color }}>
                        {activity.action.replace(/_/g, ' ')}
                      </span>
                      {activity.profiles && (
                        <span style={{ fontSize: 11, color: '#6b6b8a' }}>
                          by @{activity.profiles.username}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}