import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
export const dynamic = "force-dynamic";
export const revalidate = 0;

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

// POST /api/members -> register a new member with 5 raw face-descriptor samples
// (matched individually at recognition time — see src/lib/faceEngine.ts for why
// these are kept separate rather than averaged into one descriptor).
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, roll_no, email, descriptors } = body;

  const validSamples =
    Array.isArray(descriptors) &&
    descriptors.length > 0 &&
    descriptors.every((d: unknown) => Array.isArray(d) && d.length === 128);

  if (!name || !roll_no || !email || !validSamples) {
    return NextResponse.json(
      { error: "name, roll_no, email and at least one 128-length descriptor sample are required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseServer
    .from("members")
    .insert({ name, roll_no, email, descriptor: descriptors })
    .select()
    .single();

  if (error) {
    const status = error.code === "23505" ? 409 : 500; // unique_violation
    return NextResponse.json({ error: error.message }, { status });
  }

  return NextResponse.json({ member: data }, { status: 201 });
}