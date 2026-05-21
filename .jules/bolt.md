## 2025-02-18 - Bounded Concurrency vs EMFILE limits
**Learning:** When performing parallel file system reads in Node.js (like gathering 1000s of markdown notes), using unbounded `Promise.all(files.map(...))` throws `EMFILE` (too many open files) limits set by the OS.
**Action:** Always implement bounded concurrency or chunking (`const chunk = filesToProcess.slice(i, i + CHUNK_SIZE);`) for file system intensive operations. This yields huge performance improvements (e.g. 717ms -> 202ms) while remaining stable.
