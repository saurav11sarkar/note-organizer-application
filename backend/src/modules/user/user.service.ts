import { IUser } from "./user.interface";
import bcrypt from "bcryptjs";
import User from "./user.model";
import AppError from "../../error/appError";
import jwt from "jsonwebtoken";
import config from "../../config";

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

  return { accessToken, refreshToken };
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

  const tokens = generateTokens(user);
  return {
    ...tokens,
    user,
  };
};

const login = async (
  payload: Pick<IUser, "email" | "password">
): Promise<AuthTokens> => {
  const user = await User.findOne({ email: payload.email });
  if (!user) {
    throw new AppError(404, "User not found");
  }

  const isPasswordValid = await bcrypt.compare(payload.password, user.password);
  if (!isPasswordValid) {
    throw new AppError(401, "Invalid credentials");
  }
  const tokens = generateTokens(user);

  return { ...tokens, user };
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
        { id: user._id, email: user.email, role: user.role },
        config.JWT_SECRET,
        { algorithm: "HS256", expiresIn: "1d" }
      ),
    };
  } catch (error) {
    throw new AppError(401, "Invalid refresh token");
  }
};

export const userService = {
  register,
  login,
  refreshToken,
};
