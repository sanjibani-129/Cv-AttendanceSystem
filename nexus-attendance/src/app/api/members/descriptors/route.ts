import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET /api/members/descriptors
// Returns id, name, roll_no and every captured face-descriptor sample for
// each member (not an average — see src/lib/faceEngine.ts) so the browser
// can run the euclidean-distance match locally against the live webcam
// frame. Kept as its own endpoint (rather than bloating /api/members) since
// this is the only place descriptors ever leave the DB.
//
// Note: the underlying Supabase column is still named "descriptor" (jsonb)
// to avoid a schema migration — it now stores an array of samples
// (number[][]) rather than a single averaged array. Renamed here in the
// response body to "descriptors" so the frontend type matches what it
// actually is.
export async function GET() {
  const { data, error } = await supabaseServer
    .from("members")
    .select("id, name, roll_no, descriptor");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const members = (data ?? []).map((m) => ({
    id: m.id,
    name: m.name,
    roll_no: m.roll_no,
    descriptors: m.descriptor,
  }));

  return NextResponse.json({ members });
}