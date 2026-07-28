"""
Lighting normalization via histogram equalization.
Owned by: Person 3
"""
import cv2


def normalize_lighting(frame):
    """Applies histogram equalization on the luminance channel to normalize lighting."""
    ycrcb = cv2.cvtColor(frame, cv2.COLOR_BGR2YCrCb)
    y, cr, cb = cv2.split(ycrcb)
    y_eq = cv2.equalizeHist(y)
    merged = cv2.merge((y_eq, cr, cb))
    return cv2.cvtColor(merged, cv2.COLOR_YCrCb2BGR)
