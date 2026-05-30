## 2024-05-30 - Accordion Accessibility
**Learning:** Accordion-style groups and collapsible panels require proper ARIA attributes to be fully accessible. The toggle button needs `aria-expanded` and `aria-controls={id}`, and the corresponding content container must have a matching `id`.
**Action:** Always verify that collapsible UI components have matching `aria-controls` on the trigger and `id` on the content, along with an accurate `aria-expanded` state.
