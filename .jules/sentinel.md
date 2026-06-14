## 2024-06-14 - Fix Path Traversal in Note ID Validation
**Vulnerability:** Path traversal vulnerability existed in `validateNoteId` in `note-taking-app/src/lib/file-system.ts` where payloads using `..` that resolved to a path that started with the same directory prefix (e.g. `folder/../../note`) could bypass the validation checks.
**Learning:** `path.relative` checking the resolved path against the base path could allow traversal if the resulting resolved path doesn't start with `..`. Normalizing paths (especially handling backslashes) and explicitly checking for `..` is crucial to prevent bypasses.
**Prevention:** Normalize backslashes to forward slashes before any checks and explicitly reject any ID that includes `..` to prevent traversal bypasses entirely.
