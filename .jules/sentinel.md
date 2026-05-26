
## 2024-05-26 - Critical Path Traversal Bypass via Backslashes
**Vulnerability:** Path traversal logic in `validateNoteId` validated relative paths, but did not normalize backslashes beforehand. This allowed POSIX environments to bypass traversal protections via backslashes (e.g., `folder/..\..\..\etc\passwd`).
**Learning:** `path.resolve` and `path.relative` on POSIX environments do not treat `\` as a directory separator, so they allow backslash-based traversal strings to pass through unchanged, leading to bypassing validation logic when the downstream component parses backslashes.
**Prevention:** Normalize backslashes (`\`) to forward slashes (`/`) *before* applying path resolution and traversal boundaries using `path.relative` or similar boundary checking routines.
