## 2024-06-09 - Accessible Note Groups Accordion
**Learning:** React accordion-style group toggles often miss crucial structural ARIA attributes and focus states for keyboard users.
**Action:** Always ensure accordion header buttons include `aria-expanded` and `aria-controls` referencing the corresponding collapsible content container's `id`, and that standard buttons have visible `focus-visible` styles explicitly defined if they deviate from default browser outlines.
