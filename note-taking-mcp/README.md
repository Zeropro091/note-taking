# Note Taking MCP Server

MCP server that integrates your local Note Taking App with Claude Code.

## Installation

1. **Install dependencies:**
   ```bash
   cd note-taking-mcp
   npm install
   ```

2. **Add to Claude Code settings** (`~/.claude/settings.json`):

   ```json
   {
     "mcpServers": {
       "note-taking": {
         "command": "node",
         "args": ["C:/Users/JayamAirways/note-taking-mcp/server/index.js"],
         "env": {
           "NOTES_API_URL": "http://localhost:3001"
         }
       }
     }
   }
   ```

3. **Restart Claude Code**

## Usage

Once installed, Claude Code will have native access to your notes:

```
You: "Show me all my notes about react"
Me: [uses list_notes tool]

You: "What did I write about API design?"  
Me: [uses search_notes tool with "API design"]

You: "Create a note about today's meeting"
Me: [uses create_note tool]
```

## Available Tools

| Tool | Description |
|------|-------------|
| `list_notes` | List all notes with metadata |
| `get_note` | Get full content of a specific note |
| `search_notes` | Fuzzy search across all notes |
| `get_graph` | Get knowledge graph structure |
| `get_related` | Find notes related to a specific note |
| `create_note` | Create a new note |
| `get_backlinks` | Find notes that link to a specific note |

## Requirements

- Note Taking App must be running on `http://localhost:3001`
- Node.js installed
- Claude Code installed

## Troubleshooting

If tools don't appear:
1. Check Note Taking App is running: `curl http://localhost:3001/api/ai/notes`
2. Check MCP server is running (look for console output)
3. Verify settings.json path format (use forward slashes on Windows)
