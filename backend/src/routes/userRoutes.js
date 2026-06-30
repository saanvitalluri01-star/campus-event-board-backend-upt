const express = require("express");
const router = express.Router();
const { getMyEvents, getMyRsvps } = require("../controllers/userController");
const { protect, restrictTo } = require("../middleware/auth");

// Organizer: events they created
router.get("/my-events", protect, restrictTo("organizer", "admin"), getMyEvents);

// Student/any: events they RSVPed to
router.get("/my-rsvps", protect, getMyRsvps);

module.exports = router;
