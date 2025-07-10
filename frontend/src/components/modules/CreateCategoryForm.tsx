"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface CustomSession {
  accessToken?: string;
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function CreateCategoryForm() {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const session = sessionData as CustomSession | null;

  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // console.log({ session });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (!session?.accessToken || !session.user) {
        throw new Error("You must be logged in to create a category");
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/category`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to create category");
      }

      toast.success(data.message || "Category created successfully");
      router.push("/categories");
    } catch (error: unknown) {
      const err = error as Error;
      console.error("Error creating category:", err);
      toast.error(err.message || "Failed to create category");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        ➕ Create New Category
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-md p-6 space-y-6"
      >
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Category Name
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Personal, Work"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={isSaving || !session}
          className={`w-full px-6 py-2 text-white font-semibold rounded-lg shadow-md bg-indigo-600 hover:bg-indigo-700 transition ${
            isSaving || !session ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {isSaving ? "Saving..." : "Save Category"}
        </button>
      </form>
    </div>
  );
}
