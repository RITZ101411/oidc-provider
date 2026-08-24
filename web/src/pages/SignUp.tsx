import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authClient } from '../lib/auth-client';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const { error } = await authClient.signUp.email({ name, email, password });
    if (error) {
      setError(error.message ?? 'Sign up failed');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="page">
      <h2>Create Account</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required autoFocus />
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
        <button type="submit">Sign Up</button>
      </form>
      <p className="center">
        <Link to="/login">Already have an account?</Link>
      </p>
    </div>
  );
}
