import AppError from "../../error/appError";
import User from "../user/user.model";
import { ICategory } from "./category.interface";
// import { ICategory } from "./category.model";
import Category from "./category.model";

const createCategory = async (id: string, payload: Partial<ICategory>) => {
  const user = await User.findById(id);
  if (!user) throw new AppError(401, "User not found");

  if (!payload.name) throw new AppError(400, "Category name is required");

  const result = await (await Category.create({ ...payload, user: user._id })).populate({
    path: "user",
    select: "name email",
  });
  return result;
};

const getCategories = async (id: string) => {
  const user = await User.findById(id);
  if (!user) throw new AppError(401, "User not found");

  const result = await Category.find({ user: user._id }).populate({
    path: "user",
    select: "name email",
  });
  return result;
};

const updateCategory = async (
  userId: string,
  id: string,
  payload: Partial<ICategory>
) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(401, "User not found");

  const result = await Category.findOneAndUpdate(
    { _id: id, user: userId },
    payload,
    { new: true }
  ).populate({
    path: "user",
    select: "name email",
  });
  if (!result) throw new AppError(404, "Category not found");
  return result;
};

const deleteCategory = async (userId: string, id: string) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(401, "User not found");

  const result = await Category.findOneAndDelete({ _id: id, user: userId });
  if (!result) throw new AppError(404, "Category not found");
  return result;
};

export const categoryService = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};