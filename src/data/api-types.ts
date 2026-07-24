import type { ApiEntry } from "./types.js";

const nodeType: ApiEntry = {
  name: "Node",
  kind: "type",
  description: "Represents a node in the flow. Contains position, data, type, dimensions, and behavior flags.",
  importPath: "import type { Node } from '@xyflow/react'",
  props: [
    { name: "id", type: "string", description: "Unique identifier." },
    { name: "position", type: "XYPosition", description: "{ x, y } position on the canvas." },
    { name: "data", type: "Record<string, unknown>", description: "Arbitrary data passed to the node component." },
    { name: "type", type: "string", description: "Node type matching a key in nodeTypes.", default: "'default'" },
    { name: "hidden", type: "boolean", description: "Hide the node." },
    { name: "selected", type: "boolean", description: "Selection state." },
    { name: "draggable", type: "boolean", description: "Override global draggable setting." },
    { name: "selectable", type: "boolean", description: "Override global selectable setting." },
    { name: "connectable", type: "boolean", description: "Override global connectable setting." },
    { name: "deletable", type: "boolean", description: "Override global deletable setting." },
    { name: "parentId", type: "string", description: "Parent node ID for subflows/groups." },
    { name: "extent", type: "CoordinateExtent | 'parent' | null", description: "Movement boundary. 'parent' constrains to parent node. null explicitly unsets a previously-set extent." },
    { name: "expandParent", type: "boolean", description: "Auto-expand parent when dragged to edge." },
    { name: "zIndex", type: "number", description: "Z-index for rendering order." },
    { name: "style", type: "CSSProperties", description: "Inline CSS styles." },
    { name: "className", type: "string", description: "CSS class name." },
    { name: "dragHandle", type: "string", description: "CSS selector for drag handle elements within the node." },
    { name: "origin", type: "NodeOrigin", description: "Origin point [0-1, 0-1] for positioning.", default: "[0, 0]" },
    { name: "measured", type: "{ width?: number; height?: number }", description: "Read-only measured dimensions after DOM layout." },
    { name: "width", type: "number", description: "Node width as an inline style hint. NOT the measured dimension — that is at node.measured.width." },
    { name: "height", type: "number", description: "Node height as an inline style hint." },
    { name: "initialWidth", type: "number", description: "Initial width used before first DOM measurement." },
    { name: "initialHeight", type: "number", description: "Initial height used before first DOM measurement." },
    { name: "handles", type: "NodeHandle[]", description: "Pre-defined handle positions for SSR. Allows server rendering without DOM measurement." },
    { name: "sourcePosition", type: "Position", description: "Default handle position for source handles (built-in node types)." },
    { name: "targetPosition", type: "Position", description: "Default handle position for target handles (built-in node types)." },
    { name: "focusable", type: "boolean", description: "Whether the node is focusable via keyboard." },
    { name: "resizing", type: "boolean", description: "Read-only. True while the node is actively being resized." },
    { name: "ariaLabel", type: "string", description: "Accessible label for the node." },
    { name: "ariaRole", type: "AriaRole", description: "ARIA role for the node element. Added v12.7.0." },
    { name: "domAttributes", type: "Omit<HTMLAttributes<HTMLDivElement>, 'id' | 'draggable' | 'style' | 'className' | 'role' | 'aria-label'>", description: "Custom DOM attributes applied to the node wrapper div. Added v12.7.0." },
  ],
  usage: `const node: Node = {
  id: '1',
  type: 'custom',
  position: { x: 100, y: 200 },
  data: { label: 'My Node', status: 'active' },
};`,
  examples: [
    {
      title: "Typed custom node data",
      category: "custom-nodes",
      code: `type MyNodeData = { label: string; status: 'active' | 'inactive' };
type MyNode = Node<MyNodeData, 'statusNode'>;

const node: MyNode = {
  id: '1',
  type: 'statusNode',
  position: { x: 0, y: 0 },
  data: { label: 'Server', status: 'active' },
};`,
    },
  ],
  tips: [
    "Don't set width/height directly — use style or className for sizing.",
    "v12: measured dimensions are at node.measured.width, not node.width.",
    "Default node types: 'default' (both handles), 'input' (source only), 'output' (target only), 'group' (container).",
  ],
  relatedApis: ["Edge", "NodeProps", "Handle"],
};

