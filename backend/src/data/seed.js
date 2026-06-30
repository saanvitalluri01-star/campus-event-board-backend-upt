require("dotenv").config({ path: require("path").join(__dirname, "../../.env") });
const mongoose = require("mongoose");
const User = require("../models/User");
const Event = require("../models/Event");
const { seedData, buildEvents } = require("./seedData");

const run = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/campus_event_board"
    );
    console.log("✅ MongoDB connected");

    // Clear existing data
    await Promise.all([User.deleteMany({}), Event.deleteMany({})]);
    console.log("🗑️  Cleared existing data");

    // Create admin
    const admin = await User.create(seedData.admin);
    console.log(`✅ Admin: ${admin.email}`);

    // Create organizers
    const organizers = await User.insertMany(seedData.organizers);
    console.log(`✅ Created ${organizers.length} organizers`);

    // Create students
    const students = await User.insertMany(seedData.students);
    console.log(`✅ Created ${students.length} students`);

    // Create events
    const eventsPayload = buildEvents(organizers);
    const events = await Event.insertMany(eventsPayload);
    console.log(`✅ Created ${events.length} events`);

    // Seed some RSVPs so data looks real
    const student0 = students[0];
    const student1 = students[1];
    const student2 = students[2];

    // student0 RSVPs to first 4 events
    for (let i = 0; i < 4; i++) {
      events[i].rsvps.push(student0._id);
      events[i].rsvpCount++;
    }
    // student1 RSVPs to events 2–6
    for (let i = 2; i < 7; i++) {
      events[i].rsvps.push(student1._id);
      events[i].rsvpCount++;
    }
    // student2 RSVPs to last 3 events
    for (let i = 7; i < 10; i++) {
      events[i].rsvps.push(student2._id);
      events[i].rsvpCount++;
    }

    await Promise.all(events.map((e) => e.save()));
    console.log("✅ Seeded RSVPs");

    console.log("\n🎉 Database seeded successfully!");
    console.log("─────────────────────────────────────────────────");
    console.log("👤 Admin     → admin@campus.edu        / Admin@123");
    console.log("🎤 Organizer → arjun.mehta@campus.edu  / Organizer@123");
    console.log("🎓 Student   → aarav@student.edu       / Student@123");
    console.log("─────────────────────────────────────────────────\n");

    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
};

run();
