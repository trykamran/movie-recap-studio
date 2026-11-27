# Agent Rules & Guidelines — Movie Recap Studio

## 1. Communication & Language
- **Roman Urdu / English Only:** Reply strictly in Roman Urdu (Latin script) when the user speaks Urdu/Hindi, or English when the user speaks English. Never use Arabic/Urdu or Devanagari script.

## 2. Architecture & Cost Constraints
- **Zero Backend / Zero Server Cost:** Everything on `website/` must remain 100% static and client-side (browser-based processing via JS, WebCodecs, HLS.js, HTTP Range requests).
- **BYOK (Bring Your Own Key):** Never hardcode API keys. All AI keys and Custom Base URLs live in the user's `localStorage`.
- **No TTS in Main Editor Flow:** Keep the main editor focused on SRT ➔ AI Script ➔ User Voice Upload & Duration Match ➔ Timestamp-Only Movie Fetch ➔ Preview & Render.

## 3. UI & Design Standards
- **Navbar:** Clean, subtle frosted glass (`backdrop-blur-md`), Brand Logo/Name on left, Nav links center, Light/Dark theme toggle + CTA on right, and a **3-line hamburger menu** on mobile screens.
- **Dual Theme Sync:** Both `index.html` and `studio.html` share `localStorage.getItem('theme')` (`dark` / `light`).

## 4. Deployment Workflow
- Always commit changes to `main` on GitHub (`trykamran/movie-recap-studio`) and deploy to Vercel project `movie-recap-studio` (`movieexplain.vercel.app`).
- Update `MEMORY.md` whenever new pages, features, or commits are shipped.
