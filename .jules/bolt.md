## 2024-05-28 - Memoize Fuse.js search index creation
**Learning:** Creating `Fuse.js` search indices synchronously on every API request or keystroke (e.g., within `searchNotes` or `quickSwitch`) is an O(N) operation and a known performance bottleneck in the codebase.
**Action:** Always cache or memoize the Fuse instance. Use a lightweight cache key, such as `length-maxUpdatedAt`, to efficiently invalidate the cache when notes are added, removed, or modified.

## 2024-05-28 - Optimize GraphView edge lookup and memoize data
**Learning:** Performing a `.find()` lookup inside an array `.filter()` or `.map()` when resolving graph edges against nodes creates an $O(N \times E)$ performance bottleneck on every React render. Also, caching user data in module-level global variables in a Next.js environment is a severe security vulnerability (cross-tenant data leakage) and must be avoided.
**Action:** Always wrap expensive derived graph states in `useMemo` to prevent exhaustive-deps rendering loops. Optimize relationship resolutions by precomputing a `Set` of valid node IDs ($O(N)$) before iterating over edges, reducing the lookup complexity to $O(E)$ and the total complexity to $O(N + E)$. Never cache user-specific arrays in global `let` or `var` variables outside of request scopes.
