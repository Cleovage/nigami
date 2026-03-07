/**
 * Derives a human-readable answer from a media filename.
 *
 * Examples:
 *   "Attack on Titan.mp4"           → "Attack On Titan"
 *   "one_piece-opening.webm"        → "One Piece Opening"
 *   "jujutsu_kaisen__clip1.gif"     → "Jujutsu Kaisen"
 *   "Naruto Shippuden (OP 16).mp4" → "Naruto Shippuden"
 */
export function answerFromFilename(fileName: string): string {
  // strip extension
  let base = fileName.replace(/\.[^.]+$/, "");

  // strip everything after __ (suffix marker)
  base = base.replace(/__.*$/, "");

  // strip parenthesised suffixes like (OP 16) or (clip)
  base = base.replace(/\s*\([^)]*\)\s*/g, " ");

  // replace delimiters with spaces
  base = base.replace(/[-_]+/g, " ");

  // collapse whitespace
  base = base.replace(/\s+/g, " ").trim();

  if (!base) return "Unknown";

  // title-case each word
  return base
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
