export const V12_MIGRATION = `# React Flow v12 Migration Guide (from v11)

## Package Change
\`\`\`bash
# Remove old package
npm uninstall reactflow

# Install v12
npm install @xyflow/react
\`\`\`

## Import Changes
\`\`\`tsx
// v11 (OLD)
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';

// v12 (NEW)
import { ReactFlow, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
\`\`\`

## Key Breaking Changes

| v11 | v12 |
|-----|-----|
| \`node.width\` / \`node.height\` | \`node.measured.width\` / \`node.measured.height\` |
| \`nodeInternals\` | \`nodeLookup\` |
| \`project()\` | \`screenToFlowPosition()\` |
| \`getNode(id)\` returns \`null\` | \`getNode(id)\` returns \`undefined\` |
| \`getEdge(id)\` returns \`null\` | \`getEdge(id)\` returns \`undefined\` |
| Default export | Named export: \`{ ReactFlow }\` |
| \`onEdgeUpdate\` | \`onReconnect\` |
| \`edgesUpdatable\` | \`edgesReconnectable\` |
| \`updateEdge()\` util | \`reconnectEdge()\` util |

## Type Changes
\`\`\`tsx
// v11: generic data in Node type
type MyNode = Node<{ label: string }>;

// v12: data AND type in generic
type MyNode = Node<{ label: string }, 'customType'>;
\`\`\`

## Additional Breaking Changes

| v11 | v12 |
|-----|-----|
| \`node.parentNode\` | \`node.parentId\` |
| \`NodeProps.xPos\` | \`NodeProps.positionAbsoluteX\` |
| \`NodeProps.yPos\` | \`NodeProps.positionAbsoluteY\` |
| \`getTransformForBounds()\` returns \`[x, y, zoom]\` tuple | \`getViewportForBounds()\` returns \`{ x, y, zoom }\` object |
| \`getRectOfNodes()\` | \`getNodesBounds()\` |
| \`getMarkerEndId()\` | Removed — no replacement |
| CSS: \`react-flow__handle-connecting\` | CSS: \`connectingto\` / \`connectingfrom\` |
| CSS: \`react-flow__handle-valid\` | CSS: \`valid\` |
| \`connectionNodeId\` (store) | \`connection.fromHandle.nodeId\` |
| \`connectionHandleId\` (store) | \`connection.fromHandle.id\` |
| \`connectionHandleType\` (store) | \`connection.fromHandle\` type fields |

## Behavioral Changes
- \`nodeDragThreshold\` defaults to \`1\` (was \`0\`) — sub-pixel drags no longer register as moves.
- Node/edge updates must return **new objects** — mutation is no longer detected.
- \`node.width\` / \`node.height\` are now **inline style hints**, not measured values. If you load nodes from a database with stored width/height, strip those fields to restore auto-measurement:
\`\`\`tsx
const nodes = storedNodes.map(({ width, height, ...node }) => node);
\`\`\`

## Database / Persistence Caveat
In v11, \`node.width\` and \`node.height\` were read-only measured values. In v12 they set fixed inline styles. If you load persisted nodes that have these fields, React Flow will render them with that fixed size and skip DOM measurement — which can cause layout issues. Strip them on load unless you explicitly want fixed-size nodes.

## v12.4.0: useHandleConnections deprecated
\`useHandleConnections\` was deprecated in v12.4.0. Migrate to \`useNodeConnections\`:
\`\`\`tsx
// Old (deprecated):
const conns = useHandleConnections({ type: 'target', id: 'my-handle' });
// New:
const conns = useNodeConnections({ handleType: 'target', handleId: 'my-handle' });
\`\`\`

## v12.11.0: handleId requires handleType in useNodeConnections
TypeScript now raises an error if \`handleId\` is provided without \`handleType\` in \`useNodeConnections\`.
\`\`\`tsx
// TypeScript error — handleId without handleType:
useNodeConnections({ handleId: 'my-handle' });
// Correct:
useNodeConnections({ handleType: 'target', handleId: 'my-handle' });
\`\`\`
`;
