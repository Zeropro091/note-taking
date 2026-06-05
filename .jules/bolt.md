## 2026-06-05 - Graph View Performance Optimization
**Learning:** Rendering complex React components with arrays/lists mapping logic inline can lead to O(N*E) cascading recalculations. In 'GraphView.tsx', hovered node state changes triggered a full recalculation of node list filters inside link filters.
**Action:** Always wrap expensive derived calculations like graph nodes and links in `useMemo` to prevent recalculation when unrelated state changes (like hovers), and use a precomputed `Set` for array cross-referencing to reduce time complexity.
