# Contributing

Thanks for helping improve Movie Recap Studio.

## Before opening an issue

- Search existing issues for the same problem.
- Include the host (Codex, Claude Code, ChatGPT desktop, or another agent), version, and exact prompt used.
- Share a minimal reproducible example. Do not upload copyrighted movie files or private material unless you have the rights and it is necessary.

## Changes to the skill

- Keep instructions platform-neutral unless a section is explicitly host-specific.
- Preserve the TTS rule: actual audio is the source for spoken wording and timing; do not add draft comparison or TTS correction as a mandatory stage.
- Keep source-movie, voiceover, master-video, and Shorts timelines distinct.
- Never claim visual verification from SRT alone.
- Keep narration and timestamp copy blocks free of labels and extra text.
- Update the canonical skill under `skills/movie-recap-studio/`.
- Mirror canonical changes into `.agents/skills/` and `.claude/skills/`.
- Update tests and docs when behavior changes.

## Local checks

```bash
python scripts/validate_skill.py
python scripts/build_skill.py
```

## Pull requests

Explain:
1. What behavior changed?
2. Why is the change needed?
3. Which evaluation prompts were run?
4. Which hosts were actually tested?

Do not claim host compatibility that you have not tested.
