import type { ModeDefinition, ModeKey } from "@/types/quiz";

export const MODES: ModeDefinition[] = [
  {
    key: "iconic-scenes",
    title: "Guess the Scene",
    subtitle: "Identify the anime from iconic moments",
    icon: "🎬",
    folderName: "Iconic Scenes (Video)",
    kind: "video",
    allowedExtensions: [".mp4", ".webm", ".mov", ".mkv"],
  },
  {
    key: "opening",
    title: "Guess the Opening",
    subtitle: "Name the anime from its opening sequence",
    icon: "🎵",
    folderName: "Anime Opening (Video)",
    kind: "video",
    allowedExtensions: [".mp4", ".webm", ".mov", ".mkv"],
  },
  {
    key: "characters",
    title: "Guess the Character",
    subtitle: "Identify characters from their portraits",
    icon: "👤",
    folderName: "Characters (Images)",
    kind: "image",
    allowedExtensions: [".jpg", ".jpeg", ".png", ".webp", ".gif", ".mp4", ".webm", ".mov"],
  },
  {
    key: "place",
    title: "Guess the Place",
    subtitle: "Recognize anime locations and backgrounds",
    icon: "🏯",
    folderName: "Anime Place (Images)",
    kind: "image",
    allowedExtensions: [".jpg", ".jpeg", ".png", ".webp", ".gif", ".mp4", ".webm", ".mov"],
  },
  {
    key: "eyes",
    title: "Guess the Eyes",
    subtitle: "Close-up eye identification challenge",
    icon: "👁️",
    folderName: "Eyes (Image)",
    kind: "image",
    allowedExtensions: [".jpg", ".jpeg", ".png", ".webp", ".gif", ".mp4", ".webm", ".mov"],
  },
  {
    key: "logo",
    title: "Guess the Logo",
    subtitle: "Recognize anime from their logos",
    icon: "✨",
    folderName: "Logo (Images)",
    kind: "image",
    allowedExtensions: [".jpg", ".jpeg", ".png", ".webp", ".gif", ".mp4", ".webm", ".mov"],
  },
  {
    key: "memes",
    title: "Guess the Meme",
    subtitle: "Meme and GIF identification madness",
    icon: "😂",
    folderName: "Anime Memes (Images or gifs)",
    kind: "image",
    allowedExtensions: [".jpg", ".jpeg", ".png", ".webp", ".gif", ".mp4", ".webm", ".mov"],
  },
];

export function getModeByKey(key: string): ModeDefinition | undefined {
  return MODES.find((m) => m.key === key);
}
