# 🌟 Nigami - The Ultimate Anime Quiz Experience

Nigami is a high-end, glassmorphic anime quiz presentation platform built with Next.js. It features a stunning monochrome aesthetic with vibrant glowing accents, volumetric god rays, and immersive WebGL animations.

## ✨ Features

- **🎨 High-Level Design**: Glassmorphic UI with backdrop blurs, interactive hover glows, and a sleek black-and-white theme.
- **⚡ Dynamic Visuals**: 
  - Volumetric animated god rays fanning from the top.
  - Interactive mouse-tracking spotlight effects on cards.
  - Immersive WebGL background powered by **Unicorn Studio**.
  - Breathing ambient glows and pulsing "Anime Quiz" title.
- **🎮 Seamless Gameplay**:
  - **No setup required**: Just drop your media into the folders and play.
  - **Smart Reveal**: Automatically derives answers from file names (e.g., `Attack_on_Titan.mp4` -> `Attack On Titan`).
  - **Keyboard Shortcuts**: Press `R` to Reveal and `N` for Next Round.
- **📁 Automated Discovery**: Picks up new images, GIFs, and videos automatically from your local folders.

## 📁 File Structure

```text
.
├── src/
│   ├── app/                  # Next.js App Router (pages, layout, globals)
│   │   ├── api/              # API routes for media scanning
│   │   ├── modes/            # Mode selection page
│   │   ├── play/[mode]/      # Dynamic quiz gameplay route
│   │   ├── layout.tsx        # Root layout with fonts and noise overlay
│   │   ├── page.tsx          # Landing page (Hero section)
│   │   └── globals.css       # Core styling and animations
│   ├── components/
│   │   └── game/             # Quiz engine and UI components
│   │       └── PresenterGame.tsx # Main quiz logic & keyboard shortcuts
│   ├── data/
│   │   └── answer-overrides.json # Manual filename-to-answer mapping
│   ├── lib/                  # Utility functions
│   │   ├── answerFromFilename.ts # Filename parsing logic
│   │   ├── mediaScanner.ts    # Node.js fs-based scanner
│   │   ├── modeConfig.ts      # Quiz mode definitions
│   │   └── soundFx.ts         # Audio management (TBI)
│   └── types/                # TypeScript interface definitions
├── public/                   # Static assets
└── .orchids/                 # Project configuration
```

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have [Bun](https://bun.sh/) or Node.js installed.

### 2. Installation
```bash
bun install
# or
npm install
```

### 3. Run Locally
```bash
bun dev
# or
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the magic.

## 📁 Content Setup

Nigami reads files directly from these root folders:

- `Iconic Scenes (Video)`
- `Anime Opening (Video)`
- `Characters (Images)`
- `Anime Place (Images)`
- `Eyes (Image)`
- `Logo (Images)`
- `Anime Memes (Images or gifs)`

### File Naming Convention
The answer is derived from the filename. 
- Use underscores or hyphens: `One_Piece.mp4` or `Attack-on-Titan.jpg`.
- Extra notes after `__`: `Naruto__S1.mp4` (displays as "Naruto S1").

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **WebGL**: [Unicorn Studio](https://www.unicorn.studio/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 📝 Custom Overrides
If you need a specific answer for a file that doesn't match the naming convention, edit `src/data/answer-overrides.json`:
```json
{
  "snk_scene_1.mp4": "Attack on Titan"
}
```

---

*Designed for high-quality anime events and quiz nights.*
