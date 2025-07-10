"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Folder, Loader2, Pen, Trash2 } from "lucide-react";
import Link from "next/link";

interface Category {
  _id: string;
  name: string;
}

interface CustomSession {
  accessToken?: string;
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const { data: sessionData } = useSession();
  const session = sessionData as CustomSession | null;

  useEffect(() => {
    const getAllCategories = async () => {
      if (!session?.accessToken) {
        console.log("You must be logged in to view categories");
        return;
      }

      setLoading(true);

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/category/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch categories");
        }

        setCategories(data.data || []);
        toast.success(data.message || "Categories fetched successfully");
      } catch (error: unknown) {
        const err = error as Error;
        console.error("Error fetching categories:", err.message);
        toast.error(err.message || "Failed to fetch categories");
      } finally {
        setLoading(false);
      }
    };

    getAllCategories();
  }, [session?.accessToken]);

  const handleDelete = async (categoryId: string) => {
    if (!session?.accessToken) {
      console.log("You must be logged in to delete categories");
      return;
    }

    if (!confirm("Are you sure you want to delete this category?")) {
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/category/${categoryId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to delete category");
      }

      setCategories(categories.filter(cat => cat._id !== categoryId));
      toast.success(data.message || "Category deleted successfully");
    } catch (error: unknown) {
      const err = error as Error;
      console.error("Error deleting category:", err.message);

    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Folder className="h-8 w-8 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            All Categories
          </h1>
        </div>
        <Link 
          href="/categories/create-category"
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          <Pen className="h-4 w-4" />
          Add New
        </Link>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center gap-4 py-12">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-gray-600">Loading categories...</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
          <Folder className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No categories found
          </h3>
          <p className="mt-2 text-gray-600">
            Get started by creating a new category
          </p>
          <Link
            href="/categories/create-category"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            <Pen className="h-4 w-4" />
            Create Category
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="absolute right-4 top-4 flex gap-2">
                <Link
                  href={`/categories/edit/${cat._id}`}
                  className="rounded-full bg-blue-100 p-2 text-blue-600 hover:bg-blue-200"
                >
                  <Pen className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => handleDelete(cat._id)}
                  className="rounded-full bg-red-100 p-2 text-red-600 hover:bg-red-200"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-indigo-100 p-3 text-indigo-600">
                  <Folder className="h-5 w-5" />
                </div>
                <h2 className="truncate text-lg font-semibold text-gray-900">
                  {cat.name}
                </h2>
              </div>
              
              <p className="mt-3 truncate text-sm text-gray-500">
                ID: {cat._id}
              </p>
              
              <div className="mt-4 flex items-center justify-between">
                <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700">
                  Category
                </span>
                <Link
                  href={`/categories/${cat._id}`}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}