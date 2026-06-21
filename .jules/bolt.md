## 2024-06-25 - React Force Graph Array Lookups
**Learning:** In the `react-force-graph-2d` component `GraphView.tsx`, calculating edge relationships dynamically inside the render cycle using `find()` within a `filter()` creates an O(N * E) operation that severely blocks the main thread, especially because hover states trigger frequent re-renders.
**Action:** Always wrap data calculations for force graphs in `useMemo`, and convert nested array lookups into precomputed `Set` or `Map` data structures, lowering time complexity to O(N + E).
