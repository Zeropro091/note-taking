// API route for backlinks
import { NextRequest, NextResponse } from 'next/server';
import { getAllNotes } from '@/lib/file-system';
import { findBacklinks } from '@/lib/graph';

export const runtime = 'nodejs';

// GET /api/backlinks/[id] - Get backlinks for a note
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const notes = await getAllNotes();
    const backlinks = findBacklinks(id, notes);

    return NextResponse.json({
      success: true,
      backlinks,
    });
  } catch (error) {
    console.error('Error fetching backlinks:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch backlinks' },
      { status: 500 }
    );
  }
}
