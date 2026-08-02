# 🛠️ Team Collaboration Guideline (Developer Handbook)

This document outlines the exact responsibilities, API contracts, and skill references for the 3 developers building the DeepDive Learn Enterprise Platform.

---

## 👨‍💻 Developer 1: Frontend (Next.js)
**Focus:** UI/UX, State Management, and API Integration.
**Skill Files to Reference:** 
- `nextjs-starter` (For Duolingo-style UI patterns and Zustand state management).

### APIs to Consume (Provided by Dev 2):
1. **Submit Code for Execution**
   - **Endpoint:** `POST /api/v1/submissions`
   - **Payload to send:** 
     ```json
     {
       "user_id": "user_123",
       "lesson_id": "lesson_1",
       "code": "print('Hello World')",
       "language": "python"
     }
     ```
   - **Response:** `{"submission_id": "sub_999", "status": "queued"}`

2. **Check Execution Status (Polling for Phase 1)**
   - **Endpoint:** `GET /api/v1/submissions/{submission_id}`
   - **Response (if done):** 
     ```json
     {
       "status": "completed",
       "output": "Hello World\n",
       "error": null,
       "execution_time_ms": 120
     }
     ```

### UI/UX & Development Tasks:
As the Frontend Developer, you are responsible for the entire visual experience for both students and teachers.

**1. Student Portal (Duolingo Style UI/UX):**
- **Learning Tree (Path):** Build a vertical, scrolling map where lessons are connected by SVG dashed lines. Units should be distinct sections with clear titles.
- **Gamification Elements:** 
  - **Hearts System:** Display hearts (lives) at the top. Deduct a heart if the `status` from the execution API is `error` or `passed: false`. Show a modal when out of hearts.
  - **XP & Streaks:** Animate the XP bar and show fire icons for daily streaks after a successful code submission.
  - **Mascot/Animations:** Use simple SVGs or Lottie animations for a mascot that cheers when the student passes a lesson.
- **Interactive Coding Screen:**
  - Build a two-pane layout: Theory/Instructions on the left, Monaco Code Editor on the right.
  - Include an interactive "Run Code" button that changes state to a spinning loader while polling the execution API.
  - Show a sliding bottom sheet (green for success, red for error) with the actual stdout/stderr when execution completes.

**2. Teacher Dashboard & CMS:**
- **Visual Syllabus Builder:** Build forms for teachers to visually Add/Edit Units, Modules, and Lessons (integrating Monaco Editor for typing starter code).
- **Audit Trail & Stats:** Build tables and charts (using a library like Recharts) to display online student count and submission histories from Dev 2's API.
- **i18n (Bilingual):** Integrate `next-intl` to allow toggling the entire interface between English and Myanmar.

**3. API Integration:**
- Remove the local `react-py` engine (from Phase 1 MVP).
- When the user clicks "Run", send the `POST` request.
- Set up a polling interval (every 2 seconds) using the `GET` endpoint until the status is `completed` or `error`.
- Update the Zustand global state (Hearts, XP) based on the output.

---

## 👨‍💻 Developer 2: Unified Backend API (FastAPI)
**Focus:** Monolithic REST APIs (Student + Teacher), Database interactions, and Redis Queuing.
**Skill Files to Reference:** 
- `deep-dive-python` (To understand the curriculum data structure and Expected Outputs).

### APIs to Produce (Unified on Port 8000):
Since we are using a traditional backend approach (not microservices), you will build **ALL** APIs for both the Student and Teacher sides on a single FastAPI server.

**[Student APIs]**
1. `POST /api/v1/submissions` (Queue code to Redis)
2. `GET /api/v1/submissions/{id}` (Poll status)
3. `GET /api/v1/lessons` (List all lessons for dashboard)
4. `GET /api/v1/lessons/{id}` (Get specific lesson content)

**[Teacher APIs]**
5. `POST /api/teacher/auth/login` (Teacher Login)
6. `GET /api/teacher/stats` (Dashboard stats - online count, total submissions)
7. `GET /api/teacher/submissions` (Audit trail - list of all student submissions)
8. `POST, PUT, DELETE /api/teacher/lessons` (CRUD endpoints for Visual Syllabus Builder)
9. `POST /api/teacher/simulate` (Trigger fake submissions for demo)

