"""
Data access functions for members and attendance sessions.
Owned by: Person 5 (backend). Person 4 (tracking) also calls these functions.
"""
from datetime import datetime
from src.database.db import get_connection


def create_member(name: str) -> int:
    conn = get_connection()
    cur = conn.execute("INSERT INTO members (name) VALUES (?)", (name,))
    conn.commit()
    member_id = cur.lastrowid
    conn.close()
    return member_id


def get_member_by_name(name: str):
    conn = get_connection()
    row = conn.execute("SELECT * FROM members WHERE name = ?", (name,)).fetchone()
    conn.close()
    return dict(row) if row else None


def get_all_members():
    conn = get_connection()
    rows = conn.execute("SELECT * FROM members").fetchall()
    conn.close()
    return [dict(r) for r in rows]


def start_session(member_id: int) -> int:
    conn = get_connection()
    cur = conn.execute(
        "INSERT INTO attendance_sessions (member_id, start_time) VALUES (?, ?)",
        (member_id, datetime.now()),
    )
    conn.commit()
    session_id = cur.lastrowid
    conn.close()
    return session_id


def end_session(session_id: int):
    conn = get_connection()
    row = conn.execute(
        "SELECT start_time FROM attendance_sessions WHERE id = ?", (session_id,)
    ).fetchone()
    if row is None:
        conn.close()
        return
    start_time = datetime.fromisoformat(row["start_time"])
    end_time = datetime.now()
    duration = int((end_time - start_time).total_seconds())
    conn.execute(
        "UPDATE attendance_sessions SET end_time = ?, duration_seconds = ? WHERE id = ?",
        (end_time, duration, session_id),
    )
    conn.commit()
    conn.close()


def get_sessions_for_member(member_id: int):
    conn = get_connection()
    rows = conn.execute(
        "SELECT * FROM attendance_sessions WHERE member_id = ? ORDER BY start_time DESC",
        (member_id,),
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]


def get_all_sessions():
    conn = get_connection()
    rows = conn.execute(
        """
        SELECT s.*, m.name as member_name
        FROM attendance_sessions s
        JOIN members m ON s.member_id = m.id
        ORDER BY s.start_time DESC
        """
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]
