# Anime Quiz Presenter (Dynamic, Reveal-Only)

This is a Next.js presentation website for your anime quiz event.

## What it does

- No login required
- No answer typing field
- Shows media (image/gif/video)
- **Reveal Answer** button displays answer from file name
- **Next Round** button moves to the next random item
- New files are picked up automatically while dev server runs (short cache)

## Quiz modes and folders

The app reads files directly from these folders in the project root:

- `Iconic Scenes (Video)`
- `Anime Opening (Video)`
- `Characters (Images)`
- `Anime Place (Images)`
- `Eyes (Image)`
- `Logo (Images)`
- `Anime Memes (Images or gifs)`

## File naming (important)

The revealed answer is derived from the filename.

Recommended style:

- `Anime Title.ext`
- `Anime_Title.ext`
- `Anime-Title.ext`
- `Anime Title__note.ext` (anything after `__` is treated like extra text)

Examples:

- `Attack on Titan.mp4` -> `Attack On Titan`
- `one_piece-opening.webm` -> `One Piece Opening`
- `jujutsu_kaisen__clip1.gif` -> `Jujutsu Kaisen Clip1`

If you want a custom display answer for a specific file, edit:

- `src/data/answer-overrides.json`

Example:

```json
{
  "snk_scene_1.mp4": "Attack on Titan"
}
```

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Start dev server:

```bash
npm run dev
```

3. Open:

- `http://localhost:3000`

## Presenter controls

- Click **Reveal Answer** to show answer
- Click **Next Round** to continue
- Keyboard shortcuts:
  - `R` = Reveal answer
  - `N` = Next round

## Notes

- This is intentionally a presentation mode build (no accounts, no leaderboard, no typed guessing).
- If a mode has no files yet, the page shows an empty-state message with refresh option.
