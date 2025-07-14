import { SortOrder } from "mongoose";
import AppError from "../../error/appError";
import pagenation from "../../utils/pagenation";
import User from "../user/user.model";
import { ICategory } from "./category.interface";
import Category from "./category.model";
import mongoose from 'mongoose';
import Note from "../note/note.model";

const createCategory = async (id: string, payload: Partial<ICategory>) => {
  const user = await User.findById(id);
  if (!user) throw new AppError(401, "User not found");

  if (!payload.name) throw new AppError(400, "Category name is required");

  const result = await (
    await Category.create({ ...payload, user: user._id })
  ).populate({
    path: "user",
    select: "name email",
  });
  return result;
};

const getCategories = async (id: string, params: any, options: any) => {
  const user = await User.findById(id);
  if (!user) throw new AppError(401, "User not found");

  const { searchTerm, ...specifiedFields } = params;
  const { page, limit, skip, sortBy, sortOrder } = pagenation(options);

  const filters: any[] = [];

  if (searchTerm) {
    const searchableFields = ["name"];
    filters.push({
      $or: searchableFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: "i" },
      })),
    });
  }

  if (Object.keys(specifiedFields).length > 0) {
    filters.push({
      $and: Object.entries(specifiedFields).map(([field, value]) => ({
        [field]: { $eq: value },
      })),
    });
  }

  const whereCondition = filters.length > 0 ? { $and: filters } : {};

  const result = await Category.find({
    user: id,
    ...whereCondition,
  })
    .populate({
      path: "user",
      select: "name email",
    })
    .sort({ [sortBy]: sortOrder as SortOrder })
    .skip(skip)
    .limit(limit);

  if (!result) throw new AppError(404, "Category not found");
  const total = await Category.countDocuments({
    user: id,
    ...whereCondition,
  });

  return {
    data: result,
    meta: {
      page,
      limit,
      total,
    },
  };
};

const getSingleCategory = async (userId: string, categoryId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(401, "User not found");

  const category = await Category.findOne({ _id: categoryId, user: userId });
  if (!category) throw new AppError(404, "Category not found");

  return category;
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

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const result = await Category.findOneAndDelete({
      _id: id,
      user: userId,
    }).session(session);

    if (!result) throw new AppError(404, "Category not found");

    await Note.deleteMany({ category: id }).session(session);

    await session.commitTransaction();
    session.endSession();
    return result;

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error; // Re-throw to allow error handling in calling function
  }
};


export const categoryService = {
  createCategory,
  getCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
