# Bolt Journal

## 2024-05-18 - Optimize graph data filtering
**Learning:** For React performance with data-heavy components (e.g., `react-force-graph-2d`), expensive derived states like nodes and links should be wrapped in `useMemo` to prevent exhaustive-deps warnings and redundant recalculations on frequent events like hover. Furthermore, performing lookups within array `.filter()` or `.map()` methods (e.g., finding nodes associated with graph edges using nested `.find()`) can be slow.
**Action:** Optimize time complexity by precomputing a `Set` or `Map` of valid IDs before the loop, reducing `O(N*E)` operations to `O(N+E)`. And wrap expensive state operations in `useMemo`.
