## YYYY-MM-DD - Path Traversal Bypass via Backslashes

**Vulnerability:** A path traversal vulnerability was present in the note ID validation logic (`validateNoteId`). When backslashes (`\`) were used in path traversal sequences (e.g., `\\..\\..\\etc\\passwd`), `path.resolve` on non-Windows platforms (like Linux) treated them as regular characters rather than directory separators. As a result, the input successfully passed the "does not contain `..`" relative path check, returning `true`. However, later inside `sanitizeNoteId`, the backslashes were blindly replaced with forward slashes before reading the file, enabling true path traversal and exposing arbitrary files on the system.

**Learning:** This vulnerability existed because the validation step (`validateNoteId`) didn't parse paths using the exact same normalization logic that was eventually used in the actual file system operation. `sanitizeNoteId` introduced forward-slash conversion *after* validation logic was executed.

**Prevention:** Always normalize the path separators *before* applying path traversal detection checks, ensuring that platform-specific nuances (like backslash behavior on POSIX systems) cannot be used to bypass validation checks.
