# Xore Roofing × Auxilium GTM Proposal App

A single-page React + Vite + TypeScript application for crafting and sharing interactive go-to-market proposals. The experience is tuned for Xore Roofing and Auxilium with editable ICP, budget scenarios, KPI tracking, and exportable print output.

## Features

- ✨ **Executive-ready UI** with Tailwind CSS, shadcn-inspired components, and Framer Motion transitions.
- 🧠 **Editable strategy blocks** including BLUF, ICP outline, budgets, KPIs, tasks, RAID log, and decisions/milestones.
- 📊 **Dynamic budget math** with live CAC/CPL calculations and tiered scenario toggles.
- ⚠️ **Capacity guardrails** that highlight risk if projected wins exceed the sales team threshold.
- 💾 **State persistence** to `localStorage`, plus JSON download/upload and shareable URL hashes.
- 🖨️ **Print-optimized proposal** view ready for html2canvas + jsPDF export.

## Getting Started

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

> **Note:** The repo ships without installed dependencies. Run `npm install` before starting the dev server.

## PDF Export & Sharing

- **Export PDF:** Click `Export PDF` in the header. The Printable Proposal tab is rendered off-screen and exported using html2canvas + jsPDF.
- **Share Link:** Use `Share Link` to open the dialog, then copy the generated URL. The entire proposal state is encoded into the URL hash.
- **Download / Upload JSON:** Buttons in the header and dialog allow offline backups and restores.

## Project Structure

```
├── index.html
├── package.json
├── src
│   ├── App.tsx
│   ├── components/ui
│   ├── lib
│   ├── sections
│   ├── styles
│   └── types.ts
└── tailwind.config.cjs
```

## Tech Stack

- [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) build tooling
- [Tailwind CSS](https://tailwindcss.com/) utility styling
- shadcn-inspired custom UI primitives (Button, Card, Tabs, Dialog, Table, Badge, Toggle, Alert)
- [Framer Motion](https://www.framer.com/motion/) animations
- [Lucide Icons](https://lucide.dev/)
- [html2canvas](https://html2canvas.hertzen.com/) + [jsPDF](https://github.com/parallax/jsPDF) for PDF export

## Linting & Type Safety

TypeScript is configured in strict mode. Run the quick check with:

```bash
npm run lint
```

## Deployment

Build the production bundle with:

```bash
npm run build
```

Then serve the `dist` directory with any static host (e.g., Vercel, Netlify, or S3/CloudFront).

## Accessibility

- Keyboard-focusable buttons, tabs, and sliders
- ARIA labels on controls
- Print styles to maintain readability in exported PDFs

## License

Proprietary – provided for Auxilium internal and client-facing use.
