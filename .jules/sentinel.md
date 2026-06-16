
## 2025-06-16 - Prevent POSIX Path Traversal Bypass
**Vulnerability:** The application mitigated path traversal by rejecting `..`, but failed to sanitize backslashes (`\`) on POSIX systems. If a Windows-style path traversal was provided (e.g., `folder\..\..\etc\passwd`), it bypassed the invalid character check but `path.resolve` failed to normalize it.
**Learning:** Checking for `..` is not enough. You must standardize directory separators first (by replacing backslashes with forward slashes) before relying on `path.resolve` or searching for traversal payloads, because an attacker might use unhandled separators to smuggle `..`.
**Prevention:** Normalize all incoming paths by converting `\` to `/`, then explicitly check for `..` before doing any further path logic, acting as defense in depth against traversal attacks.
