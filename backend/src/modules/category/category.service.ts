import AppError from "../../error/appError";
import User from "../user/user.model";
import { ICategory } from "./category.interface";
import Category from "./category.model";

const createCategory = async (id: string, payload: Partial<ICategory>) => {
  const user = await User.findById(id);
  if (!user) throw new AppError(401, "User not found");

  const result = (
    await Category.create({ ...payload, user: user._id })
  ).populate("user");
  return result;
};

const getCategories = async (id: string) => {
  const user = await User.findById(id);
  if (!user) throw new AppError(401, "User not found");

  const result = await Category.find({ user: user._id });
  return result;
};

const updateCategory = async (
  userid: string,
  id: string,
  payload: Partial<ICategory>
) => {
  const user = await User.findById(userid);
  if (!user) throw new AppError(401, "User not found");

  const result = await Category.findByIdAndUpdate(id, payload, { new: true });
  if (!result) throw new AppError(404, "Category not found");
  return result;
};

const deletedCategory = async (userid: string, id: string) => {
  const user = await User.findById(userid);
  if (!user) throw new AppError(401, "User not found");

  const result = await Category.findByIdAndDelete(id);
  if (!result) throw new AppError(404, "Category not found");
  return result;
};

export const categoryService = {
  createCategory,
  getCategories,
  updateCategory,
  deletedCategory,
};
