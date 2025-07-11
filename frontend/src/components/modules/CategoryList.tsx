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
      if (!session?.accessToken) return;

      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/category/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.accessToken}`,
          },
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch categories");
        }

        setCategories(data.data || []);
        toast.success(data.message || "Categories fetched successfully");
      } catch (error: unknown) {
        const err = error as Error;
        toast.error(err.message || "Failed to fetch categories");
      } finally {
        setLoading(false);
      }
    };

    getAllCategories();
  }, [session?.accessToken]);

  const handleDelete = async (categoryId: string) => {
    if (!session?.accessToken) return;
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/category/${categoryId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to delete category");
      }

      setCategories(categories.filter(cat => cat._id !== categoryId));
      toast.success(data.message || "Category deleted successfully");
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || "Error deleting category");
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Folder className="h-8 w-8 text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">All Categories</h1>
        </div>
        <Link
          href="/categories/create-category"
          className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700 transition"
        >
          <Pen className="h-4 w-4" />
          Add Category
        </Link>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex flex-col items-center justify-center gap-4 py-20">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-sm text-gray-500">Loading categories...</p>
        </div>
      ) : categories.length === 0 ? (
        // No Categories
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center shadow-sm">
          <Folder className="mx-auto h-10 w-10 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No categories found</h3>
          <p className="mt-1 text-sm text-gray-500">Start by creating a new category</p>
          <Link
            href="/categories/create-category"
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition"
          >
            <Pen className="h-4 w-4" />
            Create Category
          </Link>
        </div>
      ) : (
        // Category Cards
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="group relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
            >
              {/* Action Buttons */}
              <div className="absolute right-4 top-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Link
                  href={`/categories/edit/${cat._id}`}
                  className="rounded-full bg-blue-100 p-2 text-blue-600 hover:bg-blue-200 transition"
                >
                  <Pen className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => handleDelete(cat._id)}
                  className="rounded-full bg-red-100 p-2 text-red-600 hover:bg-red-200 transition"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Card Content */}
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-indigo-100 p-3 text-indigo-600">
                  <Folder className="h-5 w-5" />
                </div>
                <h2 className="truncate text-lg font-semibold text-gray-800">{cat.name}</h2>
              </div>

              <p className="mt-2 truncate text-sm text-gray-500">ID: {cat._id}</p>

              <div className="mt-4 flex items-center justify-between">
                <span className="rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700">
                  Category
                </span>
                <Link
                  href={`/categories/${cat._id}`}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                >
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
