import { Response } from "express";

interface ResponseData<T> {
  success: boolean;
  message: string;
  data?: T;
  meta?: any;
}

const sendResponse = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T,
  meta?: any
): void => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    meta,
  } as ResponseData<T>);
};

export default sendResponse;