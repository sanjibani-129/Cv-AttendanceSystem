import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

// GET /api/members/descriptors
// Returns id, name, roll_no and the raw face descriptor for every member so
// the browser can run the euclidean-distance match locally against the
// live webcam frame. Kept as its own endpoint (rather than bloating
// /api/members) since this is the only place descriptors ever leave the DB.
export async function GET() {
  const { data, error } = await supabaseServer
    .from("members")
    .select("id, name, roll_no, descriptor");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ members: data });
}
