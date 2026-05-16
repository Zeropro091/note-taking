
## 2024-05-16 - [POSIX Traversal Bypass via Normalization]
**Vulnerability:** A path traversal vulnerability existed where input like `foo/..\\..\\etc\\passwd` bypassed traversal checks.
**Learning:** `path.resolve` on POSIX systems does not treat backslashes as path separators. Therefore, validating a path before normalizing it (e.g. converting `\` to `/`) can allow malicious input to pass validation, and subsequent normalization transforms the "safe" string into an actual traversal payload.
**Prevention:** Always normalize path separators (e.g., converting backslashes to forward slashes) BEFORE resolving or validating the path.
