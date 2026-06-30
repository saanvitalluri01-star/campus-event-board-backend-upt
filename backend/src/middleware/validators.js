const { body, param, query, validationResult } = require("express-validator");

// Run validation and return errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

// ─── Auth ─────────────────────────────────────────────────────────────────────

const registerValidator = [
  body("name").trim().notEmpty().withMessage("Name is required")
    .isLength({ min: 2, max: 50 }).withMessage("Name must be 2–50 characters"),

  body("email").trim().notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please provide a valid email").normalizeEmail(),

  body("password").notEmpty().withMessage("Password is required")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Password must include uppercase, lowercase, and a number"),

  body("role").optional()
    .isIn(["student", "organizer"]).withMessage("Role must be student or organizer"),

  validate,
];

const loginValidator = [
  body("email").trim().notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
  validate,
];

// ─── Events ───────────────────────────────────────────────────────────────────

const createEventValidator = [
  body("title").trim().notEmpty().withMessage("Title is required")
    .isLength({ min: 3, max: 150 }).withMessage("Title must be 3–150 characters"),

  body("description").trim().notEmpty().withMessage("Description is required")
    .isLength({ min: 10, max: 5000 }).withMessage("Description must be 10–5000 characters"),

  body("category").notEmpty().withMessage("Category is required")
    .isIn(["academic", "cultural", "sports", "tech", "social", "other"])
    .withMessage("Invalid category"),

  body("date").notEmpty().withMessage("Event date is required")
    .isISO8601().withMessage("Date must be a valid ISO 8601 date")
    .custom((val) => {
      if (new Date(val) <= new Date()) throw new Error("Event date must be in the future");
      return true;
    }),

  body("venue").trim().notEmpty().withMessage("Venue is required")
    .isLength({ max: 200 }).withMessage("Venue cannot exceed 200 characters"),

  body("maxCapacity").notEmpty().withMessage("Max capacity is required")
    .isInt({ min: 1, max: 100000 }).withMessage("Capacity must be between 1 and 100,000"),

  body("imageURL").optional({ nullable: true }).trim()
    .isURL({ protocols: ["http", "https"] }).withMessage("Image URL must be a valid URL"),

  body("tags").optional().isArray({ max: 10 }).withMessage("Tags must be an array of max 10"),

  validate,
];

const updateEventValidator = [
  body("title").optional().trim()
    .isLength({ min: 3, max: 150 }).withMessage("Title must be 3–150 characters"),

  body("description").optional().trim()
    .isLength({ min: 10, max: 5000 }).withMessage("Description must be 10–5000 characters"),

  body("category").optional()
    .isIn(["academic", "cultural", "sports", "tech", "social", "other"])
    .withMessage("Invalid category"),

  body("date").optional().isISO8601().withMessage("Date must be a valid ISO 8601 date"),

  body("maxCapacity").optional()
    .isInt({ min: 1, max: 100000 }).withMessage("Capacity must be between 1 and 100,000"),

  body("status").optional()
    .isIn(["upcoming", "ongoing", "completed", "cancelled"]).withMessage("Invalid status"),

  body("imageURL").optional({ nullable: true }).trim()
    .isURL({ protocols: ["http", "https"] }).withMessage("Image URL must be a valid URL"),

  validate,
];

const mongoIdValidator = [
  param("id").isMongoId().withMessage("Invalid ID format"),
  validate,
];

const paginationValidator = [
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be 1–100"),
  validate,
];

module.exports = {
  registerValidator,
  loginValidator,
  createEventValidator,
  updateEventValidator,
  mongoIdValidator,
  paginationValidator,
};
