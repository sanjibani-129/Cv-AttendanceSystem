# CV Attendance System

Computer vision-based attendance tracking using a laptop webcam.
MediaPipe for detection, DeepFace/ArcFace for recognition, FastAPI backend,
SQLite database, Streamlit dashboard.

## Setup
```
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m src.database.db          # initialize the database
```

## Run
```
# Terminal 1 - API
uvicorn src.api.main:app --reload

# Terminal 2 - Dashboard
streamlit run dashboard/app.py

# Terminal 3 - Register a member
python -m src.enrollment.register_member

# Terminal 4 - Start live recognition
python -m src.vision.camera_stream
```

See `docs/API_CONTRACT.md` and `docs/SETUP.md` for details.
