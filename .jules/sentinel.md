## 2024-05-17 - [Path Traversal bypass via POSIX vs Windows separators]
**Vulnerability:** Path traversal bypass in `validateNoteId`.
**Learning:** `path.resolve` handles backslashes properly on Windows but not on POSIX. Malicious inputs using Windows-style backslashes (e.g., `file\..\..\etc\passwd`) bypass strict `startsWith("..")` and `.isAbsolute` checks on a POSIX environment if they aren't normalized first. The string replaces happening *after* validation allowed traversing out of the expected directory context.
**Prevention:** Always normalize file separators (e.g. replacing `\\` with `/`) on paths BEFORE performing any path resolution and relative boundary checking to prevent bypassing traversal checks.
