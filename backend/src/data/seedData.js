const seedData = {
  organizers: [
    { name: "Dr. Arjun Mehta", email: "arjun.mehta@campus.edu", password: "Organizer@123", role: "organizer" },
    { name: "Prof. Sneha Reddy", email: "sneha.reddy@campus.edu", password: "Organizer@123", role: "organizer" },
    { name: "Rahul Sharma", email: "rahul.sharma@campus.edu", password: "Organizer@123", role: "organizer" },
    { name: "Priya Nair", email: "priya.nair@campus.edu", password: "Organizer@123", role: "organizer" },
    { name: "Karthik Iyer", email: "karthik.iyer@campus.edu", password: "Organizer@123", role: "organizer" },
  ],
  students: [
    { name: "Aarav Singh", email: "aarav@student.edu", password: "Student@123", role: "student" },
    { name: "Meera Pillai", email: "meera@student.edu", password: "Student@123", role: "student" },
    { name: "Rohan Gupta", email: "rohan@student.edu", password: "Student@123", role: "student" },
  ],
  admin: { name: "Admin User", email: "admin@campus.edu", password: "Admin@123", role: "admin" },
};

// Events are built in seed.js after organizer IDs are known
const buildEvents = (organizers) => {
  const future = (days) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d;
  };

  return [
    {
      title: "TechFest 2025 — National Level Hackathon",
      description:
        "Join us for a 24-hour hackathon where students from across the country compete to build innovative solutions. Categories include AI/ML, Web3, HealthTech, and EdTech. Cash prizes worth ₹5,00,000 await the top teams. Meals, snacks, and swag provided for all participants.",
      category: "tech",
      date: future(15),
      venue: "Main Auditorium & Tech Labs, Block A",
      organizer: organizers[0]._id,
      imageURL: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800",
      maxCapacity: 300,
      tags: ["hackathon", "coding", "AI", "prizes"],
      status: "upcoming",
    },
    {
      title: "Ranga Utsav — Annual Cultural Night",
      description:
        "An extravaganza of music, dance, drama, and art! Students from all departments showcase their talent in classical dance, western music, street plays, and stand-up comedy. A night filled with colour, culture, and celebration. Open to all students and faculty.",
      category: "cultural",
      date: future(7),
      venue: "Open Air Theatre, Central Campus",
      organizer: organizers[1]._id,
      imageURL: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800",
      maxCapacity: 1000,
      tags: ["dance", "music", "drama", "culture"],
      status: "upcoming",
    },
    {
      title: "Inter-Department Cricket Championship",
      description:
        "The annual cricket tournament is back! 16 department teams battle it out over 3 weeks for the coveted Inter-Department Trophy. T20 format. All matches will be livestreamed on the campus YouTube channel. Register your team by Day 3.",
      category: "sports",
      date: future(3),
      venue: "Campus Cricket Ground, Sports Complex",
      organizer: organizers[2]._id,
      imageURL: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800",
      maxCapacity: 500,
      tags: ["cricket", "sports", "tournament", "team"],
      status: "upcoming",
    },
    {
      title: "Research Symposium on Sustainable Engineering",
      description:
        "A two-day academic symposium featuring keynote lectures from IIT professors, paper presentations by postgraduate students, and panel discussions on green technology, renewable energy, and sustainable infrastructure. Certificate of participation for all attendees.",
      category: "academic",
      date: future(21),
      venue: "Conference Hall, Engineering Block",
      organizer: organizers[0]._id,
      imageURL: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800",
      maxCapacity: 200,
      tags: ["research", "sustainability", "engineering", "conference"],
      status: "upcoming",
    },
    {
      title: "Freshers Welcome Party 2025",
      description:
        "A warm welcome to all first-year students! The seniors have planned a spectacular evening with games, DJ night, photo booth, and delicious food. Come dressed in your best college wear. There will be fun competitions and lucky draw prizes for the freshers.",
      category: "social",
      date: future(5),
      venue: "Student Activity Centre",
      organizer: organizers[3]._id,
      imageURL: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800",
      maxCapacity: 400,
      tags: ["freshers", "party", "welcome", "DJ"],
      status: "upcoming",
    },
    {
      title: "AI & Machine Learning Workshop",
      description:
        "A hands-on 8-hour workshop covering Python for ML, model training, neural networks, and real-world deployments using TensorFlow and PyTorch. Bring your own laptop. Beginner to intermediate level. Limited to 60 participants for personalized attention.",
      category: "tech",
      date: future(10),
      venue: "Computer Lab 3, IT Department",
      organizer: organizers[4]._id,
      imageURL: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800",
      maxCapacity: 60,
      tags: ["AI", "machine learning", "Python", "workshop"],
      status: "upcoming",
    },
    {
      title: "Yoga & Mental Wellness Day",
      description:
        "Join us for a relaxing morning of yoga, meditation, and wellness talks by certified instructors. Aimed at reducing exam stress and promoting mental health awareness. Free refreshments afterwards. Yoga mats provided — just bring yourself!",
      category: "social",
      date: future(8),
      venue: "Campus Garden & Amphitheatre",
      organizer: organizers[3]._id,
      imageURL: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800",
      maxCapacity: 150,
      tags: ["wellness", "yoga", "mental health", "meditation"],
      status: "upcoming",
    },
    {
      title: "Entrepreneurship Summit & Startup Pitch",
      description:
        "Pitch your startup idea to a panel of angel investors and venture capitalists! Top 3 pitches win seed funding of ₹50,000 each. The summit also features talks from successful alumni entrepreneurs, networking sessions, and a startup exhibition fair.",
      category: "academic",
      date: future(30),
      venue: "Seminar Hall, Management Block",
      organizer: organizers[1]._id,
      imageURL: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800",
      maxCapacity: 250,
      tags: ["startup", "entrepreneurship", "pitch", "funding"],
      status: "upcoming",
    },
    {
      title: "Art & Photography Exhibition",
      description:
        "A curated display of student artwork, digital photography, and installations. Over 80 works from 50 students across the arts and engineering streams. Prizes in 3 categories: Traditional Art, Digital Art, and Photography. Public voting decides winners!",
      category: "cultural",
      date: future(12),
      venue: "Gallery Hall, Arts Block",
      organizer: organizers[2]._id,
      imageURL: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800",
      maxCapacity: 300,
      tags: ["art", "photography", "exhibition", "creative"],
      status: "upcoming",
    },
    {
      title: "5K Campus Marathon — Run for Education",
      description:
        "Lace up your shoes for the annual 5K marathon raising funds for underprivileged student scholarships. Open to students, faculty, and their families. Finisher medals for everyone. Top 3 winners get trophies and gift vouchers. Registration closes 2 days before the event.",
      category: "sports",
      date: future(20),
      venue: "Starting Point: Main Gate, Campus Road Circuit",
      organizer: organizers[4]._id,
      imageURL: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800",
      maxCapacity: 800,
      tags: ["marathon", "run", "charity", "fitness"],
      status: "upcoming",
    },
  ];
};

module.exports = { seedData, buildEvents };
