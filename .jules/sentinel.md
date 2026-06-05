## 2024-05-24 - Windows Path Separator Bypass in path.relative

**Vulnerability:** A path traversal vulnerability existed in `validateNoteId` because it relied solely on `path.relative` after resolving paths with `path.resolve`. This allowed bypasses using Windows path separators (e.g., `..\..\etc\passwd`), which `path.relative` might not catch properly on all systems or when mixed with forward slashes before normalization.

**Learning:** When validating paths to prevent traversal, normalizing path separators BEFORE doing any `path.resolve` or `path.relative` operations is crucial. Otherwise, mixed separators can trick validation functions while still allowing file system access. Additionally, implicitly trusting `path.relative` alone isn't enough when complex characters are involved.

**Prevention:** Always normalize path separators (`replace(/\\/g, '/')`) before validation. Apply a defense-in-depth approach by explicitly rejecting suspicious patterns like `..` in the normalized string before relying on standard library path resolution methods.
