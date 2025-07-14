import { NextFunction, Request, Response } from "express";
import AppError from "../error/appError";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import User from "../modules/user/user.model";

interface DecodedToken extends JwtPayload {
  id: string;
  email: string;
  role: string;
  name: string;
  image?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
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
        if (config.NODE_ENV === "development") {
          console.error("Token verification failed:", error);
        }
        throw new AppError(401, "Unauthorized: Invalid token");
      }

      const { email, role } = decoded;
      const user = await User.findOne({ email }).select("-password");
      if (!user) {
        throw new AppError(401, "Unauthorized: User not found");
      }

      if (requiredRoles.length && !requiredRoles.includes(role)) {
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

// import { NextFunction, Request, Response } from "express";
// import AppError from "../error/appError";
// import jwt, { JwtPayload } from "jsonwebtoken";
// import config from "../config";
// import User from "../modules/user/user.model";

// interface DecodedToken extends JwtPayload {
//   id: string;
//   email: string;
//   role: string;
//   name: string;
//   image?: string;
// }

// declare global {
//   namespace Express {
//     interface Request {
//       user?: any | DecodedToken;
//     }
//   }
// }

// const authMiddleware = (...requiredRoles: string[]) => {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const authHeader = req.headers?.authorization;
//       const token = authHeader?.startsWith("Bearer ")
//         ? authHeader.split(" ")[1]
//         : req.cookies?.refreshToken;

//       if (!token) {
//         throw new AppError(401, "Unauthorized: Token missing");
//       }

//       let decoded: DecodedToken;
//       try {
//         decoded = jwt.verify(
//           token,
//           config.JWT_SECRET as string
//         ) as DecodedToken;
//       } catch (error) {
//         if (config.NODE_ENV === "development") {
//           console.error("Token verification failed:", error);
//         }
//         throw new AppError(401, "Unauthorized: Invalid token");
//       }

//       // Always fetch fresh user data from database
//       const user = await User.findById(decoded.id).select("-password");
//       if (!user) {
//         throw new AppError(401, "Unauthorized: User not found");
//       }

//       if (requiredRoles.length && !requiredRoles.includes(user.role)) {
//         throw new AppError(403, "Forbidden: Role not authorized");
//       }

//       // Update decoded data with fresh user data
//       req.user = {
//         id: user._id.toString(),
//         email: user.email,
//         role: user.role,
//         name: user.name,
//         image: user.image,
//       };

//       next();
//     } catch (error) {
//       next(error);
//     }
//   };
// };

// export default authMiddleware;
