import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser"; // Fixed typo
import morgan from "morgan";
import helmet from "helmet";
import globalError from "./error/globalError";
import router from "./routers/routes";

const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Health check route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "server is running" });
});

// API routes
app.use("/api", router);

// 404 handler
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global error handler
app.use(globalError);

export default app;