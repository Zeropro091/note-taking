#!/usr/bin/env node
/**
 * MCP Server for Note Taking App
 *
 * This server connects Claude Code to your local note-taking application,
 * exposing your notes as native tools that Claude can use contextually.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import fetch from 'node-fetch';

// Configuration - point to your running note-taking app
const BASE_URL = process.env.NOTES_API_URL || 'http://localhost:3001';

// Helper to make API calls
async function apiCall(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Create the MCP server
const server = new Server(
  {
    name: 'note-taking-mcp',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'list_notes',
        description: 'List all notes in your knowledge base',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'get_note',
        description: 'Get the full content of a specific note by ID',
        inputSchema: {
          type: 'object',
          properties: {
            note_id: {
              type: 'string',
              description: 'Note ID (e.g., "Welcome")',
            },
          },
          required: ['note_id'],
        },
      },
      {
        name: 'search_notes',
        description: 'Search notes by query with fuzzy matching',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query',
            },
            limit: {
              type: 'number',
              description: 'Max results to return (default: 10)',
            },
          },
          required: ['query'],
        },
      },
      {
        name: 'get_graph',
        description: 'Get the knowledge graph structure (nodes and connections)',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'get_related',
        description: 'Find notes related to a specific note',
        inputSchema: {
          type: 'object',
          properties: {
            note_id: {
              type: 'string',
              description: 'Note ID',
            },
          },
          required: ['note_id'],
        },
      },
      {
        name: 'create_note',
        description: 'Create a new note in your knowledge base',
        inputSchema: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'Note path (e.g., "dev/notes/setup.md")',
            },
            title: {
              type: 'string',
              description: 'Note title',
            },
            content: {
              type: 'string',
              description: 'Markdown content (optional)',
            },
          },
          required: ['path', 'title'],
        },
      },
      {
        name: 'get_backlinks',
        description: 'Get all notes that link to a specific note',
        inputSchema: {
          type: 'object',
          properties: {
            note_id: {
              type: 'string',
              description: 'Note ID',
            },
          },
          required: ['note_id'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      // List all notes
      case 'list_notes': {
        const result = await apiCall('/api/ai/notes');
        return {
          content: [{
            type: 'text',
            text: `Found ${result.notes.length} notes:\n${result.notes.map((n, i) =>
              `${i + 1}. **${n.title}** (${n.id})\n   Tags: ${n.tags.join(', ') || 'none'}\n   Updated: ${n.updatedAt}`
            ).join('\n\n')}`
          }],
        };
      }

      // Get a specific note
      case 'get_note': {
        const { note_id } = args;
        const result = await apiCall(`/api/ai/notes/${note_id}`);
        return {
          content: [{
            type: 'text',
            text: `**${result.note.title}**\n\nTags: ${result.note.tags.join(', ') || 'none'}\nPath: ${result.note.path}\n\n${result.note.content}`
          }],
        };
      }

      // Search notes
      case 'search_notes': {
        const { query, limit = 10 } = args;
        const result = await apiCall('/api/ai/search', {
          method: 'POST',
          body: JSON.stringify({ query, limit }),
        });
        return {
          content: [{
            type: 'text',
            text: `Found ${result.results.length} notes matching "${query}":\n\n${result.results.map((r, i) =>
              `${i + 1}. **${r.note.title}** (relevance: ${r.score.toFixed(2)})\n   ${r.snippet}\n   Tags: ${r.note.tags.join(', ') || 'none'}`
            ).join('\n\n')}`
          }],
        };
      }

      // Get graph data
      case 'get_graph': {
        const result = await apiCall('/api/ai/graph');
        return {
          content: [{
            type: 'text',
            text: `Knowledge graph:\n\n${result.graph.nodes.length} notes, ${result.graph.edges.length} connections\n\n` +
              `Top connected notes:\n` +
              `${result.graph.nodes.map(n => `- ${n.label} (${n.tags.join(', ')})`).join('\n')}`
          }],
        };
      }

      // Get related notes
      case 'get_related': {
        const { note_id } = args;
        const result = await apiCall(`/api/ai/notes/${note_id}/related`);
        return {
          content: [{
            type: 'text',
            text: `Related to ${note_id}:\n\n${result.related.map((n, i) =>
              `${i + 1}. **${n.title}**\n   Tags: ${n.tags.join(', ') || 'none'}`
            ).join('\n\n')}`
          }],
        };
      }

      // Create a new note
      case 'create_note': {
        const { path, title, content } = args;
        const result = await apiCall('/api/ai/notes', {
          method: 'POST',
          body: JSON.stringify({
            path,
            title,
            content: content || `# ${title}\n\nCreated from Gemini CLI via MCP.`,
          }),
        });
        return {
          content: [{
            type: 'text',
            text: `✅ Created note: **${result.note.title}** (${result.note.id})`
          }],
        };
      }

      // Get backlinks for a note
      case 'get_backlinks': {
        const { note_id } = args;
        const result = await apiCall(`/api/backlinks/${note_id}`);
        return {
          content: [{
            type: 'text',
            text: result.backlinks.length > 0
              ? `Backlinks to ${note_id}:\n\n${result.backlinks.map((b, i) =>
                `${i + 1}. **${b.title}**\n   ${b.excerpt}`
              ).join('\n\n')}`
              : `No backlinks found for ${note_id}`
          }],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [{
        type: 'text',
        text: `Error: ${error.message}`
      }],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Note Taking MCP Server running on stdio');
}

main().catch(console.error);
