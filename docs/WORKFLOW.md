# Workflow Reference

## Main path

Choose Long/Short → set duration → upload complete SRT → analyze story → show 3–4 short topic options → user selects and approves a topic → generate complete English narration immediately → user creates and uploads MP3 → analyze actual spoken words and audio timing → re-read complete SRT → map spoken beats to source scenes → return clean timestamp ranges.

Long mode only: after the master video exists, plan Shorts from the master-video timeline.

## Conversation UX

English only. Keep prompts and explanations short. Use native host selectable questions when supported (Claude AskUserQuestion / ChatGPT selectable options); otherwise use compact text options. Ask one main question at a time. No separate narration-style questionnaire.

## TTS rule

The uploaded TTS is the source of truth. Analyze its actual spoken content and timing. Do not compare it against the draft, reject it, rewrite it, or request a new TTS because wording differs. Only compare drafts if the user explicitly asks.

## Timeline integrity

- Source Movie: original film timestamps for SCENECUTTER.
- Voiceover: actual TTS timecodes.
- Master Video: completed long-form edit timecodes.
- Shorts: ranges inside the master video.

Never substitute one timeline for another. Calculate every selected clip duration. Do not claim visual verification from SRT alone.
