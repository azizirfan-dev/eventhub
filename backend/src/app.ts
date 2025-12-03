import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import { corsOptions } from "./config/cors";
import authRoutes from "./modules/auth/auth.route";
import userRoutes from "./modules/users/user.route";
import eventRoutes from "./modules/events/event.route";
import transactionRoutes from "./modules/transactions/transaction.route";
import reviewRoutes from "./modules/reviews/review.route";
import dashboardRoutes from "./modules/dashboard/dashboard.route";
import { errorHandler } from "./middlewares/error.middleware";
import { initTransactionJobs } from "./jobs/transaction.jobs";

const app = express();

// Core Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security & Monitoring
app.use(helmet());
app.use(morgan("dev"));

// CORS
app.use(cors(corsOptions));

// Routes
app.get("/", (req, res) => res.json({ message: "EventHub API running..." }));
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/events", eventRoutes);
app.use("/transactions", transactionRoutes);
app.use("/reviews", reviewRoutes);
app.use("/dashboard", dashboardRoutes);

// Error Handler
app.use(errorHandler);

// Cron
if (process.env.NODE_CRON === "true") {
  initTransactionJobs();
}

export default app;
