import http from "node:http";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { Server } from "socket.io";
import { env } from "./config/env.js";
import { analyticsRouter } from "./routes/analytics.routes.js";
import { auditRouter } from "./routes/audit.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import { bookingRouter } from "./routes/booking.routes.js";
import { customerRouter } from "./routes/customer.routes.js";
import { invoiceRouter } from "./routes/invoice.routes.js";
import { notificationRouter } from "./routes/notification.routes.js";
import { serviceRouter } from "./routes/service.routes.js";
import { uploadRouter } from "./routes/upload.routes.js";
import { userRouter } from "./routes/user.routes.js";
import { errorHandler } from "./utils/http.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.WEB_ORIGIN,
      credentials: true
    })
  );
  app.use(cookieParser());
  app.use(express.json({ limit: "1mb" }));
  app.use(rateLimit({ windowMs: 60_000, limit: 120 }));

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", service: "operations-api" });
  });

  app.use("/auth", authRouter);
  app.use("/audit-logs", auditRouter);
  app.use("/bookings", bookingRouter);
  app.use("/customers", customerRouter);
  app.use("/invoices", invoiceRouter);
  app.use("/analytics", analyticsRouter);
  app.use("/notifications", notificationRouter);
  app.use("/services", serviceRouter);
  app.use("/users", userRouter);
  app.use("/upload", uploadRouter);
  app.use(errorHandler);

  return app;
}

export function createHttpServer() {
  const app = createApp();
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: env.WEB_ORIGIN,
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    socket.on("join-user-channel", (userId: string) => {
      socket.join(`user:${userId}`);
    });
  });

  return { app, server, io };
}


