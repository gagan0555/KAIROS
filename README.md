# Kairos 🌌
### *The Active Autonomous Life & Career Operating System*

Kairos is an active, multi-agent personal orchestration ecosystem that completely re-engineers human productivity. It shifts the paradigm from **passive digital checklists**—which rely on tedious manual tracking and easily ignored push notifications—into an **Active Autonomous Execution Partner**.

Designed to eliminate operational paralysis during high-stress corporate recruitment cycles, heavy academic workloads, and daily logistical administration, Kairos actively intercepts unstructured human chaos (chat logs, screenshots, emails) and converts it into a structured, optimized, and self-defending timeline.

---

## 🚀 Key Innovation Pillars

### 1. Unified Icon-Driven Dashboard Layout
Kairos completely discards confusing left-sidebar layouts. The interface utilizes a premium, centralized **Navigation Grid** built with glassmorphism panels, deep slate/charcoal tones, and glowing status borders. Users navigate seamlessly across modules via distinct dashboard tiles:
*   **[Shield] Chrono-Shield:** Lock in non-negotiable physical calendar blocks.
*   **[PlusCircle] Multimodal Dropzone:** Drag and drop unstructured raw text or image screenshots.
*   **[Trello] Kanban Pipeline:** Track customizable, infinite-stage life workflows.
*   **[Zap] Focus Chamber:** Enter fullscreen, distraction-free execution blocks.
*   **[Terminal] Agent Council Log:** View live multi-agent negotiation transcripts.
*   **[Sliders] Priority Engine:** Dynamically adjust task weight variables from 0 to 100%.

### 2. Seamless Interactive App Guide, Google Auth & Profile Customization
* **Google Authentication:** Streamlined login workflow that removes onboarding friction. No corporate or university ID is required; users validate with a single click to securely bind their calendar states.
* **Dynamic User Profile Customization:** Immediately following a successful Google login event, the system prompts the user to input an editable display name and select a visual identity token from a curated preset library of avatar designs. This profile state writes directly to the local persistence layers and permanently projects the user's name and avatar avatar element into the global application header.
* **Enhanced Multi-Stage Guided Tour:** Upgrades standard onboarding into an active, context-aware layout walkthrough wizard. The framework dynamically positions helpful explanatory tooltips directly adjacent to active UI elements (Dropzone, Chrono-Shield, Focus Chamber) complete with a live step progress indicator (e.g., 'Step 3 of 6') along with functional, highly visible 'Next' and 'Skip Tour' action anchors at every stage.

### 3. Database De-Confliction & Google Calendar API Logic
To prevent task-overlapping scheduling chaos, the system implements a strict backend validation check (`checkTemporalOverlap`). Combined with a live Google Calendar API sync framework, the algorithm cross-evaluates calendar intervals:
*   If a temporal conflict occurs, the engine analyzes the `importance_percentage` vectors of the colliding blocks.
*   The lower-weighted item is dynamically shifted forward into the next available free window.
*   A non-degradable 10-minute protective transition buffer is automatically applied to guarantee intervals never overlap.

### 4. The Single-Call 7-Agent Cognitive Council
The orchestration backend executes multi-turn multi-agent deliberation within **exactly ONE comprehensive API call to Gemini 1.5 Pro**. The model simulates an internal monologue debate among 7 specialized sub-agents:
1.  **`Urgency_Sentinel`:** Enforces absolute deadline, OA, and placement milestone compliance.
2.  **`Burnout_Governor`:** Tracks rolling 48-hour task compliance, dynamically launching *Recovery Mode* (smoothing task density) or *Acceleration Mode* (injecting productive habits).
3.  **`Chrono_Gatekeeper`:** Safeguards the untouchable physical boundaries of the Chrono-Shield.
4.  **`Habit_Architect`:** Micro-injects growth routines into open calendar voids to eliminate dead time.
5.  **`Skill_Synthesizer`:** Interrogates qualitative user failure feedback to generate custom 3-day remedial syllabi.
6.  **`Admin_Quartermaster`:** Automates calendar syncs, logistics, and routine administrative tracking.
7.  **`Focus_Guardian`:** Manages attention budgets and monitors context-switching inside active work blocks.

---

## 📦 Tech Stack
*   **Intelligence Layer:** Google AI Studio, Gemini 1.5 Pro, Gemini Function Calling API.
*   **Frontend Engine:** React, TypeScript, Vite, Tailwind CSS, Lucide React Icons.
*   **Backend Server:** Node.js, Express REST Framework.
*   **Persistence Store:** Embedded SQLite Database Layer with strict `checkTemporalOverlap` queries.

---

## ⚡ Quick Start & Installation

### Prerequisites
*   Node.js v18+
*   Gemini API Key (via Google AI Studio)

### Steps
1.  Clone the repository:
    ```bash
    git clone [https://github.com/yourusername/kairos.git](https://github.com/yourusername/kairos.git)
    cd kairos
    ```
2.  Install all packages:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the root directory:
    ```env
    VITE_GEMINI_API_KEY=your_gemini_api_key_here
    PORT=3000
    ```
4.  Boot up the development environment:
    ```bash
    npm run dev
    ```

### 🏆 One-Click Evaluator Hackathon Demo Mode
To allow judges to witness 100% of the platform's multi-agent depth in under 10 seconds, click the **"Launch Hackathon Demo Mode"** button at the top of the screen. This immediately seeds the database state with a mock engineering timetable, an imminent 24-hour Uber OA deadline (95% priority), a 52% compliance flag that shifts the theme into Recovery Mode, and an active terminal log printing the 7-agent network's execution argument in real time.
