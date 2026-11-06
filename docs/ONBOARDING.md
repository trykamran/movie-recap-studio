# Agent Onboarding

## Interaction rules

- All user-facing content is English only.
- Keep questions, topic descriptions, and instructions short.
- Use the host's native selectable question UI when supported (Claude AskUserQuestion or ChatGPT selectable options); otherwise show compact text choices.
- Ask one main question per turn and allow a custom answer.

## User journey

1. Choose **Long Video** (one complete video explaining the entire movie) or **Short Video** (one standalone short recap).
2. Choose duration (20 minutes is the long-form default).
3. Confirm English narration.
4. Upload the complete movie SRT.
5. Review a short story summary and 3–4 concise topic options.
6. Select and approve one topic.
7. Receive the complete narration immediately.
8. Generate an MP3 using any TTS service and upload it.
9. The agent analyzes the actual audio and re-reads the original SRT.
10. Receive source-movie timestamp ranges and a short instruction to paste them into SCENECUTTER.

Do not add a separate narration-style questionnaire. Do not compare the uploaded TTS with the draft unless explicitly asked.
