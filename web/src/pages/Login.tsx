import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authClient } from '../lib/auth-client';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const { error } = await authClient.signIn.email({ email, password });
    if (error) {
      setError(error.message ?? 'Login failed');
    } else {
      // Better Auth will resume the OAuth flow on reload
      window.location.reload();
    }
  };

  return (
    <div className="page">
      <h2>Sign In</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Sign In</button>
      </form>
      <p className="center">
        <Link to="/signup">Create account</Link>
      </p>
    </div>
  );
}
