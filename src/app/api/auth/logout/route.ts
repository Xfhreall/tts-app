import { NextResponse } from "next/server";
import { getSession } from "@/shared/lib/session";

export async function POST() {
  try {
    const session = await getSession();
    session.destroy();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan saat logout" }, { status: 500 });
  }
}
