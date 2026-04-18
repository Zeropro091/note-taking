'use client';

// Panel showing backlinks (notes that link to the current note)
import { Link2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Backlink } from '@/types/notes';

interface BacklinksPanelProps {
  backlinks: Backlink[];
  onNoteClick: (noteId: string) => void;
}

export default function BacklinksPanel({
  backlinks,
  onNoteClick,
}: BacklinksPanelProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-zinc-800 flex items-center gap-2">
        <Link2 className="w-4 h-4 text-zinc-400" />
        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">
          Backlinks
        </h3>
        <span className="ml-auto text-xs text-zinc-500">
          {backlinks.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <AnimatePresence mode="wait">
          {backlinks.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-8 text-center text-zinc-500 text-sm"
            >
              <Link2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No backlinks</p>
              <p className="text-xs mt-1">
                Other notes can link here using <code>[[note-name]]</code>
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              {backlinks.map((backlink, index) => (
                <motion.button
                  key={backlink.noteId}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onNoteClick(backlink.noteId)}
                  className="w-full text-left p-2 rounded hover:bg-zinc-800 transition-colors group"
                >
                  <div className="font-medium text-sm text-zinc-300 group-hover:text-blue-400">
                    {backlink.title}
                  </div>
                  <div className="text-xs text-zinc-500 mt-1 line-clamp-2">
                    {backlink.excerpt}
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
