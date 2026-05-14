import { createNote } from '../file-system';
import fs from 'fs/promises';

jest.mock('fs/promises');

describe('createNote', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully create a note with a valid path and title', async () => {
    // Mock fs.access to resolve (dir exists)
    (fs.access as jest.Mock).mockResolvedValue(undefined);

    // Mock fs.readFile for the first getNoteById call (note doesn't exist yet)
    (fs.readFile as jest.Mock).mockRejectedValueOnce(new Error('ENOENT'));

    // Mock fs.mkdir and fs.writeFile for the save operations
    (fs.mkdir as jest.Mock).mockResolvedValue(undefined);
    (fs.writeFile as jest.Mock).mockResolvedValue(undefined);

    // Mock fs.readFile and fs.stat for the final getNoteById call (returning the saved note)
    const mockFileContent = '---\ntitle: My Test Note\ntags: []\n---\n# My Test Note\n\n';
    (fs.readFile as jest.Mock).mockResolvedValueOnce(mockFileContent);
    (fs.stat as jest.Mock).mockResolvedValueOnce({
      birthtime: new Date('2023-01-01'),
      mtime: new Date('2023-01-01')
    });

    const note = await createNote('my-test-note', 'My Test Note');

    expect(note).toBeDefined();
    expect(note?.title).toBe('My Test Note');
    expect(note?.id).toBe('my-test-note');

    // Verify file operations were called correctly
    expect(fs.writeFile).toHaveBeenCalledTimes(1);
    const writeArgs = (fs.writeFile as jest.Mock).mock.calls[0];
    expect(writeArgs[0]).toMatch(/my-test-note\.md$/);
    expect(writeArgs[1]).toContain('# My Test Note');
    expect(writeArgs[1]).toContain('title: My Test Note');
  });

  it('should throw an error if the note path is invalid (path traversal)', async () => {
    await expect(createNote('../secret', 'Secret Note')).rejects.toThrow('Invalid note path: ../secret');
    expect(fs.writeFile).not.toHaveBeenCalled();
  });

  it('should correctly handle paths with a .md extension', async () => {
    // Mock fs.access to resolve (dir exists)
    (fs.access as jest.Mock).mockResolvedValue(undefined);

    // Mock fs.readFile for the first getNoteById call (note doesn't exist yet)
    (fs.readFile as jest.Mock).mockRejectedValueOnce(new Error('ENOENT'));

    // Mock fs.mkdir and fs.writeFile for the save operations
    (fs.mkdir as jest.Mock).mockResolvedValue(undefined);
    (fs.writeFile as jest.Mock).mockResolvedValue(undefined);

    // Mock fs.readFile and fs.stat for the final getNoteById call
    (fs.readFile as jest.Mock).mockResolvedValueOnce('---\ntitle: Extension Note\ntags: []\n---\n# Extension Note\n\n');
    (fs.stat as jest.Mock).mockResolvedValueOnce({
      birthtime: new Date('2023-01-01'),
      mtime: new Date('2023-01-01')
    });

    const note = await createNote('extension-note.md', 'Extension Note');

    expect(note?.id).toBe('extension-note'); // extension should be removed

    expect(fs.writeFile).toHaveBeenCalledTimes(1);
    const writeArgs = (fs.writeFile as jest.Mock).mock.calls[0];
    // Should not result in extension-note.md.md
    expect(writeArgs[0]).toMatch(/extension-note\.md$/);
  });
});
