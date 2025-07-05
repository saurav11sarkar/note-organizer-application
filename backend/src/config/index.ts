import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

export default {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/ecommerce",
  JWT_SECRET: process.env.JWT_SECRET || "secret",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1h",
  SALT_ROUNDS: process.env.SALT_ROUNDS || 10,
};