const edgeType: ApiEntry = {
  name: "Edge",
  kind: "type",
  description: "Complete description of an edge between two nodes with rendering properties.",
  importPath: "import type { Edge } from '@xyflow/react'",
  props: [
    { name: "id", type: "string", description: "Unique identifier." },
    { name: "source", type: "string", description: "Source node ID." },
    { name: "target", type: "string", description: "Target node ID." },
    { name: "sourceHandle", type: "string | null", description: "Source handle ID (if multiple handles)." },
    { name: "targetHandle", type: "string | null", description: "Target handle ID (if multiple handles)." },
    { name: "type", type: "string", description: "Edge type matching edgeTypes.", default: "'default'" },
    { name: "animated", type: "boolean", description: "Animated dashed edge." },
    { name: "label", type: "ReactNode", description: "Label content on the edge." },
    { name: "labelStyle", type: "CSSProperties", description: "Label CSS styles." },
    { name: "style", type: "CSSProperties", description: "Edge SVG path styles." },
    { name: "hidden", type: "boolean", description: "Hide the edge." },
    { name: "selected", type: "boolean", description: "Selection state." },
    { name: "deletable", type: "boolean", description: "Override deletable setting." },
    { name: "selectable", type: "boolean", description: "Override selectable setting." },
    { name: "reconnectable", type: "boolean | HandleType", description: "Allow reconnecting this edge." },
    { name: "data", type: "Record<string, unknown>", description: "Arbitrary data for custom edges." },
    { name: "markerStart", type: "EdgeMarkerType", description: "Marker at edge start." },
    { name: "markerEnd", type: "EdgeMarkerType", description: "Marker at edge end." },
    { name: "zIndex", type: "number", description: "Z-index." },
    { name: "interactionWidth", type: "number", description: "Width of invisible click target.", default: "20" },
    { name: "className", type: "string", description: "CSS class applied to the edge element." },
    { name: "focusable", type: "boolean", description: "Whether the edge is keyboard-focusable." },
    { name: "ariaLabel", type: "string", description: "Accessible label for the edge." },
    { name: "ariaRole", type: "AriaRole", description: "ARIA role for the edge element. Added v12.7.0." },
    { name: "domAttributes", type: "object", description: "Custom DOM attributes for the edge wrapper. Added v12.7.0." },
    { name: "labelBgPadding", type: "[number, number]", description: "Padding around the edge label background box." },
    { name: "labelBgBorderRadius", type: "number", description: "Border radius of the edge label background box." },
    { name: "pathOptions", type: "{ offset?: number; borderRadius?: number } | { curvature?: number }", description: "Variant-specific path options: borderRadius/offset for SmoothStep edges, curvature for Bezier edges." },
  ],
  usage: `const edge: Edge = {
  id: 'e1-2',
  source: '1',
  target: '2',
  type: 'smoothstep',
  animated: true,
  label: 'connects to',
};`,
  examples: [],
  tips: [
    "Default edge types: 'default' (bezier), 'straight', 'step', 'smoothstep', 'simplebezier'.",
    "SmoothStepEdge variant adds pathOptions: { offset, borderRadius }.",
    "BezierEdge variant adds pathOptions: { curvature }.",
  ],
  relatedApis: ["Node", "EdgeProps", "Connection"],
};

