import type { PatternSection } from "./types.js";

export const PATTERNS: Record<PatternSection, string> = {
  "zustand-store": `# Zustand Store Architecture for React Flow

\`\`\`ts
import { create } from 'zustand';
import {
  type Node, type Edge, type OnNodesChange, type OnEdgesChange, type OnConnect,
  applyNodeChanges, applyEdgeChanges, addEdge,
} from '@xyflow/react';

type FlowState = {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNode: (node: Node) => void;
  removeNode: (id: string) => void;
  updateNodeData: (id: string, data: Partial<Record<string, unknown>>) => void;
};

const useFlowStore = create<FlowState>((set, get) => ({
  nodes: [],
  edges: [],
  onNodesChange: (changes) => set({ nodes: applyNodeChanges(changes, get().nodes) }),
  onEdgesChange: (changes) => set({ edges: applyEdgeChanges(changes, get().edges) }),
  onConnect: (connection) => set({ edges: addEdge(connection, get().edges) }),
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  addNode: (node) => set({ nodes: [...get().nodes, node] }),
  removeNode: (id) => set({
    nodes: get().nodes.filter((n) => n.id !== id),
    edges: get().edges.filter((e) => e.source !== id && e.target !== id),
  }),
  updateNodeData: (id, data) => set({
    nodes: get().nodes.map((n) => n.id === id ? { ...n, data: { ...n.data, ...data } } : n),
  }),
}));

export default useFlowStore;
\`\`\`

**Usage with stable selectors (prevents re-renders):**
\`\`\`tsx
const selector = (s: FlowState) => ({
  nodes: s.nodes, edges: s.edges,
  onNodesChange: s.onNodesChange,
  onEdgesChange: s.onEdgesChange,
  onConnect: s.onConnect,
});

function Flow() {
  const store = useFlowStore(selector);
  return <ReactFlow {...store} fitView />;
}
\`\`\``,

  "undo-redo": `# Undo / Redo with Zundo

\`\`\`bash
npm install zundo
\`\`\`

\`\`\`ts
import { create } from 'zustand';
import { temporal } from 'zundo';

const useFlowStore = create<FlowState>()(
  temporal(
    (set, get) => ({
      nodes: [],
      edges: [],
      onNodesChange: (changes) => set({ nodes: applyNodeChanges(changes, get().nodes) }),
      onEdgesChange: (changes) => set({ edges: applyEdgeChanges(changes, get().edges) }),
      onConnect: (connection) => set({ edges: addEdge(connection, get().edges) }),
    }),
    {
      // Only track meaningful changes, not every drag pixel
      equality: (past, current) =>
        JSON.stringify(past.nodes.map(n => ({ id: n.id, position: n.position, data: n.data }))) ===
        JSON.stringify(current.nodes.map(n => ({ id: n.id, position: n.position, data: n.data }))),
      limit: 50,
    }
  )
);

// Hook for undo/redo
export function useFlowHistory() {
  return useFlowStore.temporal.getState();
}
\`\`\`

**Usage:**
\`\`\`tsx
function UndoRedoControls() {
  const { undo, redo, pastStates, futureStates } = useFlowHistory();
  return (
    <Panel position="top-right">
      <button onClick={() => undo()} disabled={pastStates.length === 0}>Undo</button>
      <button onClick={() => redo()} disabled={futureStates.length === 0}>Redo</button>
    </Panel>
  );
}
\`\`\``,

  "drag-and-drop": `# Drag & Drop from Sidebar

\`\`\`tsx
function Sidebar() {
  const onDragStart = (event: DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside>
      <div draggable onDragStart={(e) => onDragStart(e, 'customNode')}>
        Custom Node
      </div>
    </aside>
  );
}

function Flow() {
  const { screenToFlowPosition, addNodes } = useReactFlow();

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event: DragEvent) => {
    event.preventDefault();
    const type = event.dataTransfer.getData('application/reactflow');
    if (!type) return;

    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    addNodes({
      id: crypto.randomUUID(),
      type,
      position,
      data: { label: \`New \${type}\` },
    });
  }, [screenToFlowPosition, addNodes]);

  return (
    <ReactFlow onDragOver={onDragOver} onDrop={onDrop} ... />
  );
}
\`\`\``,

  "auto-layout-dagre": `# Auto Layout with Dagre

\`\`\`bash
npm install @dagrejs/dagre
\`\`\`

\`\`\`tsx
import Dagre from '@dagrejs/dagre';

function getLayoutedElements(nodes: Node[], edges: Edge[], direction = 'TB') {
  const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: direction, nodesep: 50, ranksep: 80 });

  nodes.forEach((node) => {
    g.setNode(node.id, {
      width: node.measured?.width ?? 172,
      height: node.measured?.height ?? 36,
    });
  });

  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target);
  });

  Dagre.layout(g);

  const layoutedNodes = nodes.map((node) => {
    const pos = g.node(node.id);
    return {
      ...node,
      position: {
        x: pos.x - (node.measured?.width ?? 172) / 2,
        y: pos.y - (node.measured?.height ?? 36) / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
}
\`\`\``,

  "auto-layout-elk": `# Auto Layout with ELK

\`\`\`bash
npm install elkjs
\`\`\`

\`\`\`tsx
import ELK from 'elkjs/lib/elk.bundled.js';

const elk = new ELK();

async function getLayoutedElements(nodes: Node[], edges: Edge[]) {
  const graph = {
    id: 'root',
    layoutOptions: {
      'elk.algorithm': 'layered',
      'elk.direction': 'DOWN',
      'elk.spacing.nodeNode': '50',
      'elk.layered.spacing.nodeNodeBetweenLayers': '80',
    },
    children: nodes.map((n) => ({
      id: n.id,
      width: n.measured?.width ?? 172,
      height: n.measured?.height ?? 36,
    })),
    edges: edges.map((e) => ({ id: e.id, sources: [e.source], targets: [e.target] })),
  };

  const layout = await elk.layout(graph);

  return {
    nodes: nodes.map((node) => {
      const elkNode = layout.children?.find((n) => n.id === node.id);
      return { ...node, position: { x: elkNode?.x ?? 0, y: elkNode?.y ?? 0 } };
    }),
    edges,
  };
}
\`\`\``,

  "context-menu": `# Context Menu

\`\`\`tsx
function Flow() {
  const [menu, setMenu] = useState<{ x: number; y: number; nodeId?: string } | null>(null);
  const { deleteElements, getNode } = useReactFlow();

  const onPaneContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    setMenu({ x: event.clientX, y: event.clientY });
  }, []);

  const onNodeContextMenu = useCallback((event: React.MouseEvent, node: Node) => {
    event.preventDefault();
    setMenu({ x: event.clientX, y: event.clientY, nodeId: node.id });
  }, []);

  return (
    <>
      <ReactFlow
        onPaneContextMenu={onPaneContextMenu}
        onNodeContextMenu={onNodeContextMenu}
        onPaneClick={() => setMenu(null)}
      />
      {menu && (
        <div style={{ position: 'fixed', left: menu.x, top: menu.y }} className="bg-white shadow rounded p-2">
          {menu.nodeId && (
            <button onClick={() => { deleteElements({ nodes: [{ id: menu.nodeId! }] }); setMenu(null); }}>
              Delete Node
            </button>
          )}
        </div>
      )}
    </>
  );
}
\`\`\``,

  "copy-paste": `# Copy & Paste Nodes

\`\`\`tsx
function useCopyPaste() {
  const { getNodes, getEdges, addNodes, addEdges, screenToFlowPosition } = useReactFlow();
  const clipboard = useRef<{ nodes: Node[]; edges: Edge[] }>({ nodes: [], edges: [] });

  const copy = useCallback(() => {
    const selected = getNodes().filter((n) => n.selected);
    const selectedIds = new Set(selected.map((n) => n.id));
    const connectedEdges = getEdges().filter(
      (e) => selectedIds.has(e.source) && selectedIds.has(e.target)
    );
    clipboard.current = { nodes: selected, edges: connectedEdges };
  }, [getNodes, getEdges]);

  const paste = useCallback(() => {
    const { nodes: copiedNodes, edges: copiedEdges } = clipboard.current;
    if (copiedNodes.length === 0) return;

    const idMap = new Map<string, string>();
    const newNodes = copiedNodes.map((n) => {
      const newId = crypto.randomUUID();
      idMap.set(n.id, newId);
      return { ...n, id: newId, position: { x: n.position.x + 50, y: n.position.y + 50 }, selected: true };
    });

    const newEdges = copiedEdges.map((e) => ({
      ...e,
      id: crypto.randomUUID(),
      source: idMap.get(e.source) ?? e.source,
      target: idMap.get(e.target) ?? e.target,
    }));

    addNodes(newNodes);
    addEdges(newEdges);
  }, [addNodes, addEdges]);

  return { copy, paste };
}
\`\`\``,

  "save-restore": `# Save & Restore Flow

\`\`\`tsx
function SaveRestore() {
  const { toObject, setNodes, setEdges, setViewport } = useReactFlow();

  const onSave = useCallback(() => {
    const flow = toObject();
    localStorage.setItem('flow', JSON.stringify(flow));
  }, [toObject]);

  const onRestore = useCallback(() => {
    const json = localStorage.getItem('flow');
    if (!json) return;
    const flow = JSON.parse(json);
    setNodes(flow.nodes || []);
    setEdges(flow.edges || []);
    if (flow.viewport) {
      setViewport(flow.viewport);
    }
  }, [setNodes, setEdges, setViewport]);

  return (
    <Panel position="top-right">
      <button onClick={onSave}>Save</button>
      <button onClick={onRestore}>Restore</button>
    </Panel>
  );
}
\`\`\``,

  "prevent-cycles": `# Prevent Cycles (DAG Validation)

\`\`\`tsx
import { getOutgoers } from '@xyflow/react';

function hasCycle(node: Node, target: Node, nodes: Node[], edges: Edge[], visited = new Set<string>()): boolean {
  if (visited.has(node.id)) return false;
  visited.add(node.id);
  if (node.id === target.id) return true;

  for (const outgoer of getOutgoers(node, nodes, edges)) {
    if (hasCycle(outgoer, target, nodes, edges, visited)) return true;
  }
  return false;
}

// Use as isValidConnection:
<ReactFlow
  isValidConnection={(connection) => {
    const nodes = getNodes();
    const edges = getEdges();
    const target = nodes.find((n) => n.id === connection.target);
    const source = nodes.find((n) => n.id === connection.source);
    if (!target || !source) return false;
    return !hasCycle(target, source, nodes, edges);
  }}
/>
\`\`\``,

  "keyboard-shortcuts": `# Keyboard Shortcuts

\`\`\`tsx
function KeyboardShortcuts() {
  const { undo, redo } = useFlowHistory();
  const { copy, paste } = useCopyPaste();
  const { fitView, zoomIn, zoomOut } = useReactFlow();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
      if (mod && e.key === 'z' && e.shiftKey) { e.preventDefault(); redo(); }
      if (mod && e.key === 'c') { copy(); }
      if (mod && e.key === 'v') { paste(); }
      if (mod && e.key === '=') { e.preventDefault(); zoomIn(); }
      if (mod && e.key === '-') { e.preventDefault(); zoomOut(); }
      if (mod && e.key === '0') { e.preventDefault(); fitView({ duration: 300 }); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, redo, copy, paste, fitView, zoomIn, zoomOut]);

  return null;
}
\`\`\``,

  "performance": `# Performance Optimization

## Rules
1. **Define nodeTypes/edgeTypes outside the component** or useMemo — never inline.
2. **Use stable selectors** with Zustand to prevent unnecessary re-renders.
3. **Avoid useNodes/useEdges** in components that don't need the full array — use useNodesData(ids) instead.
4. **Enable onlyRenderVisibleElements** for large graphs (1000+ nodes).
5. **Use useReactFlow().getNodes()** for on-demand access instead of subscribing.

\`\`\`tsx
// BAD: re-renders on every node change
const nodes = useNodes();

// GOOD: only re-renders when specific node data changes
const nodeData = useNodesData('node-1');

// GOOD: on-demand access, no re-renders
const { getNodes } = useReactFlow();
const handleClick = () => {
  const nodes = getNodes();
};
\`\`\`

## Large graph settings
\`\`\`tsx
<ReactFlow
  onlyRenderVisibleElements
  minZoom={0.1}
  maxZoom={4}
  elevateNodesOnSelect={false}
  elevateEdgesOnSelect={false}
/>
\`\`\``,

  "dark-mode": `# Dark Mode with Tailwind

React Flow v12 supports \`colorMode\` prop:

\`\`\`tsx
<ReactFlow colorMode="dark" ... />
// or follow system:
<ReactFlow colorMode="system" ... />
\`\`\`

For Tailwind + shadcn, map CSS variables:
\`\`\`css
.react-flow.dark {
  --xy-background-color: hsl(var(--background));
  --xy-node-background-color: hsl(var(--card));
  --xy-node-border-color: hsl(var(--border));
  --xy-node-color: hsl(var(--card-foreground));
  --xy-edge-stroke: hsl(var(--muted-foreground));
  --xy-minimap-background: hsl(var(--card));
  --xy-controls-button-background: hsl(var(--card));
  --xy-controls-button-color: hsl(var(--card-foreground));
}
\`\`\``,

  ssr: `# SSR / SSG Setup

## v12 Recommended: True SSR with pre-defined dimensions

React Flow v12 supports genuine server rendering by pre-defining \`width\`, \`height\`, and \`handles\` on nodes. This avoids layout shift on hydration and does not require disabling SSR:

\`\`\`tsx
import { ReactFlow, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Pre-define dimensions and handles for SSR
const nodes = [
  {
    id: '1',
    position: { x: 0, y: 0 },
    data: { label: 'Node 1' },
    width: 150,
    height: 40,
    handles: [
      { type: 'source', position: Position.Bottom },
    ],
  },
];

// No dynamic(ssr:false) needed — hydrates correctly
export default function Page() {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <ReactFlow nodes={nodes} edges={[]} />
    </div>
  );
}
\`\`\`

## Fallback: Dynamic import (no SSR)

Still valid for legacy setups or when pre-defining dimensions is impractical:

\`\`\`tsx
'use client'; // Next.js app dir

import dynamic from 'next/dynamic';

const Flow = dynamic(() => import('./Flow'), { ssr: false });

export default function Page() {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Flow />
    </div>
  );
}
\`\`\``,

  subflows: `# SubFlows (Parent/Child Nodes)

\`\`\`tsx
const nodes = [
  {
    id: 'group-1',
    type: 'group',
    position: { x: 0, y: 0 },
    style: { width: 400, height: 300 },
    data: {},
  },
  {
    id: 'child-1',
    parentId: 'group-1',
    extent: 'parent' as const,  // constrain to parent bounds
    expandParent: true,          // auto-expand parent if needed
    position: { x: 20, y: 40 }, // relative to parent
    data: { label: 'Child 1' },
  },
  {
    id: 'child-2',
    parentId: 'group-1',
    extent: 'parent' as const,
    position: { x: 200, y: 40 },
    data: { label: 'Child 2' },
  },
];
\`\`\`

**Rules:**
- Parent nodes must appear before children in the nodes array.
- Child positions are relative to the parent.
- Use \`extent: 'parent'\` to keep children inside the parent bounds.
- Use \`expandParent: true\` for auto-expanding group.
- Set \`zIndexMode="auto"\` on ReactFlow for proper z-ordering in sub-flows.`,

  "edge-reconnection": `# Edge Reconnection

\`\`\`tsx
import { reconnectEdge } from '@xyflow/react';

function Flow() {
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onReconnect = useCallback((oldEdge: Edge, newConnection: Connection) => {
    setEdges((els) => reconnectEdge(oldEdge, newConnection, els));
  }, [setEdges]);

  return (
    <ReactFlow
      edges={edges}
      onEdgesChange={onEdgesChange}
      edgesReconnectable
      onReconnect={onReconnect}
      onReconnectStart={(_, edge, handleType) => console.log('reconnect start', edge.id, handleType)}
      onReconnectEnd={(_, edge, handleType) => console.log('reconnect end', edge.id, handleType)}
    />
  );
}
\`\`\``,

  "computing-flows": `# Reactive Computing Flows (Data Pipeline Pattern)

Use \`useNodeConnections\`, \`useNodesData\`, and \`updateNodeData\` to build nodes that reactively compute based on connected inputs. This is the headline v12 data flow pattern.

\`\`\`tsx
import { useNodeConnections, useNodesData, useReactFlow } from '@xyflow/react';

function ComputeNode({ id, data }: NodeProps) {
  const { updateNodeData } = useReactFlow();

  // Get connections coming into this node
  const connections = useNodeConnections({ handleType: 'target' });
  const sourceIds = connections.map((c) => c.source);

  // Subscribe only to the data of connected source nodes
  const sourcesData = useNodesData(sourceIds);

  // Re-compute whenever upstream data changes
  useEffect(() => {
    const inputValues = sourcesData.map((n) => n?.data?.value ?? 0);
    const result = inputValues.reduce((sum, v) => sum + v, 0);
    updateNodeData(id, { value: result });
  }, [sourcesData, id, updateNodeData]);

  return (
    <div className="p-4 border rounded bg-white">
      <Handle type="target" position={Position.Left} />
      <div>Sum: {data.value}</div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
\`\`\``,

  "connection-state": `# Colorize Handles During Connection Drag

Use \`useConnection\` to style handles dynamically while the user drags a connection line:

\`\`\`tsx
import { Handle, Position, useConnection, useNodeId } from '@xyflow/react';

function SmartHandle({ type, position, id }: { type: 'source' | 'target'; position: Position; id?: string }) {
  const nodeId = useNodeId();
  // Subscribe only to inProgress to avoid re-renders on position changes
  const inProgress = useConnection((c) => c.inProgress);
  const fromNodeId = useConnection((c) => c.fromNode?.id);

  // Highlight target handles when a drag is active (but not from this node)
  const isHighlighted = inProgress && type === 'target' && fromNodeId !== nodeId;

  return (
    <Handle
      type={type}
      position={position}
      id={id}
      style={{
        background: isHighlighted ? '#22c55e' : '#6b7280',
        border: isHighlighted ? '2px solid #16a34a' : '2px solid #374151',
        transition: 'background 0.15s',
      }}
    />
  );
}
\`\`\``,

  "controlled-viewport": `# Controlled Viewport

Use the \`viewport\` + \`onViewportChange\` props (v12.0.0) for a fully-controlled viewport. Enables animated transitions driven by external state, storing viewport in URL params, or synchronized multi-panel views.

\`\`\`tsx
function ControlledFlow() {
  const [viewport, setViewport] = useState({ x: 0, y: 0, zoom: 1 });

  return (
    <>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        viewport={viewport}
        onViewportChange={setViewport}
      />
      <button onClick={() => setViewport({ x: 0, y: 0, zoom: 1.5 })}>
        Zoom to 150%
      </button>
    </>
  );
}
\`\`\`

**Sync to URL params:**
\`\`\`tsx
const [viewport, setViewport] = useState(() => {
  const params = new URLSearchParams(window.location.search);
  return {
    x: Number(params.get('vx') ?? 0),
    y: Number(params.get('vy') ?? 0),
    zoom: Number(params.get('vz') ?? 1),
  };
});

const onViewportChange = (vp: Viewport) => {
  setViewport(vp);
  const params = new URLSearchParams({ vx: String(vp.x), vy: String(vp.y), vz: String(vp.zoom) });
  window.history.replaceState(null, '', '?' + params.toString());
};
\`\`\``,

  "edge-toolbar": `# Edge Toolbar (v12.9.0)

\`EdgeToolbar\` renders action elements anchored to an edge's midpoint, similar to \`NodeToolbar\` for nodes. It does not scale with the viewport.

\`\`\`tsx
import { EdgeToolbar, BaseEdge, getBezierPath } from '@xyflow/react';
import type { EdgeProps } from '@xyflow/react';

function ActionEdge({
  id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition,
  });
  const { setEdges } = useReactFlow();

  return (
    <>
      <BaseEdge path={edgePath} />
      <EdgeToolbar edgeId={id} x={labelX} y={labelY}>
        <div className="flex gap-1 bg-white shadow rounded px-2 py-1 text-xs">
          <button onClick={() => console.log('edit', id)}>Edit</button>
          <button onClick={() => setEdges((es) => es.filter((e) => e.id !== id))}>
            Delete
          </button>
        </div>
      </EdgeToolbar>
    </>
  );
}
\`\`\``,

  "before-delete": `# Confirm Before Delete (onBeforeDelete)

Use \`onBeforeDelete\` (v12.0.0) to intercept and conditionally cancel deletion. Return \`false\` or a Promise resolving to \`false\` to cancel.

\`\`\`tsx
function Flow() {
  const onBeforeDelete = useCallback(async ({ nodes, edges }) => {
    if (nodes.some((n) => n.data?.protected)) {
      const ok = window.confirm('Delete protected node?');
      return ok;
    }
    return true;
  }, []);

  return (
    <ReactFlow
      onBeforeDelete={onBeforeDelete}
      onDelete={({ nodes, edges }) => {
        console.log('Deleted:', nodes.length, 'nodes,', edges.length, 'edges');
      }}
    />
  );
}
\`\`\``,

  "typescript-strict": `# TypeScript Strict Mode Setup

## Define node and edge types
\`\`\`tsx
import type { Node, Edge, NodeProps } from '@xyflow/react';

// Step 1: Define data + discriminant for each custom node
type TextNode = Node<{ text: string }, 'text'>;
type NumberNode = Node<{ value: number }, 'number'>;

// Step 2: Create a union type
type AppNode = TextNode | NumberNode;
type AppEdge = Edge<{ weight?: number }, 'weighted'> | Edge;

// Step 3: Type useReactFlow with your union
const { getNodes, setNodes } = useReactFlow<AppNode, AppEdge>();

// Step 4: Type custom node components
function TextNodeComponent({ data }: NodeProps<TextNode>) {
  return <div>{data.text}</div>;
}

// Step 5: Define nodeTypes outside the component
const nodeTypes = {
  text: TextNodeComponent,
} satisfies NodeTypes;
\`\`\`

## useNodeConnections v12.11.0 constraint
\`\`\`tsx
// TypeScript error — handleId without handleType:
useNodeConnections({ handleId: 'my-handle' });

// Correct:
useNodeConnections({ handleType: 'target', handleId: 'my-handle' });
\`\`\``,

  "accessibility": `# Accessibility (a11y) — v12.7.0

React Flow v12.7.0 added per-node/edge ARIA attributes and keyboard auto-pan.

\`\`\`tsx
// Per-node ARIA attributes
const nodes = [
  {
    id: '1',
    position: { x: 0, y: 0 },
    data: { label: 'Server' },
    ariaLabel: 'Server node — click to view details',
    ariaRole: 'button',
    domAttributes: { 'data-testid': 'server-node' },
  },
];

// Customize aria-label text on the flow wrapper
<ReactFlow
  ariaLabelConfig={{
    nodes: (n) => \`Node: \${n.data.label}\`,
    edges: (e) => \`Connection from \${e.source} to \${e.target}\`,
  }}
  // Pan viewport to bring tab-focused node into view
  autoPanOnNodeFocus
  // Disable React Flow keyboard handling if your app manages it
  // disableKeyboardA11y
/>
\`\`\``,

  "mobile-touch": `# Mobile & Touch Interaction

\`\`\`tsx
<ReactFlow
  // Two-finger pan (button code 1 = right mouse / touch pan)
  panOnDrag={[1, 2]}
  // Pinch to zoom
  zoomOnPinch
  // Prevent accidental connection starts on touch
  connectionDragThreshold={10}
  // Allow scroll-wheel pan on desktop
  panOnScroll
  panOnScrollMode="free"
  // Prevent page scroll while interacting with the canvas
  preventScrolling
/>
\`\`\`

**Note:** \`panOnDrag={[1, 2]}\` enables pan via right-click drag (button 1) and middle-click drag (button 2), leaving left-click (button 0) for node interaction and selection.`,

  "custom-connection-line": `# Custom Connection Line

\`\`\`tsx
import type { ConnectionLineComponentProps } from '@xyflow/react';

function CustomConnectionLine({
  fromX, fromY, toX, toY, connectionStatus,
}: ConnectionLineComponentProps) {
  return (
    <g>
      <path
        fill="none"
        stroke={connectionStatus === 'valid' ? '#22c55e' : '#ef4444'}
        strokeWidth={2}
        d={\`M\${fromX},\${fromY} C \${fromX} \${toY} \${fromX} \${toY} \${toX},\${toY}\`}
      />
      <circle cx={toX} cy={toY} r={4} fill={connectionStatus === 'valid' ? '#22c55e' : '#ef4444'} />
    </g>
  );
}

// Usage:
<ReactFlow connectionLineComponent={CustomConnectionLine} />
\`\`\`

The \`connectionStatus\` is 'valid' when hovering over a compatible handle.`,

  "auto-layout-on-mount": `# Auto Layout on Mount

Use \`useNodesInitialized\` to wait for all nodes to be measured before running layout:

\`\`\`tsx
function LayoutFlow({ initialNodes, initialEdges }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { fitView } = useReactFlow();
  const initialized = useNodesInitialized();

  useEffect(() => {
    if (!initialized) return;

    // Run layout (e.g., Dagre)
    const { nodes: layouted } = getLayoutedElements(nodes, edges, 'TB');
    setNodes(layouted);

    // v12.5.0+: fitView works immediately after setNodes — no requestAnimationFrame needed
    fitView({ duration: 300 });
  }, [initialized]);

  return (
    <ReactFlow
      nodes={nodes} edges={edges}
      onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
      fitView
    />
  );
}
\`\`\``,
};
