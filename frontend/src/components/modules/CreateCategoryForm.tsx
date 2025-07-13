"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { FiLoader } from "react-icons/fi";

interface CustomSession {
  accessToken?: string;
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

interface CategoryResponse {
  success: boolean;
  message?: string;
  data?: {
    _id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
}

export default function CategoryForm({ isEdit = false }) {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.id as string;
  const { data: sessionData } = useSession();
  const session = sessionData as CustomSession | null;

  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(isEdit);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch category data for edit mode
  useEffect(() => {
    const fetchCategory = async () => {
      if (!isEdit || !session?.accessToken) return;

      try {
        setIsLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/category/${categoryId}`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(
            errorData.message || `Failed to fetch category (HTTP ${res.status})`
          );
        }

        const data: CategoryResponse = await res.json();

        if (!data.success || !data.data) {
          throw new Error(data.message || "Category not found");
        }

        setName(data.data.name);
      } catch (error: any) {
        console.error("Error fetching category:", error);
        toast.error(error.message || "Failed to load category data");
        router.push("/categories");
      } finally {
        setIsLoading(false);
      }
    };

    if (isEdit && categoryId) {
      fetchCategory();
    }
  }, [isEdit, session?.accessToken, categoryId, router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (!session?.accessToken) {
        throw new Error("You must be logged in");
      }

      if (!name.trim()) {
        throw new Error("Category name is required");
      }

      const url = isEdit
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/category/${categoryId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/category`;

      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message || `Failed to ${isEdit ? "update" : "create"} category (HTTP ${res.status})`
        );
      }

      const data = await res.json();

      if (!data.success) {
        throw new Error(
          data.message || `Failed to ${isEdit ? "update" : "create"} category`
        );
      }

      toast.success(
        data.message || `Category ${isEdit ? "updated" : "created"} successfully`
      );
      router.push("/categories");
      router.refresh();
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error(
        error.message || `Failed to ${isEdit ? "update" : "create"} category`
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <FiLoader className="animate-spin text-4xl text-indigo-600" />
          <p className="text-gray-600">
            {isEdit ? "Loading category..." : "Preparing form..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          {isEdit ? "✏️ Edit Category" : "➕ Create New Category"}
        </h1>
        <button
          onClick={() => router.push("/categories")}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
        >
          Cancel
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-md overflow-hidden"
      >
        <div className="p-6 space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category Name
              <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter category name"
              minLength={2}
              maxLength={50}
            />
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end border-t border-gray-200">
          <button
            type="submit"
            disabled={isSaving || !session}
            className={`px-6 py-2 text-white font-semibold rounded-lg shadow-md bg-indigo-600 hover:bg-indigo-700 transition ${
              isSaving || !session ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {isSaving ? (
              <span className="flex items-center">
                <FiLoader className="animate-spin mr-2" />
                {isEdit ? "Updating..." : "Creating..."}
              </span>
            ) : isEdit ? (
              "Update Category"
            ) : (
              "Create Category"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}