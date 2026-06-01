## 2024-05-15 - [Graph View Optimization]
**Learning:** Creating derived state (like filtering graph nodes/edges) inside a functional React component without `useMemo` forces full recalculation on every render (e.g., hover state changes).
**Action:** Use `useMemo` to cache derived states for `currentData` inside `GraphView`.
