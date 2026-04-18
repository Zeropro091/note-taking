// API route for listing and creating notes
import { NextRequest, NextResponse } from 'next/server';
import { getAllNotes, createNote } from '@/lib/file-system';
import { z } from 'zod';

// Schema validation for creating a note
const createNoteSchema = z.object({
  path: z.string()
    .min(1, 'Path is required')
    .max(255, 'Path is too long')
    .regex(/^[^<>:"|?*\x00-\x1f]+$/, 'Path contains invalid characters'),
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title is too long')
    .trim(),
});

export const runtime = 'nodejs';

// GET /api/notes - List all notes
export async function GET(request: NextRequest) {
  try {
    const notes = await getAllNotes();
    return NextResponse.json({
      success: true,
      notes,
    });
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notes' },
      { status: 500 }
    );
  }
}

// POST /api/notes - Create a new note
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body using Zod schema
    const validationResult = createNoteSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid input',
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const { path, title } = validationResult.data;
    const note = await createNote(path, title);

    return NextResponse.json({
      success: true,
      note,
    });
  } catch (error) {
    console.error('Error creating note:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create note' },
      { status: 500 }
    );
  }
}
