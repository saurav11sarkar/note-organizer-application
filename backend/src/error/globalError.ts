import { NextFunction, Request, Response } from "express";
import config from "../config";

const globalError = (err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong";

    res.status(statusCode).json({
        status: "error",
        message: message,
        error:err,
        stack:config.NODE_ENV === "development" ? err.stack : "stack show only developer",
    })
}

export default globalError;