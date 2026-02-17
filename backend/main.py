from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from routers import auth, tracks, artists, profile

app = FastAPI(title="Spotify Dashboard API")

origins = [settings.frontend_url]
if settings.allowed_origins:
    origins.extend(o.strip() for o in settings.allowed_origins.split(",") if o.strip())

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(tracks.router, prefix="/api/tracks", tags=["tracks"])
app.include_router(artists.router, prefix="/api/artists", tags=["artists"])
app.include_router(profile.router, prefix="/api/profile", tags=["profile"])


@app.get("/api/health")
async def health():
    return {"status": "ok"}