const nodePropsType: ApiEntry = {
  name: "NodeProps",
  kind: "type",
  description: "Props received by custom node components. Generic: NodeProps<NodeType extends Node = Node>. React Flow wraps your component and passes these.",
  importPath: "import type { NodeProps, Node } from '@xyflow/react'",
  props: [
    { name: "id", type: "NodeType['id']", description: "Unique node ID." },
    { name: "data", type: "NodeType['data']", description: "Node data object (typed from your Node generic)." },
    { name: "type", type: "NodeType['type']", description: "Node type." },
    { name: "selected", type: "boolean", description: "Whether node is selected." },
    { name: "isConnectable", type: "boolean", description: "Whether node is connectable." },
    { name: "zIndex", type: "number", description: "Current z-index." },
    { name: "positionAbsoluteX", type: "number", description: "Absolute X position." },
    { name: "positionAbsoluteY", type: "number", description: "Absolute Y position." },
    { name: "dragging", type: "boolean", description: "Whether node is being dragged." },
    { name: "draggable", type: "boolean", description: "Whether node is draggable." },
    { name: "selectable", type: "boolean", description: "Whether node is selectable." },
    { name: "deletable", type: "boolean", description: "Whether node is deletable." },
    { name: "dragHandle", type: "string", description: "CSS selector for drag handle." },
    { name: "parentId", type: "string", description: "Parent node ID." },
    { name: "width", type: "number", description: "Measured width." },
    { name: "height", type: "number", description: "Measured height." },
    { name: "sourcePosition", type: "Position", description: "Source handle position (default nodes only)." },
    { name: "targetPosition", type: "Position", description: "Target handle position (default nodes only)." },
  ],
  usage: `import type { NodeProps, Node } from '@xyflow/react';

// Step 1: Define your node type
type CounterNode = Node<{ initialCount?: number }, 'counter'>;

// Step 2: Use NodeProps<YourNodeType> as the prop type
export default function CounterNode(props: NodeProps<CounterNode>) {
  const [count, setCount] = useState(props.data?.initialCount ?? 0);

  return (
    <div>
      <p>Count: {count}</p>
      <button className="nodrag" onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}

// Step 3: Register in nodeTypes (outside component!)
const nodeTypes = { counter: CounterNode };`,
  examples: [],
  tips: [
    "The generic parameter is a Node type (not raw data). Use Node<MyData, 'myType'> to define it.",
    "Always register custom nodes via the nodeTypes prop on <ReactFlow>, defined outside the component or memoized.",
    "Add 'nodrag' class to interactive elements (buttons, inputs) inside nodes to prevent dragging when clicking them.",
  ],
  relatedApis: ["Node", "EdgeProps", "Handle"],
};

