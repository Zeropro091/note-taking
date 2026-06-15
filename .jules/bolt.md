
## 2024-05-18 - Optimize Graph Data Processing
**Learning:** In React components rendering heavy data structures like D3 force graphs, deriving complex objects directly in the render body without memoization leads to severe performance regressions because it triggers expensive recalculations and layout shifts on every render. Furthermore, using nested iterations like `.find()` inside a `.filter()` loop results in `O(N*E)` time complexity, which becomes a major bottleneck for large graphs.
**Action:** Always wrap heavy derived states (like node and link object generation) in `useMemo`. For filtering connected data (like graph edges based on node properties), precompute a `Set` of valid IDs before the loop to reduce time complexity to `O(N+E)`.
