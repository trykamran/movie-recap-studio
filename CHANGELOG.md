# Changelog

## [2.3.0] - 2026-11-06

### Added
- Added a native Gemini CLI discovery mirror at `.gemini/skills/movie-recap-studio/`.
- Expanded host compatibility documentation for Claude, Codex, ChatGPT Skills, Gemini CLI, and other Agent Skills-compatible hosts.
- Added separate portable, Codex, Claude, and Gemini skill archive outputs.
- Added copy-ready installation guidance and explicit warnings distinguishing the repository ZIP from standalone skill ZIPs.

### Changed
- Clarified `.agents/skills/` as the interoperable discovery path used by Codex and also supported by Gemini CLI.
- Updated the manifest, validation script, and build script to verify and package all host mirrors.
- Reworked installation documentation to avoid claiming that a GitHub URL can directly install a skill in every host.

## [2.2.1] - 2026-11-06

### Changed
- Clarified the first welcome screen with two explicit choices: Long Video and Short Video.
- Made the format choice the first interaction.

## [2.2.0] - 2026-11-06

### Changed
- Enforced English-only user-facing communication and narration.
- Shortened onboarding questions, topic descriptions, explanations, and final output.
- Added native host selectable-question guidance with concise text fallback.
- Removed the separate narration-style questionnaire; narration follows topic approval.
- Simplified final delivery to clean source timestamps and a brief Movie Recap instruction.

### Clarified
- Uploaded MP3/TTS is analyzed as-is; draft comparison is not a required step.
