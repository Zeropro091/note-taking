## 2024-07-08 - [Path Traversal in validateNoteId]
**Vulnerability:** Path traversal vulnerability bypass via Windows backslashes and relative paths that resolve within the directory.
**Learning:** Using `path.resolve` alone is insufficient if backslashes aren't normalized or if relative dot-dot segments aren't explicitly rejected before resolution.
**Prevention:** Normalize all backslashes to forward slashes and explicitly reject path segments consisting of exactly `..` using bounded regex `/(^|\/)\.\.(?=\/|$)/` as defense in depth.