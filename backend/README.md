# 🎓 Campus Event Board — Backend API

REST API built with Node.js, Express, MongoDB, and JWT authentication.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env: set MONGODB_URI and JWT_SECRET

# 3. Seed the database
npm run seed

# 4. Start development server
npm run dev
```

Server runs at: **http://localhost:5000**

---

## 👤 Seeded Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@campus.edu | Admin@123 |
| Organizer | arjun.mehta@campus.edu | Organizer@123 |
| Organizer | sneha.reddy@campus.edu | Organizer@123 |
| Student | aarav@student.edu | Student@123 |
| Student | meera@student.edu | Student@123 |

---

## 📖 API Reference

### Auth
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | /api/auth/register | Public | Register new user |
| POST | /api/auth/login | Public | Login & get JWT |
| GET | /api/auth/me | Private | Get my profile |

### Events
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET | /api/events | Public | All events (paginated, searchable) |
| GET | /api/events/upcoming | Public | Next upcoming events |
| GET | /api/events/popular | Public | Most RSVPed events |
| GET | /api/events/:id | Public | Single event |
| POST | /api/events | Organizer | Create event |
| PUT | /api/events/:id | Organizer | Update event |
| DELETE | /api/events/:id | Organizer/Admin | Delete event |
| POST | /api/events/:id/rsvp | Logged in | RSVP to event |
| DELETE | /api/events/:id/rsvp | Logged in | Cancel RSVP |
| GET | /api/events/:id/attendees | Organizer | View attendees |

### Users
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET | /api/users/my-events | Organizer | My created events |
| GET | /api/users/my-rsvps | Any | My RSVPed events |

### Query Params for GET /api/events
| Param | Example | Description |
|-------|---------|-------------|
| page | ?page=2 | Page number |
| limit | ?limit=5 | Results per page |
| search | ?search=hackathon | Full-text search |
| category | ?category=tech | Filter by category |
| status | ?status=upcoming | Filter by status |
| date | ?date=2025-12-01 | Filter by date |
| sortBy | ?sortBy=rsvpCount | Sort field |
| sortOrder | ?sortOrder=desc | Sort direction |

---

## 📁 Folder Structure

```
backend/
├── src/
│   ├── config/database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── eventController.js
│   │   └── userController.js
│   ├── data/
│   │   ├── seedData.js
│   │   └── seed.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   ├── requestLogger.js
│   │   └── validators.js
│   ├── models/
│   │   ├── Event.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── eventRoutes.js
│   │   └── userRoutes.js
│   ├── app.js
│   └── server.js
├── postman/
│   └── Campus_Event_Board.postman_collection.json
├── .env.example
└── package.json
```

---

## 🔐 Auth Header

All protected routes require:
```
Authorization: Bearer <your_jwt_token>
```

---

## ⚙️ Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| PORT | No (5000) | Server port |
| MONGODB_URI | Yes | MongoDB connection string |
| JWT_SECRET | Yes | JWT signing secret |
| JWT_EXPIRES_IN | No (7d) | Token expiry |
| FRONTEND_URL | No | Allowed CORS origin |
