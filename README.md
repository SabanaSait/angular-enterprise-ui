# Angular Enterprise UI

A production-ready Angular application shell showcasing scalable layout architecture, responsive sidenav navigation, routing, and accessibility-first UI patterns using modern standalone components.

## 🎯 Purpose

This project is built to demonstrate:

- Enterprise-grade Angular layout architecture
- Modern standalone component approach (Angular 16+)
- Responsive navigation patterns for desktop and mobile
- Accessibility best practices (keyboard navigation, focus trapping, ESC handling)
- Clean separation of layout and feature concerns

This repository is intended as a **reference implementation** for real-world Angular applications.

---

## 🧱 Architecture Overview

- **App Shell Pattern**

  - Persistent header
  - Responsive sidenav
  - Routed content area

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

- Angular (latest LTS)
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
