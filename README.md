# Angular Enterprise UI

A production-ready Angular application shell showcasing scalable layout architecture, authentication with role-based access control (RBAC), responsive sidenav navigation, routing, and accessibility-first UI patterns using modern standalone components.

## 🎯 Purpose

This project is built to demonstrate:

- Enterprise-grade Angular layout architecture
- Modern standalone component approach (Angular 21 LTS)
- Authentication and authorization
- Responsive navigation patterns for desktop and mobile
- Accessibility best practices (keyboard navigation, focus trapping, ESC handling)
- Clean separation of layout and feature concerns

This repository is intended as a **reference implementation** for real-world Angular applications.

---

## 🔐 Authentication & Authorization

This application includes a production-grade authentication and authorization foundation:

- Authentication state managed via Angular signals
- Session persistence with localStorage and bootstrap restoration
- Role-Based Access Control (RBAC)
  - Roles mapped to permissions
  - Permission-based route guards (`canMatch`)
  - Permission-driven navigation rendering
- Secure defaults (no permission → no access)

The design intentionally derives permissions from roles to avoid stale or inconsistent authorization state.

---

## 🧱 Architecture Overview

- **App Shell Pattern**

  - Persistent header
  - Responsive sidenav
  - Routed content area
  - Layout-driven routing

- **Auth-aware App Shell**

  - RBAC-protected routes
  - Permission-based navigation rendering
  - Session-safe initialization

- **Standalone Components**

  - No NgModules
  - Explicit imports per component
  - Improved readability and tree-shaking

- **Routing**
  - Layout-driven routing
  - Feature-based navigation

---

## ♿ Accessibility Highlights

- Keyboard-accessible sidenav
- ESC key to close overlay navigation
- Focus trapping within sidenav
- Focus restoration on close
- Backdrop support for mobile navigation

---

## 📱 Responsive Design

- Desktop: fixed sidebar layout
- Tablet & Mobile: off-canvas sidenav with overlay
- Flexbox-based layout with overflow-safe patterns

---

## 🛠️ Tech Stack

- Angular 21.x (latest LTS)
- Standalone Components
- Angular Router
- SCSS (mobile-first)
- TypeScript

---

## 🚀 Development

### Development server

```bash
ng serve
```

Open http://localhost:4200 to run the app locally.
