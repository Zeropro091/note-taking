## 2024-06-12 - Graph Node Filtering Performance Optimization

**Learning:** When dealing with derived state in React components that handle graph data (nodes and edges), performing an `.includes()` or `.find()` across all nodes for every edge during filtering results in an inefficient $O(N \times E)$ operation. Without `useMemo`, this expensive calculation runs on every render (such as during hover events), significantly degrading performance.

**Action:** Always wrap expensive derived states like graph node and link objects in `useMemo`. When filtering edges based on node properties, precompute a `Set` of valid node IDs during the node mapping phase to convert the $O(N)$ lookup into an $O(1)$ operation, reducing the overall time complexity from $O(N \times E)$ to $O(N + E)$.
