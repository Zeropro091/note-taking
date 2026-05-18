## 2024-05-18 - Path Traversal via POSIX Backslash Bypass
**Vulnerability:** A path traversal vulnerability was found where `validateNoteId` in `note-taking-app/src/lib/file-system.ts` would incorrectly pass POSIX backslash bypasses (e.g. `\..\..\etc\passwd`).
**Learning:** `path.resolve` and `path.relative` on POSIX systems do not interpret backslashes as path separators, but later steps might convert backslashes to forward slashes, causing a traversal escape.
**Prevention:** Normalize backslashes to forward slashes *before* performing relative path validation logic to prevent POSIX traversal bypasses.
