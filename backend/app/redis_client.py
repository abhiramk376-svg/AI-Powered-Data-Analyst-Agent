import json
from typing import Any, Optional

import redis.asyncio as aioredis

from app.config import settings

_redis: Optional[aioredis.Redis] = None


def get_redis() -> aioredis.Redis:
    """Lazily create a single shared Redis client. Works unchanged for
    Redis Cloud: pass a `rediss://` URL (TLS) and redis-py handles the
    TLS handshake automatically — no extra ssl_* kwargs needed for
    Redis Cloud's managed certificates."""
    global _redis
    if _redis is None:
        _redis = aioredis.from_url(
            settings.redis_url,
            decode_responses=True,
            socket_timeout=10,
            socket_connect_timeout=10,
            retry_on_timeout=True,
            health_check_interval=30,
        )
    return _redis


def _session_key(session_id: str) -> str:
    return f"session:{session_id}"


def _history_key(session_id: str) -> str:
    return f"session:{session_id}:history"


async def save_session_state(session_id: str, state: dict[str, Any]) -> None:
    """Persist non-message session state (profile, df paths, cleaning plan, etc.)."""
    r = get_redis()
    await r.set(_session_key(session_id), json.dumps(state), ex=settings.session_ttl_seconds)


async def get_session_state(session_id: str) -> Optional[dict[str, Any]]:
    r = get_redis()
    raw = await r.get(_session_key(session_id))
    return json.loads(raw) if raw else None


async def append_message(session_id: str, role: str, content: str) -> None:
    r = get_redis()
    key = _history_key(session_id)
    await r.rpush(key, json.dumps({"role": role, "content": content}))
    await r.expire(key, settings.session_ttl_seconds)


async def get_history(session_id: str, limit: int = 20) -> list[dict[str, str]]:
    r = get_redis()
    key = _history_key(session_id)
    raw_items = await r.lrange(key, -limit, -1)
    return [json.loads(item) for item in raw_items]


async def delete_session(session_id: str) -> None:
    r = get_redis()
    await r.delete(_session_key(session_id), _history_key(session_id))
