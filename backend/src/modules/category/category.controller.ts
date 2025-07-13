
import catchAsync from "../../utils/catchAsycn";
import pick from "../../utils/pick";
import sendResponse from "../../utils/sendResponse";
import { categoryService } from "./category.service";


const createCategory = catchAsync(async (req, res) => {
  const result = await categoryService.createCategory(req.user?.id, req.body);
  sendResponse(res, 201, "Category created successfully", result);
});

const getCategories = catchAsync(async (req, res) => {
  const filters = pick(req.query, ["name", "searchTerm"]);
  const options = pick(req.query, ["sortBy", "sortOrder", "limit", "page"]);
  const result = await categoryService.getCategories(req.user?.id,filters,options);
  sendResponse(res, 200, "Categories retrieved successfully", result.data,result.meta);
});

const getSingleCategory = catchAsync(async (req, res) => {
  const category = await categoryService.getSingleCategory(req.user?.id, req.params.id);
  sendResponse(res, 200, "Category fetched successfully", category);
});


const updateCategory = catchAsync(async (req, res) => {
  const result = await categoryService.updateCategory(
    req.user?.id,
    req.params.id,
    req.body
  );
  sendResponse(res, 200, "Category updated successfully", result);
});

const deleteCategory = catchAsync(async (req, res) => {
  const result = await categoryService.deleteCategory(
    req.user?.id,
    req.params.id
  );
  sendResponse(res, 200, "Category deleted successfully", result);
});

export const categoryController = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  getSingleCategory
};