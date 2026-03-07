import { promises as fs } from "node:fs";
import path from "node:path";
import overrides from "@/data/answer-overrides.json";
import { answerFromFilename } from "@/lib/answerFromFilename";
import { getModeByKey } from "@/lib/modeConfig";
import type { MediaItem, ModeKey } from "@/types/quiz";

const CACHE_TTL_MS = 3_000;
const cache = new Map<string, { expires: number; items: MediaItem[] }>();

function root() {
  return process.cwd();
}

function folderPath(folderName: string) {
  return path.join(root(), folderName);
}

function overrideAnswer(fileName: string): string | undefined {
  return (overrides as Record<string, string>)[fileName];
}

export function resolveFilePath(mode: ModeKey, fileName: string): string | null {
  const def = getModeByKey(mode);
  if (!def) return null;
  const dir = path.resolve(folderPath(def.folderName));
  const full = path.resolve(dir, fileName);
  if (!full.startsWith(dir + path.sep) && full !== dir) return null;
  return full;
}

export async function listMedia(mode: ModeKey): Promise<MediaItem[]> {
  const def = getModeByKey(mode);
  if (!def) return [];

  const now = Date.now();
  const hit = cache.get(mode);
  if (hit && hit.expires > now) return hit.items;

  const dir = folderPath(def.folderName);
  let entries: string[];
  try {
    entries = await fs.readdir(dir);
  } catch {
    cache.set(mode, { expires: now + CACHE_TTL_MS, items: [] });
    return [];
  }

  const exts = new Set(def.allowedExtensions.map((e) => e.toLowerCase()));
  const VIDEO_EXTS = new Set([".mp4", ".webm", ".mov", ".mkv"]);

  const items: MediaItem[] = entries
    .filter((name) => exts.has(path.extname(name).toLowerCase()))
    .sort((a, b) => a.localeCompare(b))
    .map((fileName) => ({
      id: `${mode}::${fileName}`,
      mode,
      fileName,
      answer: overrideAnswer(fileName) ?? answerFromFilename(fileName),
      contentUrl: `/api/media/content/${encodeURIComponent(mode)}/${encodeURIComponent(fileName)}`,
      // Determine kind per-file from extension so mixed folders (images + videos) work correctly
      kind: VIDEO_EXTS.has(path.extname(fileName).toLowerCase()) ? "video" : "image",
    }));

  cache.set(mode, { expires: now + CACHE_TTL_MS, items });
  return items;
}
