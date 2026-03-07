import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Anime Quiz | Presentation Mode",
  description: "Dynamic anime quiz for college events — no login, just reveal and go!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* ambient background */}
        <div className="bg-grid" />
        <div className="bg-orb bg-orb--purple" />
        <div className="bg-orb bg-orb--blue" />
        <div className="bg-orb bg-orb--pink" />

        <div className="app-shell">
          {/* navigation */}
          <nav className="top-nav">
            <Link href="/" className="nav-brand">
              ANIME QUIZ
            </Link>
            <div className="nav-links">
              <Link href="/" className="nav-link">
                Home
              </Link>
            </div>
          </nav>

          {/* page content */}
          <div className="page-container">{children}</div>

          {/* footer */}
          <footer className="footer">
            Anime Quiz Presenter — Built for college events
          </footer>
        </div>
      </body>
    </html>
  );
}
