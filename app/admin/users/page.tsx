'use client';
import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  role: string;
  created_at: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);
  const supabase = createClient();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from('profiles')
      .select('id, username, display_name, role, created_at')
      .order('created_at', { ascending: false })
      .limit(100);

    if (search) {
      query = query.or(`username.ilike.%${search}%,display_name.ilike.%${search}%`);
    }

    const { data } = await query;
    setUsers((data || []) as Profile[]);
    setLoading(false);
  }, [search, supabase]);

  useEffect(() => {
    const timeout = setTimeout(fetchUsers, 300);
    return () => clearTimeout(timeout);
  }, [fetchUsers]);

  const updateRole = async (userId: string, role: string) => {
    setUpdating(userId);
    const { error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId);

    if (error) {
      alert('Failed to update role');
    } else {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
    }
    setUpdating(null);
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 className="font-display" style={{ fontSize: 32, fontWeight: 700, color: '#fff', letterSpacing: '.04em' }}>USERS</h1>
        <p style={{ color: '#6b6b8a', fontSize: 14, marginTop: 4 }}>Manage member roles and permissions</p>
      </div>

      {/* Role legend */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        {[
          { role: 'admin', color: '#ff00aa', desc: 'Full access to everything' },
          { role: 'editor', color: '#00e5ff', desc: 'Can publish articles' },
          { role: 'reader', color: '#6b6b8a', desc: 'Can read and comment' },
        ].map(({ role, color, desc }) => (
          <div key={role} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#111120', border: '1px solid #252540', borderRadius: 8, padding: '8px 14px' }}>
            <span style={{ fontSize: 11, fontWeight: 700, fontFamily: 'monospace', color }}>{role}</span>
            <span style={{ fontSize: 12, color: '#6b6b8a' }}>— {desc}</span>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ position: 'relative', maxWidth: 320, marginBottom: 20 }}>
        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#6b6b8a' }}>🔍</span>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search users..."
          style={{ width: '100%', background: '#111120', border: '1px solid #252540', borderRadius: 8, padding: '10px 12px 10px 36px', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
        />
      </div>

      {/* Users Table */}
      <div style={{ background: '#111120', border: '1px solid #252540', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#1a1a2e' }}>
              {['User', 'Username', 'Joined', 'Role', 'Change Role'].map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#6b6b8a', borderBottom: '1px solid #252540' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ padding: 32, textAlign: 'center', color: '#6b6b8a' }}>Loading...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: 32, textAlign: 'center', color: '#6b6b8a' }}>No users found</td></tr>
            ) : (
              users.map(user => (
                <tr key={user.id} style={{ borderBottom: '1px solid #252540' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(0,255,136,.1)', border: '1px solid rgba(0,255,136,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#00ff88', fontFamily: 'Rajdhani, sans-serif', flexShrink: 0 }}>
                        {(user.display_name || user.username)[0].toUpperCase()}
                      </div>
                      <span style={{ fontSize: 14, color: '#fff', fontWeight: 500 }}>{user.display_name || user.username}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: '#6b6b8a', fontFamily: 'monospace' }}>@{user.username}</td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: '#6b6b8a' }}>
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 4, fontFamily: 'monospace', background: user.role === 'admin' ? 'rgba(255,0,170,.12)' : user.role === 'editor' ? 'rgba(0,229,255,.12)' : 'rgba(107,107,138,.2)', color: user.role === 'admin' ? '#ff00aa' : user.role === 'editor' ? '#00e5ff' : '#6b6b8a' }}>
                      {user.role}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <select
                      value={user.role}
                      onChange={e => updateRole(user.id, e.target.value)}
                      disabled={updating === user.id}
                      style={{ background: '#0a0a12', border: '1px solid #252540', borderRadius: 6, padding: '6px 10px', color: '#fff', fontSize: 12, outline: 'none', cursor: 'pointer', opacity: updating === user.id ? 0.5 : 1 }}
                    >
                      <option value="reader">reader</option>
                      <option value="editor">editor</option>
                      <option value="admin">admin</option>
                    </select>
                    {updating === user.id && <span style={{ fontSize: 11, color: '#6b6b8a', marginLeft: 8 }}>Saving...</span>}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}