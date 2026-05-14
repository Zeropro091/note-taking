'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { File } from 'lucide-react';
import type { Note } from '@/types/notes';
import { cn } from '@/lib/utils';
import { PARA_CATEGORIES } from '../sidebar/NoteGroups';

interface PARABoardProps {
  notes: Note[];
  onNoteSelect: (path: string) => void;
  onMoveNote: (noteId: string, newTags: string[]) => void;
}

export default function PARABoard({ notes, onNoteSelect, onMoveNote }: PARABoardProps) {
  const [draggedNote, setDraggedNote] = useState<Note | null>(null);

  // Define columns matching PARA_CATEGORIES plus General/Inbox
  const columns = useMemo(() => {
    return [
      { id: 'General', title: 'Inbox', color: PARA_CATEGORIES.General.color, icon: PARA_CATEGORIES.General.icon, tags: PARA_CATEGORIES.General.tags },
      { id: 'Projects', title: 'Projects', color: PARA_CATEGORIES.Projects.color, icon: PARA_CATEGORIES.Projects.icon, tags: PARA_CATEGORIES.Projects.tags },
      { id: 'Areas', title: 'Areas', color: PARA_CATEGORIES.Areas.color, icon: PARA_CATEGORIES.Areas.icon, tags: PARA_CATEGORIES.Areas.tags },
      { id: 'Resources', title: 'Resources', color: PARA_CATEGORIES.Resources.color, icon: PARA_CATEGORIES.Resources.icon, tags: PARA_CATEGORIES.Resources.tags },
      { id: 'Archives', title: 'Archives', color: PARA_CATEGORIES.Archives.color, icon: PARA_CATEGORIES.Archives.icon, tags: PARA_CATEGORIES.Archives.tags },
    ];
  }, []);

  // Group notes into columns based on tags
  const notesByColumn = useMemo(() => {
    const grouped: Record<string, Note[]> = {
      General: [],
      Projects: [],
      Areas: [],
      Resources: [],
      Archives: [],
    };

    const assignedNoteIds = new Set<string>();

    // Assign notes to categories (excluding General first)
    for (const note of notes) {
      if (!note.tags || note.tags.length === 0) continue;

      for (const col of columns) {
        if (col.id === 'General') continue;
        if (note.tags.some((tag) => col.tags.includes(tag.toLowerCase()))) {
          grouped[col.id].push(note);
          assignedNoteIds.add(note.id);
          break; // Assign to first matching category
        }
      }
    }

    // Unassigned notes go to General (Inbox)
    for (const note of notes) {
      if (!assignedNoteIds.has(note.id)) {
        grouped['General'].push(note);
      }
    }

    return grouped;
  }, [notes, columns]);

  const handleDragStart = (e: React.DragEvent, note: Note) => {
    setDraggedNote(note);
    e.dataTransfer.effectAllowed = 'move';
    // Firefox requires setting data
    e.dataTransfer.setData('text/plain', note.id);

    // Slight delay to make the original card look transparent while dragging
    setTimeout(() => {
      if (e.target instanceof HTMLElement) {
        e.target.style.opacity = '0.5';
      }
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    if (e.target instanceof HTMLElement) {
      e.target.style.opacity = '1';
    }
    setDraggedNote(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();

    if (!draggedNote) return;

    // Check if the note is already in the target column
    const isAlreadyInTarget = notesByColumn[targetColumnId].some(n => n.id === draggedNote.id);
    if (isAlreadyInTarget) return;

    // Determine new tags
    const targetColumn = columns.find(c => c.id === targetColumnId);
    if (!targetColumn) return;

    // Remove existing PARA tags
    const allPARATags = columns.flatMap(c => c.tags);
    let newTags = (draggedNote.tags || []).filter(tag => !allPARATags.includes(tag.toLowerCase()));

    // Add target column tags (if not General/Inbox)
    if (targetColumn.tags.length > 0) {
      newTags = [...newTags, ...targetColumn.tags];
    }

    onMoveNote(draggedNote.id, newTags);
  };

  return (
    <div className="h-full w-full p-6 flex gap-4 overflow-x-auto bg-zinc-950">
      {columns.map((column) => (
        <div
          key={column.id}
          className="flex flex-col min-w-[280px] max-w-[320px] bg-zinc-900/50 rounded-lg border border-zinc-800/50"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, column.id)}
        >
          {/* Column Header */}
          <div
            className="p-3 border-b border-zinc-800 flex items-center justify-between"
            style={{ borderTop: `3px solid ${column.color}`, borderTopLeftRadius: '0.5rem', borderTopRightRadius: '0.5rem' }}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">{column.icon}</span>
              <h3 className="font-semibold text-zinc-200">{column.title}</h3>
            </div>
            <span className="text-xs font-medium bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">
              {notesByColumn[column.id]?.length || 0}
            </span>
          </div>

          {/* Column Content */}
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            <AnimatePresence>
              {notesByColumn[column.id]?.map((note) => (
                <motion.div
                  key={note.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  draggable
                  onDragStart={(e) => handleDragStart(e as unknown as React.DragEvent, note)}
                  onDragEnd={handleDragEnd}
                  onClick={() => onNoteSelect(note.path)}
                  className={cn(
                    "p-3 rounded border border-zinc-800 bg-zinc-900/80 cursor-grab active:cursor-grabbing hover:border-zinc-700 transition-colors",
                    draggedNote?.id === note.id ? "opacity-50" : ""
                  )}
                >
                  <div className="flex items-start gap-2">
                    <File className="w-4 h-4 text-zinc-500 mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-zinc-300 font-medium truncate">
                        {note.title}
                      </p>

                      {/* Non-PARA Tags */}
                      {note.tags && note.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {note.tags
                            .filter(tag => !columns.flatMap(c => c.tags).includes(tag.toLowerCase()))
                            .slice(0, 3)
                            .map((tag) => (
                              <span key={tag} className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">
                                #{tag}
                              </span>
                            ))}
                          {note.tags.filter(tag => !columns.flatMap(c => c.tags).includes(tag.toLowerCase())).length > 3 && (
                            <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">
                              +{note.tags.filter(tag => !columns.flatMap(c => c.tags).includes(tag.toLowerCase())).length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {notesByColumn[column.id]?.length === 0 && (
              <div className="h-full flex items-center justify-center min-h-[100px]">
                <p className="text-sm text-zinc-600">Drop notes here</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
