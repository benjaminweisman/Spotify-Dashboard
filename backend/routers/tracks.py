from fastapi import APIRouter, Depends, HTTPException, Query
from httpx import HTTPStatusError

from middleware.auth_middleware import require_token
from models.schemas import AudioFeature, AudioFeaturesResponse
from services.spotify_client import get_top_tracks, get_audio_features

router = APIRouter()

FEATURE_KEYS = [
    "danceability", "energy", "valence", "acousticness",
    "instrumentalness", "speechiness", "liveness", "tempo",
]


@router.get("/top")
async def top_tracks(
    time_range: str = Query("medium_term", pattern="^(short_term|medium_term|long_term)$"),
    limit: int = Query(50, ge=1, le=50),
    access_token: str = Depends(require_token),
):
    try:
        return await get_top_tracks(access_token, time_range, limit)
    except HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail="Failed to fetch top tracks")


@router.get("/audio-features", response_model=AudioFeaturesResponse)
async def audio_features(
    ids: str = Query(..., description="Comma-separated track IDs"),
    access_token: str = Depends(require_token),
):
    track_ids = [tid.strip() for tid in ids.split(",") if tid.strip()]
    if not track_ids:
        raise HTTPException(status_code=400, detail="No track IDs provided")

    try:
        result = await get_audio_features(access_token, track_ids)
    except HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail="Failed to fetch audio features")

    if result is None:
        return AudioFeaturesResponse(available=False)

    features = []
    for af in result.get("audio_features", []):
        if af is None:
            features.append(None)
        else:
            features.append(AudioFeature(**{k: af[k] for k in FEATURE_KEYS}))

    valid = [f for f in features if f is not None]
    averages = None
    if valid:
        averages = AudioFeature(
            **{
                k: round(sum(getattr(f, k) for f in valid) / len(valid), 3)
                for k in FEATURE_KEYS
            }
        )

    return AudioFeaturesResponse(available=True, features=features, averages=averages)
