import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export function LoginPage() {
  const { isAuthenticated, loading, login } = useAuth();

  if (loading) return null;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Spotify Dashboard</h1>
        <p>Discover your listening profile, audio fingerprint, and taste evolution.</p>
        <button onClick={login} className="btn btn-spotify">
          Login with Spotify
        </button>
      </div>
    </div>
  );
}
