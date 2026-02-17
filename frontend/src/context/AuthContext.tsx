import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { fetchProfile } from '../api/spotify';
import type { SpotifyProfile } from '../types/spotify';

interface AuthState {
  isAuthenticated: boolean;
  profile: SpotifyProfile | null;
  loading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

const SCOPES = 'user-read-private user-read-email user-top-read';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<SpotifyProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      fetchProfile()
        .then(setProfile)
        .catch(() => {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = () => {
    const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    const redirectUri = encodeURIComponent(window.location.origin + '/callback');
    const scope = encodeURIComponent(SCOPES);
    window.location.href =
      `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${scope}&redirect_uri=${redirectUri}`;
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!profile,
        profile,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
