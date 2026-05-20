## 2025-02-12 - File I/O Optimization
**Learning:** `getAllNotes` was sequential, heavily restricting performance for API calls parsing markdown files. Replacing it with unbounded `Promise.all` throws `EMFILE` for large directories.
**Action:** Use chunked concurrency (`Promise.all` over chunks of ~50 files) to speed up I/O significantly while avoiding OS file handle limits.
