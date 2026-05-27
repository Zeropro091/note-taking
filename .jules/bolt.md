## 2024-05-27 - O(N*E) lookup in GraphView
**Learning:** Found O(N*E) complexity when looking up nodes for edges in GraphView, combined with missing useMemo for currentData causing lag on hover.
**Action:** Use useMemo for expensive derived state and Set/Map for lookups in array mapping/filtering.
