## 2024-06-17 - Fix Path Traversal Vulnerability in validateNoteId
**Vulnerability:** Path traversal vulnerability in `validateNoteId` allowed bypassing traversal checks using Windows backslashes (e.g. `\..\..\etc\passwd`).
**Learning:** `path.resolve` handles backslashes on POSIX systems differently (as literal characters instead of separators), causing it to appear safe. When it goes to `sanitizeNoteId`, the backslashes are converted to forward slashes because `validateNoteId(id)` returns `true`, and the string returned actually traverses.
**Prevention:** Normalize backslashes to forward slashes BEFORE performing path traversal checks and explicitly reject strings containing `..` for defense in depth.
