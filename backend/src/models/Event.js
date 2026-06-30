const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [150, "Title cannot exceed 150 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters"],
      maxlength: [5000, "Description cannot exceed 5000 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: ["academic", "cultural", "sports", "tech", "social", "other"],
        message: "Category must be academic, cultural, sports, tech, social, or other",
      },
    },
    date: {
      type: Date,
      required: [true, "Event date is required"],
    },
    venue: {
      type: String,
      required: [true, "Venue is required"],
      trim: true,
      maxlength: [200, "Venue cannot exceed 200 characters"],
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imageURL: {
      type: String,
      trim: true,
      default: null,
      match: [/^https?:\/\/.+/, "Image URL must start with http or https"],
    },
    maxCapacity: {
      type: Number,
      required: [true, "Maximum capacity is required"],
      min: [1, "Capacity must be at least 1"],
      max: [100000, "Capacity cannot exceed 100,000"],
    },
    rsvpCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    rsvps: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) => arr.length <= 10,
        message: "Cannot have more than 10 tags",
      },
    },
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed", "cancelled"],
      default: "upcoming",
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
eventSchema.index({ title: "text", description: "text", tags: "text" });
eventSchema.index({ date: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ organizer: 1 });
eventSchema.index({ rsvpCount: -1 });

// Virtual: is event full?
eventSchema.virtual("isFull").get(function () {
  return this.rsvpCount >= this.maxCapacity;
});

// Virtual: spots remaining
eventSchema.virtual("spotsRemaining").get(function () {
  return Math.max(0, this.maxCapacity - this.rsvpCount);
});

// Auto-update status based on date before queries
eventSchema.pre(/^find/, function (next) {
  this.populate("organizer", "name email role");
  next();
});

module.exports = mongoose.model("Event", eventSchema);
