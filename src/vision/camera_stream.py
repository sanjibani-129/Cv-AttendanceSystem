"""
Main webcam capture loop - wires detection + recognition + liveness + tracking together.
Owned by: Person 3 (loop), integrates with Person 4's tracker.
"""
import cv2
from src.config import FRAME_SKIP
from src.vision.detector import FaceDetector
from src.vision.recognizer import FaceRecognizer
from src.vision.liveness import LivenessDetector
from src.vision.preprocess import normalize_lighting
from src.tracking.session_tracker import SessionTracker


def run_camera_loop():
    cap = cv2.VideoCapture(0)
    detector = FaceDetector()
    recognizer = FaceRecognizer()
    liveness = LivenessDetector()
    tracker = SessionTracker()

    frame_count = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        frame_count += 1
        if frame_count % FRAME_SKIP != 0:
            cv2.imshow("Attendance", frame)
            if cv2.waitKey(1) & 0xFF == ord("q"):
                break
            continue

        frame = normalize_lighting(frame)
        boxes = detector.detect(frame)

        for box in boxes:
            x, y, w, h = box
            face_crop = detector.crop_face(frame, box)
            name, score = recognizer.identify(face_crop)

            is_live = liveness.check_liveness(frame)
            label = f"{name} ({score:.2f})" if name else "Unknown"

            if name and is_live:
                tracker.mark_present(name)
                color = (0, 255, 0)
            elif name and not is_live:
                label += " - verify liveness"
                color = (0, 165, 255)
            else:
                color = (0, 0, 255)

            cv2.rectangle(frame, (x, y), (x + w, y + h), color, 2)
            cv2.putText(frame, label, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)

        tracker.check_timeouts()
        cv2.imshow("Attendance", frame)
        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    run_camera_loop()
