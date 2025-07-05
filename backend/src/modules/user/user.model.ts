import mongoose from "mongoose";
import { IUser } from "./user.interface";
import bcrypt from "bcryptjs";
import config from "../../config";

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Please provide a username"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    method: {
      type: String,
      enum: ["credentials", "github", "google"],
      default: "credentials",
    },
    image: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1640960543409-dbe56ccc30e2?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(
      this.password,
      Number(config.SALT_ROUNDS)
    );
  }
  next();
});

userSchema.post("save", function (doc, next) {
  doc.password = "**";
  next();
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
