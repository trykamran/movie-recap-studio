#!/usr/bin/env python3
"""Build portable skill ZIPs from the canonical source (stdlib only)."""
from pathlib import Path
import shutil
import zipfile

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "skills" / "movie-recap-studio"
DIST = ROOT / "dist"

def zip_folder(folder: Path, output: Path, arc_prefix: str) -> None:
    with zipfile.ZipFile(output, "w", zipfile.ZIP_DEFLATED) as archive:
        for path in sorted(folder.rglob("*")):
            if path.is_file():
                archive.write(path, Path(arc_prefix) / path.relative_to(folder))

def main() -> None:
    if not (SOURCE / "SKILL.md").is_file():
        raise SystemExit("Canonical SKILL.md not found.")
    DIST.mkdir(exist_ok=True)
    portable = DIST / "movie-recap-studio-agent-skill.zip"
    codex = DIST / "movie-recap-studio-codex-skill.zip"
    claude = DIST / "movie-recap-studio-claude-skill.zip"
    gemini = DIST / "movie-recap-studio-gemini-skill.zip"
    zip_folder(SOURCE, portable, "movie-recap-studio")
    zip_folder(ROOT / ".agents" / "skills" / "movie-recap-studio", codex, "movie-recap-studio")
    zip_folder(ROOT / ".claude" / "skills" / "movie-recap-studio", claude, "movie-recap-studio")
    zip_folder(ROOT / ".gemini" / "skills" / "movie-recap-studio", gemini, "movie-recap-studio")
    for file in [portable, codex, claude, gemini]:
        print(f"Built {file.relative_to(ROOT)} ({file.stat().st_size:,} bytes)")

if __name__ == "__main__":
    main()
