
## 2025-01-20 - GraphView Accessibility Improvements
**Learning:** The application's toggle-style buttons (like the tag filters in GraphView) lacked `aria-pressed` states, making it difficult for screen reader users to discern which filter was active. Additionally, standard icon-only buttons lacked `aria-label`s and `focus-visible` rings. Adding simple `aria-pressed={condition}` dynamically improves this interaction significantly.
**Action:** When creating toggle buttons or filter chips in React, always bind an `aria-pressed` state to the active condition alongside visible styling changes, and ensure all icon-only interactive elements receive `focus-visible:ring-2 focus-visible:outline-none` and `aria-label` attributes.
