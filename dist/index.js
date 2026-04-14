#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const index_js_1 = require("./tools/index.js");
const server = new mcp_js_1.McpServer({
    name: "reactflow-mcp",
    version: "1.0.0",
});
(0, index_js_1.registerAll)(server);
async function main() {
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
}
main().catch((err) => {
    console.error("Failed to start MCP server:", err);
    process.exit(1);
});
