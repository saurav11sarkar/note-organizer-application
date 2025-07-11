import AppError from "../../error/appError";
import pagenation from "../../utils/pagenation";
import uploadCloudinary from "../../utils/uploadCloudnary";
import User from "../user/user.model";
import { INote } from "./node.interface";
import Note from "./note.model";
import { SortOrder } from "mongoose";

const createNode = async (
  id: string,
  payload: Partial<INote>,
  file?: Express.Multer.File
) => {
  const user = await User.findById(id);
  if (!user) throw new AppError(404, "User not found");

  const result = new Note({
    ...payload,
    user: user._id,
  });

  if (file) {
    const img = await uploadCloudinary(file);
    result.image = img.url;
  }
  await result.save();
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
  payload: Partial<INote>,
  file?: Express.Multer.File
) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, "User not found");

  const note = await Note.findOne({ _id: noteId, user: user._id });
  if (!note) throw new AppError(404, "Note not found");

  // Update text fields
  Object.assign(note, payload);

  // Update image if provided
  if (file) {
    const img = await uploadCloudinary(file);
    note.image = img.url;
  }

  await note.save();
  return note;
};

export const noteService = {
  createNode,
  getNotes,
  getNoteById,
  deletedById,
  updatedById,
};
