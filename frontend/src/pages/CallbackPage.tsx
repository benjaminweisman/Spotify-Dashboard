import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { exchangeToken } from '../api/spotify';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export function CallbackPage() {
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get('code');
    const spotifyError = searchParams.get('error');

    if (spotifyError) {
      setError(`Spotify authorization failed: ${spotifyError}`);
      return;
    }

    if (!code) {
      setError('No authorization code received');
      return;
    }

    exchangeToken(code)
      .then((data) => {
        localStorage.setItem('access_token', data.access_token);
        if (data.refresh_token) {
          localStorage.setItem('refresh_token', data.refresh_token);
        }
        window.location.replace('/dashboard');
      })
      .catch(() => {
        setError('Failed to exchange authorization code');
      });
  }, [searchParams]);

  if (error) {
    return (
      <div className="login-page">
        <div className="login-card">
          <h2>Authentication Error</h2>
          <p>{error}</p>
          <button onClick={() => window.location.replace('/')} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return <LoadingSpinner message="Logging you in..." />;
}
