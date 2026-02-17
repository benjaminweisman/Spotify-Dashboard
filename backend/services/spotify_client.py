import httpx

from config import settings

SPOTIFY_ACCOUNTS_URL = "https://accounts.spotify.com"
SPOTIFY_API_URL = "https://api.spotify.com/v1"


async def exchange_code(code: str) -> dict:
    """Exchange authorization code for access and refresh tokens."""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{SPOTIFY_ACCOUNTS_URL}/api/token",
            data={
                "grant_type": "authorization_code",
                "code": code,
                "redirect_uri": settings.spotify_redirect_uri,
                "client_id": settings.spotify_client_id,
                "client_secret": settings.spotify_client_secret,
            },
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )
        response.raise_for_status()
        return response.json()


async def refresh_access_token(refresh_token: str) -> dict:
    """Refresh an expired access token."""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{SPOTIFY_ACCOUNTS_URL}/api/token",
            data={
                "grant_type": "refresh_token",
                "refresh_token": refresh_token,
                "client_id": settings.spotify_client_id,
                "client_secret": settings.spotify_client_secret,
            },
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )
        response.raise_for_status()
        return response.json()


def _auth_headers(access_token: str) -> dict:
    return {"Authorization": f"Bearer {access_token}"}


async def get_current_profile(access_token: str) -> dict:
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{SPOTIFY_API_URL}/me",
            headers=_auth_headers(access_token),
        )
        response.raise_for_status()
        return response.json()


async def get_top_tracks(
    access_token: str, time_range: str = "medium_term", limit: int = 50
) -> dict:
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{SPOTIFY_API_URL}/me/top/tracks",
            params={"time_range": time_range, "limit": limit},
            headers=_auth_headers(access_token),
        )
        response.raise_for_status()
        return response.json()


async def get_top_artists(
    access_token: str, time_range: str = "medium_term", limit: int = 50
) -> dict:
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{SPOTIFY_API_URL}/me/top/artists",
            params={"time_range": time_range, "limit": limit},
            headers=_auth_headers(access_token),
        )
        response.raise_for_status()
        return response.json()


async def get_audio_features(access_token: str, track_ids: list[str]) -> dict | None:
    """Fetch audio features for tracks. Returns None if 403 (restricted endpoint)."""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{SPOTIFY_API_URL}/audio-features",
            params={"ids": ",".join(track_ids)},
            headers=_auth_headers(access_token),
        )
        if response.status_code == 403:
            return None
        response.raise_for_status()
        return response.json()
