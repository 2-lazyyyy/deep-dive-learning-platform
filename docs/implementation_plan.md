# 🚀 DeepDive Learn: University Enterprise Architecture (Phased SPEC v2)

## 🎯 Goal Description
To build a University-Scale, Distributed Interactive Learning Platform (similar to LeetCode/HackerRank). The long-term vision is a platform that handles **500 concurrent users**, runs **On-Premise**, supports **multiple programming languages**, includes a **Teacher Dashboard**, and **retains full submission histories**.

This SPEC is structured in two phases so it can be extended without rewriting from scratch:
*   **Phase 1 — Teacher Demo (Current Focus):** A small-scale, single-server proof of concept for an internal teacher-only demo. No students onboarded yet.
*   **Phase 2 — Full Production Rollout:** The full distributed, scaled architecture for 500 concurrent students, to be built once Phase 1 is approved.

---

## 🏗️ 1. System Architecture

### Phase 1 — Demo Architecture (Simplified)
For the teacher demo, the full distributed system is scoped down to the minimum needed to prove the concept:
*   **Frontend:** Single Next.js app serving both a basic Student view (for sample submissions) and the Teacher Dashboard.
*   **Backend:** One FastAPI instance handles requests directly (No load balancer needed).
*   **Execution:** A single Celery worker (1 Docker container) pulls from Redis and runs code in one language only (Python).
*   **Sandbox:** Still uses an isolated, disposable Docker container per code run. **(This is NOT cut, as sandboxed execution is the core value proposition).**
    *   *Expert Note:* To achieve this locally, the Celery worker must be run with access to the host's Docker Socket (`/var/run/docker.sock`) using Docker-in-Docker (DinD) patterns.
*   **Update mechanism:** Simple polling (dashboard refreshes every 2–3 seconds) instead of WebSockets.
*   **Scale target:** 5–10 concurrent demo users (teachers + a few sample "student" submissions).

### Phase 2 — Full Distributed### A. Frontend Services (UI & i18n)
*   **Student Portal (Next.js):** The gamified learning interface.
*   **Teacher Dashboard (Next.js):** A separate portal for teachers.
*   **Bilingual Support (i18n):** The entire UI will support both **English and Myanmar**. Users can toggle between languages instantly. We will use a library like `next-intl`.

### B. Core Backend (Python FastAPI):** Acts as API Gateway. Multiple instances behind a Load Balancer. Forwards submissions to the Message Queue.
*   **Message Queue (Redis):** Holds all incoming code submissions in a waiting line.
*   **Worker Nodes (Celery in Docker):** Multiple Docker containers (5–10+, auto-scaling) pull from the queue in parallel.
*   **Isolated Execution (Sandbox):** Each worker spins up a brand-new, temporary Sandbox per submission, runs the code (Python, C++, Java), captures output, and destroys it.
*   **Real-time updates:** WebSocket-based push instead of polling.

---

## 💾 2. Database Schema (Bilingual Data)
We will use **PostgreSQL** (via Supabase). To support both English and Myanmar syllabus content efficiently, text fields will use `JSONB` to store dual translations.

1.  `Users`: (id, role, name, xp, hearts)
2.  `Lessons`: (id, unit, module, content [JSONB: en/mm], expected_output)
3.  `Submissions`: (id, user_id, lesson_id, submitted_code, language, status, execution_time, timestamp)

> [!TIP]
> **Phase 1 Database Suggestion:** To keep the demo setup lightweight, we will use the **Supabase Cloud Free Tier** instead of installing PostgreSQL locally on the demo laptop. We will also pre-populate 5-10 sample `Lessons` and one hardcoded teacher account.

---

## 🎓 3. Teacher & Admin Features

| Feature | Phase 1 (Demo) | Phase 2 (Production) |
| :--- | :--- | :--- |
| **Real-time online count** | ✅ via polling | ✅ via WebSocket |
| **Audit Trail (History)** | ✅ basic table view | ✅ full searchable/filterable |
| **Syllabus Builder (Visual UI)** | ⏳ Manual Database Entry | ✅ Teachers can visually add/edit Units, Modules, and Lessons directly from the Dashboard UI using forms. |
| **Plagiarism Detection** | ⏳ Shown as "Coming Soon" | ✅ Implemented (algorithm TBD) |

### ✨ New Feature Details: Syllabus Builder (Visual CMS)
*   **How it works:** Teachers do NOT need to write JSON or Markdown files. The Teacher Dashboard will have a full **Content Management System (CMS)** built-in.
*   **Visual Forms:** Teachers can click "Add Unit", type the title, click "Add Module", and then "Add Lesson".
*   **Code Editor integration:** For the "Initial Code" and "Expected Output" fields, the UI will embed a code editor (Monaco Editor) so teachers can test the code they are assigning directly in the browser before saving it to the database.

---

## 🔒 4. Security (Mandatory at any scale)
*   **Sandbox isolation:** Every code execution runs in a disposable Docker container, destroyed immediately after.
*   **Resource limits:** Hard CPU limit, memory cap, and execution timeout (e.g., 5–10s) to prevent a single submission from crashing the host.
*   **Network isolation:** Sandbox containers have no outbound internet access.
*   **Authentication:** Phase 1 uses a single hardcoded teacher login; Phase 2 requires proper university SSO/OAuth integration.

---

## 🎬 5. Phase 1 Demo Flow
1. Teacher logs in with the demo account.
2. A few sample "student" submissions are triggered. 
   *   *Expert Suggestion:* We will build a small Python **Simulator Script** that automatically fires 5 concurrent submissions to perfectly demonstrate the polling dashboard and queue in action.
3. Teacher Dashboard shows submissions arriving, pass/fail status, and execution time.
4. Teacher opens the Audit Trail to view a submitted student's exact code.
5. Wrap-up: Present the "Path to Production".

---

## 💰 6. Cost Analysis & Hardware Requirements
*   **Phase 1 (Demo):** Runs on a single developer laptop. Software cost: $0. Database hosted on Supabase Cloud Free Tier ($0).
*   **Phase 2 (500 CCU Full Production):** All software remains 100% free and open-source.
    *   *Hardware (On-Premise):* 16–32 Cores CPU, 32–64GB RAM, 1TB SSD. Estimated one-time cost: ~$2,000–$4,000 USD.
    *   *Cloud Alternative (AWS/DigitalOcean):* ~$150–$300/month.

---

> [!IMPORTANT]
> ## 🛑 User Review Required
> The SPEC has been fully updated to **Phase 1 (Teacher Demo) vs Phase 2 (Production)** based on your PDF, including all expert suggestions (Docker-in-Docker note, Supabase Cloud for Phase 1, and the Simulator script).
> 
> If you approve this phased approach, please click **"Proceed"** and we will begin building **Phase 1**.
