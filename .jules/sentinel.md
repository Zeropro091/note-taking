## 2026-06-10 - Path Traversal Bypass via Backslashes on POSIX

**Vulnerability:** A path traversal vulnerability existed in the file download/access functionality (`validateNoteId` function). Attackers could use backslashes (`..\\..\\..\\etc\\passwd`) to bypass the `path.relative` check, because `path.resolve` on Linux/POSIX treats `\` as a valid filename character, not a directory separator. The application later converted these backslashes to forward slashes in a sanitization function (`sanitizeNoteId`), which allowed the payload to become an active path traversal path during the final file access.

**Learning:** When dealing with file paths, path traversal checks (like `path.relative` boundaries) can be bypassed if the application subsequently transforms the path strings (e.g. converting `\` to `/`) after the validation logic. Validation must be performed on the final path format that will be used. Also, backslashes are valid filename characters on Linux but path separators on Windows, so normalizing them *before* any resolution or validation ensures consistent defense.

**Prevention:**
1. Always normalize path separators (e.g., converting `\` to `/`) *before* invoking standard library path functions like `path.resolve` or `path.relative`.
2. Apply defense-in-depth: explicitly reject inputs containing `..` rather than solely relying on `path.relative` bounding checks.
3. Validate the exact string that will be used for file access.
