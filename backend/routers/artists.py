from fastapi import APIRouter, Depends, HTTPException, Query
from httpx import HTTPStatusError

from middleware.auth_middleware import require_token
from services.spotify_client import get_top_artists, get_artists_by_ids

router = APIRouter()


@router.get("/details")
async def artist_details(
    ids: str = Query(..., description="Comma-separated artist IDs"),
    access_token: str = Depends(require_token),
):
    artist_ids = [aid.strip() for aid in ids.split(",") if aid.strip()]
    if not artist_ids:
        raise HTTPException(status_code=400, detail="No artist IDs provided")
    try:
        return await get_artists_by_ids(access_token, artist_ids)
    except HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail="Failed to fetch artist details")


@router.get("/top")
async def top_artists(
    time_range: str = Query("medium_term", pattern="^(short_term|medium_term|long_term)$"),
    limit: int = Query(50, ge=1, le=50),
    access_token: str = Depends(require_token),
):
    try:
        return await get_top_artists(access_token, time_range, limit)
    except HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail="Failed to fetch top artists")
