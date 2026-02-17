from motor.motor_asyncio import AsyncIOMotorClient

from config import settings

client: AsyncIOMotorClient | None = None
db = None


async def connect_db():
    global client, db
    client = AsyncIOMotorClient(settings.mongodb_url)
    db = client[settings.mongodb_db_name]


async def close_db():
    global client
    if client:
        client.close()


def get_db():
    return db
