"""
Small time formatting helpers shared across backend and dashboard.
"""


def seconds_to_hms(seconds) -> str:
    if seconds is None:
        return "In progress"
    seconds = int(seconds)
    h = seconds // 3600
    m = (seconds % 3600) // 60
    s = seconds % 60
    return f"{h}h {m}m {s}s"
