# Workflow Reference

## Production paths

### Full movie explanation
Setup → complete SRT → story map → approval → style selection → full narration → TTS generation → read actual TTS → segment voiceover timeline → re-read complete SRT → map spoken beats to source scenes → calculate source clip durations → deliver SCENECUTTER ranges → assemble/review master → plan Shorts from master timeline.

### Short movie explanation
Setup → complete SRT → story map → approval → style selection → full narration → TTS generation → read actual TTS → segment voiceover timeline → re-read complete SRT → map spoken beats to source scenes → calculate source clip durations → deliver SCENECUTTER ranges → assemble/review short.

## Four independent timelines

| Timeline | Meaning | Used for |
|---|---|---|
| Source Movie | Original film timecode | Finding footage in source movie |
| Voiceover | TTS audio timecode | Knowing what is spoken and when |
| Master Video | Final long-form edit timecode | Reviewing the completed explanation |
| Shorts | Ranges inside the master video | Extracting short-form edits |

Never substitute one timeline for another.

## TTS interpretation rule

The TTS audio is the final spoken source for scene mapping. Read/transcribe it to identify the words actually spoken and their timing. Do not compare it against the earlier draft, rewrite it, reject it, or ask for a new TTS merely because wording differs. The user can explicitly request a comparison as a separate task.

## Evidence labels

- **SRT-supported:** subtitle text and timecode directly support the story beat.
- **Contextual inference:** the event is plausible from surrounding story context but not proven by the SRT alone.
- **Visually verified:** actual video or frames were accessible and inspected.

## Shot pacing

Target a 4–5 second average shot length, usually using 3–6 second ranges. Use longer shots only when the story or emotion justifies them. Do not pad with irrelevant footage.

## Timestamp arithmetic

For each range, calculate end minus start. Sum all selected ranges. Report the actual TTS duration, total source footage duration, difference, shot count, and average shot duration. Account for transition overlaps or gaps if known. Never claim exact synchronization without verification.
