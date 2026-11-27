# Movie Recap Studio — Project Memory & Status

> **Last Updated:** 2026-11-27  
> **Repository:** `https://github.com/trykamran/movie-recap-studio` (`main` branch)  
> **Hosting:** Vercel Static Deployment (0 Server Cost, 100% Client-Side)

---

## 1. Live Websites & Deployment Status
- **Total Websites Built:** 2 pages (`index.html` Landing Page + `studio.html` Web Editor)
- **Live Status:** 100% LIVE on Vercel Production
  - **Primary Clean URL:** `https://movieexplain.vercel.app`
  - **Web Editor Direct URL:** `https://movieexplain.vercel.app/studio`
  - **Vercel Project Name:** `movie-recap-studio` (`prj_UwkegpWVSyTQJbRzfBXbbzHBZhvb`)
  - **Team Domain:** `https://movie-recap-studio-itxunknown39-webs-projects.vercel.app`

---

## 2. Built Modules & Data Inventory (`website/`)
| File | Purpose | Status |
| :--- | :--- | :--- |
| `website/index.html` | Main Apple-style Landing Page, responsive frosted-glass navbar (3-line mobile menu), Light/Dark mode toggle, 5-step workflow cards, 3 download cards | Built & Live |
| `website/studio.html` | In-Browser 4-Step Web Editor (Startup BYOK Modal ➔ SRT Script ➔ Voice Duration Sync ➔ Timestamp-Only Movie Link ➔ Final Preview & Render) | Built & Live |
| `website/assets/studio.js` | Client-side SRT parser, OpenCode/OpenRouter/Gemini/Custom BYOK API client, Audio duration detector, HTTP Range / HLS timestamp fetcher, synced preview & export | Built & Live |
| `website/assets/studio.css` | Dual-theme (Light & Dark) Apple glassmorphism styles & contrast adapters | Built & Live |
| `website/vercel.json` | Clean URLs routing (`cleanUrls: true`, `trailingSlash: false`) | Built & Live |

---

## 3. Exact Web Editor Workflow Order
1. **First-Time Browser Onboarding Modal:** Shows once per browser (`localStorage.recap_onboarded`) with a close `X` button. Lets user configure **OpenCode / OpenRouter / Gemini / OpenAI / Custom Base URL** + API Key.
2. **Step 1 — SRT First:** User uploads `.srt`/`.vtt` ➔ AI analyzes subtitles and generates the narration script (No TTS in main flow).
3. **Step 2 — Voice Upload & Duration Sync:** User records/uploads their own audio (`.mp3`/`.wav`) ➔ Studio reads exact audio duration and auto-balances scene timestamps to match.
4. **Step 3 — Movie Link (Last) & Timestamp-Only Fetch:** User pastes MovieBox/MP4/HLS URL (or picks local file) ➔ Fetches **only** the matched scene timestamps (never downloads the full movie).
5. **Step 4 — Final Preview & Render:** Synced video + voice playback preview, followed by one-click final MP4 download.
