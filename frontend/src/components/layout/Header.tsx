import { useAuth } from '../../context/AuthContext';

export function Header() {
  const { profile, logout } = useAuth();

  return (
    <header className="header">
      <div className="header-left">
        <h1>Spotify Dashboard</h1>
      </div>
      {profile && (
        <div className="header-right">
          <div className="header-profile">
            {profile.images?.[0] && (
              <img
                src={profile.images[0].url}
                alt={profile.display_name}
                className="header-avatar"
              />
            )}
            <span>{profile.display_name}</span>
          </div>
          <button onClick={logout} className="btn btn-secondary">
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
