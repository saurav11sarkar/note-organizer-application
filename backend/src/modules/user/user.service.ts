import { IUser } from "./user.interface";
import bcrypt from "bcryptjs";
import User from "./user.model";
import AppError from "../../error/appError";
import jwt from "jsonwebtoken";
import config from "../../config";
import { profile } from "console";
import uploadCloudinary from "../../utils/uploadCloudnary";

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user?: Partial<IUser>;
}

const generateTokens = (user: IUser): AuthTokens => {
  const payload = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    image: user.image,
  };

  const accessToken = jwt.sign(payload, config.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: "1d",
  });

  const refreshToken = jwt.sign(payload, config.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: "7d",
  });

  return { accessToken, refreshToken, user: payload };
};

const register = async (payload: IUser): Promise<AuthTokens> => {
  const existingUser = await User.findOne({ email: payload.email });
  if (existingUser) {
    throw new AppError(409, "User already exists");
  }

  if (!payload.password) {
    payload.password = Math.random().toString(36).slice(-8);
  }

  payload.role =
    payload.email === "sauravsarkar.developer@gmail.com" ? "admin" : "user";

  const user = await User.create(payload);
  if (!user) {
    throw new AppError(400, "User creation failed");
  }

  return generateTokens(user);
};

// const login = async (
//   payload: Pick<IUser, "email" | "password">
// ): Promise<AuthTokens> => {
//   const user = await User.findOne({ email: payload.email }).select("+password");

//   if (!user) {
//     throw new AppError(404, "User not found");
//   }

//   if (payload.password === "SOCIAL_LOGIN") {
//     // This is a social login attempt
//     if (user.method === "credentials") {
//       throw new AppError(401, "Please login with email and password");
//     }

//     return generateTokens(user);
//   }

//   // Normal credential-based login
//   if (user.method !== "credentials") {
//     throw new AppError(401, `Please login using ${user.method}`);
//   }

//   const isPasswordValid = await bcrypt.compare(payload.password, user.password);
//   if (!isPasswordValid) {
//     throw new AppError(401, "Invalid credentials");
//   }

//   return generateTokens(user);
// };


const login = async (
  payload: Pick<IUser, "email" | "password">
): Promise<AuthTokens> => {
  const user = await User.findOne({ email: payload.email }).select("+password");

  if (!user) {
    throw new AppError(404, "User not found");
  }

  if (payload.password === "SOCIAL_LOGIN") {
    // This is a social login attempt - return fresh data
    if (user.method === "credentials") {
      throw new AppError(401, "Please login with email and password");
    }

    // Return fresh user data including any updates
    return {
      ...generateTokens(user),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
        method: user.method
      }
    };
  }

  // Normal credential-based login
  if (user.method !== "credentials") {
    throw new AppError(401, `Please login using ${user.method}`);
  }

  const isPasswordValid = await bcrypt.compare(payload.password, user.password);
  if (!isPasswordValid) {
    throw new AppError(401, "Invalid credentials");
  }

  return generateTokens(user);
};

const refreshToken = async (
  token: string
): Promise<{ accessToken: string }> => {
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as jwt.JwtPayload;
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      throw new AppError(401, "User not found");
    }

    return {
      accessToken: jwt.sign(
        {
          id: user._id,
          email: user.email,
          role: user.role,
          name: user.name,
          image: user.image,
        },
        config.JWT_SECRET,
        { algorithm: "HS256", expiresIn: "1d" }
      ),
    };
  } catch (error) {
    throw new AppError(401, "Invalid refresh token");
  }
};

const getProfile = async (id: string) => {
  const user = await User.findById(id).select("-password");
  if (!user) {
    throw new AppError(404, "User not found");
  }

  return user;
};

const updatedProfile = async (
  id: string,
  payload: Partial<IUser>,
  file?: Express.Multer.File
) => {
  const user = await User.findById(id);
  if (!user) throw new AppError(404, "User not found");

  if (payload.name) user.name = payload.name;
  if (file) {
    const img = await uploadCloudinary(file);
    user.image = img.url;
  }

  await user.save();
  return user;
};

export const userService = {
  register,
  login,
  refreshToken,
  getProfile,
  updatedProfile,
};
