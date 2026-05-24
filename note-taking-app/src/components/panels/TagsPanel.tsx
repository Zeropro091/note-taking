'use client';

// Panel showing all tags in the knowledge base
import { Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Note } from '@/types/notes';
import { getAllTags } from '@/lib/search';

interface TagsPanelProps {
  notes: Note[];
  selectedTag: string | null;
  onTagSelect: (tag: string | null) => void;
}

export default function TagsPanel({
  notes,
  selectedTag,
  onTagSelect,
}: TagsPanelProps) {
  const tagCounts = getAllTags(notes);
  const sortedTags = Array.from(tagCounts.entries()).sort(
    (a, b) => b[1] - a[1]
  );

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-zinc-800 flex items-center gap-2">
        <Tag className="w-4 h-4 text-zinc-400" />
        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">
          Tags
        </h3>
        <span className="ml-auto text-xs text-zinc-500">
          {sortedTags.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <AnimatePresence mode="wait">
          {sortedTags.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-8 text-center text-zinc-500 text-sm"
            >
              <Tag className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No tags</p>
              <p className="text-xs mt-1">
                Add tags to notes using <code>#tagname</code>
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-1"
            >
              {/* Show all option */}
              <button aria-label="Show all notes"
                onClick={() => onTagSelect(null)}
                className={`
                  w-full text-left px-2 py-1.5 rounded hover:bg-zinc-800
                  transition-colors text-sm flex items-center justify-between
                  ${selectedTag === null ? 'bg-zinc-800 text-blue-400' : 'text-zinc-400'}
                `}
              >
                <span>All Notes</span>
                <span className="text-xs text-zinc-600">{notes.length}</span>
              </button>

              {/* Tags list */}
              {sortedTags.map(([tag, count], index) => (
                <motion.button
                  key={tag}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  onClick={() => onTagSelect(tag === selectedTag ? null : tag)}
                  className={`
                    w-full text-left px-2 py-1.5 rounded hover:bg-zinc-800
                    transition-colors text-sm flex items-center justify-between
                    ${selectedTag === tag ? 'bg-zinc-800 text-blue-400' : 'text-zinc-400'}
                  `}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-zinc-600">#</span>
                    <span>{tag}</span>
                  </span>
                  <span className="text-xs text-zinc-600">{count}</span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
