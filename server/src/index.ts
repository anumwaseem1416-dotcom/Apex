import "dotenv/config";

import express from "express";
import cors from "cors";
import path from "path";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/auth";
import customerRoutes from "./routes/customers";
import productRoutes from "./routes/products";
import saleRoutes from "./routes/sales";
import creditRoutes from "./routes/credits";
import expenseRoutes from "./routes/expenses";
import dashboardRoutes from "./routes/dashboard";
import adminRoutes from "./routes/admin";
import { startReminderCron } from "./services/reminderService";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../../dist")));

// API Routes
app.get("/api/health", async (_req, res) => {
  try {
    // Verify DB connectivity without exposing details
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true, db: true });
  } catch {
    res.status(500).json({ ok: false, db: false });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/products", productRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/credits", creditRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin", adminRoutes);

// Serve React app for all non-API routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../dist/index.html"));
});

// Start reminder cron job
startReminderCron();

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { prisma };
