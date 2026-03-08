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
  // fileName could contain subdirectories like "Easy/foo.jpg"
  const full = path.resolve(dir, fileName);
  if (!full.startsWith(dir + path.sep) && full !== dir) return null;
  return full;
}

// Recursively get all files in a directory
async function walk(dir: string, baseDir: string = dir): Promise<string[]> {
  let results: string[] = [];
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        results = results.concat(await walk(fullPath, baseDir));
      } else {
        results.push(path.relative(baseDir, fullPath));
      }
    }
  } catch {
    // ignore
  }
  return results;
}

export async function listMedia(mode: ModeKey): Promise<MediaItem[]> {
  const def = getModeByKey(mode);
  if (!def) return [];

  const now = Date.now();
  const hit = cache.get(mode);
  if (hit && hit.expires > now) return hit.items;

  const dir = folderPath(def.folderName);
  const entries: string[] = await walk(dir);

  const exts = new Set(def.allowedExtensions.map((e) => e.toLowerCase()));
  const VIDEO_EXTS = new Set([".mp4", ".webm", ".mov", ".mkv"]);

  const items: MediaItem[] = entries
    .filter((name) => exts.has(path.extname(name).toLowerCase()))
    .sort((a, b) => a.localeCompare(b))
    .map((filePath) => {
      // Normalize to posix for URLs and IDs
      const normalizedPath = filePath.split(path.sep).join('/');
      const fileName = path.basename(filePath);
      
      // Extract difficulty from the directory name if it exists (e.g. "Easy/foo.jpg" -> "Easy")
      const dirName = path.dirname(normalizedPath);
      let difficulty: MediaItem["difficulty"] = null;
      if (dirName !== ".") {
        const topDir = dirName.split('/')[0].toLowerCase();
        if (topDir === "easy") difficulty = "Easy";
        else if (topDir === "medium") difficulty = "Medium";
        else if (topDir === "hard") difficulty = "Hard";
      }

      return {
        id: `${mode}::${normalizedPath}`,
        mode,
        fileName: normalizedPath, // Store relative path so route can resolve it
        answer: overrideAnswer(normalizedPath) ?? answerFromFilename(fileName),
        contentUrl: `/api/media/content/${encodeURIComponent(mode)}/${encodeURIComponent(normalizedPath)}`,
        // Determine kind per-file from extension so mixed folders (images + videos) work correctly
        kind: VIDEO_EXTS.has(path.extname(fileName).toLowerCase()) ? "video" : "image",
        difficulty
      };
    });

  cache.set(mode, { expires: now + CACHE_TTL_MS, items });
  return items;
}
