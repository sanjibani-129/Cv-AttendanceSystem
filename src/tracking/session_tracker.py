"""
In-memory session state: tracks who's currently present, closes sessions after timeout.
Owned by: Person 4
"""
import time
from src.config import SESSION_TIMEOUT_SECONDS
from src.database.models import get_member_by_name, create_member, start_session, end_session


class SessionTracker:
    def __init__(self):
        self.active_sessions = {}  # name -> {"session_id": int, "last_seen": float}

    def mark_present(self, name: str):
        now = time.time()
        if name in self.active_sessions:
            self.active_sessions[name]["last_seen"] = now
        else:
            member = get_member_by_name(name)
            member_id = member["id"] if member else create_member(name)
            session_id = start_session(member_id)
            self.active_sessions[name] = {"session_id": session_id, "last_seen": now}
            print(f"Session started for {name}")

    def check_timeouts(self):
        now = time.time()
        expired = []
        for name, info in self.active_sessions.items():
            if now - info["last_seen"] > SESSION_TIMEOUT_SECONDS:
                end_session(info["session_id"])
                expired.append(name)
                print(f"Session closed for {name}")
        for name in expired:
            del self.active_sessions[name]
