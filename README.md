# 90DaysOfDevOps - Interactive Learning Platform 🚀

A modern, fast, and interactive Learning Platform built on top of Michael Cade's popular [90DaysOfDevOps](https://github.com/MichaelCade/90DaysOfDevOps) repository (29k+ stars).

![Platform Preview](/public/logo.png)

---

## 🌟 Key Features

1. **Interactive 90-Day Learning Matrix**
   - 90-day visual curriculum grid with color-coded modules.
   - Filter by status (*Completed*, *Pending*, *Bookmarked*) or by module.
   - Real-time hover preview and direct navigation to any day.

2. **13 Structured DevOps Modules**
   - **Module 1**: DevOps Culture & Fundamentals (Days 1–6)
   - **Module 2**: Programming with Go (Days 7–13)
   - **Module 3**: Linux Administration & Scripting (Days 14–20)
   - **Module 4**: Computer Networking for DevOps (Days 21–27)
   - **Module 5**: Cloud Foundations (AWS & Azure) (Days 28–34)
   - **Module 6**: Git & Version Control Mastery (Days 35–41)
   - **Module 7**: Containers & Docker Architecture (Days 42–48)
   - **Module 8**: Kubernetes & Orchestration (Days 49–55)
   - **Module 9**: Infrastructure as Code (Terraform) (Days 56–62)
   - **Module 10**: Configuration Management (Ansible) (Days 63–69)
   - **Module 11**: CI/CD Pipelines & Automation (Days 70–76)
   - **Module 12**: Monitoring, Observability & Logs (Days 77–83)
   - **Module 13**: Data Storage, Backup & Security (Days 84–90)

3. **Daily Learning Experience**
   - Clean, modern reader UI with dark mode optimized for developers.
   - Markdown rendering with syntax-highlighted code blocks and one-click copy.
   - All 880+ original diagrams and screenshots properly served and optimized.
   - Estimated reading times, tag categorization, and breadcrumb navigation.
   - Previous / Next day pagination.

4. **Progress Tracking & Gamification**
   - LocalStorage persistence for instant, zero-friction saves (no account needed).
   - Daily completion check-offs with confetti celebrations 🎉.
   - Active learning streak counter (🔥) and completion progress bars.
   - **16 Achievement Badges** to unlock as you progress through modules.
   - Personalized **Certificate of Completion** generated with unique verification code upon completing all 90 days (printable & downloadable as PDF).

5. **Interactive DevOps Knowledge Checks (Quizzes)**
   - Curated technical quizzes for all 13 modules.
   - Immediate feedback with in-depth technical explanations.
   - Score tracking, accuracy percentages, and retry support.

6. **DevOps CLI Cheat Sheet & Quick-Reference**
   - Searchable database of 100+ essential CLI commands across Linux, Docker, Kubernetes, Git, Terraform, Ansible, Networking, and Monitoring.
   - One-click copy and command explanations.

7. **Personal Notes & Bookmarks**
   - In-app note-taking drawer on every day with auto-save.
   - Dedicated Notes dashboard with full-text search and one-click Markdown export.

8. **Instant Search (`Cmd+K` / `Ctrl+K`)**
   - Global modal search indexing all 90 days, modules, topics, and tags.

9. **Multi-Track Support**
   - Pre-configured to support toggling between **2022 (DevOps Foundations)**, **2023 (DevSecOps Track)**, and **2024 (Community Sessions)**!

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) 16 (App Router)
- **Frontend**: [React](https://react.dev/) 19 & TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4
- **Icons**: [Lucide React](https://lucide.dev/)
- **Markdown**: `react-markdown`, `remark-gfm`, `rehype-raw`, `gray-matter`
- **Celebrations**: `canvas-confetti`

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd /Users/gaurav/devops-90days-platform
pnpm install
```

### 2. Run Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build
```bash
pnpm build
pnpm start -p 3000
```

---

## 📁 Project Structure

```
devops-90days-platform/
├── content/               # Markdown curriculum content
│   ├── 2022/              # Days 1–90 (Core DevOps Foundations)
│   ├── 2023/              # Days 1–90 (DevSecOps Track)
│   └── 2024/              # Days 1–91 (Community Edition)
├── public/                # Static assets & images
│   ├── Images/            # 880+ original architecture diagrams & screenshots
│   └── *.png / *.jpg      # Track covers and badges
├── src/
│   ├── app/
│   │   ├── page.tsx               # Dashboard / Interactive Matrix Home
│   │   ├── layout.tsx             # Root layout with providers & nav
│   │   ├── day/[slug]/page.tsx    # Day Reader & learning experience
│   │   ├── modules/page.tsx       # 13 modules curriculum index
│   │   ├── quizzes/page.tsx       # Interactive module knowledge checks
│   │   ├── cheatsheet/page.tsx    # DevOps CLI Cheat Sheet
│   │   ├── badges/page.tsx        # Gamified achievement badges
│   │   └── notes/page.tsx         # User notes hub & Markdown export
│   ├── components/                # Reusable UI components
│   │   ├── Navbar.tsx
│   │   ├── RoadmapMatrix.tsx
│   │   ├── ModuleCards.tsx
│   │   ├── MarkdownViewer.tsx
│   │   ├── DaySidebar.tsx
│   │   ├── GlobalSearchModal.tsx
│   │   ├── QuizModal.tsx
│   │   ├── NotesDrawer.tsx
│   │   └── CertificateModal.tsx
│   ├── context/
│   │   └── ProgressContext.tsx    # LocalStorage progress & streak state
│   └── lib/                       # Data structures, quizzes, and helpers
│       ├── types.ts
│       ├── curriculum.ts
│       ├── content.ts
│       ├── quizzes.ts
│       └── cheatsheet.ts
└── package.json
```

---

## 📜 Attribution & License

- Original curriculum content and roadmap by [Michael Cade](https://github.com/MichaelCade) under [Creative Commons Attribution-NonCommercial-ShareAlike 4.0](http://creativecommons.org/licenses/by-nc-sa/4.0/).
- Interactive Learning Platform codebase licensed under MIT.
