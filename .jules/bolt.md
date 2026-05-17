## 2024-05-18 - [Parallel File System Reads]
**Learning:** Using `Promise.all` with a bounded concurrency limit significantly improves the performance of `getAllNotes` compared to sequential filesystem operations in Node.js.
**Action:** When mapping directories or performing multiple file operations, use bounded concurrency.
