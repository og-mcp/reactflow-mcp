# React Flow MCP Server

MCP server that gives AI assistants accurate [React Flow](https://reactflow.dev) (`@xyflow/react`) v12 documentation, API references, enterprise patterns, and code generation.

Repository: [og-mcp/reactflow-mcp](https://github.com/og-mcp/reactflow-mcp)



## Tools

| Tool | Description |
|------|-------------|
| `list_apis` | Browse all 56 APIs grouped by kind (components, hooks, utilities, types) |
| `get_api` | Detailed reference for any API — props, usage, examples, tips |
| `search_docs` | Keyword search across all documentation and code examples |
| `get_examples` | Code examples by category (15 categories) |
| `get_pattern` | Enterprise patterns with full implementation (17 patterns) |
| `get_template` | Production-ready templates: custom-node, custom-edge, zustand-store |
| `get_migration_guide` | React Flow v11 to v12 migration guide |
| `generate_flow` | Generate a complete flow component from natural language |

## Resources

| Resource | URI |
|----------|-----|
| Cheatsheet | `reactflow://cheatsheet` |

## Patterns

zustand-store, undo-redo, drag-and-drop, auto-layout-dagre, auto-layout-elk, context-menu, copy-paste, save-restore, prevent-cycles, keyboard-shortcuts, performance, dark-mode, ssr, subflows, edge-reconnection, custom-connection-line, auto-layout-on-mount

## Install

### npm

```bash
npm i @og-mcp/reactflow-mcp
```

### Claude Code

```bash
claude mcp add reactflow-mcp -- npx -y @og-mcp/reactflow-mcp
```

### Claude Desktop / Cursor / Windsurf

Add to your MCP config:

```json
{
  "mcpServers": {
    "reactflow-mcp": {
      "command": "npx",
      "args": ["-y", "@og-mcp/reactflow-mcp"]
    }
  }
}
```

### From source

```bash
git clone https://github.com/og-mcp/reactflow-mcp.git
cd reactflow-mcp
npm install
npm run build
npm start
```

## Development

```bash
npm install
npm run dev    # watch mode
npm run build  # production build
npm start      # run server
```

## License

MIT
