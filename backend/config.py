from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    spotify_client_id: str
    spotify_client_secret: str
    spotify_redirect_uri: str = "http://localhost:5173/callback"
    mongodb_url: str = "mongodb://localhost:27017"
    mongodb_db_name: str = "spotify_dashboard"
    frontend_url: str = "http://localhost:5173"

    model_config = {"env_file": ".env"}


settings = Settings()
