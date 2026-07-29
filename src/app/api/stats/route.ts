import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const today = new Date().toISOString().slice(0, 10);

  const [{ count: totalMembers }, { data: openSessions }, { data: todaysSessions }] =
    await Promise.all([
      supabaseServer.from("members").select("*", { count: "exact", head: true }),
      supabaseServer.from("attendance").select("member_id").is("check_out", null),
      supabaseServer
        .from("attendance")
        .select("check_in, check_out, confidence")
        .eq("session_date", today),
    ]);

  const hoursToday =
    todaysSessions?.reduce((sum, s) => {
      const end = s.check_out ? new Date(s.check_out) : new Date();
      const hours = (end.getTime() - new Date(s.check_in).getTime()) / 3_600_000;
      return sum + hours;
    }, 0) ?? 0;

  const confidences = todaysSessions?.map((s) => s.confidence).filter((c): c is number => c != null) ?? [];
  const avgConfidence =
    confidences.length > 0 ? confidences.reduce((a, b) => a + b, 0) / confidences.length : 0;

  return NextResponse.json({
    totalMembers: totalMembers ?? 0,
    insideNow: openSessions?.length ?? 0,
    hoursToday: Number(hoursToday.toFixed(1)),
    avgConfidence: Number(avgConfidence.toFixed(1)),
  });
}