## 2024-07-07 - Fix Path Traversal Bypass via Backslashes
**Vulnerability:** Path traversal vulnerability in `validateNoteId` where Windows-style backslashes could bypass `path.resolve` validation on POSIX systems, allowing access to files outside `NOTES_DIR`.
**Learning:** Node's `path` functions process paths according to the OS they are running on. On POSIX systems, Windows backslashes (`\`) are treated as normal characters, not directory separators, allowing bypass of `path.relative` checks.
**Prevention:** Always normalize path separators (convert `\` to `/`) BEFORE resolving paths against restricted directories, and implement explicit rejection of traversal attempts (like `..`) as defense-in-depth.
