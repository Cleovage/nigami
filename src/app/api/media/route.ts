import { NextRequest, NextResponse } from "next/server";
import { getModeByKey } from "@/lib/modeConfig";
import { listMedia } from "@/lib/mediaScanner";
import type { MediaApiResponse, ModeKey } from "@/types/quiz";

export async function GET(req: NextRequest) {
  const mode = req.nextUrl.searchParams.get("mode") as ModeKey | null;
  if (!mode) return NextResponse.json({ error: "mode required" }, { status: 400 });

  const def = getModeByKey(mode);
  if (!def) return NextResponse.json({ error: "invalid mode" }, { status: 400 });

  const items = await listMedia(mode);

  const res: MediaApiResponse = {
    mode,
    title: def.title,
    total: items.length,
    items,
  };

  return NextResponse.json(res, { headers: { "Cache-Control": "no-store" } });
}
