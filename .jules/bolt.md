## 2024-07-04 - Optimize React Force Graph Edge Filtering Complexity
**Learning:** In data-heavy visualization components like `react-force-graph-2d`, array scanning operations during node/edge filtering (like `.find()` or `.includes()`) inside render loops can lead to $O(V \times E)$ time complexity, causing massive UI blocking.
**Action:** Always pre-compute a `Set` or `Map` of lookup data inside a `useMemo` block to drop lookup complexity to $O(1)$, effectively turning $O(V \times E)$ operations into $O(V + E)$ when dealing with graphs or relationships in React.
