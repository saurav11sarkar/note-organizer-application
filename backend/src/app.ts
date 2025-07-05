import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookeParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import globalError from "./error/globalError";
import router from "./routers/routes";

const app = express();

app.use(cors({origin:"http://localhost:3000",credentials: true}));
app.use(helmet());
app.use(cookeParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// router
app.use("/api", router);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "server is running" });
});

// error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ success: false, message: "not found" });
});

app.use(globalError);

export default app;
