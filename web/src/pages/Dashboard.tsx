import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { authClient } from '../lib/auth-client';

export default function Dashboard() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authClient.getSession().then(({ data }) => {
      setSession(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <p className="page">Loading...</p>;

  if (!session) {
    return (
      <div className="page">
        <h2>OIDC Provider</h2>
        <p>You are not signed in.</p>
        <Link to="/login">Sign In</Link> | <Link to="/signup">Sign Up</Link>
      </div>
    );
  }

  return (
    <div className="page">
      <h2>OIDC Provider</h2>
      <p>Signed in as <strong>{session.user.email}</strong></p>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <button onClick={async () => { await authClient.signOut(); window.location.reload(); }}>
        Sign Out
      </button>
    </div>
  );
}
