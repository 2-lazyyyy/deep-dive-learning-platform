# 🚀 Project Status & Developer Handoff

Welcome to the **DeepDive Learn** repository! 

This document outlines the current state of the project, what has been completed, and what is expected of the Next.js Frontend Developer who is taking over.

## ✅ Completed Tasks (Foundation)

1. **Enterprise Architecture SPEC:** The complete distributed architecture plan is documented in `docs/implementation_plan.md`.
2. **API Contracts:** The exact REST API endpoints and data structures are defined in `docs/guideline.md`.
3. **AI Agent Skills:** Custom rules for AI agents (Cursor/Copilot) are provided in `docs/skills/nextjs-starter.md` and `docs/skills/duolingo-ux-reference.md`.
4. **MVP Tear-down:** 
   - Removed local browser Python execution (`react-py`).
   - Cleaned up the repository to be strictly a **Next.js UI Frontend**.
5. **UI Foundation Scaffolded:**
   - Integrated **Monaco Editor** (`@monaco-editor/react`) in the student coding sandbox.
   - Built a mock polling mechanism (no real backend needed to develop UI).
   - Scaffolded the **Teacher Dashboard** layout, overview page, and the visual Syllabus Builder.

---

## ⏳ To-Do (For Frontend Developer)

Your primary responsibility is to bring the **Duolingo-style gamified UI/UX** to life using Mock Data. Since the backend is being built separately by Developer 2, you do **not** need to wait for real APIs. Use static JSON mock arrays based on `guideline.md`.

### 1. Student Portal (Gamification)
- Build the scrolling vertical **Learning Tree** (Path) UI.
- Implement the **Hearts (Lives) System** and **XP / Streaks** using `Zustand` for global state management.
- Add success/failure modals and animations (framer-motion or CSS).

### 2. Bilingual Support (i18n)
- Integrate `next-intl` to allow the user to toggle the entire application between **English** and **Myanmar** seamlessly.

### 3. Teacher Dashboard CMS (Visual Syllabus Builder)
- Expand the current scaffold in `dashboard/lessons/page.tsx` into a fully functioning visual form.
- Allow teachers to visually add Units, Modules, and Lessons (including Monaco Editor inputs for starter code) and save the state locally in Zustand.

### 4. UI/UX Polish
- Strictly use `shadcn/ui` components and Tailwind CSS.
- Refer to `docs/skills/duolingo-ux-reference.md` for exact color palettes and design constraints.

> **💡 Pro Tip:** If you are using an AI Coding Agent (like Cursor), be sure to mention: *"Read docs/guideline.md and docs/skills/duolingo-ux-reference.md before generating code"* in your prompt!
