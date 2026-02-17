from fastapi import APIRouter, HTTPException
from httpx import HTTPStatusError

from models.schemas import TokenRequest, RefreshRequest, TokenResponse
from services.spotify_client import exchange_code, refresh_access_token

router = APIRouter()


@router.post("/token", response_model=TokenResponse)
async def get_token(body: TokenRequest):
    """Exchange authorization code for access/refresh tokens."""
    try:
        data = await exchange_code(body.code)
    except HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail="Token exchange failed")
    return TokenResponse(
        access_token=data["access_token"],
        refresh_token=data.get("refresh_token"),
        token_type=data["token_type"],
        expires_in=data["expires_in"],
    )


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(body: RefreshRequest):
    """Refresh an expired access token."""
    try:
        data = await refresh_access_token(body.refresh_token)
    except HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail="Token refresh failed")
    return TokenResponse(
        access_token=data["access_token"],
        refresh_token=data.get("refresh_token"),
        token_type=data["token_type"],
        expires_in=data["expires_in"],
    )
