## 2024-05-24 - POSIX Path Traversal Bypass via Backslashes

**Vulnerability:** Path traversal check `validateNoteId` could be bypassed in POSIX environments when validating backslash paths (`..\\..\\etc\\passwd`). `path.resolve` does not normalize backslashes as path separators in POSIX, allowing the entire string to be treated as a valid filename and evading `.startsWith('..')` checks while still writing to malicious paths on the OS if later passed to shell or unsafe IO wrappers. Furthermore, `..` patterns within the string (e.g. `folder/../../note`) were allowed, increasing the attack surface.

**Learning:** `path.resolve()` and `path.relative()` behaviors differ between platforms. On POSIX systems, a backslash is a valid filename character, not a directory separator. This means `path.resolve('/data', '..\\..\\etc\\passwd')` becomes `/data/..\\..\\etc\\passwd`, which bypasses `path.relative` checking because it's technically within the directory structure, despite being functionally unsafe in contexts that later normalize or interpret those backslashes.

**Prevention:** Normalize backslashes to forward slashes before any `path` operations (`id.replace(/\\/g, '/')`). As a defense-in-depth measure, strictly reject *any* ID containing `..`, regardless of whether it resolves "safely" within the target directory.
