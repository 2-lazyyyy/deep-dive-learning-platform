# 🚀 DeepDive Learn (Frontend Repository)

Welcome to the **DeepDive Learn** project! This repository contains the Frontend (Next.js) for the gamified Python learning platform. 

We are building a University-Scale, Distributed Interactive Learning Platform with a **Monolithic FastAPI Backend** running on Port 8000.

## ⚠️ Important Note for Frontend Developer
The backend is **currently in development** and is NOT ready yet. You are tasked with building the UI/UX first using Mock Data based on the API contracts.

### 📚 Essential Reading Before You Code
Please carefully read the following files in the `/docs` folder before writing any code:
1. `docs/implementation_plan.md` (The complete architecture spec for the system).
2. `docs/guideline.md` (Your specific responsibilities and the exact API endpoints you need to call).

## 🤖 AI Agent Instructions (Cursor / Copilot)
If you are using an AI Coding Agent (like Cursor IDE), please copy and paste the following prompt to give your AI the exact context it needs to build the UI flawlessly:

> **"Read the `docs/guideline.md` and the UI rules in `docs/skills/duolingo-ux-reference.md` and `docs/skills/nextjs-starter.md`. Act as Developer 1 (Frontend). We are building a Duolingo-style learning platform. The backend is not ready yet, so please create the UI using Mock Data based on the API contracts in the guideline. Strictly use Next.js 14 App Router, Tailwind CSS, Zustand, and shadcn/ui."**

---

### Running the App Locally
```bash
npm install
npm run dev
```
The app will start at `http://localhost:3000`.
