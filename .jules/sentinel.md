
## 2024-06-11 - Prevent Path Traversal Verification Bypasses
**Vulnerability:** Path traversal checks could be bypassed because input paths could resolve strictly inside the directory if `..` sequences were stripped *after* checks, or if validation logic allowed `..` resolving within the target directory due to Windows backslash path behavior in `path.resolve` on non-POSIX systems, leading to potential access files not intended.
**Learning:** Checking for traversal by looking exclusively at if the fully resolved absolute path is inside the directory boundary isn't always enough if untrusted input can contain raw path separators like backslashes which later get normalized.
**Prevention:** Normalize backslashes (`\`) to forward slashes (`/`) and perform an explicit reject-list check for `..` *before* delegating to the native `path.resolve`/`path.relative` module.
