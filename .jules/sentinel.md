
## 2024-05-24 - [Path Traversal bypass with backslashes]
**Vulnerability:** A path traversal vulnerability was found in `validateNoteId` where inputs containing backslashes (e.g. `foo/..\..\etc\passwd`) bypassed the check. Because backslashes weren't normalized to forward slashes before calling `path.resolve()`, the returned relative path didn't start with `..`. However, `sanitizeNoteId` converted these backslashes to forward slashes, resulting in an unsafe file path being accessed.
**Learning:** In POSIX environments, `path.resolve` handles backslashes simply as regular filename characters. Thus, path traversal sequences using backslashes (`..\..`) don't actually traverse directories until they're normalized to forward slashes.
**Prevention:** Always normalize all backslashes (`\`) to forward slashes (`/`) *before* resolving paths and checking for traversal, to ensure `path.resolve` accurately evaluates the intended path.
