## 2024-05-14 - Accessible Accordion IDs
**Learning:** When using dynamic strings like group names to generate `id` and `aria-controls` attributes for accordion components, whitespace in the strings will break the ARIA linkage because `aria-controls` parses spaces as multiple distinct IDs.
**Action:** Always sanitize dynamic strings before using them in `id` and `aria-*` attributes (e.g., `.replace(/\s+/g, '-')`) to ensure robust accessibility support.
