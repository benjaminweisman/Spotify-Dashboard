from fastapi import APIRouter, Depends, HTTPException
from httpx import HTTPStatusError

from middleware.auth_middleware import require_token
from services.spotify_client import get_current_profile

router = APIRouter()


@router.get("/me")
async def me(access_token: str = Depends(require_token)):
    try:
        return await get_current_profile(access_token)
    except HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail="Failed to fetch profile")
