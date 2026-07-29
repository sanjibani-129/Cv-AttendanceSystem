import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

// GET /api/attendance -> recent session log, newest first, joined with member name
export async function GET(req: NextRequest) {
  const limit = Number(req.nextUrl.searchParams.get("limit") ?? 50);

  const { data, error } = await supabaseServer
    .from("attendance")
    .select("id, member_id, check_in, check_out, confidence, session_date, members(name, roll_no)")
    .order("check_in", { ascending: false })
    .limit(limit);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ attendance: data });
}

// POST /api/attendance -> called by the Live Camera screen after a face match.
// Toggles state: opens a new session if the member has none in progress,
// otherwise closes their currently-open session (check-out).
export async function POST(req: NextRequest) {
  const { member_id, confidence } = await req.json();

  if (!member_id) {
    return NextResponse.json({ error: "member_id is required" }, { status: 400 });
  }

  const { data: openSession, error: lookupError } = await supabaseServer
    .from("attendance")
    .select("id")
    .eq("member_id", member_id)
    .is("check_out", null)
    .maybeSingle();

  if (lookupError) {
    return NextResponse.json({ error: lookupError.message }, { status: 500 });
  }

  if (openSession) {
    const { data, error } = await supabaseServer
      .from("attendance")
      .update({ check_out: new Date().toISOString() })
      .eq("id", openSession.id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ action: "check_out", record: data });
  }

  const { data, error } = await supabaseServer
    .from("attendance")
    .insert({ member_id, confidence: confidence ?? null })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ action: "check_in", record: data }, { status: 201 });
}
