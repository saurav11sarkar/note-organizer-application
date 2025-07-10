import AppError from "../../error/appError";
import pagenation from "../../utils/pagenation";
import User from "../user/user.model";
import { INote } from "./node.interface";
import Note from "./note.model";
import { SortOrder } from "mongoose";

const createNode = async (id: string, payload: INote) => {
  const user = await User.findById(id);
  if (!user) throw new AppError(404, "User not found");
  const result = await Note.create({
    ...payload,
    user: user._id,
  });
  return result;
};

const getNotes = async (id: string, params: any, options: any) => {
  const user = await User.findById(id);
  if (!user) throw new AppError(404, "User not found");

  const { searchTerm, ...specifiedFields } = params;
  const { page, limit, skip, sortBy, sortOrder } = pagenation(options);

  const filters: any[] = [];

  if (searchTerm) {
    const searchableFields = ["title", "content"];
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

  const result = await Note.find({
    user: id,
    ...whereCondition,
  })
    .populate([
      { path: "category", select: "name" },
      { path: "user", select: ["email", "name"] },
    ])
    .sort({ [sortBy]: sortOrder as SortOrder })
    .skip(skip)
    .limit(limit);

  if (!result) throw new AppError(404, "Note not found");

  const total = await Note.countDocuments({
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

const getNoteById = async (userId: string, noteId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, "User not found");
  const result = await Note.findOne({
    _id: noteId,
    user: user._id,
  }).populate([
    { path: "category", select: "name" },
    { path: "user", select: ["email", "name"] },
  ]);

  if (!result) throw new AppError(404, "Note not found");
  return result;
};

const deletedById = async (userId: string, noteId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, "User not found");
  const result = await Note.findOneAndDelete({
    _id: noteId,
    user: user._id,
  });
  if (!result) throw new AppError(404, "Note not found");
  return result;
};

const updatedById = async (
  userId: string,
  noteId: string,
  payload: Partial<INote>
) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, "User not found");
  const result = await Note.findOneAndUpdate(
    { _id: noteId, user: user._id },
    payload,
    { new: true }
  );

  if (!result) throw new AppError(404, "Note not found");
  return result;
};

export const noteService = {
  createNode,
  getNotes,
  getNoteById,
  deletedById,
  updatedById,
};
