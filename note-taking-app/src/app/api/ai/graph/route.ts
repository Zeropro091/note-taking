// AI API route for knowledge graph data
import { NextRequest, NextResponse } from 'next/server';
import { getAllNotes } from '@/lib/file-system';
import { buildGraph } from '@/lib/graph';

export const runtime = 'nodejs';

// GET /api/ai/graph - Get graph structure for AI understanding
export async function GET(request: NextRequest) {
  try {
    const notes = await getAllNotes();
    const graph = buildGraph(notes);

    return NextResponse.json({
      success: true,
      graph: {
        nodes: graph.nodes.map((n) => ({
          id: n.id,
          label: n.label,
          tags: n.tags,
        })),
        edges: graph.edges,
      },
      stats: {
        totalNotes: graph.nodes.length,
        totalConnections: graph.edges.length,
      },
    });
  } catch (error) {
    console.error('Error fetching graph for AI:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch graph' },
      { status: 500 }
    );
  }
}
