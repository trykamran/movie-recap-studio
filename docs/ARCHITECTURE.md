# Architecture

## Purpose

Movie Recap Studio is an instruction-first Agent Skill. It teaches an LLM a repeatable workflow; it is not itself a subtitle parser, ASR engine, video editor, or hosted application.

## Layers

1. **Discovery metadata** — `SKILL.md` frontmatter tells a host when the skill is relevant.
2. **Core instructions** — `SKILL.md` defines the interactive production workflow and output contracts.
3. **References** — supporting documents clarify timeline semantics and workflow details.
4. **Host metadata** — `agents/openai.yaml` configures optional ChatGPT desktop presentation metadata.
5. **Host discovery mirrors** — `.agents/skills/` for Codex and `.claude/skills/` for Claude Code.
6. **Repository tooling** — scripts validate mirror consistency and build portable archives.

## Source of truth

`skills/movie-recap-studio/` is canonical. Host-specific directories mirror its files so each host can discover the skill in its documented location. Run `python scripts/validate_skill.py` after editing.

## Why no `.codex/skills/` or `.cloud/skills/` directory?

The repository uses documented discovery paths rather than inventing similarly named folders. Codex repository skills use `.agents/skills/`; Claude Code project skills use `.claude/skills/`. Other hosts may support the open format through their own import or discovery mechanisms.
