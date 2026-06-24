## 2024-06-24 - Array lookup optimization during Graph Filtering
**Learning:** During array filtering over highly connected nodes in data-heavy components (like graph edges), performing array traversal matching inside an edge `.filter()` loop results in O(N*E) complexity which blocks the main thread.
**Action:** When performing lookups within array `.filter()` or `.map()` methods (e.g., finding nodes associated with graph edges), optimize time complexity by precomputing a `Set` or `Map` of valid IDs before the loop. This reduces O(N*E) operations to O(N+E).
