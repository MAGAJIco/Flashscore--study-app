from fastapi import APIRouter, Request, HTTPException, Depends
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from motor.motor_asyncio import AsyncIOMotorClient
import os

router = APIRouter(prefix="/api/analytics", tags=["analytics"])

MONGO_URI = os.getenv("MONGODB_URI") or os.getenv("DATABASE_URL") or "mongodb://localhost:27017"
DB_NAME = os.getenv("MONGO_DB_NAME", "sports_central")

# simple API key guard for these endpoints
ANALYTICS_API_KEY = os.getenv("ANALYTICS_API_KEY", None)

def get_db_client() -> AsyncIOMotorClient:
    return AsyncIOMotorClient(MONGO_URI)

class InstallRecord(BaseModel):
    installedAt: Optional[datetime]
    userAgent: Optional[str]
    platform: Optional[str]
    clientId: Optional[str]
    extra: Optional[dict] = None

async def require_api_key(request: Request):
    if not ANALYTICS_API_KEY:
        return True
    key = request.headers.get("x-analytics-key") or (await request.json()).get("apiKey", None)
    if key != ANALYTICS_API_KEY:
        raise HTTPException(status_code=403, detail="Forbidden")
    return True

@router.post("/install", status_code=201)
async def record_install(payload: InstallRecord, request: Request, _=Depends(require_api_key)):
    client = get_db_client()
    db = client[DB_NAME]
    coll = db["pwa_installs"]
    installed_at = payload.installedAt or datetime.utcnow()
    doc = {
        "installedAt": installed_at,
        "userAgent": payload.userAgent,
        "platform": payload.platform,
        "clientId": payload.clientId,
        "extra": payload.extra or {},
        "createdAt": datetime.utcnow()
    }
    res = await coll.insert_one(doc)
    return {"success": True, "id": str(res.inserted_id)}

@router.get("/first-installed")
async def get_first_installed(request: Request, _=Depends(require_api_key)):
    client = get_db_client()
    db = client[DB_NAME]
    coll = db["pwa_installs"]
    doc = await coll.find().sort([("installedAt", 1), ("createdAt", 1)]).limit(1).to_list(length=1)
    if not doc:
        return {"success": False, "message": "No installs found"}
    first = doc[0]
    first["id"] = str(first.get("_id"))
    first.pop("_id", None)
    for k in ("installedAt", "createdAt"):
        if first.get(k) and hasattr(first[k], "isoformat"):
            first[k] = first[k].isoformat()
    return {"success": True, "firstInstalled": first}