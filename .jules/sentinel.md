## $(date +%Y-%m-%d) - Path Traversal Bypass via Backslash Normalization
**Vulnerability:** Path traversal payload using backslashes (e.g., `folder/..\\..\\etc\\passwd`) bypassed validation on POSIX systems.
**Learning:** `path.resolve` on POSIX systems does not interpret `\` as a directory separator. If input containing `\` is later normalized to `/` *after* validation but before usage, it opens a vulnerability.
**Prevention:** Always normalize path separators to forward slashes (`/`) *before* applying path resolution and traversal validation checks.
