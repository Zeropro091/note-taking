// API route for graph data
import { NextRequest, NextResponse } from 'next/server';
import { getAllNotes } from '@/lib/file-system';
import { buildGraph } from '@/lib/graph';

export const runtime = 'nodejs';

// GET /api/graph - Get graph data
export async function GET(request: NextRequest) {
  try {
    const notes = await getAllNotes();
    const graph = buildGraph(notes);

    return NextResponse.json({
      success: true,
      graph,
    });
  } catch (error) {
    console.error('Error fetching graph:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch graph data' },
      { status: 500 }
    );
  }
}
