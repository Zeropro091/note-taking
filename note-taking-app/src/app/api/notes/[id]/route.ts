// API route for individual note operations
import { NextRequest, NextResponse } from 'next/server';
import { getNoteById, saveNote, deleteNote, renameNote } from '@/lib/file-system';
import { buildGraph, findBacklinks } from '@/lib/graph';

export const runtime = 'nodejs';

// GET /api/notes/[id] - Get a specific note
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const note = await getNoteById(id);

    if (!note) {
      return NextResponse.json(
        { success: false, error: 'Note not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      note,
    });
  } catch (error) {
    console.error('Error fetching note:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch note' },
      { status: 500 }
    );
  }
}

// PUT /api/notes/[id] - Update a note
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { content, frontmatter } = body;

    const note = await saveNote(id, content, frontmatter);

    return NextResponse.json({
      success: true,
      note,
    });
  } catch (error) {
    console.error('Error updating note:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update note' },
      { status: 500 }
    );
  }
}

// DELETE /api/notes/[id] - Delete a note
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteNote(id);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Error deleting note:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete note' },
      { status: 500 }
    );
  }
}

// PATCH /api/notes/[id] - Rename a note
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { newId } = body;

    if (!newId) {
      return NextResponse.json(
        { success: false, error: 'newId is required' },
        { status: 400 }
      );
    }

    const note = await renameNote(id, newId);

    return NextResponse.json({
      success: true,
      note,
    });
  } catch (error) {
    console.error('Error renaming note:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to rename note' },
      { status: 500 }
    );
  }
}
