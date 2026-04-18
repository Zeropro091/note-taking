'use client';

// Panel showing table of contents from headings
import { List } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { extractHeadings } from '@/lib/markdown';

interface OutlinePanelProps {
  content: string;
  onHeadingClick?: (line: number) => void;
}

export default function OutlinePanel({
  content,
  onHeadingClick,
}: OutlinePanelProps) {
  const headings = extractHeadings(content);

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-zinc-800 flex items-center gap-2">
        <List className="w-4 h-4 text-zinc-400" />
        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">
          Outline
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <AnimatePresence mode="wait">
          {headings.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-8 text-center text-zinc-500 text-sm"
            >
              <List className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No headings</p>
              <p className="text-xs mt-1">
                Add headings with <code>#</code> to see outline
              </p>
            </motion.div>
          ) : (
            <motion.nav
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-1"
            >
              {headings.map((heading, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                  onClick={() => onHeadingClick?.(heading.line)}
                  className={`
                    block w-full text-left px-2 py-1 rounded hover:bg-zinc-800
                    transition-colors text-sm
                    ${heading.level === 1 ? 'font-semibold' : ''}
                    ${heading.level === 2 ? 'pl-3' : ''}
                    ${heading.level === 3 ? 'pl-6 text-zinc-400' : ''}
                    ${heading.level >= 4 ? 'pl-9 text-zinc-500' : ''}
                  `}
                >
                  <span className="text-zinc-400 mr-2">
                    {'#'.repeat(heading.level)}
                  </span>
                  {heading.text}
                </motion.button>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
