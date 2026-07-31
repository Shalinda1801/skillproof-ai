import express from "express";
import skillProofApp from "./src/app.js";
import { connectDB } from "./src/config/db.js";

const app = express();

let databaseConnectionPromise = null;

/*
  This route confirms that the Vercel function itself is running.
  It does not wait for MongoDB.
*/
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SkillProof AI backend is running on Vercel.",
    timestamp: new Date().toISOString(),
  });
});

/*
  Vercel is serverless, so server.js is not used to keep a permanent
  server running. This middleware connects to MongoDB when a function
  instance receives its first database request.

  The promise is reused while that function instance remains active.
*/
app.use(async (req, res, next) => {
  try {
    if (!databaseConnectionPromise) {
      databaseConnectionPromise = connectDB();
    }

    await databaseConnectionPromise;
    next();
  } catch (error) {
    console.error("MongoDB connection failed on Vercel:", error.message);

    databaseConnectionPromise = null;

    res.status(503).json({
      success: false,
      message: "The database service is temporarily unavailable.",
    });
  }
});

/*
  Forward all remaining requests to the existing SkillProof Express app.
*/
app.use(skillProofApp);

export default app;