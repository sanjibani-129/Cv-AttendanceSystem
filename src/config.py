"""
Central configuration for the CV Attendance System.
Change values here, not scattered across files.
Owned by: everyone reads this, nobody edits it without telling the group.
"""
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# Database
DB_PATH = BASE_DIR / "data" / "attendance.db"

# Face recognition
FACE_MATCH_THRESHOLD = 0.6          # cosine similarity threshold for a "match"
EMBEDDING_MODEL = "ArcFace"         # DeepFace model name
ENROLLMENT_FRAME_COUNT = 8          # frames captured per member during registration

# Session tracking
SESSION_TIMEOUT_SECONDS = 300       # 5 minutes - close session if not seen again within this window

# Vision pipeline performance
FRAME_SKIP = 5                      # process every Nth frame to reduce CPU load

# Paths
KNOWN_FACES_DIR = BASE_DIR / "data" / "known_faces"
EMBEDDINGS_FILE = BASE_DIR / "data" / "embeddings.pkl"

# API
API_HOST = "0.0.0.0"
API_PORT = 8000
SECRET_KEY = os.getenv("SECRET_KEY", "change-this-in-production")
