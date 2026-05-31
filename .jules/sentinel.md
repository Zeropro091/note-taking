## 2024-05-31 - Path Traversal Vulnerability Bypass

**Vulnerability:** A path traversal bypass was possible in `validateNoteId` by using backslashes (`\`) instead of forward slashes on non-Windows platforms, or by relying on `path.relative` stripping the traversal sequences when checking if the resolved path starts with `..`, potentially allowing access to unexpected files within the system if combined with other sanitization failures. The initial checks failed to strictly block `..` or normalize `\` to `/` before resolving the path.

**Learning:** When validating paths to prevent traversal, OS-agnostic bypasses (like `\..`) can occur if characters are not properly normalized before resolution. Additionally, relying solely on `path.resolve` and `path.relative` can lead to edge cases where traversal payloads are incorrectly parsed as safe if they evaluate back to the intended base directory but still contain traversal tokens in the original payload string.

**Prevention:** Always normalize path separators (`\` to `/`) before any other validation steps. As a defense-in-depth measure, explicitly reject any input containing `..` rather than trying to sanitize or resolve it, as path resolution rules can be complex and platform-dependent.
