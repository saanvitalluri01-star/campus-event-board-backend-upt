# 🎓 Campus Event Board — Frontend

React + Tailwind CSS frontend for Campus Event Board.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Frontend runs at: **http://localhost:5173**

> ⚠️ Make sure the backend is running on **http://localhost:8000** before starting the frontend.

---

## 📁 Folder Structure

```
src/
├── api/
│   ├── axios.js         # Axios instance with token interceptor
│   └── index.js         # All API call functions
├── components/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── EventCard.jsx
│   ├── Spinner.jsx
│   └── ProtectedRoute.jsx
├── context/
│   └── AuthContext.jsx  # Global auth state
├── pages/
│   ├── Home.jsx
│   ├── Events.jsx
│   ├── EventDetail.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx    # Handles both organizer + student views
│   ├── CreateEvent.jsx  # Also handles Edit mode
│   └── NotFound.jsx
├── utils/
│   └── index.js         # formatDate, colors, helpers
├── App.jsx              # Routes
├── main.jsx
└── index.css
```

---

## 🔑 Demo Accounts (from seed data)

| Role | Email | Password |
|------|-------|----------|
| Student | aarav@student.edu | Student@123 |
| Organizer | arjun.mehta@campus.edu | Organizer@123 |
| Admin | admin@campus.edu | Admin@123 |

---

## 📄 Pages

| Route | Access | Description |
|-------|--------|-------------|
| / | Public | Home with hero, upcoming & popular events |
| /events | Public | Browse all events with search/filter/sort/pagination |
| /events/:id | Public | Event detail with RSVP button |
| /login | Public | Login form |
| /register | Public | Register form with role selector |
| /dashboard | Protected | Organizer: created events. Student: RSVPs |
| /events/new | Organizer | Create event form |
| /events/:id/edit | Organizer | Edit event form |
