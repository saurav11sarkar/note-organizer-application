import AppError from "../../error/appError";
import catchAsycn from "../../utils/catchAsycn";
import pick from "../../utils/pick";
import sendresponse from "../../utils/sendResponse";
import { noteService } from "./note.service";

const createNode = catchAsycn(async (req, res) => {
  const file = req.file as Express.Multer.File;

  const fromData = JSON.parse(req.body.data);
  if (!fromData) throw new AppError(400, "Invalid data");

  const result = await noteService.createNode(req.user?.id, fromData, file);
  sendresponse(res, 201, "Node created successfully", result);
});

const getNotes = catchAsycn(async (req, res) => {
  const filters = pick(req.query, ["title", "content", "searchTerm"]);
  const options = pick(req.query, ["sortBy", "sortOrder", "limit", "page"]);
  const result = await noteService.getNotes(req.user?.id, filters, options);
  sendresponse(
    res,
    200,
    "Notes fetched successfully",
    result.data,
    result.meta
  );
});

const getNoteById = catchAsycn(async (req, res) => {
  const result = await noteService.getNoteById(req.user?.id, req.params.id);
  sendresponse(res, 200, "Node fetched successfully", result);
});

const deletedById = catchAsycn(async (req, res) => {
  const result = await noteService.deletedById(req.user?.id, req.params.id);
  sendresponse(res, 200, "Node deleted successfully", result);
});

const updatedById = catchAsycn(async (req, res) => {
  const file = req.file as Express.Multer.File;

  const fromData = JSON.parse(req.body.data);
  if (!fromData) throw new AppError(400, "Invalid data");

  const result = await noteService.updatedById(
    req.user?.id,
    req.params.id,
    fromData,
    file
  );
  sendresponse(res, 200, "Note Updeted Successfully", result);
});

export const noteController = {
  createNode,
  getNotes,
  getNoteById,
  deletedById,
  updatedById,
};
