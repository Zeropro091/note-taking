## 2024-05-15 - [O(N) Array Traversal in Graph Generation]
**Learning:** Generating edges for a graph based on links between objects can easily become an O(N*M) operation if target IDs are resolved dynamically via `array.find()` inside a nested loop. This is a significant bottleneck as the graph scales (e.g., in `addWikilinkEdges` in `graph.ts`).
**Action:** When mapping relationships between objects, iterate the objects once to build a `Map` structure for O(1) identifier resolution, then construct the edges using the map. This reduces complexity from O(N*M) to O(N+M).
