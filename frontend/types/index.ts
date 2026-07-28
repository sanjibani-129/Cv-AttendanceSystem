export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'viewer';
  avatar_url?: string;
}

export interface Member {
  id: string;
  name: string;
  roll_number: string;
  email: string;
  department: string;
  phone: string;
  attendance_rate: number;
  face_registered: boolean;
  status: 'active' | 'inactive';
  created_at: string;
}

export interface AttendanceRecord {
  id: string;
  member_id: string;
  member_name: string;
  department: string;
  timestamp: string;
  type: 'CHECK_IN' | 'CHECK_OUT';
  status: 'PRESENT' | 'LATE' | 'ABSENT';
  confidence: number;
}

export interface DashboardStats {
  today_attendance: number;
  present: number;
  absent: number;
  late: number;
  recognition_accuracy: number;
  unknown_faces: number;
  today_checkins: number;
  today_checkouts: number;
  weekly_trend: Array<{ day: string; count: number }>;
  department_stats: Array<{ department: string; percentage: number }>;
}

export interface RecognitionResult {
  recognized: boolean;
  member?: Member;
  confidence: number;
  bounding_box?: { x: number; y: number; width: number; height: number };
  status: 'SUCCESS' | 'UNKNOWN' | 'NO_FACE';
}
