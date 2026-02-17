from pydantic import BaseModel


class TokenRequest(BaseModel):
    code: str


class RefreshRequest(BaseModel):
    refresh_token: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str | None = None
    token_type: str
    expires_in: int


class AudioFeature(BaseModel):
    danceability: float
    energy: float
    valence: float
    acousticness: float
    instrumentalness: float
    speechiness: float
    liveness: float
    tempo: float


class AudioFeaturesResponse(BaseModel):
    available: bool
    features: list[AudioFeature | None] = []
    averages: AudioFeature | None = None
