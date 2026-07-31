import app from "../src/app.js";
import { connectDB } from "../src/config/db.js";

let databaseConnectionPromise = null;

const ensureDatabaseConnection = async () => {
  if (!databaseConnectionPromise) {
    databaseConnectionPromise = connectDB().catch((error) => {
      databaseConnectionPromise = null;
      throw error;
    });
  }

  return databaseConnectionPromise;
};

export default async function handler(req, res) {
  /*
    The health endpoint does not need to wait for MongoDB.
  */
  if (
    req.url === "/api/health" ||
    req.url === "/api/health/"
  ) {
    return app(req, res);
  }

  try {
    await ensureDatabaseConnection();
    return app(req, res);
  } catch (error) {
    console.error(
      "MongoDB connection failed on Vercel:",
      error.message
    );

    return res.status(503).json({
      success: false,
      message: "Database service is temporarily unavailable.",
    });
  }
}