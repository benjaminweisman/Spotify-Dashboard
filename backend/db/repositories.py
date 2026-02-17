from datetime import datetime, timezone

from models.database import get_db


async def save_listening_snapshot(user_id: str, time_range: str, data: dict):
    """Save a snapshot of user's top tracks/artists for historical tracking."""
    db = get_db()
    if db is None:
        return None

    snapshot = {
        "user_id": user_id,
        "time_range": time_range,
        "data": data,
        "created_at": datetime.now(timezone.utc),
    }
    result = await db.listening_snapshots.insert_one(snapshot)
    return str(result.inserted_id)


async def get_listening_snapshots(user_id: str, time_range: str, limit: int = 10):
    """Get recent listening snapshots for a user."""
    db = get_db()
    if db is None:
        return []

    cursor = (
        db.listening_snapshots.find(
            {"user_id": user_id, "time_range": time_range}
        )
        .sort("created_at", -1)
        .limit(limit)
    )
    return await cursor.to_list(length=limit)
