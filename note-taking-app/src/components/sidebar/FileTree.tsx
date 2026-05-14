'use client';

// File tree component for browsing notes
import { useState } from 'react';
import { File, Folder, FolderOpen, FilePlus, FolderPlus, Trash2, Edit2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { FileNode } from '@/types/notes';

interface FileTreeProps {
  tree: FileNode[];
  selectedId: string | null;
  onNoteSelect: (path: string) => void;
  onNoteCreate?: (path: string, title: string) => void;
  onNoteDelete?: (path: string) => void;
  onNoteRename?: (oldPath: string, newPath: string) => void;
}

interface TreeNodeProps {
  node: FileNode;
  level: number;
  selectedId: string | null;
  onNoteSelect: (path: string) => void;
  onNoteCreate?: (path: string, title: string) => void;
  onNoteDelete?: (path: string) => void;
  onNoteRename?: (oldPath: string, newPath: string) => void;
}

function TreeNode({
  node,
  level,
  selectedId,
  onNoteSelect,
  onNoteCreate,
  onNoteDelete,
  onNoteRename,
}: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level < 1);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(node.name);

  const isSelected = selectedId === node.path.replace(/\.md$/, '');

  const handleClick = () => {
    if (node.type === 'folder') {
      setIsExpanded(!isExpanded);
    } else {
      onNoteSelect(node.path);
    }
  };

  const handleEdit = async () => {
    if (editValue !== node.name) {
      const newPath = node.path.replace(node.name, editValue);
      onNoteRename?.(node.path, newPath);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEdit();
    } else if (e.key === 'Escape') {
      setEditValue(node.name);
      setIsEditing(false);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Delete "${node.name}"?`)) {
      onNoteDelete?.(node.path);
    }
  };

  return (
    <div>
      <div
        className={`
          group flex items-center gap-2 px-2 py-1 rounded cursor-pointer
          hover:bg-zinc-800 transition-colors
          ${isSelected ? 'bg-zinc-800 text-blue-400' : 'text-zinc-300'}
        `}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={handleClick}
        onContextMenu={(e) => {
          e.preventDefault();
          setIsEditing(true);
        }}
      >
        {node.type === 'folder' ? (
          isExpanded ? (
            <FolderOpen className="w-4 h-4 text-zinc-500" />
          ) : (
            <Folder className="w-4 h-4 text-zinc-500" />
          )
        ) : (
          <File className="w-4 h-4 text-zinc-500" />
        )}

        {isEditing ? (
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleEdit}
            onKeyDown={handleKeyDown}
            className="h-6 text-sm bg-zinc-700 border-zinc-600"
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="flex-1 text-sm truncate">{node.name}</span>
        )}

        {node.type === 'file' && (
          <button
            onClick={handleDelete}
            aria-label={`Delete ${node.name}`}
            className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-red-400 rounded hover:text-red-400 p-1"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        )}
      </div>

      {node.type === 'folder' && isExpanded && node.children && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          {node.children.map((child) => (
            <TreeNode
              key={child.path}
              node={child}
              level={level + 1}
              selectedId={selectedId}
              onNoteSelect={onNoteSelect}
              onNoteCreate={onNoteCreate}
              onNoteDelete={onNoteDelete}
              onNoteRename={onNoteRename}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}

export default function FileTree({
  tree,
  selectedId,
  onNoteSelect,
  onNoteCreate,
  onNoteDelete,
  onNoteRename,
}: FileTreeProps) {
  const [showNewMenu, setShowNewMenu] = useState(false);
  const [newItemPath, setNewItemPath] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [newItemType, setNewItemType] = useState<'file' | 'folder'>('file');

  const handleCreate = async () => {
    if (!newItemName.trim()) return;

    const path = newItemPath
      ? `${newItemPath}/${newItemName}${newItemType === 'file' ? '.md' : ''}`
      : `${newItemName}${newItemType === 'file' ? '.md' : ''}`;

    if (newItemType === 'file') {
      onNoteCreate?.(path, newItemName);
    }

    setNewItemName('');
    setNewItemPath('');
    setShowNewMenu(false);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-zinc-800">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">
            Files
          </h2>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => {
                setNewItemType('file');
                setShowNewMenu(!showNewMenu);
              }}
              title="New note"
              aria-label="Create new note"
            >
              <FilePlus className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => {
                setNewItemType('folder');
                setShowNewMenu(!showNewMenu);
              }}
              title="New folder"
              aria-label="Create new folder"
            >
              <FolderPlus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* New item form */}
        {showNewMenu && (
          <div className="space-y-2">
            <Input
              placeholder={`New ${newItemType} name...`}
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreate();
                if (e.key === 'Escape') setShowNewMenu(false);
              }}
              className="h-8 text-sm"
              autoFocus
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleCreate} className="flex-1">
                Create
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowNewMenu(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-y-auto py-2">
        {tree.length === 0 ? (
          <div className="px-4 py-8 text-center text-zinc-500 text-sm">
            <File className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No notes yet</p>
            <p className="text-xs mt-1">Create your first note to get started</p>
          </div>
        ) : (
          tree.map((node) => (
            <TreeNode
              key={node.path}
              node={node}
              level={0}
              selectedId={selectedId}
              onNoteSelect={onNoteSelect}
              onNoteCreate={onNoteCreate}
              onNoteDelete={onNoteDelete}
              onNoteRename={onNoteRename}
            />
          ))
        )}
      </div>
    </div>
  );
}
