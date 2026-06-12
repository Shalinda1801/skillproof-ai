import express from "express";
import cors from "cors";
import morgan from "morgan";
import { env } from "./config/env.js";
import authRoutes from "./routes/auth.routes.js";
import skillRoutes from "./routes/skill.routes.js";
import challengeRoutes from "./routes/challenge.routes.js";
import submissionRoutes from "./routes/submission.routes.js";
import { errorHandler, notFound } from "./middlewares/error.middleware.js";

const app = express();

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

if (env.nodeEnv === "development") {
  app.use(morgan("dev"));
}

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SkillProof AI backend is running.",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/challenges", challengeRoutes);
app.use("/api/submissions", submissionRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;