const edgePropsType: ApiEntry = {
  name: "EdgeProps",
  kind: "type",
  description: "Props received by custom edge components. Generic: EdgeProps<EdgeType extends Edge = Edge>.",
  importPath: "import type { EdgeProps, Edge } from '@xyflow/react'",
  props: [
    { name: "id", type: "string", description: "Edge ID." },
    { name: "source", type: "string", description: "Source node ID." },
    { name: "target", type: "string", description: "Target node ID." },
    { name: "sourceHandleId", type: "string | null", description: "Source handle ID." },
    { name: "targetHandleId", type: "string | null", description: "Target handle ID." },
    { name: "sourceX", type: "number", description: "Source X coordinate." },
    { name: "sourceY", type: "number", description: "Source Y coordinate." },
    { name: "targetX", type: "number", description: "Target X coordinate." },
    { name: "targetY", type: "number", description: "Target Y coordinate." },
    { name: "sourcePosition", type: "Position", description: "Source handle position." },
    { name: "targetPosition", type: "Position", description: "Target handle position." },
    { name: "data", type: "EdgeType['data']", description: "Edge data object (typed from your Edge generic)." },
    { name: "type", type: "EdgeType['type']", description: "Edge type." },
    { name: "selected", type: "boolean", description: "Whether edge is selected." },
    { name: "selectable", type: "boolean", description: "Whether edge is selectable." },
    { name: "deletable", type: "boolean", description: "Whether edge is deletable." },
    { name: "animated", type: "boolean", description: "Whether edge is animated." },
    { name: "label", type: "ReactNode", description: "Edge label." },
    { name: "labelStyle", type: "CSSProperties", description: "Label CSS styles." },
    { name: "labelShowBg", type: "boolean", description: "Show background behind label." },
    { name: "labelBgStyle", type: "CSSProperties", description: "Label background styles." },
    { name: "labelBgPadding", type: "[number, number]", description: "Label background padding." },
    { name: "labelBgBorderRadius", type: "number", description: "Label background border radius." },
    { name: "markerStart", type: "string", description: "Start marker URL." },
    { name: "markerEnd", type: "string", description: "End marker URL." },
    { name: "pathOptions", type: "any", description: "Path-specific options (curvature, borderRadius, etc)." },
    { name: "style", type: "CSSProperties", description: "Edge SVG path styles." },
    { name: "interactionWidth", type: "number", description: "Width of invisible click target." },
  ],
  usage: `import type { EdgeProps, Edge } from '@xyflow/react';
import { BaseEdge, getBezierPath } from '@xyflow/react';

// Step 1: Define your edge type (optional)
type CustomEdgeType = Edge<{ weight: number }, 'weighted'>;

// Step 2: Use EdgeProps<YourEdgeType>
function WeightedEdge({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data, style }: EdgeProps<CustomEdgeType>) {
  const [edgePath, labelX, labelY] = getBezierPath({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition });
  return (
    <>
      <BaseEdge path={edgePath} style={style} />
      <text x={labelX} y={labelY} textAnchor="middle">{data?.weight}</text>
    </>
  );
}

// Step 3: Register in edgeTypes (outside component!)
const edgeTypes = { weighted: WeightedEdge };`,
  examples: [],
  tips: [
    "The generic parameter is an Edge type (not raw data). Use Edge<MyData, 'myType'> to define it.",
    "Use BaseEdge to get the invisible interaction path and marker handling for free.",
    "For complex HTML labels, use EdgeLabelRenderer instead of SVG text.",
  ],
  relatedApis: ["Edge", "NodeProps", "BaseEdge", "EdgeLabelRenderer"],
};

const connectionType: ApiEntry = {
  name: "Connection",
  kind: "type",
  description: "Minimal description of an edge between two nodes. The addEdge util upgrades a Connection to an Edge.",
  importPath: "import type { Connection } from '@xyflow/react'",
  props: [
    { name: "source", type: "string", description: "Source node ID." },
    { name: "target", type: "string", description: "Target node ID." },
    { name: "sourceHandle", type: "string | null", description: "Source handle ID." },
    { name: "targetHandle", type: "string | null", description: "Target handle ID." },
  ],
  usage: `const onConnect = (connection: Connection) => {
  setEdges((eds) => addEdge(connection, eds));
};`,
  examples: [],
  relatedApis: ["Edge", "addEdge", "useConnection"],
};

const viewportType: ApiEntry = {
  name: "Viewport",
  kind: "type",
  description: "Describes the current viewport position and zoom level of the flow canvas.",
  importPath: "import type { Viewport } from '@xyflow/react'",
  props: [
    { name: "x", type: "number", description: "X offset." },
    { name: "y", type: "number", description: "Y offset." },
    { name: "zoom", type: "number", description: "Zoom level." },
  ],
  usage: `const viewport: Viewport = { x: 0, y: 0, zoom: 1 };`,
  examples: [],
  relatedApis: ["useViewport", "useReactFlow"],
};

