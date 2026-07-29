export interface Member {
  id: string;
  name: string;
  roll_no: string;
  email: string;
  descriptor: number[];
  created_at: string;
}

export interface MemberStats {
  id: string;
  name: string;
  roll_no: string;
  email: string;
  hours: number;
  is_inside: boolean;
}

export interface AttendanceRecord {
  id: string;
  member_id: string;
  check_in: string;
  check_out: string | null;
  confidence: number | null;
  session_date: string;
  members?: Pick<Member, "name" | "roll_no">;
}

export interface DashboardStats {
  totalMembers: number;
  insideNow: number;
  hoursToday: number;
  avgConfidence: number;
}
