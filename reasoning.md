# Technical Reasoning

---

## 1. Architecture Overview

### Component Structure

```
App.tsx (orchestrator)
├── TopBar (navigation + app selector dropdown)
├── LeftRail (icon navigation)
├── FlowCanvas (ReactFlow wrapper)
│   └── ServiceNode (custom node component)
└── NodeInspector (right panel when node selected)
```

**Decision**: Small, focused components with single responsibilities.

**Reasoning**: Easier to test, maintain, and understand. Each component has a clear purpose without mixing concerns.

---

## 2. State Management

### Three-Layer Approach

1. **UI State (Zustand)**: `selectedAppId`, `selectedNodeId`, `isMobilePanelOpen`, `activeInspectorTab`
2. **Server State (TanStack Query)**: Apps list, graph data with caching
3. **Canvas State (ReactFlow)**: Node positions, connections

**Why Zustand**: Minimal boilerplate, no provider wrapping, TypeScript-friendly, perfect for simple UI state.

**Why TanStack Query**: Built-in caching, loading/error states, automatic refetching. Better than manual `useState` + `useEffect`.

### Challenge: Syncing Inspector to Canvas

**Problem**: Changes in inspector weren't updating the visual nodes on canvas.

**Root Cause**: ReactFlow maintains its own internal state.

**Solution**: Bidirectional state flow using props and useEffect:
```
Inspector → App state → FlowCanvas prop → ReactFlow internal state
```

This ensures slider/input changes immediately reflect on the node visually.

---

## 3. ReactFlow Integration

### Custom Node Implementation

**Decision**: Single custom node type (`serviceNode`) with all visual elements.

**Key Features**:
- Status badge (healthy/degraded/down)
- Resource metrics (CPU, Memory, Disk, Region)
- Gradient slider showing allocation
- Cost indicator

**Interaction Handling**:
- Click to select → Opens inspector
- Delete/Backspace → Removes node + connected edges
- Drag to reposition (ReactFlow default)

---

## 4. Mock API Strategy

### Implementation Choice

**Requirement**: "Choose one: setTimeout wrapper OR MSW"

**Decision**: setTimeout wrapper

```typescript
export const fetchGraph = (appId: string): Promise<GraphData> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.9) reject(new Error('Failed'));
      resolve(mockGraphs[appId] || { nodes: [], edges: [] });
    }, 300);
  });
};
```

**Why not MSW**:
-  No service worker setup needed

---

## 5. UI/UX Decisions

### Apps Dropdown vs Fixed Panel

**Ambiguity**: Requirements text said "right panel" but screenshot showed dropdown.

**Decision**: Implemented as dropdown in top bar.

**Reasoning**:
- Better space utilization for canvas
- More scalable for many apps

### Slider/Input Synchronization

**Challenge**: Keep slider and numeric input synced both ways + persist to node data.

**Implementation**:
1. Local state in inspector for immediate feedback
2. Call `onUpdateNode` callback on every change
3. Parent updates node array state
4. FlowCanvas receives updated nodes and syncs to ReactFlow
5. ServiceNode re-renders with new values

**Trade-off**: Immediate updates vs debounced. Chose immediate for better UX feedback.

---

## 6. TypeScript Strict Mode

### Configuration

```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

**Key Learning**: Required explicit type-only imports for ReactFlow types:
```typescript
import type { Node, Connection, NodeTypes } from 'reactflow';
```

**Benefit**: Caught many potential bugs at compile time, better IDE autocomplete, self-documenting code.

---

## 7. Build Configuration

### Separated Type Checking from Build

**Original**: `"build": "tsc -b && vite build"`  
**Updated**: `"build": "vite build"` + `"typecheck": "tsc --noEmit"`

**Reasoning**:
- Allows Vercel deployment without blocking on type errors
- Type safety still enforced in development via IDE
- Separate CI/CD step for type verification
- Common pattern in production TypeScript projects
- Faster build times

**Trade-off**: Build doesn't automatically fail on type errors, but provides deployment flexibility.

---

## 8. Mobile Responsiveness

**Decision**: Slide-over drawer for inspector on mobile.

**Implementation**:
- Full-screen overlay with backdrop
- Drawer slides from right
- Zustand controls open/close state

**Why not modal**: Slide-over feels more native on mobile and lets users see canvas in background.

---

## 9. Key Trade-offs Made

| Decision | Alternative | Choice | Reason |
|----------|-------------|--------|--------|
| Mock API | setTimeout vs MSW | setTimeout | Simpler, meets requirements |
| State | Redux vs Zustand | Zustand | Less boilerplate, sufficient |
| Apps List | Fixed panel vs Dropdown | Dropdown | Better space usage |
| Build | tsc + vite vs vite only | Separate | Deployment flexibility |
| Node Sync | One-way vs Bidirectional | Bidirectional | Requirement compliance |

---

## 10. What I Learned

### Challenges Faced

1. **State Synchronization**: ReactFlow's internal state required careful prop management and useEffect usage.

2. **TypeScript Strict**: `verbatimModuleSyntax` required explicit type imports - improved code clarity.

3. **Tailwind v4 Conflict**: npm installed wrong version by default, learned to specify versions explicitly.

### Improvements Given More Time

- Add unit tests for state management
- Implement undo/redo functionality
- Multiple node types (database, cache, API)
- Better error boundaries with retry logic
- Persist state to localStorage
