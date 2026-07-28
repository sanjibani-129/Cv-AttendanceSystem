"""
Member registration and listing endpoints.
Owned by: Person 5
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from src.database.models import create_member, get_all_members, get_member_by_name

router = APIRouter()


class MemberCreate(BaseModel):
    name: str


@router.post("/")
def register_member(payload: MemberCreate):
    existing = get_member_by_name(payload.name)
    if existing:
        raise HTTPException(status_code=400, detail="Member already exists")
    member_id = create_member(payload.name)
    return {"id": member_id, "name": payload.name}


@router.get("/")
def list_members():
    return get_all_members()
