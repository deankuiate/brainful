# Brainful

A minimal, distraction-free productivity app. Brainful brings together a scheduler, task manager, and notes tool in one clean black-and-white interface.

---

## Features

**Scheduler** — A monthly calendar where you can add, view, and delete events. Events are tied to specific dates and times, and persist across sessions via localStorage.

**ToDoist** — A task manager with Today and Upcoming views. Tasks support inline editing, due dates, completion tracking, drag-to-reorder, and a detail panel for notes.

**Notes** — A Notion-style page editor. Create, rename, and delete pages from a sidebar, with autosaving content to localStorage.

---

## Project Structure

```
brainful/
├── logo/
│   ├── whitelogo.png
│   └── favicon.png
└── app/
    ├── about/
    │   ├── about.html
    │   ├── about.css
    │   ├── aboutbanner.png
    │   └── brainimage.png
    ├── scheduler/
    │   ├── scheduler.html
    │   ├── scheduler.css
    │   └── scheduler.js
    ├── todoist/
    │   ├── todoist.html
    │   ├── todoist.css
    │   └── todoist.js
    └── notes/
        ├── notes.html
        ├── notes.css
        └── notes.js
```

---

## Getting Started

Brainful is a static site — no build step or dependencies required.

1. Clone or download the repo
2. Serve it from a local server with `/brainful/` as the base path (required due to the `<base href="/brainful/">` tag)
3. Open `app/about/about.html` in your browser

A simple way to serve it locally:

```bash
# using python
python -m http.server 8080
# then visit http://localhost:8080/brainful/app/about/about.html
```

---

## Storage

All data (pages, tasks, events) is saved to the browser's `localStorage`. Nothing is sent to a server. Clearing your browser data will erase saved content.

---

## Tech Stack

- vanilla HTML, CSS, JavaScript — no frameworks
- [Font Awesome 6](https://fontawesome.com/) for icons
- Google Fonts — *Cause* typeface

---

## Contact

Built by [Dean Kuiate](https://www.linkedin.com/in/deankuiate/)
- GitHub: [@deankuiate](https://github.com/deankuiate)
- Email: deanthemachine21@gmail.com