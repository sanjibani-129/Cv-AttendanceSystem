"""
Member enrollment: capture frames from webcam, generate averaged face embedding.
Owned by: Person 2
"""
import pickle
import cv2
import numpy as np
from deepface import DeepFace
from src.config import ENROLLMENT_FRAME_COUNT, EMBEDDING_MODEL, EMBEDDINGS_FILE, KNOWN_FACES_DIR
from src.database.models import create_member


def capture_frames(name: str, count: int = ENROLLMENT_FRAME_COUNT):
    """Opens the webcam and captures `count` frames on keypress 'c'."""
    KNOWN_FACES_DIR.mkdir(parents=True, exist_ok=True)
    person_dir = KNOWN_FACES_DIR / name
    person_dir.mkdir(exist_ok=True)

    cap = cv2.VideoCapture(0)
    captured = 0
    frames = []

    print(f"Registering '{name}'. Press 'c' to capture a frame, 'q' to quit early.")
    while captured < count:
        ret, frame = cap.read()
        if not ret:
            break
        cv2.putText(
            frame, f"Captured: {captured}/{count} - press 'c'", (10, 30),
            cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2,
        )
        cv2.imshow("Enrollment", frame)

        key = cv2.waitKey(1) & 0xFF
        if key == ord("c"):
            frames.append(frame.copy())
            cv2.imwrite(str(person_dir / f"{captured}.jpg"), frame)
            captured += 1
        elif key == ord("q"):
            break

    cap.release()
    cv2.destroyAllWindows()
    return frames


def generate_master_embedding(frames):
    """Runs each frame through DeepFace, averages the embeddings into one vector."""
    embeddings = []
    for frame in frames:
        try:
            result = DeepFace.represent(frame, model_name=EMBEDDING_MODEL, enforce_detection=True)
            embeddings.append(np.array(result[0]["embedding"]))
        except Exception as e:
            print("Skipped a frame (no face detected):", e)

    if not embeddings:
        raise ValueError("No valid face embeddings generated. Try again with better lighting.")

    return np.mean(embeddings, axis=0)


def save_embedding(name: str, embedding: np.ndarray):
    """Appends this member's embedding to the shared embeddings store."""
    if EMBEDDINGS_FILE.exists():
        with open(EMBEDDINGS_FILE, "rb") as f:
            store = pickle.load(f)
    else:
        store = {}

    store[name] = embedding
    with open(EMBEDDINGS_FILE, "wb") as f:
        pickle.dump(store, f)


def register_new_member(name: str):
    """Full enrollment flow: capture -> embed -> save -> add to database."""
    frames = capture_frames(name)
    if not frames:
        print("No frames captured. Aborting.")
        return
    embedding = generate_master_embedding(frames)
    save_embedding(name, embedding)
    create_member(name)
    print(f"'{name}' registered successfully with {len(frames)} frames.")


if __name__ == "__main__":
    member_name = input("Enter new member's name: ")
    register_new_member(member_name)
