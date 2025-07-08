import catchAsycn from "../../utils/catchAsycn";
import sendresponse from "../../utils/sendResponse";
import { categoryService } from "./category.service";

const createCategory = catchAsycn(async (req, res) => {
  const result = await categoryService.createCategory(req.user?.id, req.body);
  sendresponse(res, 201, "create category successfully", result);
});

const getCategories = catchAsycn(async (req, res) => {
  const result = await categoryService.getCategories(req.user?.id);
  sendresponse(res, 200, "get categories successfully", result);
});

const updateCategory = catchAsycn(async (req, res) => {
  const result = await categoryService.updateCategory(
    req.user?.id,
    req.params.id,
    req.body
  );
  sendresponse(res, 200, "update category successfully", result);
});

const deletedCategory = catchAsycn(async (req, res) => {
  const result = await categoryService.deletedCategory(
    req.user?.id,
    req.params.id
  );
  sendresponse(res, 200, "deleted category successfully", result);
});

export const categoryController = {
  createCategory,
  getCategories,
  updateCategory,
  deletedCategory,
};
