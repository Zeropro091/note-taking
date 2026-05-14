## 2025-02-20 - Parallelising file reads needs bounded concurrency
**Learning:** Using `Promise.all` with `fs.readdir` can cause `EMFILE` limits if the number of files read in parallel exceeds system limits.
**Action:** Always batch arrays for asynchronous promise reading, using a predefined batch size (like 50), especially when dealing with unknown file limits or structures.
