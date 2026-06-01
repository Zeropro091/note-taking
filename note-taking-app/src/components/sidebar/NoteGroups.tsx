'use client';

// Note groups component for organizing notes by tags/categories
import { useState, useMemo } from 'react';
import { File, ChevronDown, ChevronRight, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Note } from '@/types/notes';
import { cn } from '@/lib/utils';

// Category definitions with icons and colors
export const PARA_CATEGORIES: Record<string, { tags: string[]; color: string; icon: string }> = {
  'Projects': {
    tags: ['project'],
    color: '#3b82f6', // blue-500
    icon: '🎯',
  },
  'Areas': {
    tags: ['area'],
    color: '#22c55e', // green-500
    icon: '🪴',
  },
  'Resources': {
    tags: ['resource'],
    color: '#eab308', // yellow-500
    icon: '📚',
  },
  'Archives': {
    tags: ['archive'],
    color: '#6b7280', // gray-500
    icon: '🗄️',
  },
  'General': {
    tags: [], // Default for notes without matching tags
    color: '#6366f1', // indigo-500
    icon: '📝',
  },
};

interface NoteGroup {
  name: string;
  icon: string;
  color: string;
  notes: Note[];
  count: number;
}

interface NoteGroupsProps {
  notes: Note[];
  selectedId: string | null;
  onNoteSelect: (path: string) => void;
}

export default function NoteGroups({
  notes,
  selectedId,
  onNoteSelect,
}: NoteGroupsProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['Projects', 'Areas']));

  // Group notes by category
  const groupedNotes = useMemo(() => {
    const groups: NoteGroup[] = [];

    // First, categorize notes
    for (const [categoryName, category] of Object.entries(PARA_CATEGORIES)) {
      if (categoryName === 'General') continue; // Skip General, handle separately

      const categoryNotes = notes.filter((note) => {
        if (!note.tags || note.tags.length === 0) return false;
        return note.tags.some((tag) => category.tags.includes(tag.toLowerCase()));
      });

      if (categoryNotes.length > 0) {
        groups.push({
          name: categoryName,
          icon: category.icon,
          color: category.color,
          notes: categoryNotes,
          count: categoryNotes.length,
        });
      }
    }

    // Find notes that weren't assigned to any category
    const assignedNoteIds = new Set(groups.flatMap((g) => g.notes.map((n) => n.id)));
    const generalNotes = notes.filter((n) => !assignedNoteIds.has(n.id));

    if (generalNotes.length > 0) {
      groups.push({
        name: 'General',
        icon: PARA_CATEGORIES.General.icon,
        color: PARA_CATEGORIES.General.color,
        notes: generalNotes,
        count: generalNotes.length,
      });
    }

    return groups;
  }, [notes]);

  // Get unique tags from all notes for tag cloud
  const allTags = useMemo(() => {
    const tagMap = new Map<string, number>();
    for (const note of notes) {
      for (const tag of note.tags || []) {
        tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
      }
    }
    return Array.from(tagMap.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);
  }, [notes]);

  const toggleGroup = (groupName: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupName)) {
        next.delete(groupName);
      } else {
        next.add(groupName);
      }
      return next;
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-zinc-800">
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-3">
          Groups
        </h2>

        {/* Tag Cloud */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {allTags.slice(0, 12).map(({ tag, count }) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 hover:bg-zinc-700 transition-colors cursor-pointer"
                title={`${count} note${count > 1 ? 's' : ''}`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Groups */}
      <div className="flex-1 overflow-y-auto py-2">
        {groupedNotes.length === 0 ? (
          <div className="px-4 py-8 text-center text-zinc-500 text-sm">
            <Tag className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No groups yet</p>
            <p className="text-xs mt-1">Add tags to notes to create groups</p>
          </div>
        ) : (
          groupedNotes.map((group) => {
            const isExpanded = expandedGroups.has(group.name);

            return (
              <div key={group.name} className="mb-1">
                {/* Group Header */}
                <button
                  onClick={() => toggleGroup(group.name)}
                  aria-expanded={isExpanded}
                  aria-controls={`group-${group.name}`}
                  className={cn(
                    'w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors',
                    'hover:bg-zinc-800 rounded mx-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500'
                  )}
                  style={{ borderLeft: `3px solid ${group.color}` }}
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-zinc-500 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-zinc-500 flex-shrink-0" />
                  )}
                  <span className="text-lg">{group.icon}</span>
                  <span className="flex-1 text-left font-medium text-zinc-300">
                    {group.name}
                  </span>
                  <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">
                    {group.count}
                  </span>
                </button>

                {/* Group Notes */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      id={`group-${group.name}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                      className="mt-1 space-y-0.5 overflow-hidden"
                    >
                      {group.notes.map((note) => {
                        const isSelected = selectedId === note.id;
                        return (
                          <button
                            key={note.id}
                            onClick={() => onNoteSelect(note.path)}
                            className={cn(
                              'w-full flex items-center gap-2 px-3 py-1.5 text-sm transition-colors',
                              'hover:bg-zinc-800 rounded mx-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
                              isSelected && 'bg-zinc-800 text-blue-400'
                            )}
                            style={{ paddingLeft: '2.5rem' }}
                          >
                            <File className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
                            <span className="flex-1 text-left truncate text-zinc-400">
                              {note.title}
                            </span>
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>

      {/* Stats Footer */}
      <div className="p-3 border-t border-zinc-800 text-xs text-zinc-500">
        <div className="flex justify-between">
          <span>{notes.length} notes</span>
          <span>{allTags.length} tags</span>
        </div>
      </div>
    </div>
  );
}
