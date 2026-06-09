# HappyRun Troca Figurinha Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a hardcoded frontend that reproduces the 9-screen HappyRun trading journey from the provided reference and includes a screen-by-screen review flow.

**Architecture:** Use a Vite React TypeScript app with a single state-driven mobile frame component. Keep all content hardcoded in local data structures and drive the journey with deterministic screen state so each screen can be rendered directly for review.

**Tech Stack:** Vite, React, TypeScript, Vitest, Testing Library, plain CSS

---

### Task 1: Project scaffold

**Files:**
- Create: `package.json`, `src/*`, `public/*`, `vite.config.ts`, `tsconfig*.json`

- [ ] **Step 1: Scaffold the Vite React TypeScript app**

Run: `npx create-vite@latest . --template react-ts`
Expected: project files created in the current folder.

- [ ] **Step 2: Install dependencies**

Run: `npm install`
Expected: local `node_modules` and lockfile created with no install errors.

### Task 2: Journey behavior tests

**Files:**
- Create: `src/__tests__/journey.test.tsx`
- Modify: `src/App.tsx`, `src/main.tsx`, `src/index.css`

- [ ] **Step 1: Write failing tests for the initial screen and navigation**

Add tests that assert:
- the gancho screen renders first
- the continue/add buttons move through the journey
- the review controls can open a specific screen directly

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --runInBand`
Expected: FAIL because the custom journey UI is not implemented yet.

- [ ] **Step 3: Write minimal implementation**

Create a single screen-state component with hardcoded screen metadata and deterministic navigation.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- --runInBand`
Expected: PASS for the new journey tests.

### Task 3: Pixel-perfect UI pass

**Files:**
- Modify: `src/App.tsx`, `src/index.css`

- [ ] **Step 1: Implement the mobile frame and all 9 screens**

Recreate the reference using hardcoded assets, badges, progress markers, stat cards, chips, CTA buttons, and review controls.

- [ ] **Step 2: Verify with visual inspection and browser screenshots**

Run the app and inspect each screen in the browser.

- [ ] **Step 3: Refine spacing, colors, typography, and icon sizing**

Adjust CSS until the rendered screens match the reference closely.

### Task 4: Final verification

**Files:**
- Modify: `README.md` if needed

- [ ] **Step 1: Run the focused automated checks**

Run: `npm test -- --runInBand`
Expected: PASS.

- [ ] **Step 2: Run production build**

Run: `npm run build`
Expected: PASS with generated production bundle.

- [ ] **Step 3: Capture review notes**

Summarize any remaining visual gaps screen by screen.