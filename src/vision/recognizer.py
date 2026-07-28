"""
Face recognition: compares a live frame's embedding against stored member embeddings.
Owned by: Person 3
"""
import pickle
import numpy as np
from deepface import DeepFace
from src.config import EMBEDDINGS_FILE, EMBEDDING_MODEL, FACE_MATCH_THRESHOLD


def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))


class FaceRecognizer:
    def __init__(self):
        self.known_embeddings = self._load_embeddings()

    def _load_embeddings(self):
        if not EMBEDDINGS_FILE.exists():
            return {}
        with open(EMBEDDINGS_FILE, "rb") as f:
            return pickle.load(f)

    def reload(self):
        """Call this after new members are registered mid-session."""
        self.known_embeddings = self._load_embeddings()

    def identify(self, face_crop):
        """Returns (name, similarity_score) for the best match, or (None, score) if no match."""
        try:
            result = DeepFace.represent(face_crop, model_name=EMBEDDING_MODEL, enforce_detection=True)
            live_embedding = np.array(result[0]["embedding"])
        except Exception:
            return None, 0.0

        best_match, best_score = None, 0.0
        for name, stored_embedding in self.known_embeddings.items():
            score = cosine_similarity(live_embedding, stored_embedding)
            if score > best_score:
                best_match, best_score = name, score

        if best_score >= FACE_MATCH_THRESHOLD:
            return best_match, best_score
        return None, best_score
