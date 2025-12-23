# App Graph Builder

A responsive ReactFlow-based application graph builder with service node management, real-time inspector updates, and mobile support.

Live Demo: https://reactflow-canvas-mq9n.vercel.app

App Screenshot: <img width="1918" height="857" alt="image" src="https://github.com/user-attachments/assets/0cbd14d3-8654-4722-ab88-693cec6642c8" />


---

## Features

- Interactive Graph Canvas – ReactFlow-powered node visualization  
- Real-time Node Inspector – Edit nodes with instant visual feedback  
- Synced Slider/Input – Bidirectional sync persists to node data  
- Mobile Responsive – Slide-over drawer for small screens  
- Mock API – Simulated backend with loading and error states  
- State Management – Zustand for UI, TanStack Query for data  
- Professional UI – shadcn/ui components with dark theme  
- TypeScript Strict – Full type safety throughout  

---

## Tech Stack

- React 18 + TypeScript (strict mode)
- Vite – Fast build tool
- ReactFlow – Graph visualization library
- shadcn/ui – Headless UI components
- TanStack Query – Data fetching and caching
- Zustand – Lightweight state management
- Tailwind CSS – Utility-first styling
- Lucide React – Icon library

---

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Clone repository
git clone <your-repo-url>
cd app-graph-builder

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit **http://localhost:5173**

### Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
npm run typecheck  # TypeScript type checking
```

---

## Installation Issues & Solutions

### Issue 1: Tailwind Init Fails on Windows

**Error:**
```
could not determine executable to run
```

**Solution:** Manually create config files

**Create `tailwind.config.js`:**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ['./src/**/*.{ts,tsx}'],
  // ... rest of config
}
```

**Create `postcss.config.js`:**
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### Issue 2: Tailwind v4 Installed (Wrong Version)

**Error:**
```
Cannot apply unknown utility class 'border-border'
```

**Solution:**
```bash
npm uninstall tailwindcss
npm install -D tailwindcss@3.4.1 postcss@8.4.32 autoprefixer@10.4.16
```

### Issue 3: TypeScript Type Import Errors

**Error:**
```
'Node' is a type and must be imported using a type-only import
```

**Solution:**
```typescript
// Wrong
import { Node } from 'reactflow';

// Correct
import type { Node } from 'reactflow';
```

### Issue 4: React Hook Errors

**Error:**
```
Invalid hook call
```

**Solution:** Multiple React versions installed. Clean reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue 5: Missing Dependencies

**Error:**
```
Cannot find module '@tanstack/react-query'
```

**Solution:**
```bash
npm install @tanstack/react-query zustand lucide-react
```

### Issue 6: Vercel Build Fails

**Error:** Build fails on Vercel with `tsc -b && vite build`

**Solution:** Update `package.json`:
```json
{
  "scripts": {
    "build": "vite build",
    "typecheck": "tsc --noEmit"
  }
}
```

---

## Usage

- **Select App**: Click dropdown in top bar
- **Select Node**: Click any node on canvas
- **Edit Node**: Inspector appears on right (Config/Runtime tabs)
- **Delete Node**: Select node + press Delete/Backspace
- **Drag Nodes**: Click and drag to reposition
- **Zoom/Pan**: Mouse wheel + drag canvas

**Mobile**: Tap menu (≡) to open inspector drawer

---

## Key Design Decisions

### 1. Apps as Dropdown
- Screenshot showed dropdown, not fixed panel
- Better space utilization for canvas
- 
### 2. State Management
- **Zustand**: UI state (selections, panels)
- **TanStack Query**: Server state (apps, graphs)
- **ReactFlow**: Canvas state (positions, connections)

### 3. Mock API
- Used `setTimeout` wrapper (not MSW)
- Simpler, meets requirements
- 300-500ms latency, 10% error rate

### 4. Bidirectional Sync
- Inspector changes update visual nodes in real-time
- Required careful state flow: Inspector → App → FlowCanvas → ReactFlow

### 5. Build Configuration
- Separated `typecheck` from `build`
- Allowed Vercel deployment without blocking
- Type safety still enforced in development

---

## Known Limitations

1. **No Persistence** - State resets on refresh (could add localStorage)
2. **Mock Data Only** - No real backend (setTimeout wrapper for demo)
3. **Single Node Type** - Only service nodes (extensible for database/cache nodes)
4. **No Edge Editing** - Edges auto-created, can't be edited individually
5. **Mobile** - Can do better mobile responsiveness
6. **No Undo/Redo** - Could implement with state history
7. **Manual Layout** - No auto-layout algorithms
8. **Limited Keyboard Shortcuts** - Only Delete/Backspace (could add more)

---

## Requirements Met

-  Layout: top bar, left rail, canvas, inspector
-  ReactFlow: 3+ nodes, drag, select, delete
-  Node Inspector: tabs, status badge, synced slider/input
-  TanStack Query: mock API, loading/error states
-  Zustand: all required state
-  shadcn/ui components
-  TypeScript strict mode
-  All required scripts
-  Mobile responsive (drawer)

---

**Built with using React + TypeScript + Vite**
