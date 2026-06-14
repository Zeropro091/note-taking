## 2026-06-14 - Memoize expensive operations inside React components
**Learning:** Performing array .find() lookups within an edge-filtering map function inside a React render loop leads to O(N*E) time complexity. Not wrapping derived states in useMemo causes exhaustive re-evaluations on frequent events like node hovers.
**Action:** Always memoize derived arrays/objects with useMemo in data-heavy components like ForceGraph2D, and precompute lookup Sets before looping to reduce time complexity to O(N+E).
