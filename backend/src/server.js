import app from "./app.js";
import { connectDB } from "./config/db.js";

let dbConnected = false;

const ensureDBConnection = async () => {
  if (dbConnected) {
    return;
  }

  await connectDB();
  dbConnected = true;
};

const handler = async (req, res) => {
  try {
    await ensureDBConnection();
    return app(req, res);
  } catch (error) {
    console.error("Database connection failed:");
    console.error(error);

    return res.status(500).json({
      message: "Database connection failed",
    });
  }
};

export default handler;