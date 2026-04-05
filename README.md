# AI Agent Profile Builder

A modern, drag-and-drop interface for composing custom AI agents from
profiles, skills, and personality layers — built as a frontend take-home challenge.

---

## What is this?

You pick a **base profile** (like "Code Assistant" or "Creative Writer"),
drag on **skills** (like Web Search or Code Execution), stack some
**personality layers** (Chain of Thought? Pirate Persona? Why not both),
pick an **AI provider**, name your agent, and save it.

---

## Features

- Drag and drop skills and layers onto your agent canvas (desktop)
- Tap to add on mobile — no awkward dragging on small screens
- Accordion panel on the left keeps things clean and uncluttered
- Saved agents persist in localStorage — they survive page refreshes
- Confirm modal before any destructive action (no accidental deletions)
- Toast notifications for every action — save, load, delete, clear
- Fully responsive — works on phones, tablets, and wide monitors
- Session timer so you know how long you've been lost in agent-land

---

## Tech Stack

- React + TypeScript + Vite
- Tailwind CSS
- dnd-kit (drag and drop)
- Lucide React + react-hot-toast

---

## Getting Started

```bash
git clone https://github.com/basnetsushant/ai-agent-builder
cd ai-agent-builder
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and start building agents.

---

## How to use it

1. **Pick a profile** — click one from the Base Profile section on the left
2. **Add skills** — drag them onto the Skills drop zone (or tap on mobile)
3. **Add layers** — same idea, drag or tap from the Layers section
4. **Pick a provider** — Claude, ChatGPT, Gemini, DeepSeek, or Kimi
5. **Name and save** — give your agent a name and hit Save
6. **Load or delete** — your saved agents appear at the bottom of the canvas

---
