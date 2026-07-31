import app from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";

const PORT = Number(process.env.PORT || env.port || 5000);

let server = null;

const startServer = async () => {
  try {
    // Connect to MongoDB before accepting requests
    await connectDB();

    server = app.listen(PORT, () => {
      console.log(
        `Server running in ${env.nodeEnv} mode on port ${PORT}`
      );
    });
  } catch (error) {
    console.error("Failed to start SkillProof AI backend:");
    console.error(error.message);

    process.exit(1);
  }
};

const shutdownServer = (signal) => {
  console.log(`${signal} received. Closing server safely...`);

  if (!server) {
    process.exit(0);
  }

  server.close(() => {
    console.log("HTTP server closed.");
    process.exit(0);
  });

  // Force shutdown if the server does not close within 10 seconds
  setTimeout(() => {
    console.error("Forced server shutdown.");
    process.exit(1);
  }, 10000).unref();
};

process.on("SIGTERM", () => {
  shutdownServer("SIGTERM");
});

process.on("SIGINT", () => {
  shutdownServer("SIGINT");
});

process.on("unhandledRejection", (error) => {
  console.error("Unhandled Promise Rejection:");
  console.error(error);

  shutdownServer("UNHANDLED_REJECTION");
});

startServer();