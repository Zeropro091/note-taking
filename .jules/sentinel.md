
## 2024-05-18 - Path Traversal Bypass via Backslashes
**Vulnerability:** Path traversal filter bypass where Windows-style backslashes (`\`) in paths (e.g. `dir/..\..\etc\passwd`) were processed successfully by `path.resolve` on non-Windows systems but bypassed `path.relative` validation checks when traversing directories.
**Learning:** `path.resolve` handles backslashes as regular filename characters on POSIX systems, but when validating paths, failing to normalize backslashes first can allow traversal strings to slip past filters before being interpreted by underlying file system APIs.
**Prevention:** Always normalize backslashes to forward slashes BEFORE resolving the path relative to a base directory when validating user-supplied file IDs.
