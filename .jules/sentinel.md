## 2024-05-20 - [Path Traversal] POSIX Backslash Normalization Bypass

**Vulnerability:** A path traversal vulnerability existed where an attacker could bypass `validateNoteId` validation on POSIX systems by using backslashes `\` instead of forward slashes `/` (e.g., `foo\..\..\..\etc\passwd`).
**Learning:** `path.resolve` on POSIX systems treats backslashes as valid filename characters, not as directory separators. Because the backslashes were only converted to forward slashes *after* `validateNoteId` during `sanitizeNoteId`, the un-normalized string successfully passed the `relative !== '' && !relative.startsWith('..')` checks, only to later result in traversal when `sanitizeNoteId` replaced `\` with `/` and prepended `NOTES_DIR`.
**Prevention:** Always normalize path separators (`\` to `/`) *before* applying path resolution (`path.resolve`) and relative path checking (`path.relative`) for validation purposes to prevent POSIX-specific traversal bypasses.