const reactFlowInstanceType: ApiEntry = {
  name: "ReactFlowInstance",
  kind: "type",
  description: "Collection of methods to query and manipulate flow state. Returned by useReactFlow() hook.",
  importPath: "import type { ReactFlowInstance } from '@xyflow/react'",
  props: [
    { name: "getNodes()", type: "() => Node[]", description: "Get all nodes." },
    { name: "setNodes()", type: "(nodes | updater) => void", description: "Replace or update nodes array." },
    { name: "addNodes()", type: "(node | nodes) => void", description: "Add one or more nodes." },
    { name: "getNode()", type: "(id) => Node | undefined", description: "Get node by ID." },
    { name: "updateNode()", type: "(id, update) => void", description: "Partially update a node." },
    { name: "updateNodeData()", type: "(id, data) => void", description: "Update node's data object." },
    { name: "getEdges()", type: "() => Edge[]", description: "Get all edges." },
    { name: "setEdges()", type: "(edges | updater) => void", description: "Replace or update edges array." },
    { name: "addEdges()", type: "(edge | edges) => void", description: "Add one or more edges." },
    { name: "getEdge()", type: "(id) => Edge | undefined", description: "Get edge by ID." },
    { name: "updateEdge()", type: "(id, update) => void", description: "Partially update an edge." },
    { name: "deleteElements()", type: "(params: DeleteElementsOptions) => Promise<{ deletedNodes: Node[]; deletedEdges: Edge[] }>", description: "Delete nodes and/or edges. Returns the items actually deleted (useful for cleanup)." },
    { name: "toObject()", type: "() => ReactFlowJsonObject", description: "Export flow as JSON." },
    { name: "fitView()", type: "(options?: { padding?: number; includeHiddenNodes?: boolean; minZoom?: number; maxZoom?: number; duration?: number; ease?: (t: number) => number; interpolate?: 'smooth' | 'linear'; nodes?: ({ id: string })[] }) => Promise<boolean>", description: "Fit viewport to all nodes or a subset via nodes array. Since v12.5.0 works immediately after setNodes without requestAnimationFrame." },
    { name: "zoomIn()", type: "(options?: { duration?: number; ease?: (t: number) => number; interpolate?: 'smooth' | 'linear' }) => Promise<boolean>", description: "Zoom in by 1.2x." },
    { name: "zoomOut()", type: "(options?: { duration?: number; ease?: (t: number) => number; interpolate?: 'smooth' | 'linear' }) => Promise<boolean>", description: "Zoom out by 1/1.2x." },
    { name: "zoomTo()", type: "(zoomLevel: number, options?: { duration?: number; ease?: (t: number) => number; interpolate?: 'smooth' | 'linear' }) => Promise<boolean>", description: "Zoom to specific level." },
    { name: "getViewport()", type: "() => Viewport", description: "Get current viewport." },
    { name: "getZoom()", type: "() => number", description: "Get the current viewport zoom level." },
    { name: "setViewport()", type: "(viewport: Viewport, options?: { duration?: number; ease?: (t: number) => number; interpolate?: 'smooth' | 'linear' }) => Promise<boolean>", description: "Set viewport." },
    { name: "setCenter()", type: "(x: number, y: number, options?: { zoom?: number; duration?: number; ease?: (t: number) => number; interpolate?: 'smooth' | 'linear' }) => Promise<boolean>", description: "Center viewport on position." },
    { name: "fitBounds()", type: "(bounds: Rect, options?: { padding?: number; duration?: number; ease?: (t: number) => number; interpolate?: 'smooth' | 'linear' }) => Promise<boolean>", description: "Fit viewport to rectangle." },
    { name: "screenToFlowPosition()", type: "(clientPosition: XYPosition, options?: { snapToGrid?: boolean; snapGrid?: [number, number] }) => XYPosition", description: "Convert screen/client coords to canvas flow coords. Since v12.10.2 supports snapToGrid option." },
    { name: "flowToScreenPosition()", type: "(pos: XYPosition) => XYPosition", description: "Convert flow coords to screen coords." },
    { name: "getIntersectingNodes()", type: "(node: Node | Rect, partially?: boolean) => Node[]", description: "Find nodes intersecting with given node/rect." },
    { name: "isNodeIntersecting()", type: "(node: Node | Rect, area: Rect, partially?: boolean) => boolean", description: "Check if node intersects area." },
    { name: "getNodesBounds()", type: "(nodes: Node[] | string[]) => Rect", description: "Get bounding box of nodes." },
    { name: "updateEdgeData()", type: "(id: string, dataUpdate: Partial<Record<string, unknown>> | ((edge: Edge) => Partial<Record<string, unknown>>), options?: { replace?: boolean }) => void", description: "Update the data attribute of an edge. Accepts a partial object or updater function. Mirrors updateNodeData." },
    { name: "getInternalNode()", type: "(id: string) => InternalNode | undefined", description: "Get the internal node with internals.positionAbsolute by ID. Distinct from getNode() which returns the public Node type." },
    { name: "getHandleConnections()", type: "({ type: HandleType; nodeId: string; id?: string | null }) => HandleConnection[]", description: "Get all active connections on a specific handle." },
    { name: "getNodeConnections()", type: "({ type?: HandleType; nodeId: string; handleId?: string | null }) => NodeConnection[]", description: "Get all connections to a node, optionally filtered by handle type." },
    { name: "viewportInitialized", type: "boolean", description: "True once the viewport has mounted. Guard fitView calls in useEffect with this property to avoid silent failures on first render." },
  ],
  usage: `const reactFlow = useReactFlow();

// Add a node
reactFlow.addNodes({ id: 'new', position: { x: 100, y: 100 }, data: { label: 'New' } });

// Fit view with animation
reactFlow.fitView({ duration: 500, padding: 0.2 });

// Export flow
const json = reactFlow.toObject();`,
  examples: [],
  relatedApis: ["useReactFlow", "ReactFlowProvider"],
};

