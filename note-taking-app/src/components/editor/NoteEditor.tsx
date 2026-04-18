'use client';

// Combined editor with markdown preview
import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Edit, Eye, Save } from 'lucide-react';

const MonacoEditor = dynamic(() => import('./MonacoEditor'), { ssr: false });
const MarkdownPreview = dynamic(() => import('./MarkdownPreview'), { ssr: false });

interface NoteEditorProps {
  noteId: string;
  initialContent: string;
  onSave: (content: string) => void;
}

type ViewMode = 'edit' | 'preview' | 'split';

export default function NoteEditor({
  noteId,
  initialContent,
  onSave,
}: NoteEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [viewMode, setViewMode] = useState<ViewMode>('edit');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  useEffect(() => {
    setContent(initialContent);
    setHasUnsavedChanges(false);
  }, [noteId, initialContent]);

  const handleChange = useCallback((newContent: string) => {
    setContent(newContent);
    setHasUnsavedChanges(newContent !== initialContent);
  }, [initialContent]);

  const handleSave = useCallback(async () => {
    setSaveStatus('saving');
    try {
      await onSave(content);
      setHasUnsavedChanges(false);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Failed to save note:', error);
      setSaveStatus('idle');
    }
  }, [content, onSave]);

  // Auto-save with debounce
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const timer = setTimeout(() => {
      handleSave();
    }, 2000);

    return () => clearTimeout(timer);
  }, [content, hasUnsavedChanges, handleSave]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + S to save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
      // Ctrl/Cmd + E to toggle edit mode
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        setViewMode('edit');
      }
      // Ctrl/Cmd + P to toggle preview mode
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        setViewMode('preview');
      }
      // Ctrl/Cmd + \ to toggle split mode
      if ((e.ctrlKey || e.metaKey) && e.key === '\\') {
        e.preventDefault();
        setViewMode('split');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSave]);

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900">
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'edit' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('edit')}
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
          <Button
            variant={viewMode === 'preview' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('preview')}
          >
            <Eye className="w-4 h-4 mr-1" />
            Preview
          </Button>
          <Button
            variant={viewMode === 'split' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('split')}
          >
            <Edit className="w-4 h-4 mr-1" />
            <Eye className="w-4 h-4 ml-1" />
            Split
          </Button>
        </div>

        <div className="flex items-center gap-4">
          {/* Save status indicator */}
          <span className="text-sm text-zinc-400">
            {saveStatus === 'saving' && 'Saving...'}
            {saveStatus === 'saved' && 'Saved'}
            {saveStatus === 'idle' && hasUnsavedChanges && 'Unsaved changes'}
          </span>

          <Button
            size="sm"
            onClick={handleSave}
            disabled={!hasUnsavedChanges || saveStatus === 'saving'}
          >
            <Save className="w-4 h-4 mr-1" />
            Save
          </Button>
        </div>
      </div>

      {/* Editor/Preview */}
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {viewMode === 'edit' && (
            <motion.div
              key="edit"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.15 }}
              className="h-full"
            >
              <MonacoEditor
                noteId={noteId}
                content={content}
                onChange={handleChange}
                onSave={handleSave}
              />
            </motion.div>
          )}

          {viewMode === 'preview' && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              className="h-full"
            >
              <MarkdownPreview content={content} noteId={noteId} />
            </motion.div>
          )}

          {viewMode === 'split' && (
            <motion.div
              key="split"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex h-full"
            >
              <div className="w-1/2 border-r border-zinc-800">
                <MonacoEditor
                  noteId={noteId}
                  content={content}
                  onChange={handleChange}
                  onSave={handleSave}
                />
              </div>
              <div className="w-1/2">
                <MarkdownPreview content={content} noteId={noteId} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
