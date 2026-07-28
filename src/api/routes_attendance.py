"""
Attendance session endpoints. Reads are served here; writes happen via the
vision loop (camera_stream.py -> session_tracker.py) directly to the database.
Owned by: Person 5
"""
from fastapi import APIRouter
from src.database.models import get_all_sessions, get_sessions_for_member, get_member_by_name

router = APIRouter()


@router.get("/")
def all_sessions():
    return get_all_sessions()


@router.get("/{member_name}")
def member_sessions(member_name: str):
    member = get_member_by_name(member_name)
    if not member:
        return []
    return get_sessions_for_member(member["id"])