const nodeChangeType: ApiEntry = {
  name: "NodeChange",
  kind: "type",
  description: "Discriminated union of all node change event shapes emitted by onNodesChange. Types: 'position', 'dimensions', 'select', 'remove', 'add', 'reset', 'replace'.",
  importPath: "import type { NodeChange } from '@xyflow/react'",
  usage: `function onNodesChange(changes: NodeChange[]) {
  setNodes((nds) => applyNodeChanges(changes, nds));
}`,
  examples: [],
  relatedApis: ["applyNodeChanges", "ReactFlow"],
};

const edgeChangeType: ApiEntry = {
  name: "EdgeChange",
  kind: "type",
  description: "Discriminated union of all edge change event shapes emitted by onEdgesChange. Types: 'select', 'remove', 'add', 'reset', 'replace'.",
  importPath: "import type { EdgeChange } from '@xyflow/react'",
  usage: `function onEdgesChange(changes: EdgeChange[]) {
  setEdges((eds) => applyEdgeChanges(changes, eds));
}`,
  examples: [],
  relatedApis: ["applyEdgeChanges", "ReactFlow"],
};

const xyPositionType: ApiEntry = {
  name: "XYPosition",
  kind: "type",
  description: "Canonical 2D coordinate type: { x: number; y: number }. Used throughout React Flow for positions.",
  importPath: "import type { XYPosition } from '@xyflow/react'",
  usage: `const pos: XYPosition = { x: 100, y: 200 };`,
  examples: [],
  relatedApis: ["Node", "Viewport", "screenToFlowPosition"],
};

const fitViewOptionsType: ApiEntry = {
  name: "FitViewOptions",
  kind: "type",
  description: "Options for fitView() calls. padding, includeHiddenNodes, minZoom, maxZoom, duration, ease, interpolate, and nodes (array of {id} to fit only a subset).",
  importPath: "import type { FitViewOptions } from '@xyflow/react'",
  props: [
    { name: "padding", type: "number", description: "Padding ratio around all nodes.", default: "0.1" },
    { name: "includeHiddenNodes", type: "boolean", description: "Include hidden nodes in the fit bounds.", default: "false" },
    { name: "minZoom", type: "number", description: "Minimum zoom after fit." },
    { name: "maxZoom", type: "number", description: "Maximum zoom after fit." },
    { name: "duration", type: "number", description: "Animation duration in ms (0 = instant)." },
    { name: "ease", type: "(t: number) => number", description: "Custom easing function. (Since v12.7.0)" },
    { name: "interpolate", type: "'smooth' | 'linear'", description: "Interpolation mode. (Since v12.7.0)" },
    { name: "nodes", type: "{ id: string }[]", description: "Fit only these nodes instead of all nodes." },
  ],
  usage: `fitView({ padding: 0.2, duration: 500, nodes: [{ id: 'node-1' }] });`,
  examples: [],
  relatedApis: ["ReactFlow", "ReactFlowInstance"],
};

