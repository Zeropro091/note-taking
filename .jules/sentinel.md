## 2024-06-10 - Path Traversal Vulnerability in file-system.ts
**Vulnerability:** Path traversal payload 'folder/../../note' incorrectly resolved as safe within directory because path.relative would successfully resolve to 'note' which is inside NOTES_DIR, defeating the intended directory constraint check.
**Learning:** `path.resolve` combined with `path.relative` is not sufficient to prevent all path traversals. `path.relative` resolves `..` segments, so `path.relative(base, resolve(base, 'a/../b'))` results in `b`, completely hiding the traversal attempt and appearing fully safe/within bounds.
**Prevention:** Always normalize the path separator (e.g. `replace(/\\/g, '/')`) and then explicitly reject ANY occurrence of `..` BEFORE using `path.resolve` or `path.relative`.
