# Angular Enterprise Admin Dashboard

An enterprise-grade admin dashboard built with **Angular v21**, designed to reflect real-world frontend architecture, scalability concerns, and accessibility-first development practices.

This project is a production-oriented reference implementation showcasing senior-level Angular and frontend engineering.

---

## Key Features

- Modern Angular v21 with **standalone components**
- **Signals + RxJS** for predictable state management
- **Role-Based Access Control (RBAC)** with Users, Roles, and Permissions
- Enterprise-grade **UX and accessibility (A11y)**
- Localization with **English (LTR) & Arabic (RTL)** support
- Unit-tested core logic and UI flows
- Clean, scalable project structure aligned with enterprise standards

---

## Tech Stack

- **Framework:** Angular v21
- **Architecture:** Standalone components, feature-based structure
- **State Management:** Angular Signals with RxJS where appropriate
- **Styling:** SCSS
- **Testing:** Vitest (unit testing)
- **Localization:** Angular built-in i18n (XLIFF)
- **Accessibility:** WCAG-aligned ARIA practices

---

## Architecture Overview

### App Shell & Layout Architecture

- Persistent application shell (header + sidenav)
- Layout-driven routing with a routed content area
- Responsive navigation patterns:
  - Desktop: fixed sidebar
  - Tablet & Mobile: off-canvas sidenav with overlay

- Clear separation between layout and feature concerns

### Feature Areas

- Authentication (Login)
- Users
- Admin
- Roles & Permissions
- Role Details

### Shared UI Building Blocks

- `app-badge` - read-only status indicators
- `app-pagination`
- `app-tabs`
- Shared **pipes** for mapping role and permission codes to human-readable labels

---

## Architecture Decisions

- Standalone components to simplify dependency boundaries and enable granular composition
- Signals for core state with RxJS only where stream operators add real value
- Feature-first folder structure to keep routing, state, and UI co-located
- Compile-time i18n for reliable RTL and predictable release artifacts
- Accessibility as a design constraint, not a retrofit

---

## Authentication & Authorization (RBAC)

This project includes a realistic authentication and authorization foundation:

- Authentication state managed using **Angular Signals**
- Session persistence with safe bootstrap restoration
- **Role-Based Access Control (RBAC)**:
  - Permissions derived from roles
  - Permission-based route protection using `canMatch`
  - Permission-driven navigation rendering

- Secure-by-default access model (no permission -> no access)

Authorization logic is intentionally centralized to avoid stale or inconsistent permission state.

---

## Accessibility (A11y)

Accessibility was treated as a **first-class requirement**, not a retrofit. A full pass was completed across the entire application (login -> role details).

### Highlights

- Proper heading hierarchy (`h1` per page, no skipped levels)
- Semantic HTML tables with `thead`, `tbody`, and `scope="col"`
- Accessible navigation with `aria-current="page"`
- ARIA-labeled pagination, tabs, and action buttons
- Keyboard-safe navigation patterns:
  - ESC key handling
  - Focus trapping within overlays
  - Focus restoration on close

- Icons treated as decorative unless interactive

Badges are intentionally **presentational-only** and kept free of ARIA roles.

---

## Localization (i18n)

The application uses **Angular's built-in i18n** with support for:

- **English (LTR)**
- **Arabic (RTL)**

### Rationale

Compile-time localization was chosen for v1 to prioritize:

- Strong compile-time safety
- Correct RTL behavior
- Simplicity and clarity for an initial production-ready version

### Known Trade-offs

- No runtime language switching
- Rebuild required per locale
- Limited scalability for large translation teams

Localized builds are emitted under:

```text
dist/enterprise-dashboard/browser/en/
dist/enterprise-dashboard/browser/ar/
```

> In future iterations, a runtime i18n solution (e.g. Transloco) would be considered for dynamic language switching and improved developer experience.

---

## Testing Strategy

- Unit tests implemented using **Vitest**
- Focus on predictable behavior, state transitions, and UI logic
- Tests added alongside features to avoid test debt

Testing is treated as a **core quality practice**, not an afterthought.

---

## Local Development Setup

### Prerequisites

- **Node.js:** v24.12.0 (used during development)
- **npm:** v11.x (as defined in `packageManager`)
- **Angular CLI:** v21+

### Install dependencies

```bash
npm install
```

### Run the application

```bash
# Default (English)
npm start

# Arabic (RTL)
npm run start:ar
```

Optional: after `npm run build:localize`, you can serve the locale folders with any static server and open `/en/` or `/ar/` paths to validate the production output.

### Build

```bash
# Standard build
npm run build

# Production build with localization
npm run build:localize
```

### Testing

```bash
npm test
```

### Linting & Formatting

```bash
npm run lint
npm run lint:fix
npm run format
```

### Localization workflow

```bash
npm run extract-i18n
```

Translation files are maintained under:

```text
src/locale/
```

### Git Hooks

This project uses **Husky + lint-staged** to enforce code quality before commits:

- ESLint on staged files
- Prettier for consistent formatting

Hooks are installed automatically via:

```bash
npm run prepare
```

---

## Future Improvements

Potential next steps:

- Runtime language switching
- Integration testing
- End-to-end (E2E) testing
- Test coverage reporting
- Feature toggles
- Expanded Roles & Permissions CRUD
- Performance profiling & optimization
- Theming support

---

## Project Intent

This project exists to demonstrate:

- Real-world Angular architecture and patterns
- Role-based access control in frontend applications
- Accessibility-first UI development
- Scalable, maintainable frontend decision-making
- Conscious trade-offs instead of premature over-engineering

It reflects how I approach building **production-ready frontend systems** in an enterprise environment.