const colorModeType: ApiEntry = {
  name: "ColorMode",
  kind: "type",
  description: "'light' | 'dark' | 'system'. Value for the colorMode prop on ReactFlow. 'system' follows the OS-level dark mode preference.",
  importPath: "import type { ColorMode } from '@xyflow/react'",
  usage: `<ReactFlow colorMode="dark" ... />
<ReactFlow colorMode="system" ... />`,
  examples: [],
  relatedApis: ["ReactFlow"],
};

const connectionStateType: ApiEntry = {
  name: "ConnectionState",
  kind: "type",
  description: "Shape returned by useConnection(). All fields are null when no drag-to-connect is in progress.",
  importPath: "import type { ConnectionState } from '@xyflow/react'",
  props: [
    { name: "inProgress", type: "boolean", description: "True while a connection drag is active." },
    { name: "isValid", type: "boolean | null", description: "Whether the current hover target is a valid drop target." },
    { name: "from", type: "XYPosition | null", description: "Starting position of the connection drag." },
    { name: "fromHandle", type: "Handle | null", description: "Source handle details." },
    { name: "fromNode", type: "Node | null", description: "Source node." },
    { name: "fromPosition", type: "Position | null", description: "Source handle position side." },
    { name: "toHandle", type: "Handle | null", description: "Target handle being hovered." },
    { name: "toNode", type: "Node | null", description: "Target node being hovered." },
    { name: "toPosition", type: "Position | null", description: "Target handle position side." },
  ],
  usage: `const { inProgress, isValid, fromNode } = useConnection();`,
  examples: [],
  relatedApis: ["useConnection", "Handle"],
};

const internalNodeType: ApiEntry = {
  name: "InternalNode",
  kind: "type",
  description: "Internal node representation returned by getInternalNode() and useInternalNode(). Contains internals.positionAbsolute for absolute canvas coordinates (vs node.position which is parent-relative).",
  importPath: "import type { InternalNode } from '@xyflow/react'",
  props: [
    { name: "internals.positionAbsolute", type: "XYPosition", description: "Absolute canvas position (not relative to parent)." },
    { name: "internals.handleBounds", type: "NodeHandleBounds | undefined", description: "Computed handle positions." },
    { name: "measured.width", type: "number | undefined", description: "Measured node width." },
    { name: "measured.height", type: "number | undefined", description: "Measured node height." },
  ],
  usage: `const internalNode = useInternalNode('node-1');
const absPos = internalNode?.internals.positionAbsolute;`,
  examples: [],
  relatedApis: ["useInternalNode", "ReactFlowInstance"],
};

const onDeleteType: ApiEntry = {
  name: "OnDelete",
  kind: "type",
  description: "Type for the onDelete prop on ReactFlow. Called after nodes/edges are deleted.",
  importPath: "import type { OnDelete } from '@xyflow/react'",
  usage: `const onDelete: OnDelete = ({ nodes, edges }) => {
  console.log('Deleted nodes:', nodes);
  console.log('Deleted edges:', edges);
};`,
  examples: [],
  relatedApis: ["OnBeforeDelete", "ReactFlow"],
};

const onBeforeDeleteType: ApiEntry = {
  name: "OnBeforeDelete",
  kind: "type",
  description: "Type for the onBeforeDelete prop on ReactFlow. Return false (or a Promise resolving to false) to cancel the deletion.",
  importPath: "import type { OnBeforeDelete } from '@xyflow/react'",
  usage: `const onBeforeDelete: OnBeforeDelete = async ({ nodes, edges }) => {
  const confirmed = await showConfirmDialog();
  return confirmed;
};`,
  examples: [],
  relatedApis: ["OnDelete", "ReactFlow"],
};

