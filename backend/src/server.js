require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/database");

const PORT = process.env.PORT || 8000;

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err.message);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err.message);
  server.close(() => process.exit(1));
});

process.on("SIGTERM", () => {
  console.log("⚠️  SIGTERM — shutting down gracefully");
  server.close(() => process.exit(0));
});

const startServer = async () => {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log("\n════════════════════════════════════════════════");
    console.log("  🎓  CAMPUS EVENT BOARD — BACKEND API");
    console.log("════════════════════════════════════════════════");
    console.log(`  🚀  Server   : http://localhost:${PORT}`);
    console.log(`  🌍  Env      : ${process.env.NODE_ENV || "development"}`);
    console.log(`  🔗  API Base : http://localhost:${PORT}/api`);
    console.log(`  ❤️   Health   : http://localhost:${PORT}/health`);
    console.log("════════════════════════════════════════════════\n");
  });

  global.server = server;
};

startServer();
