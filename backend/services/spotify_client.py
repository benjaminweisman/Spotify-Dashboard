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
        data = response.json()

        # Enrich with full track details (popularity, etc.) if missing
        items = data.get("items", [])
        if items and "popularity" not in items[0]:
            track_ids = [t["id"] for t in items if t.get("id")]
            details = await _get_several_tracks(client, access_token, track_ids)
            detail_map = {t["id"]: t for t in details}
            for item in items:
                full = detail_map.get(item["id"], {})
                if "popularity" in full:
                    item["popularity"] = full["popularity"]

        return data


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
        data = response.json()

        # Enrich with full artist details (genres, etc.) if missing
        items = data.get("items", [])
        if items and "genres" not in items[0]:
            artist_ids = [a["id"] for a in items if a.get("id")]
            details = await _get_several_artists(client, access_token, artist_ids)
            detail_map = {a["id"]: a for a in details}
            for item in items:
                full = detail_map.get(item["id"], {})
                if "genres" in full:
                    item["genres"] = full["genres"]
                if "popularity" in full:
                    item["popularity"] = full["popularity"]
                if "images" not in item and "images" in full:
                    item["images"] = full["images"]

        return data


async def _get_several_tracks(
    client: httpx.AsyncClient, access_token: str, track_ids: list[str]
) -> list[dict]:
    """Fetch full track objects by IDs (max 50 per request)."""
    results = []
    for i in range(0, len(track_ids), 50):
        batch = track_ids[i : i + 50]
        response = await client.get(
            f"{SPOTIFY_API_URL}/tracks",
            params={"ids": ",".join(batch)},
            headers=_auth_headers(access_token),
        )
        if response.status_code == 200:
            results.extend(response.json().get("tracks", []))
    return [t for t in results if t is not None]


async def _get_several_artists(
    client: httpx.AsyncClient, access_token: str, artist_ids: list[str]
) -> list[dict]:
    """Fetch full artist objects by IDs (max 50 per request)."""
    results = []
    for i in range(0, len(artist_ids), 50):
        batch = artist_ids[i : i + 50]
        response = await client.get(
            f"{SPOTIFY_API_URL}/artists",
            params={"ids": ",".join(batch)},
            headers=_auth_headers(access_token),
        )
        if response.status_code == 200:
            results.extend(response.json().get("artists", []))
    return [a for a in results if a is not None]


async def get_tracks_by_ids(access_token: str, track_ids: list[str]) -> dict:
    """Fetch full track objects by IDs."""
    async with httpx.AsyncClient() as client:
        tracks = await _get_several_tracks(client, access_token, track_ids)
        return {"tracks": tracks}


async def get_artists_by_ids(access_token: str, artist_ids: list[str]) -> dict:
    """Fetch full artist objects by IDs."""
    async with httpx.AsyncClient() as client:
        artists = await _get_several_artists(client, access_token, artist_ids)
        return {"artists": artists}


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
