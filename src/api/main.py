"""
FastAPI application entrypoint.
Owned by: Person 5
Run with: uvicorn src.api.main:app --reload
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api import routes_members, routes_attendance, routes_analytics
from src.database.db import init_db

app = FastAPI(title="CV Attendance System API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routes_members.router, prefix="/members", tags=["members"])
app.include_router(routes_attendance.router, prefix="/attendance", tags=["attendance"])
app.include_router(routes_analytics.router, prefix="/analytics", tags=["analytics"])


@app.on_event("startup")
def on_startup():
    init_db()


@app.get("/")
def root():
    return {"status": "ok", "message": "CV Attendance API running"}
