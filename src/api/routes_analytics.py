"""
Aggregate analytics: total hours per member, leaderboard.
Owned by: Person 5
"""
from collections import defaultdict
from fastapi import APIRouter
from src.database.models import get_all_sessions

router = APIRouter()


@router.get("/summary")
def summary():
    sessions = get_all_sessions()
    totals = defaultdict(int)
    for s in sessions:
        if s["duration_seconds"]:
            totals[s["member_name"]] += s["duration_seconds"]

    leaderboard = sorted(
        [{"name": name, "total_seconds": secs} for name, secs in totals.items()],
        key=lambda x: x["total_seconds"],
        reverse=True,
    )
    return {"leaderboard": leaderboard}
