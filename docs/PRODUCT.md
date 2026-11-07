# Product Overview

## Components

**Movie Recap Studio** is the Agent Skill: it analyzes a complete movie SRT, presents concise story-topic choices, writes original English narration, analyzes the user's final TTS audio, and maps spoken beats to source-movie timestamps.

**Movie Recap** is the separate desktop/mobile editing application. The skill returns timestamp ranges for the user to paste into the app. Do not claim direct integration unless implemented and tested.

## Minimal user journey

1. Select Long or Short.
2. Select duration.
3. Upload the complete SRT (English narration is used).
4. Select and approve one short topic option.
5. Receive the full narration immediately.
6. Generate an MP3 with any TTS service and upload it.
7. The agent analyzes the actual audio, re-reads the SRT, and returns clean source timestamp ranges.

## Conversation UX

All user-facing content is English only. Questions and explanations must be brief and direct. Use the host's native selectable-question interface when available: Claude AskUserQuestion in Claude and selectable question options in supported ChatGPT surfaces. Otherwise show 2–4 concise text options and accept custom input. Ask one main question per turn. Avoid long onboarding, repeated explanations, and unnecessary reports.

## Product boundary

A skill does not itself supply movie footage, guarantee transcription tools, or run Movie Recap. It must disclose unavailable media capabilities. Timestamp plans are SRT-based unless actual video inspection verifies the visuals.
