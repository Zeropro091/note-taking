'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import type { Note, FileNode, GraphData, Backlink } from '@/types/notes';
import {
  Menu,
  Search,
  GitGraph,
  PanelRight,
  FolderTree,
  Plus,
  ChevronDown,
  ChevronUp,
  Files,
  FolderOpen,
  Link2,
  List,
  Tags as TagsIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const NoteEditor = dynamic(() => import('@/components/editor/NoteEditor'), { ssr: false });
const FileTree = dynamic(() => import('@/components/sidebar/FileTree'), { ssr: false });
const NoteGroups = dynamic(() => import('@/components/sidebar/NoteGroups'), { ssr: false });
const QuickSwitcher = dynamic(() => import('@/components/sidebar/QuickSwitcher'), { ssr: false });
const GraphView = dynamic(() => import('@/components/graph/GraphView'), { ssr: false });
const BacklinksPanel = dynamic(() => import('@/components/panels/BacklinksPanel'), { ssr: false });
const OutlinePanel = dynamic(() => import('@/components/panels/OutlinePanel'), { ssr: false });
const TagsPanel = dynamic(() => import('@/components/panels/TagsPanel'), { ssr: false });

// Extract useQuickSwitcher from the QuickSwitcher component
const { useQuickSwitcher } = require('@/components/sidebar/QuickSwitcher');

function getTabClassName(active: boolean, base: string) {
  return cn(
    'flex-1 px-3 py-2 text-xs font-medium uppercase tracking-wide',
    active ? 'bg-zinc-800 text-zinc-300' : 'text-zinc-500 hover:text-zinc-400'
  );
}

export default function Home() {
  const router = useRouter();
  const params = useParams();
  const noteId = params?.id as string | undefined;

  const [notes, setNotes] = useState<Note[]>([]);
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [graph, setGraph] = useState<GraphData>({ nodes: [], edges: [] });
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [backlinks, setBacklinks] = useState<Backlink[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [activeSidebarTab, setActiveSidebarTab] = useState<'files' | 'groups'>('files');
  const [activeRightTab, setActiveRightTab] = useState<'backlinks' | 'outline' | 'tags'>('backlinks');
  const [sidebarTabsCollapsed, setSidebarTabsCollapsed] = useState(false);
  const [rightTabsCollapsed, setRightTabsCollapsed] = useState(false);
  const [showGraph, setShowGraph] = useState(false);
  const quickSwitcher = useQuickSwitcher();

  const loadData = useCallback(async () => {
    try {
      const notesRes = await fetch('/api/notes');
      const notesData = await notesRes.json();
      if (notesData.success) {
        setNotes(notesData.notes);
      }

      const graphRes = await fetch('/api/graph');
      const graphData = await graphRes.json();
      if (graphData.success) {
        setGraph(graphData.graph);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  }, []);

  const loadFileTree = useCallback(() => {
    const tree: FileNode[] = [];
    const folders = new Map<string, FileNode>();

    for (const note of notes) {
      const pathParts = note.path.split('/');
      let currentLevel = tree;
      let currentPath = '';

      for (let i = 0; i < pathParts.length - 1; i++) {
        const folderName = pathParts[i];
        currentPath = currentPath ? `${currentPath}/${folderName}` : folderName;

        if (!folders.has(currentPath)) {
          const folderNode: FileNode = {
            name: folderName,
            path: currentPath,
            type: 'folder',
            children: [],
          };
          folders.set(currentPath, folderNode);
          currentLevel.push(folderNode);
        }

        const folder = folders.get(currentPath)!;
        currentLevel = folder.children!;
      }

      currentLevel.push({
        name: pathParts[pathParts.length - 1],
        path: note.path,
        type: 'file',
      });
    }

    setFileTree(tree);
  }, [notes]);

  const loadCurrentNote = useCallback(async () => {
    if (!noteId) {
      setCurrentNote(null);
      setBacklinks([]);
      return;
    }

    try {
      const noteRes = await fetch(`/api/notes/${noteId}`);
      const noteData = await noteRes.json();

      if (noteData.success) {
        setCurrentNote(noteData.note);

        const backlinksRes = await fetch(`/api/backlinks/${noteId}`);
        const backlinksData = await backlinksRes.json();
        if (backlinksData.success) {
          setBacklinks(backlinksData.backlinks);
        }
      } else {
        setCurrentNote(null);
        setBacklinks([]);
      }
    } catch (error) {
      setCurrentNote(null);
      setBacklinks([]);
    }
  }, [noteId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    loadFileTree();
  }, [loadFileTree]);

  useEffect(() => {
    loadCurrentNote();
  }, [loadCurrentNote]);

  const handleNoteSelect = useCallback((path: string) => {
    const id = path.replace(/\.md$/, '');
    router.push(`/${id}`);
  }, [router]);

  const handleSave = useCallback(async (content: string) => {
    if (!currentNote) return;

    try {
      const res = await fetch(`/api/notes/${currentNote.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          frontmatter: currentNote.frontmatter,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setCurrentNote(data.note);
        await loadData();
      }
    } catch (error) {
      console.error('Failed to save note:', error);
    }
  }, [currentNote, loadData]);

  const handleNoteCreate = useCallback(async (path: string, title: string) => {
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path, title }),
      });

      const data = await res.json();
      if (data.success) {
        await loadData();
        handleNoteSelect(data.note.id);
      }
    } catch (error) {
      console.error('Failed to create note:', error);
    }
  }, [loadData, handleNoteSelect]);

  const handleNoteDelete = useCallback(async (path: string) => {
    try {
      const id = path.replace(/\.md$/, '');
      await fetch(`/api/notes/${id}`, { method: 'DELETE' });
      await loadData();
      if (noteId === id) {
        router.push('/');
      }
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  }, [loadData, noteId, router]);

  const handleNoteRename = useCallback(async (oldPath: string, newPath: string) => {
    try {
      const oldId = oldPath.replace(/\.md$/, '');
      const newId = newPath.replace(/\.md$/, '');

      const res = await fetch(`/api/notes/${oldId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newId }),
      });

      const data = await res.json();
      if (data.success) {
        await loadData();
        if (noteId === oldId) {
          router.push(`/${newId}`);
        }
      }
    } catch (error) {
      console.error('Failed to rename note:', error);
    }
  }, [loadData, noteId, router]);

  const handleGraphNodeClick = useCallback((nodeId: string) => {
    router.push(`/${nodeId}`);
    setShowGraph(false);
  }, [router]);

  const handleQuickSwitcherSelect = useCallback((selectedNoteId: string) => {
    router.push(`/${selectedNoteId}`);
  }, [router]);

  const handleNewNote = useCallback(async () => {
    const title = 'Untitled';
    const id = `Untitled-${Date.now()}`;
    await handleNoteCreate(id, title);
  }, [handleNoteCreate]);

  const filteredNotes = selectedTag
    ? notes.filter((n) => n.tags.includes(selectedTag))
    : notes;

  return (
    <div className="h-screen flex flex-col bg-zinc-950 text-zinc-100">
      <header className="h-12 border-b border-zinc-800 flex items-center justify-between px-4 bg-zinc-900">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <h1 className="font-semibold text-sm">
            {currentNote?.title || 'Note Taking App'}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowGraph(!showGraph)}
            title="Toggle graph view"
          >
            <GitGraph className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => quickSwitcher.open()}
            title="Quick switcher (⌘K)"
          >
            <Search className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setRightPanelOpen(!rightPanelOpen)}
            title="Toggle right panel"
          >
            <PanelRight className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            onClick={handleNewNote}
            title="New note"
          >
            <Plus className="w-4 h-4 mr-1" />
            New
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <AnimatePresence initial={false}>
          {sidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 256, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="border-r border-zinc-800 bg-zinc-900 flex flex-col overflow-hidden"
            >
              {/* Sidebar Tabs - Collapsible */}
              {sidebarTabsCollapsed ? (
                // Minimized tabs - single row with icons
                <div className="flex items-center justify-between px-2 py-1 border-b border-zinc-800 bg-zinc-900/50">
                  <div className="flex gap-1">
                    <button
                      onClick={() => setActiveSidebarTab('files')}
                      className={cn(
                        'p-1.5 rounded transition-colors',
                        activeSidebarTab === 'files'
                          ? 'bg-zinc-800 text-zinc-300'
                          : 'text-zinc-500 hover:text-zinc-400'
                      )}
                      title="Files"
                    >
                      <Files className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setActiveSidebarTab('groups')}
                      className={cn(
                        'p-1.5 rounded transition-colors',
                        activeSidebarTab === 'groups'
                          ? 'bg-zinc-800 text-zinc-300'
                          : 'text-zinc-500 hover:text-zinc-400'
                      )}
                      title="Groups"
                    >
                      <FolderOpen className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => setSidebarTabsCollapsed(false)}
                    className="p-1 text-zinc-500 hover:text-zinc-400 transition-colors"
                    title="Expand tabs"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                // Expanded tabs - full width
                <div className="flex items-center border-b border-zinc-800">
                  <div className="flex flex-1">
                    <button
                      onClick={() => setActiveSidebarTab('files')}
                      className={getTabClassName(activeSidebarTab === 'files', '')}
                    >
                      Files
                    </button>
                    <button
                      onClick={() => setActiveSidebarTab('groups')}
                      className={getTabClassName(activeSidebarTab === 'groups', '')}
                    >
                      Groups
                    </button>
                  </div>
                  <button
                    onClick={() => setSidebarTabsCollapsed(true)}
                    className="px-2 py-2 text-zinc-500 hover:text-zinc-400 transition-colors"
                    title="Minimize tabs"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Tab Content */}
              {activeSidebarTab === 'files' ? (
                <FileTree
                  tree={fileTree}
                  selectedId={noteId || null}
                  onNoteSelect={handleNoteSelect}
                  onNoteCreate={handleNoteCreate}
                  onNoteDelete={handleNoteDelete}
                  onNoteRename={handleNoteRename}
                />
              ) : (
                <NoteGroups
                  notes={notes}
                  selectedId={noteId || null}
                  onNoteSelect={handleNoteSelect}
                />
              )}
            </motion.aside>
          )}
        </AnimatePresence>

        <main className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            {showGraph ? (
              <motion.div
                key="graph"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="h-full w-full"
              >
                <GraphView
                  graph={graph}
                  onNodeClick={handleGraphNodeClick}
                  selectedNodeId={noteId}
                  notes={notes}
                />
              </motion.div>
            ) : currentNote ? (
              <motion.div
                key={currentNote.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="h-full w-full"
              >
                <NoteEditor
                  noteId={currentNote.id}
                  initialContent={currentNote.content}
                  onSave={handleSave}
                />
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex items-center justify-center"
              >
                <div className="text-center text-zinc-500">
                  <FolderTree className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">No note selected</p>
                  <p className="text-sm mb-4">
                    Select a note from the sidebar or create a new one
                  </p>
                  <Button onClick={handleNewNote}>
                    <Plus className="w-4 h-4 mr-1" />
                    Create Note
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <AnimatePresence initial={false}>
          {rightPanelOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 256, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="border-l border-zinc-800 bg-zinc-900 flex flex-col overflow-hidden"
            >
              {/* Right Panel Tabs - Collapsible */}
              {rightTabsCollapsed ? (
                // Minimized tabs - single row with icons
                <div className="flex items-center justify-between px-2 py-1 border-b border-zinc-800 bg-zinc-900/50">
                  <div className="flex gap-1">
                    <button
                      onClick={() => setActiveRightTab('backlinks')}
                      className={cn(
                        'p-1.5 rounded transition-colors',
                        activeRightTab === 'backlinks'
                          ? 'bg-zinc-800 text-zinc-300'
                          : 'text-zinc-500 hover:text-zinc-400'
                      )}
                      title="Backlinks"
                    >
                      <Link2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setActiveRightTab('outline')}
                      className={cn(
                        'p-1.5 rounded transition-colors',
                        activeRightTab === 'outline'
                          ? 'bg-zinc-800 text-zinc-300'
                          : 'text-zinc-500 hover:text-zinc-400'
                      )}
                      title="Outline"
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setActiveRightTab('tags')}
                      className={cn(
                        'p-1.5 rounded transition-colors',
                        activeRightTab === 'tags'
                          ? 'bg-zinc-800 text-zinc-300'
                          : 'text-zinc-500 hover:text-zinc-400'
                      )}
                      title="Tags"
                    >
                      <TagsIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => setRightTabsCollapsed(false)}
                    className="p-1 text-zinc-500 hover:text-zinc-400 transition-colors"
                    title="Expand tabs"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                // Expanded tabs - full width
                <div className="flex items-center border-b border-zinc-800">
                  <div className="flex flex-1">
                    <button
                      onClick={() => setActiveRightTab('backlinks')}
                      className={getTabClassName(activeRightTab === 'backlinks', '')}
                    >
                      Backlinks
                    </button>
                    <button
                      onClick={() => setActiveRightTab('outline')}
                      className={getTabClassName(activeRightTab === 'outline', '')}
                    >
                      Outline
                    </button>
                    <button
                      onClick={() => setActiveRightTab('tags')}
                      className={getTabClassName(activeRightTab === 'tags', '')}
                    >
                      Tags
                    </button>
                  </div>
                  <button
                    onClick={() => setRightTabsCollapsed(true)}
                    className="px-2 py-2 text-zinc-500 hover:text-zinc-400 transition-colors"
                    title="Minimize tabs"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="flex-1 overflow-hidden">
                {activeRightTab === 'backlinks' && (
                  <BacklinksPanel
                    backlinks={backlinks}
                    onNoteClick={handleNoteSelect}
                  />
                )}
                {activeRightTab === 'outline' && (
                  <OutlinePanel content={currentNote?.content || ''} />
                )}
                {activeRightTab === 'tags' && (
                  <TagsPanel
                    notes={notes}
                    selectedTag={selectedTag}
                    onTagSelect={setSelectedTag}
                  />
                )}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
      <QuickSwitcher
        notes={filteredNotes}
        isOpen={quickSwitcher.isOpen}
        onClose={quickSwitcher.close}
        onSelect={handleQuickSwitcherSelect}
      />
    </div>
  );
}
