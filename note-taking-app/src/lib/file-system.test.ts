import { describe, it, expect, vi } from 'vitest';
import { validateNoteId } from './file-system';
import path from 'path';

// Mock process.cwd() so tests are predictable regardless of where they run
vi.spyOn(process, 'cwd').mockReturnValue('/mock/project/dir');

describe('validateNoteId', () => {
  it('should return true for simple valid note IDs', () => {
    expect(validateNoteId('my-note')).toBe(true);
    expect(validateNoteId('1234')).toBe(true);
    expect(validateNoteId('note_with_underscores')).toBe(true);
    expect(validateNoteId('NoteWithCaps')).toBe(true);
  });

  it('should return true for valid nested note IDs', () => {
    expect(validateNoteId('folder/note')).toBe(true);
    expect(validateNoteId('folder/subfolder/note')).toBe(true);
  });

  it('should return false for empty or non-string IDs', () => {
    expect(validateNoteId('')).toBe(false);
    // @ts-expect-error - testing invalid type
    expect(validateNoteId(null)).toBe(false);
    // @ts-expect-error - testing invalid type
    expect(validateNoteId(undefined)).toBe(false);
    // @ts-expect-error - testing invalid type
    expect(validateNoteId(123)).toBe(false);
  });

  it('should return false for IDs containing invalid characters', () => {
    expect(validateNoteId('note<')).toBe(false);
    expect(validateNoteId('note>')).toBe(false);
    expect(validateNoteId('note:')).toBe(false);
    expect(validateNoteId('note"')).toBe(false);
    expect(validateNoteId('note|')).toBe(false);
    expect(validateNoteId('note?')).toBe(false);
    expect(validateNoteId('note*')).toBe(false);
    expect(validateNoteId('note\x00')).toBe(false); // Null byte
  });

  it('should return false for path traversal attempts', () => {
    // These attempt to escape the NOTES_DIR
    expect(validateNoteId('../note')).toBe(false);
    expect(validateNoteId('../../etc/passwd')).toBe(false);
  });

  it('should reject path traversal attempts even if they would resolve within the directory', () => {
    // We explicitly reject '..' now to prevent traversal bypasses
    expect(validateNoteId('folder/../../note')).toBe(false);
  });

  it('should handle Windows-style path traversal attempts', () => {
    expect(validateNoteId('..\\note')).toBe(false);
    expect(validateNoteId('..\\..\\Windows\\System32')).toBe(false);
  });
});
