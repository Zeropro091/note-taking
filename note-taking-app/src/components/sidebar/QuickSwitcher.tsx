'use client';

// Quick switcher for fuzzy searching notes
import { useState, useEffect, useCallback, useRef } from 'react';
import { Search, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import type { Note } from '@/types/notes';

interface QuickSwitcherProps {
  notes: Note[];
  isOpen: boolean;
  onClose: () => void;
  onSelect: (noteId: string) => void;
}

export default function QuickSwitcher({
  notes,
  isOpen,
  onClose,
  onSelect,
}: QuickSwitcherProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter notes based on query
  const filteredNotes = useCallback(() => {
    if (!query.trim()) {
      // Show recent notes when no query
      return notes.slice(0, 8);
    }

    const lowerQuery = query.toLowerCase();
    return notes
      .filter((note) =>
        note.title.toLowerCase().includes(lowerQuery) ||
        note.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
      )
      .slice(0, 8);
  }, [notes, query]);

  const results = filteredNotes();

  // Reset state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      // Focus input after a small delay to ensure dialog is rendered
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((i) => Math.max(i - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (results[selectedIndex]) {
            onSelect(results[selectedIndex].id);
            onClose();
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onSelect, onClose]);

  const handleSelect = (noteId: string) => {
    onSelect(noteId);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 max-w-lg">
        <div className="p-4">
          {/* Search input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              placeholder="Search notes by title or tag..."
              className="pl-10 h-10 bg-zinc-900 border-zinc-700"
            />
          </div>

          {/* Results */}
          <div className="mt-2 max-h-80 overflow-y-auto">
            {results.length === 0 ? (
              <div className="py-8 text-center text-zinc-500">
                <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No notes found</p>
                <p className="text-xs mt-1">Try a different search term</p>
              </div>
            ) : (
              <div className="py-1">
                {query === '' && (
                  <div className="px-3 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                    Recent Notes
                  </div>
                )}
                {results.map((note, index) => (
                  <motion.button
                    key={note.id}
                    layout
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    onClick={() => handleSelect(note.id)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`
                      relative w-full flex items-start gap-3 px-3 py-2 rounded
                      transition-colors text-left overflow-hidden group
                      ${index === selectedIndex
                        ? 'text-white'
                        : 'text-zinc-300'
                      }
                    `}
                  >
                    {index === selectedIndex && (
                      <motion.div
                        layoutId="active-highlight"
                        className="absolute inset-0 bg-blue-600 -z-10"
                        initial={false}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    <FileText className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{note.title}</div>
                      <div className={`
                        text-xs truncate mt-0.5
                        ${index === selectedIndex ? 'text-blue-100' : 'text-zinc-500'}
                      `}>
                        {note.path}
                      </div>
                      {note.tags.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {note.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className={`
                                text-xs px-1.5 py-0.5 rounded
                                ${index === selectedIndex
                                  ? 'bg-blue-500'
                                  : 'bg-zinc-800'
                                }
                              `}
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* Footer hints */}
          <div className="mt-3 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
            <div className="flex gap-4">
              <span><kbd className="px-1.5 py-0.5 bg-zinc-800 rounded">↑↓</kbd> Navigate</span>
              <span><kbd className="px-1.5 py-0.5 bg-zinc-800 rounded">↵</kbd> Open</span>
              <span><kbd className="px-1.5 py-0.5 bg-zinc-800 rounded">Esc</kbd> Close</span>
            </div>
            <span>{results.length} notes</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Hook to trigger quick switcher with keyboard shortcut
export function useQuickSwitcher() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to open quick switcher
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  };
}
