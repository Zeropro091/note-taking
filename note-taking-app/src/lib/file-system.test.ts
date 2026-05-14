import fs from 'fs/promises';
import path from 'path';
import { renameNote, getNoteById } from './file-system';

// Mock fs/promises
jest.mock('fs/promises', () => ({
  mkdir: jest.fn(),
  rename: jest.fn(),
  readFile: jest.fn(),
  stat: jest.fn(),
}));

jest.mock('gray-matter', () => {
  return jest.fn().mockImplementation((content) => {
    return {
      data: { title: 'Test Note' },
      content: content
    };
  });
});

describe('renameNote', () => {
  const NOTES_DIR = path.join(process.cwd(), 'data', 'notes');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully rename a note', async () => {
    const oldId = 'old-note';
    const newId = 'new-note';

    // Mock readFile and stat so getNoteById succeeds inside renameNote
    (fs.readFile as jest.Mock).mockResolvedValue('Note content');
    (fs.stat as jest.Mock).mockResolvedValue({
      birthtime: new Date('2023-01-01'),
      mtime: new Date('2023-01-02'),
    });

    const result = await renameNote(oldId, newId);

    // Verify fs.mkdir was called to create the parent directory
    expect(fs.mkdir).toHaveBeenCalledWith(
      path.dirname(path.join(NOTES_DIR, `${newId}.md`)),
      { recursive: true }
    );

    // Verify fs.rename was called with the correct paths
    expect(fs.rename).toHaveBeenCalledWith(
      path.join(NOTES_DIR, `${oldId}.md`),
      path.join(NOTES_DIR, `${newId}.md`)
    );

    // Verify the returned note has the new ID
    expect(result.id).toBe(newId);
  });

  it('should throw an error for invalid oldId (path traversal)', async () => {
    await expect(renameNote('../old-note', 'new-note')).rejects.toThrow(
      'Invalid note ID for rename operation'
    );
    expect(fs.rename).not.toHaveBeenCalled();
  });

  it('should throw an error for invalid newId (path traversal)', async () => {
    await expect(renameNote('old-note', '../new-note')).rejects.toThrow(
      'Invalid note ID for rename operation'
    );
    expect(fs.rename).not.toHaveBeenCalled();
  });

  it('should propagate errors from fs.rename (e.g., file not found)', async () => {
    const oldId = 'nonexistent-note';
    const newId = 'new-note';

    const error = new Error('ENOENT: no such file or directory');
    (fs.rename as jest.Mock).mockRejectedValue(error);

    await expect(renameNote(oldId, newId)).rejects.toThrow(error);
  });
});
