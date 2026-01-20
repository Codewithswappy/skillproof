import { trackInteraction } from "@/lib/analytics";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { slug, type, itemId } = await req.json();

    if (!slug || !type || !itemId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await trackInteraction(slug, type, itemId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Tracking error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