### Internal Contract (For Dev 3):
- When a `POST /api/v1/submissions` request arrives, do NOT run the Python code.
- Instead, push a task to the **Redis Message Queue** via Celery:
  ```python
  # Celery Task Call
  execute_code_task.delay(submission_id="sub_999", code="print('Hello World')", lang="python")
  ```

### Database Tables & Relationships (Supabase Setup)
You are responsible for defining the Supabase Schema. Here are the core tables and their relationships:

1. **`users` Table** (Stores both students and teachers)
   - `id` (UUID, Primary Key)
   - `name` (String)
   - `role` (String: 'student' or 'teacher')
   - `xp` (Integer, default 0)
   - `hearts` (Integer, default 5)
   - `created_at` (Timestamp)

2. **`units` Table** (Highest level of syllabus)
   - `id` (UUID, Primary Key)
   - `title` (String, e.g., "Unit 1: Python Basics")
   - `order_index` (Integer)

3. **`modules` Table** (Sub-topics under a unit)
   - `id` (UUID, Primary Key)
   - `unit_id` (UUID, Foreign Key -> `units.id`)
   - `title` (String, e.g., "Variables")
   - `order_index` (Integer)

4. **`lessons` Table** (The actual coding challenges)
   - `id` (UUID, Primary Key)
   - `module_id` (UUID, Foreign Key -> `modules.id`)
   - `title` (String, e.g., "Output ထုတ်ခြင်း")
   - `theory_content` (Text/Markdown)
   - `starter_code` (Text, e.g., `print("___")`)
   - `expected_output` (Text, exact stdout match)
   - `xp_reward` (Integer, default 15)
   - `order_index` (Integer)

5. **`submissions` Table** (Tracks code executions and history)
   - `id` (UUID, Primary Key)
   - `user_id` (UUID, Foreign Key -> `users.id`)
   - `lesson_id` (UUID, Foreign Key -> `lessons.id`)
   - `submitted_code` (Text)
   - `language` (String, e.g., "python")
   - `status` (String: 'queued', 'running', 'completed', 'error')
   - `passed` (Boolean)
   - `output` (Text, actual stdout from container)
   - `error` (Text, actual stderr)
   - `execution_time_ms` (Integer)
   - `created_at` (Timestamp)

**Relationships summary:**
- A **Unit** has many **Modules** (1-to-Many).
- A **Module** has many **Lessons** (1-to-Many).
- A **User** has many **Submissions** (1-to-Many).
- A **Lesson** has many **Submissions** (1-to-Many).

---

## 👨‍💻 Developer 3: Distributed Execution Engine (Celery + Docker)
**Focus:** Background Workers, Docker Sandboxing, and System Infrastructure.
**Skill Files to Reference:** 
- `deep-dive-python` (For setting up correct Python execution environments and dependencies if needed).

### The Worker Logic:
1. **Listen:** The Celery worker constantly listens to the Redis queue for `execute_code_task`.
2. **Execute (The Sandbox):** When a task is received, the worker executes a shell command to run a temporary Docker container.
   ```bash
   docker run --rm -m 128m --cpus 0.5 -v /tmp/code:/app python:3.10 python /app/script.py
   ```
3. **Capture & Update:** 
   - Capture the `stdout` (Output) and `stderr` (Errors).
   - Update the **Supabase Database** directly: Change the submission status to `"completed"` and save the output. (This allows Dev 2's API to fetch the completed result when Dev 1 polls for it).

### DevOps Tasks:
- Write the `docker-compose.yml` file to spin up:
  - 1x FastAPI Container
  - 1x Redis Container
  - 3x Celery Worker Containers (The Distributed Nodes)
- Ensure the Celery containers have access to the host's Docker socket (`/var/run/docker.sock`) so they can spin up the Sandbox containers (Docker-in-Docker pattern).
