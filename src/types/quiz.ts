export type ModeKey =
  | "iconic-scenes"
  | "opening"
  | "characters"
  | "place"
  | "eyes"
  | "logo"
  | "memes";

export type MediaKind = "image" | "video";

export interface ModeDefinition {
  key: ModeKey;
  title: string;
  subtitle: string;
  icon: string;
  folderName: string;
  kind: MediaKind;
  allowedExtensions: string[];
}

export interface MediaItem {
  id: string;
  mode: ModeKey;
  fileName: string;
  answer: string;
  contentUrl: string;
  kind: MediaKind;
}

export interface MediaApiResponse {
  mode: ModeKey;
  title: string;
  total: number;
  items: MediaItem[];
}
