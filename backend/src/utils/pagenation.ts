import { SortOrder } from "mongoose";

const pagenation = (options: {
  sortBy?: string;
  sortOrder?: string;
  limit?: number;
  page?: number;
}) => {
  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 10;
  const skip = (page - 1) * limit;
  const sortBy = options.sortBy || "createdAt";
  const sortOrder: SortOrder = options.sortOrder === "asc" ? 1 : -1;

  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
};

export default pagenation;