import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password) {
      setError('Please fill in all fields');
      return;
    }
    const ok = await login(username.trim(), password);
    if (!ok) {
      setError('Invalid username or password');
      return;
    }
    navigate('/', { replace: true });
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">todos</h1>
        <h2 className="auth-heading">Sign in</h2>
        <form onSubmit={handleSubmit}>
          <input
            className="auth-input"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
          />
          <input
            className="auth-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="auth-error">{error}</p>}
          <button className="auth-btn" type="submit">Sign in</button>
        </form>
        <p className="auth-link">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
