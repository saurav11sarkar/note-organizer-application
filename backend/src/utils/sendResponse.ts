import { Response } from "express";

const sendresponse = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T,
  meta?: any
) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    meta,
  });
};

export default sendresponse;
