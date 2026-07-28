"""
Simple blink-based liveness detection to prevent photo spoofing.
Owned by: Person 3
"""
import cv2
import numpy as np
import mediapipe as mp

mp_face_mesh = mp.solutions.face_mesh

LEFT_EYE = [33, 160, 158, 133, 153, 144]
RIGHT_EYE = [362, 385, 387, 263, 373, 380]


def eye_aspect_ratio(landmarks, eye_points, w, h):
    pts = np.array([(landmarks[i].x * w, landmarks[i].y * h) for i in eye_points])
    vertical1 = np.linalg.norm(pts[1] - pts[5])
    vertical2 = np.linalg.norm(pts[2] - pts[4])
    horizontal = np.linalg.norm(pts[0] - pts[3])
    return (vertical1 + vertical2) / (2.0 * horizontal)


class LivenessDetector:
    def __init__(self, ear_threshold=0.21, consec_frames=2):
        self.face_mesh = mp_face_mesh.FaceMesh(refine_landmarks=True)
        self.ear_threshold = ear_threshold
        self.consec_frames = consec_frames
        self.blink_counter = 0
        self.blinked = False

    def check_liveness(self, frame):
        """Feed consecutive frames; returns True once a blink has been detected."""
        h, w, _ = frame.shape
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.face_mesh.process(rgb)

        if not results.multi_face_landmarks:
            return self.blinked

        landmarks = results.multi_face_landmarks[0].landmark
        left_ear = eye_aspect_ratio(landmarks, LEFT_EYE, w, h)
        right_ear = eye_aspect_ratio(landmarks, RIGHT_EYE, w, h)
        avg_ear = (left_ear + right_ear) / 2.0

        if avg_ear < self.ear_threshold:
            self.blink_counter += 1
        else:
            if self.blink_counter >= self.consec_frames:
                self.blinked = True
            self.blink_counter = 0

        return self.blinked

    def reset(self):
        self.blink_counter = 0
        self.blinked = False
