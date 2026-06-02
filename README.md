# 🚀 PromptCraft AI — AI Marketing Prompt Generator & Smart Poster Design Studio

PromptCraft AI is a complete full-stack SaaS-style application designed for marketing professionals, content creators, and corporate design teams. It combines state-of-the-art Generative AI with a real-time, interactive marketing overlay design studio to generate, polish, and export production-ready advertising flyers, courses, and promotional posters instantly.

Integrated with **Google Gemini Pro** and **Pollinations AI**, pre-configured with a custom Portrait Presets engine, and powered by client-side LocalStorage state persistence, PromptCraft AI stands as a showcase-ready, highly polished asset for modern portfolio presentations and hosting.

---

## ✨ Primary Product Capabilities

### 1. Unified SaaS-Style Dashboard
* **Dynamic Analytics Counters:** Track productivity metrics with interactive status cards—*Posters Created, Prompts Generated, Templates Installed, and Downloads Count*—seamlessly persisted inside LocalStorage.
* **Pre-packed Template Library:** Instantiate pre-mapped brand overlays with one click across 8 diverse industries including AI Engineering, Digital Marketing, Healthcare, Real Estate, Education, Restaurants, Corporate, and Events.
* **Prompt History Dashboard Sidebar:** Instantly browse, edit, recreate, or copy previously run background creations with quick-action telemetry widgets.

### 2. Full-Feature Prompt Synthesizer
* **Intelligent Gemini Polish:** Convert raw thoughts into exquisite descriptive prompts using custom LLM prompts on the Express backend.
* **Aspect Ratio Optimization:** Switch seamlessly across multiple standardized viewport layouts: **Square (1:1)**, **Instagram Standard (4:5)**, **TikTok Story (9:16)**, and **Landscape Presentation (16:9)**.
* **Quality Preservation Harness:** Automatically appends photorealistic parameters (symmetrical eyes, studio lights, 8k best quality) and enforces standard negative masks (blurry, bad anatomy, deformed limbs) to ensure perfect rendering.
* **Human Portrait Presets:** Tailored portrait modifier matrix activated automatically when human figures, faces, teachers, students, models, or corporate staff are detected.

### 3. Smart Marketing Poster Design Studio
* **Cohesive Translucent Overlay Engine:** Dynamically renders company subtitles, highlights, CTAs, and enquiries on top of background canvases.
* **Conditional Spacing Adjustment:** Fully reactive layout architecture. Empty config fields are automatically omitted from the live drawing, adjusting typography spacing without leaving blank space.
* **Physical Brand Logo Uploader:** Drag-and-drop support for PNG, JPEG, and SVG files with visual sliders to control position (X-Coord & Y-Coord) and size Scale parameters.
* **Super-HD Canvas Exporter:** Draws original high-resolution graphics and vectors perfectly blended together, downloading as premium-quality marketing layout PNGs with robust offline fallback mechanisms.

### 4. Interactive Full-Screen Preview Modal
* **Fidelity Control UI:** Inspect details using dynamic *Zoom In*, *Zoom Out*, and *Reset* controls.
* **Click-to-Dismiss Overlay:** Easy user navigation via a sleek dark background vignette modal.

---

## 🛠️ Technological Stack

* **Frontend Framework:** React 18 with Vite
* **Programming Paradigm:** TypeScript (Strict Type Safety & Typed Enums)
* **Styling Matrix:** Tailwind CSS (Fluid utility layers, dark slate aesthetic)
* **Visual Icons:** Lucide React
* **Analytics Engine:** Recharts
* **Vector Composites:** HTML5 Canvas API + `html2canvas`
* **Backend Gateway:** Express (Node running over standard ES Module Bundling)
* **State Persistence:** Persistent Client-Side LocalStorage Keys

---

## 🏗️ Structure and Workspace Layout

```bash
├── package.json          # Node script commands & workspace project dependencies
├── server.ts             # Express gateway hosting Gemini connections & Vite proxying
├── index.html            # Static HTML landing shell
├── vite.config.ts        # Custom configuration for ES module bundling
├── src/
│   ├── main.tsx          # Frontend program entry point
│   ├── App.tsx           # Orchestrator core (manages active workspace tabs & system state)
│   ├── types.ts          # Central state definitions and data interface structures
│   ├── index.css         # Tailwind directives & Inter/JetBrains Mono typography definitions
│   └── components/
│       ├── Dashboard.tsx          # SaaS stats dashboard, library lists & histories
│       ├── Sidebar.tsx            # Unified sidebar navigation
│       ├── Header.tsx             # Clean top toolbar, brand headers & dark theme toggles
│       ├── PromptCreatorStudio.tsx # Parameterized prompt synthesis workspace
│       └── PosterDesignStudio.tsx # Custom overlay compositor with logo drag-and-drop
```

---

## 🚦 Installation and Development

To spin up and interact with PromptCraft AI locally, clone the workspace and adhere to the commands outline below:

### 1. Install Workspace Dependencies
Ensure high-speed dev environments by pulling mandatory packages:
```bash
npm install
```

### 2. Configure Environment Secrets
Establish your backend API key in the root directory:
Create a `.env` file containing:
```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```

### 3. Launch Development Server
Boot the Express microserver carrying live Vite HMR middleware:
```bash
npm run dev
```

The application will launch on your local port: [http://localhost:3000](http://localhost:3000).

---

## 🧩 Build for Production and Deployment

To bundle the application for production hosting (e.g. Netlify for static frontend, or Render/Cloud Run for full-stack environments):

```bash
npm run build
```

This processes assets through:
1. `vite build` compilation mapping frontend statics perfectly to `/dist`.
2. Bundles the production backend Node server into a unified `dist/server.cjs` script.

Launch production server:
```bash
npm run start
```

---

## 🎨 Visual Identity

PromptCraft AI uses a dark interface called **slate cosmic**, framed with deep space borders (`bg-[#0c0d1b]`), vibrant indigo/purple control highlights, and precise Inter typography paired with Fira Mono counters for an attractive, highly premium developer aesthetic.
