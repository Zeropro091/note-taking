## 2024-05-23 - Optimize GraphView re-renders
**Learning:** Found a specific performance bottleneck where the graph data mapping (including a nested `O(N*E)` search over the edges/nodes) was being recalculated on every render due to a missing `useMemo` in a component that receives frequent state updates (like hover states).
**Action:** Used `useMemo` along with an O(1) `Set` lookup for filtering edges to prevent expensive calculations and cascading updates inside data-heavy interactive visualization components.
