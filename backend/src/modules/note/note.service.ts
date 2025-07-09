import AppError from "../../error/appError";
import User from "../user/user.model";
import { INote } from "./node.interface";
import Note from "./note.model";

const createNode = async (id: string, payload: INote) => {
  const user = await User.findById(id);
  if (!user) throw new AppError(404, "User not found");
  const result = await Note.create({
    ...payload,
    user: user._id,
  });
  return result;
};

const getNotes = async (id: string, params: any) => {
  const user = await User.findById(id);
  if (!user) throw new AppError(404, "User not found");

  const result = await Note.find({
    user: id,
    $or: [
      { title: { $regex: params.searchTerm, $options: "i" } },
      { content: { $regex: params.searchTerm, $options: "i" } },
    ],
  }).populate([
    { path: "category", select: "name" },
    { path: "user", select:[ "email","name"] },
  ]);
  return result;
};

export const noteService = {
  createNode,
  getNotes,
};
