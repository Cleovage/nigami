import { promises as fs } from "node:fs";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { getModeByKey } from "@/lib/modeConfig";
import { resolveFilePath } from "@/lib/mediaScanner";
import type { ModeKey } from "@/types/quiz";

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
  ".mkv": "video/x-matroska",
};

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ slug: string[] }> },
) {
  const { slug } = await ctx.params;
  if (!slug || slug.length < 2)
    return NextResponse.json({ error: "bad path" }, { status: 400 });

  const mode = decodeURIComponent(slug[0]) as ModeKey;
  const fileName = decodeURIComponent(slug.slice(1).join("/"));

  const def = getModeByKey(mode);
  if (!def) return NextResponse.json({ error: "invalid mode" }, { status: 400 });

  const ext = path.extname(fileName).toLowerCase();
  if (!def.allowedExtensions.includes(ext))
    return NextResponse.json({ error: "type not allowed" }, { status: 400 });

  const filePath = resolveFilePath(mode, fileName);
  if (!filePath) return NextResponse.json({ error: "invalid path" }, { status: 400 });

  let buf: Buffer;
  try {
    buf = await fs.readFile(filePath);
  } catch {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(buf), {
    headers: {
      "Content-Type": MIME[ext] ?? "application/octet-stream",
      "Cache-Control": "public, max-age=300",
    },
  });
}
