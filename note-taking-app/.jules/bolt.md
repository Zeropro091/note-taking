## 2024-06-07 - React Force Graph Performance Bottlenecks

**Learning:** In data-heavy React components (like those wrapping `react-force-graph-2d`), calculating complex derived state during render can cause severe performance issues, especially when events like mouse hover trigger frequent re-renders. A specific anti-pattern discovered was an O(N*E) nested lookup during edge filtering (`graph.nodes.find` inside an edge `filter`), which scaled poorly.

**Action:** Always wrap expensive derived graph computations (like `nodes`, `links` arrays) in `useMemo`. When filtering edges based on node properties, precompute a `Set` or `Map` of valid node IDs (O(N)) first, reducing the overall time complexity of edge filtering to O(N+E).