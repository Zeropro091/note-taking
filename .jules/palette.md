## 2026-05-29 - Accessible Accordions
**Learning:** For accordion-style groups or collapsible panels (like `NoteGroups`), a `<button>` that toggles content visibility must include `aria-expanded={isExpanded}` and `aria-controls={id}` to be fully accessible. The content container must have a matching `id`.
**Action:** Always add `aria-expanded` and `aria-controls` to toggle buttons, and link them to the content container ID.
