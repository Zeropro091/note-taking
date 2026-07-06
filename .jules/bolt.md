## 2024-07-06 - Optimized Graph Component Filtering

**Learning:** Filtering graph edges based on node properties inside data-heavy components like `react-force-graph-2d` using `Array.find()` repeatedly causes significant performance bottlenecks. The operation scales as O(V*E), where V is the number of nodes and E is the number of edges, leading to massive CPU spikes on re-renders for large datasets.

**Action:** When filtering graphs based on node data, always pre-compute a `Set` of valid node IDs beforehand. Utilizing `Set.has()` reduces the edge filtering lookup time complexity to O(1), making the entire operation scale linearly at O(V+E).
