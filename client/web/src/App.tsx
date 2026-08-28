import { useEffect, useState } from 'react';

const API = 'http://localhost:8080';

type User = { sub: string; email?: string; name?: string };

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/me`, { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => {
        setUser(data.user);
        setLoading(false);
      });
  }, []);

  const handleLogout = async () => {
    await fetch(`${API}/logout`, { method: 'POST', credentials: 'include' });
    setUser(null);
  };

  if (loading) return <p>Loading...</p>;

  if (!user) {
    return (
      <div style={{ maxWidth: 400, margin: '80px auto', fontFamily: 'system-ui', textAlign: 'center' }}>
        <h1>Client App</h1>
        <p>OIDC Provider でログインしてください</p>
        <a href={`${API}/login`}>
          <button style={{ padding: '12px 24px', fontSize: 16, cursor: 'pointer' }}>
            ログイン
          </button>
        </a>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', fontFamily: 'system-ui' }}>
      <h1>Client App</h1>
      <p>ログイン済み ✓</p>
      <pre style={{ background: '#f5f5f5', padding: 16, borderRadius: 8 }}>
        {JSON.stringify(user, null, 2)}
      </pre>
      <button onClick={handleLogout} style={{ padding: '8px 16px', cursor: 'pointer' }}>
        ログアウト
      </button>
    </div>
  );
}
