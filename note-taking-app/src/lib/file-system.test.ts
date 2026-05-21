import { describe, it, expect, vi } from 'vitest';
import { validateNoteId } from './file-system';

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

  it('should allow path traversal attempts that resolve within the directory', () => {
    // 'folder/../note' resolves to 'note' which is inside NOTES_DIR
    expect(validateNoteId('folder/../note')).toBe(true);
  });

  it('should handle Windows-style path traversal attempts', () => {
    expect(validateNoteId('..\\note')).toBe(false);
    expect(validateNoteId('..\\..\\Windows\\System32')).toBe(false);
    expect(validateNoteId('folder/..\\..\\etc\\passwd')).toBe(false);
  });
});
