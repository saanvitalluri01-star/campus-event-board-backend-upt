const express = require("express");
const router = express.Router();

const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  rsvpEvent,
  cancelRsvp,
  getAttendees,
  getUpcomingEvents,
  getPopularEvents,
} = require("../controllers/eventController");

const { protect, restrictTo } = require("../middleware/auth");
const {
  createEventValidator,
  updateEventValidator,
  mongoIdValidator,
  paginationValidator,
} = require("../middleware/validators");

// ─── Special routes BEFORE /:id ───────────────────────────────────────────────
router.get("/upcoming", getUpcomingEvents);
router.get("/popular", getPopularEvents);

// ─── Standard CRUD ────────────────────────────────────────────────────────────
router
  .route("/")
  .get(paginationValidator, getAllEvents)
  .post(protect, restrictTo("organizer", "admin"), createEventValidator, createEvent);

router
  .route("/:id")
  .get(mongoIdValidator, getEventById)
  .put(protect, restrictTo("organizer", "admin"), mongoIdValidator, updateEventValidator, updateEvent)
  .delete(protect, restrictTo("organizer", "admin"), mongoIdValidator, deleteEvent);

// ─── RSVP ─────────────────────────────────────────────────────────────────────
router.post("/:id/rsvp", protect, mongoIdValidator, rsvpEvent);
router.delete("/:id/rsvp", protect, mongoIdValidator, cancelRsvp);

// ─── Attendees ────────────────────────────────────────────────────────────────
router.get("/:id/attendees", protect, mongoIdValidator, getAttendees);

module.exports = router;
