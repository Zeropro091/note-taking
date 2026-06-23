'use client';

// Graph visualization component with enhanced interactivity
import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import type { GraphData as FGData } from 'react-force-graph-2d';
import * as d3 from 'd3-force';
import { motion, AnimatePresence } from 'framer-motion';
import type { GraphData, GraphNode, Note } from '@/types/notes';
import { Maximize2, Filter, ZoomIn, ZoomOut, RotateCcw, Play, Pause, Undo, Sparkles, Download, ExternalLink, X, FileText, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GraphViewProps {
  graph: GraphData;
  onNodeClick?: (nodeId: string) => void;
  selectedNodeId?: string;
  notes?: Note[];
}

export default function GraphView({
  graph,
  onNodeClick,
  selectedNodeId,
  notes = [],
}: GraphViewProps) {
  const fgRef = useRef<any>(null);
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [isIsolated, setIsIsolated] = useState(false);
  const [isolatedData, setIsolatedData] = useState<FGData | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  // Get note details for a node ID
  const getNoteDetails = useCallback((nodeId: string): Note | undefined => {
    return notes.find((n) => n.id === nodeId);
  }, [notes]);

  // Save current graph data before isolation
  const currentData: FGData = useMemo(() => {
    // Precompute a set of valid nodes to improve performance when filtering links (O(N) lookup instead of O(N*E))
    let validNodeIds: Set<string> | null = null;

    if (filterTag) {
      validNodeIds = new Set(
        graph.nodes.filter(n => n.tags.includes(filterTag)).map(n => n.id)
      );
    }

    return {
      nodes: graph.nodes
        .filter((node) => {
          if (!filterTag) return true;
          return validNodeIds?.has(node.id);
        })
        .map((node) => ({
          id: node.id,
          name: node.label,
          val: node.tags.length + 1,
          color: node.id === selectedNodeId ? '#3b82f6' : getColorForTags(node.tags),
        })),
      links: graph.edges
        .filter((edge) => {
          if (!filterTag) return true;
          return validNodeIds?.has(edge.source) || validNodeIds?.has(edge.target);
        })
        .map((edge) => ({
          source: edge.source,
          target: edge.target,
        })),
    };
  }, [graph.nodes, graph.edges, filterTag, selectedNodeId]);

  // Use isolated data if available, otherwise use filtered currentData
  const displayData = isolatedData || currentData;

  // Get all unique tags
  const allTags = Array.from(
    new Set(graph.nodes.flatMap((n) => n.tags))
  ).sort();

  // Zoom controls
  const handleZoomIn = () => {
    fgRef.current?.zoomInOut(1.3);
  };

  const handleZoomOut = () => {
    fgRef.current?.zoomInOut(0.7);
  };

  const handleReset = () => {
    fgRef.current?.zoomToFit(400);
  };

  // Toggle physics animation
  const togglePause = () => {
    setIsPaused(!isPaused);
    if (isPaused) {
      // Pause the simulation
      if (fgRef.current) {
        fgRef.current.pauseAnimation();
      }
    } else {
      // Resume animation
      if (fgRef.current) {
        fgRef.current.resumeAnimation();
      }
    }
  };

  // Reset to full graph
  const resetGraph = useCallback(() => {
    setIsIsolated(false);
    setIsolatedData(null);
    setHoveredNode(null);
  }, []);

  // Click to isolate node (show only connected nodes)
  const isolateNode = useCallback((nodeId: string) => {
    const connectedNodeIds = new Set([nodeId]);
    const connectedLinks: typeof currentData.links = [];

    // Find all directly connected nodes
    graph.edges.forEach((edge) => {
      if (edge.source === nodeId) {
        connectedNodeIds.add(edge.target);
        connectedLinks.push(edge);
      } else if (edge.target === nodeId) {
        connectedNodeIds.add(edge.source);
        connectedLinks.push(edge);
      }
    });

    // Filter to show only connected nodes
    const filteredNodes = currentData.nodes.filter((n: any) => connectedNodeIds.has(n.id));
    const filteredLinks = currentData.links.filter((l: any) =>
      connectedNodeIds.has(l.source) && connectedNodeIds.has(l.target)
    );

    setIsolatedData({
      nodes: filteredNodes.map((n: any) => ({
        ...n,
        val: (n.tags?.length + 1) * 1.5, // Make connected nodes larger
      })),
      links: filteredLinks,
    });
    setIsIsolated(true);
  }, [graph, currentData]);

  // Highlight connected nodes on hover
  const handleNodeHover = (node: any) => {
    setHoveredNode(node?.id || null);
  };

  // Reset highlight when not hovering
  const handleBackgroundClick = () => {
    setHoveredNode(null);
    setSelectedNode(null);
    if (isIsolated) {
      resetGraph();
    }
  };

  // Handle node click - show info panel
  const handleNodeClick = (node: any) => {
    const graphNode = graph.nodes.find((n) => n.id === node.id);
    if (graphNode) {
      setSelectedNode(graphNode);
    }
  };

  // Navigate to the selected note
  const navigateToNote = useCallback(() => {
    if (selectedNode) {
      onNodeClick?.(selectedNode.id);
      setSelectedNode(null);
    }
  }, [selectedNode, onNodeClick]);

  // Close info panel
  const closeInfoPanel = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // Zoom to selected node
  useEffect(() => {
    if (selectedNodeId && fgRef.current && !isIsolated) {
      const node = currentData.nodes.find((n: any) => n.id === selectedNodeId);
      if (node) {
        fgRef.current.centerAt(node.x || 0, node.y || 0, 1.2, 300);
      }
    }
  }, [selectedNodeId, currentData, isIsolated]);

  // Configure forces for better spacing when data changes
  useEffect(() => {
    if (!fgRef.current) return;

    // Wait for graph to be ready
    const timeoutId = setTimeout(() => {
      if (!fgRef.current) return;

      const nodeCount = displayData.nodes.length;
      // Scale charge force (repulsion) based on node count
      const chargeStrength = -300 * Math.log10(nodeCount + 10);
      // Scale link distance based on node count
      const linkDistance = 50 + Math.log10(nodeCount + 10) * 40;

      try {
        fgRef.current.d3Force('charge', (d3 as any).forceManyBody().strength(chargeStrength));
        fgRef.current.d3Force('link', (d3 as any).forceLink().distance(linkDistance));
        fgRef.current.d3Force('collide', (d3 as any).forceCollide().radius(15 + Math.log10(nodeCount + 10) * 3));
        fgRef.current.d3ReheatSimulation();
      } catch (e) {
        // Force configuration might fail, ignore
        console.debug('Force configuration:', e);
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [displayData, isPaused]);

  // Export graph as image
  const exportGraph = () => {
    if (fgRef.current) {
      const canvas = (fgRef.current as any).canvas();
      if (canvas) {
        const link = document.createElement('a');
        link.download = 'knowledge-graph.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
    }
  };

  return (
    <div className={`
      relative bg-zinc-900
      ${isFullscreen ? 'fixed inset-0 z-50' : 'h-full'}
    `}>
      {/* Controls Panel */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={handleZoomIn}
          title="Zoom in (or use mouse wheel)"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={handleZoomOut}
          title="Zoom out (or use mouse wheel)"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={handleReset}
          title="Reset view (fit all nodes)"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant={isPaused ? "default" : "secondary"}
          onClick={togglePause}
          title={isPaused ? "Resume physics" : "Pause physics"}
        >
          {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={isIsolated ? resetGraph : () => setIsIsolated(true)}
          title={isIsolated ? "Show all notes" : "Click a node to isolate"}
        >
          {isIsolated ? <Undo className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={exportGraph}
          title="Download graph as image"
        >
          <Download className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setIsFullscreen(!isFullscreen)}
          title={isFullscreen ? "Exit fullscreen" : "Fullscreen mode"}
        >
          <Maximize2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Tag filter */}
      {allTags.length > 0 && (
        <div className="absolute top-4 right-4 z-10 bg-zinc-800 rounded-lg p-3 max-w-xs">
          <div className="flex items-center gap-2 mb-2">
            <Filter className="w-4 h-4 text-zinc-400" />
            <span className="text-sm font-medium">Filter by tag</span>
          </div>
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => {
                setFilterTag(null);
                if (isIsolated) resetGraph();
              }}
              className={`
                text-xs px-2 py-1 rounded transition-colors
                ${filterTag === null
                  ? 'bg-blue-600 text-white'
                  : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                }
              `}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setFilterTag(filterTag === tag ? null : tag);
                  if (isIsolated) resetGraph();
                }}
                className={`
                  text-xs px-2 py-1 rounded transition-colors
                  ${filterTag === tag
                    ? 'bg-blue-600 text-white'
                    : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                  }
                `}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Instructions overlay (shows briefly on mount) */}
      {!isFullscreen && (
        <div className="absolute bottom-16 right-4 z-10 bg-zinc-800/80 backdrop-blur-sm rounded-lg px-4 py-2 text-xs text-zinc-400 pointer-events-none">
          <div className="font-medium mb-1">🖱️ Interactive Graph:</div>
          <div>• Drag nodes to rearrange</div>
          <div>• Scroll to zoom</div>
          <div>• Click node to isolate</div>
          <div>• Click background to reset</div>
        </div>
      )}

      {/* Graph */}
      <ForceGraph2D
        key={isIsolated ? 'isolated' : 'full'}
        ref={fgRef}
        graphData={displayData}
        nodeLabel={(node: any) => `
          <div class="bg-zinc-800 px-2 py-1 rounded text-sm pointer-events-none">
            <strong>${node.name}</strong><br/>
            <span class="text-zinc-400">${node.tags?.map((t: string) => '#' + t).join(', ') || 'No tags'}</span>
          </div>
        `}
        nodeColor={(node: any) => {
          // Highlight connected nodes when hovering
          if (hoveredNode) {
            if (node.id === hoveredNode) {
              return '#ffffff'; // Bright white for hovered node
            }
            if (isConnected(node.id, hoveredNode, graph.edges)) {
              return node.color;
            }
            return '#333333'; // Dim unconnected nodes
          }
          return node.color;
        }}
        nodeRelSize={3}
        linkColor={(link: any) => {
          if (hoveredNode && (link.source?.id === hoveredNode || link.target?.id === hoveredNode)) {
            return '#666666';
          }
          return '#444444';
        }}
        linkWidth={(link: any) => {
          if (hoveredNode && (link.source?.id === hoveredNode || link.target?.id === hoveredNode)) {
            return 2;
          }
          return 1;
        }}
        onNodeClick={handleNodeClick}
        onNodeHover={handleNodeHover}
        onBackgroundClick={handleBackgroundClick}
        enableNodeDrag={true}
        enableZoomInteraction={true}
        cooldownTicks={isPaused ? 0 : 400}
        d3AlphaDecay={0.008}
        d3VelocityDecay={0.5}
        warmupTicks={300}
      />

      {/* Stats */}
      <div className="absolute bottom-4 left-4 z-10 bg-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <div>{displayData.nodes.length} notes</div>
          {isIsolated && (
            <span className="text-zinc-500">(isolated)</span>
          )}
        </div>
        <div>{displayData.links.length} connections</div>
        {isPaused && (
          <div className="text-zinc-500">⏸️ Paused</div>
        )}
        {hoveredNode && !isIsolated && (
          <div className="text-blue-400">Hovering: {hoveredNode}</div>
        )}
      </div>

      {/* Note Info Panel */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, x: 20, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="absolute bottom-4 right-4 z-20 w-80 bg-zinc-800 rounded-lg shadow-xl border border-zinc-700 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-zinc-900 border-b border-zinc-700">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-semibold text-zinc-200">Note Details</span>
              </div>
              <button
                onClick={closeInfoPanel}
                className="text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              {/* Note Title */}
              <h3 className="text-lg font-semibold text-white mb-2">
                {selectedNode.label}
              </h3>

              {/* Note ID */}
              <p className="text-xs text-zinc-500 mb-3 font-mono">
                {selectedNode.id}
              </p>

              {/* Tags */}
              {selectedNode.tags && selectedNode.tags.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-1 text-xs text-zinc-400 mb-2">
                    <Tag className="w-3 h-3" />
                    <span>Tags</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {selectedNode.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 rounded-full bg-zinc-700 text-zinc-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Connections */}
              {graph.edges.filter(e => e.source === selectedNode.id || e.target === selectedNode.id).length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-1 text-xs text-zinc-400 mb-2">
                    <Sparkles className="w-3 h-3" />
                    <span>
                      {graph.edges.filter(e => e.source === selectedNode.id || e.target === selectedNode.id).length} connections
                    </span>
                  </div>
                </div>
              )}

              {/* Note Preview (if available) */}
              {(() => {
                const note = getNoteDetails(selectedNode.id);
                if (note?.content) {
                  const preview = note.content.slice(0, 150);
                  return (
                    <div className="mb-4 p-3 bg-zinc-900 rounded-lg">
                      <p className="text-xs text-zinc-400 line-clamp-4">
                        {preview}
                        {note.content.length > 150 && '...'}
                      </p>
                    </div>
                  );
                }
                return null;
              })()}

              {/* Open Button */}
              <Button
                onClick={navigateToNote}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                size="sm"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Note
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper function to check if two nodes are connected
function isConnected(
  nodeId1: string,
  nodeId2: string,
  edges: Array<{ source: string; target: string }>
): boolean {
  return edges.some(
    (e) =>
      (e.source === nodeId1 && e.target === nodeId2) ||
      (e.source === nodeId2 && e.target === nodeId1)
  );
}

// Generate color based on tags
function getColorForTags(tags: string[] | undefined | null): string {
  // Ensure tags is an array and has at least one valid string tag
  if (!tags || !Array.isArray(tags) || tags.length === 0) {
    return '#666666';
  }

  // Filter out non-string tags
  const validTags = tags.filter((tag): tag is string => typeof tag === 'string');

  if (validTags.length === 0) {
    return '#666666';
  }

  const colors: Record<string, string> = {
    // Predefined colors for common tags
    javascript: '#f7df1e',
    typescript: '#3178c6',
    react: '#61dafb',
    nextjs: '#000000',
    python: '#3776ab',
    rust: '#000000',
    go: '#00add8',
    ai: '#10b981',
    business: '#f59e0b',
    saas: '#8b5cf6',
    documentation: '#06b6d4',
    security: '#ef4444',
    roadmap: '#ec4899',
    tech: '#3b82f6',
    app: '#8b5cf6',
    research: '#14b8a6',
    sales: '#22c55e',
    closing: '#eab308',
    objections: '#f97316',
    'follow-up': '#0ea5e9',
    'lead-gen': '#a855f7',
    negotiation: '#6366f1',
    growth: '#84cc16',
    'client-success': '#10b981',
    pricing: '#f59e0b',
    psychology: '#ec4899',
    // Default colors
    default: '#6366f1',
  };

  // Return color for first matching tag, or default
  for (const tag of validTags) {
    const key = tag.toLowerCase();
    if (colors[key]) return colors[key];
  }

  // Generate consistent color from tag string
  const firstTag = validTags[0];
  const hash = firstTag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 50%)`;
}