const isValidConnectionType: ApiEntry = {
  name: "IsValidConnection",
  kind: "type",
  description: "Type for the isValidConnection prop on ReactFlow and Handle. Return false to prevent an edge from being created.",
  importPath: "import type { IsValidConnection } from '@xyflow/react'",
  usage: `const isValidConnection: IsValidConnection = (connection) => {
  return connection.source !== connection.target; // prevent self-loops
};`,
  examples: [],
  relatedApis: ["Handle", "ReactFlow", "Connection"],
};

const panelPositionType: ApiEntry = {
  name: "PanelPosition",
  kind: "type",
  description: "'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'. Used for Controls, MiniMap, and Panel position prop.",
  importPath: "import type { PanelPosition } from '@xyflow/react'",
  usage: `<Panel position="top-right">...</Panel>`,
  examples: [],
  relatedApis: ["Panel", "Controls", "MiniMap"],
};

const handleTypeType: ApiEntry = {
  name: "HandleType",
  kind: "type",
  description: "'source' | 'target'. Distinguishes outgoing from incoming handles.",
  importPath: "import type { HandleType } from '@xyflow/react'",
  usage: `const connections = useNodeConnections({ handleType: 'source' });`,
  examples: [],
  relatedApis: ["Handle", "useNodeConnections"],
};

const positionType: ApiEntry = {
  name: "Position",
  kind: "type",
  description: "Enum-like for handle/toolbar sides. Values: Position.Top ('top'), Position.Right ('right'), Position.Bottom ('bottom'), Position.Left ('left').",
  importPath: "import { Position } from '@xyflow/react'",
  usage: `<Handle type="source" position={Position.Right} />
<NodeToolbar position={Position.Top} />`,
  examples: [],
  relatedApis: ["Handle", "NodeToolbar"],
};

const rectType: ApiEntry = {
  name: "Rect",
  kind: "type",
  description: "Axis-aligned bounding rectangle: { x, y, width, height }. Returned by getNodesBounds(), accepted by fitBounds() and isNodeIntersecting().",
  importPath: "import type { Rect } from '@xyflow/react'",
  usage: `const bounds: Rect = getNodesBounds(nodes);
fitBounds(bounds, { padding: 0.1 });`,
  examples: [],
  relatedApis: ["getNodesBounds", "getViewportForBounds", "ReactFlowInstance"],
};

const reactFlowJsonObjectType: ApiEntry = {
  name: "ReactFlowJsonObject",
  kind: "type",
  description: "Shape returned by toObject() / reactFlowInstance.toObject(). Contains nodes, edges, and viewport for serialization.",
  importPath: "import type { ReactFlowJsonObject } from '@xyflow/react'",
  props: [
    { name: "nodes", type: "Node[]", description: "All nodes in the flow." },
    { name: "edges", type: "Edge[]", description: "All edges in the flow." },
    { name: "viewport", type: "Viewport", description: "Current viewport state." },
  ],
  usage: `const json: ReactFlowJsonObject = reactFlow.toObject();
localStorage.setItem('flow', JSON.stringify(json));`,
  examples: [],
  relatedApis: ["ReactFlowInstance"],
};

export const TYPE_APIS: ApiEntry[] = [
  nodeType,
  edgeType,
  nodePropsType,
  edgePropsType,
  connectionType,
  viewportType,
  reactFlowInstanceType,
  nodeChangeType,
  edgeChangeType,
  xyPositionType,
  fitViewOptionsType,
  colorModeType,
  connectionStateType,
  internalNodeType,
  onDeleteType,
  onBeforeDeleteType,
  isValidConnectionType,
  panelPositionType,
  handleTypeType,
  positionType,
  rectType,
  reactFlowJsonObjectType,
];
