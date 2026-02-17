from fastapi import Header, HTTPException


async def require_token(authorization: str = Header(...)) -> str:
    """Extract Bearer token from Authorization header."""
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    return authorization[7:]
