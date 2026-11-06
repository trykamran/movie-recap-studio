#!/usr/bin/env python3
"""Validate Movie Recap Studio skill metadata and host mirrors (stdlib only)."""
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
CANONICAL = ROOT / "skills" / "movie-recap-studio"
MIRRORS = [
    ROOT / ".agents" / "skills" / "movie-recap-studio",
    ROOT / ".claude" / "skills" / "movie-recap-studio",
    ROOT / ".gemini" / "skills" / "movie-recap-studio",
]

def fail(message: str) -> None:
    print(f"FAIL: {message}")
    raise SystemExit(1)

def parse_frontmatter(text: str) -> str:
    if not text.startswith("---\n"):
        fail("SKILL.md must start with YAML frontmatter.")
    parts = text.split("---", 2)
    if len(parts) < 3:
        fail("Could not find closing YAML frontmatter delimiter.")
    return parts[1]

def main() -> None:
    canonical_skill = CANONICAL / "SKILL.md"
    if not canonical_skill.is_file():
        fail(f"Missing canonical skill: {canonical_skill.relative_to(ROOT)}")

    canonical_text = canonical_skill.read_text(encoding="utf-8")
    fm = parse_frontmatter(canonical_text)
    name = re.search(r"(?m)^name:\s*([a-z0-9-]+)\s*$", fm)
    description = re.search(r"(?m)^description:\s*(.+)$", fm)
    if not name:
        fail("Frontmatter must include a valid lowercase hyphenated name.")
    if len(name.group(1)) > 64:
        fail("Skill name exceeds 64 characters.")
    if not description or not description.group(1).strip():
        fail("Frontmatter must include a non-empty description.")
    if len(description.group(1).strip()) > 1024:
        fail("Skill description exceeds 1024 characters.")

    required_phrases = [
        "actual TTS audio",
        "re-read",
        "Source Movie Timeline",
        "Voiceover Timeline",
        "Master Video Timeline",
        "Shorts Timeline",
        "SCENECUTTER",
    ]
    for phrase in required_phrases:
        if phrase.lower() not in canonical_text.lower():
            fail(f"Core workflow phrase missing: {phrase}")

    for mirror in MIRRORS:
        mirror_skill = mirror / "SKILL.md"
        if not mirror_skill.is_file():
            fail(f"Missing host mirror: {mirror_skill.relative_to(ROOT)}")
        if mirror_skill.read_text(encoding="utf-8") != canonical_text:
            fail(f"SKILL.md mirror is out of sync: {mirror_skill.relative_to(ROOT)}")

        for rel in ["references/workflow-reference.md", "examples/evaluation-prompts.md", "agents/openai.yaml"]:
            if not (mirror / rel).is_file():
                fail(f"Missing {rel} in {mirror.relative_to(ROOT)}")

    print("PASS: frontmatter, core workflow, and Codex/Claude/Gemini mirrors are valid.")
    print(f"Skill name: {name.group(1)}")
    print("Canonical source: skills/movie-recap-studio/SKILL.md")

if __name__ == "__main__":
    main()
