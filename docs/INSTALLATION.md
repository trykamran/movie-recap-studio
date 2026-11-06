# Installation Guide

Movie Recap Studio uses the open Agent Skills folder format. The repository includes host-specific discovery folders where a host documents them, plus one portable canonical skill.

## Claude Code

1. Clone this repository and open its root in Claude Code.
2. Claude Code discovers `.claude/skills/movie-recap-studio/SKILL.md`.
3. Run `/movie-recap-studio`.

For claude.ai custom Skills, upload the standalone `movie-recap-studio-agent-skill.zip` through the Skills upload interface when available. Do not upload the complete GitHub repository ZIP: it contains nested ZIP files and repository metadata.

## Codex

1. Open the cloned repository in Codex.
2. Codex discovers `.agents/skills/movie-recap-studio/`.
3. Invoke `$movie-recap-studio` or ask Codex to use the skill.
4. If it is not visible, refresh or restart Codex.

For an installer prompt, use the directory URL for `.agents/skills/movie-recap-studio` after replacing the repository URL placeholder in README.

## ChatGPT

Use the standalone Agent Skill ZIP through the Skills interface in supported ChatGPT surfaces. The skill folder includes `agents/openai.yaml` metadata. The repository itself is not a published plugin, and availability of standalone Skills depends on the ChatGPT product surface and account.

## Gemini CLI

1. Clone this repository and open its root in Gemini CLI.
2. Gemini CLI discovers `.gemini/skills/movie-recap-studio/`.
3. Run `/skills list` to confirm discovery, then `/skills reload` if needed.
4. Invoke the skill using the host's skill activation flow.

The interoperable `.agents/skills/` path is also supported by Gemini CLI.

## Other Agent Skills-compatible hosts

Use `skills/movie-recap-studio/` as the portable source and follow the host's documented discovery/import convention. Compatibility is not guaranteed merely because a host supports Markdown instructions.

## Important distinction

Installing a skill does not automatically start a conversation. The user invokes it after installation. A skill ZIP contains the skill folder; the complete GitHub repository ZIP is for source-code/repository use and is not the file to upload into a hosted skill uploader.
