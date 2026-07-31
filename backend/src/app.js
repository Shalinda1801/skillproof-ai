import cors from "cors";
import express from "express";
import morgan from "morgan";

import { env } from "./config/env.js";

import aiRoutes from "./routes/ai.routes.js";
import authRoutes from "./routes/auth.routes.js";
import certificateRoutes from "./routes/certificate.routes.js";
import challengeRoutes from "./routes/challenge.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import skillRoutes from "./routes/skill.routes.js";
import submissionRoutes from "./routes/submission.routes.js";

import {
  errorHandler,
  notFound,
} from "./middlewares/error.middleware.js";

const app = express();

/*
  Hide the Express framework name from response headers.
  This is a small production security improvement.
*/
app.disable("x-powered-by");

/*
  Render places the application behind a reverse proxy.
  This allows Express to correctly understand secure HTTPS requests.
*/
app.set("trust proxy", 1);

/*
  CLIENT_URL can contain one frontend URL or several URLs separated
  by commas.

  Local example:
  CLIENT_URL=http://localhost:5173

  Deployment example:
  CLIENT_URL=https://skillproof-ai.vercel.app

  Multiple URLs:
  CLIENT_URL=http://localhost:5173,https://skillproof-ai.vercel.app
*/
const configuredOrigins = String(
  env.clientUrl ||
    process.env.CLIENT_URL ||
    "http://localhost:5173"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = new Set(configuredOrigins);

/*
  Keep the local frontend available while developing.
*/
if (env.nodeEnv === "development") {
  allowedOrigins.add("http://localhost:5173");
  allowedOrigins.add("http://127.0.0.1:5173");
}

app.use(
  cors({
    origin(origin, callback) {
      /*
        Requests without an Origin include Postman, server-to-server
        requests, and some health checks.
      */
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.has(origin)) {
        return callback(null, true);
      }

      console.warn(`Blocked by CORS: ${origin}`);

      return callback(null, false);
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

/*
  Limit incoming JSON size to reduce unnecessarily large requests.
*/
app.use(
  express.json({
    limit: "10kb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10kb",
  })
);

/*
  Show API request logs while developing locally.
*/
if (env.nodeEnv === "development") {
  app.use(morgan("dev"));
}

/*
  Opening the backend root URL will show this response.
*/
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    name: "SkillProof AI API",
    message: "SkillProof AI backend is online.",
    environment: env.nodeEnv,
  });
});

/*
  Render can use this route to check whether the backend is running.
*/
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SkillProof AI backend is running.",
    timestamp: new Date().toISOString(),
  });
});

/*
  Application routes
*/
app.use("/api/auth", authRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/challenges", challengeRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/payments", paymentRoutes);

/*
  These must remain after all application routes.
*/
app.use(notFound);
app.use(errorHandler);

export default app;