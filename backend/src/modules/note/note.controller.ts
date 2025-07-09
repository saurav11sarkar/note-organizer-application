import catchAsycn from "../../utils/catchAsycn";
import sendresponse from "../../utils/sendResponse";
import { noteService } from "./note.service";

const createNode = catchAsycn(async (req, res) => {
  const result = await noteService.createNode(req.user?.id, req.body);
  sendresponse(res, 201, "Node created successfully", result);
});

const getNotes = catchAsycn(async (req, res) => {
  const result = await noteService.getNotes(req.user?.id,req.query);
  sendresponse(res, 200, "Notes fetched successfully", result);
});

export const noteController = {
  createNode,
  getNotes,
};
