## 2024-06-03 - Optimizing O(N*E) lookups in React Force Graph derived state

**Learning:** When generating derived properties for visualization libraries like `react-force-graph-2d` (where nodes and edges rely on complex filtering and joining logic), performing an `Array.prototype.find()` lookup inside an `Array.prototype.filter()` loop naturally creates an `O(N*E)` bottleneck. Due to re-render patterns in React when states like `filterTag` or `selectedNodeId` change (e.g. via UI interactions like highlighting), this heavy calculation freezes the main thread.

**Action:** Precomputing a hash map or `Set` of valid nodes BEFORE iterating over edges converts an `O(N*E)` bottleneck to an `O(N+E)` operation. Furthermore, wrapping the full data resolution in a `useMemo` hook with granular dependencies ensures the expensive operation executes strictly when the visualization source properties change.
