import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

// GET /api/members -> list all members with live hours/status (from the
// member_stats view defined in supabase/schema.sql)
export async function GET() {
  const { data, error } = await supabaseServer
    .from("member_stats")
    .select("*")
    .order("hours", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ members: data });
}

// POST /api/members -> register a new member with an averaged face descriptor
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, roll_no, email, descriptor } = body;

  if (!name || !roll_no || !email || !Array.isArray(descriptor) || descriptor.length !== 128) {
    return NextResponse.json(
      { error: "name, roll_no, email and a 128-length descriptor array are required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseServer
    .from("members")
    .insert({ name, roll_no, email, descriptor })
    .select()
    .single();

  if (error) {
    const status = error.code === "23505" ? 409 : 500; // unique_violation
    return NextResponse.json({ error: error.message }, { status });
  }

  return NextResponse.json({ member: data }, { status: 201 });
}
