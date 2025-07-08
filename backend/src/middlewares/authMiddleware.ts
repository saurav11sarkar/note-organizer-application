import { NextFunction, Request, Response } from "express";
import AppError from "../error/appError";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import User from "../modules/user/user.model";

interface DecodedToken extends JwtPayload {
  id: string;
  email: string;
  role: string;
}

const authMiddleware = (...requiredRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers?.authorization;
      const token = authHeader?.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : req.cookies?.refreshToken;

      if (!token) {
        throw new AppError(401, "Unauthorized: Token missing");
      }

      let decoded: DecodedToken;
      try {
        decoded = jwt.verify(
          token,
          config.JWT_SECRET as string
        ) as DecodedToken;
      } catch (error) {
        throw new AppError(401, "Unauthorized: Invalid token");
      }

      const { email, role } = decoded;
      const user = await User.findOne({ email }).select("-password");
      if (!user) {
        throw new AppError(401, "Unauthorized: User not found");
      }

      if (!requiredRoles.includes(role)) {
        throw new AppError(403, "Forbidden: Role not authorized");
      }

      req.user = decoded;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default authMiddleware;
