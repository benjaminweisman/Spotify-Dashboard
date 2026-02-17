from fastapi import APIRouter, Depends, HTTPException, Query
from httpx import HTTPStatusError

from middleware.auth_middleware import require_token
from services.spotify_client import get_top_artists

router = APIRouter()


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
