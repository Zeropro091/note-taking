## 2024-05-24 - O(N*E) Graph Filtering Bottleneck
**Learning:** In data-heavy components like `react-force-graph-2d`, deriving state on every render using `.filter()` with nested `.find()` lookups on arrays creates severe O(N*E) bottlenecks that freeze the main thread, especially on frequent events like hover.
**Action:** Always wrap expensive derived graph states (nodes/links) in `useMemo` and precompute a `Set` or `Map` of valid IDs before looping over edges to reduce time complexity to O(N+E).
