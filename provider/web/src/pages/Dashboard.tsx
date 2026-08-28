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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">OIDC Provider</h2>
          <p className="text-gray-600 mb-4">You are not signed in.</p>
          <div className="space-x-4">
            <Link to="/login" className="text-blue-600 hover:underline">Sign In</Link>
            <Link to="/signup" className="text-blue-600 hover:underline">Sign Up</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">OIDC Provider</h2>
        <p className="text-gray-700 mb-4">
          Signed in as <span className="font-semibold">{session.user.email}</span>
        </p>
        <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto mb-4">
          {JSON.stringify(session, null, 2)}
        </pre>
        <button
          onClick={async () => { await authClient.signOut(); window.location.reload(); }}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
