import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// Active sessions are stored in memory for simplicity
// In production, use Redis or a database table
const activeSessions: Map<string, Map<string, number>> = new Map();

// Session timeout in milliseconds (30 seconds of inactivity)
const SESSION_TIMEOUT = 30000;

// Clean up expired sessions
function cleanupSessions(profileId: string) {
  const sessions = activeSessions.get(profileId);
  if (!sessions) return 0;

  const now = Date.now();
  for (const [sessionId, lastSeen] of sessions.entries()) {
    if (now - lastSeen > SESSION_TIMEOUT) {
      sessions.delete(sessionId);
    }
  }

  return sessions.size;
}

// GET: Get count of active visitors
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const profileId = searchParams.get("profileId");

    if (!profileId) {
      return NextResponse.json({ error: "Missing profileId" }, { status: 400 });
    }

    const count = cleanupSessions(profileId);

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Online count error:", error);
    return NextResponse.json({ count: 0 });
  }
}

// POST: Register/heartbeat a visitor session
export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      const text = await request.text();
      body = text ? JSON.parse(text) : {};
    } catch {
      body = {};
    }
    const { searchParams } = new URL(request.url);
    const profileId = body.profileId || searchParams.get("profileId");
    const sessionId = body.sessionId || searchParams.get("sessionId");

    if (!profileId || !sessionId) {
      return NextResponse.json(
        { error: "Missing profileId or sessionId" },
        { status: 400 }
      );
    }

    // Initialize profile sessions if not exists
    if (!activeSessions.has(profileId)) {
      activeSessions.set(profileId, new Map());
    }

    // Update session last seen time
    activeSessions.get(profileId)!.set(sessionId, Date.now());

    // Clean up and get count
    const count = cleanupSessions(profileId);

    return NextResponse.json({ success: true, count });
  } catch (error) {
    console.error("Session heartbeat error:", error);
    return NextResponse.json({ success: false, count: 0 });
  }
}

// DELETE: Remove a visitor session (on page unload)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const profileId = searchParams.get("profileId");
    const sessionId = searchParams.get("sessionId");

    if (profileId && sessionId) {
      const sessions = activeSessions.get(profileId);
      if (sessions) {
        sessions.delete(sessionId);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false });
  }
}
