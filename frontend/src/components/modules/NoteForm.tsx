"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { FiImage, FiX, FiLoader } from "react-icons/fi";
import Image from "next/image";

interface CustomSession {
  accessToken?: string;
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

interface Category {
  _id: string;
  name: string;
}

export default function NoteForm({ isEdit = false }) {
  const router = useRouter();
  const params = useParams();
  const noteId = params.id as string;
  const { data: sessionData } = useSession();
  const session = sessionData as CustomSession | null;

  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Data state
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(isEdit);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch data for edit mode
  useEffect(() => {
    const fetchNoteAndCategories = async () => {
      if (!isEdit || !session?.accessToken) return;

      try {
        setIsLoading(true);

        // Fetch note data
        const noteRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/note/${noteId}`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );

        if (!noteRes.ok) {
          throw new Error("Failed to fetch note");
        }

        const noteData = await noteRes.json();
        console.log("Fetched note data:", noteData);

        if (!noteData || !noteData.data) {
          throw new Error("Note data is empty");
        }

        setTitle(noteData.data.title || "");
        setContent(noteData.data.content || "");
        setCategoryId(noteData.data.category?._id || "");

        if (noteData.data.image) {
          setPreviewImage(noteData.data.image);
        }

        // Fetch categories
        const catRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/category`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );

        const catData = await catRes.json();
        if (!catRes.ok || !catData.data) {
          throw new Error(catData.message || "Failed to fetch categories");
        }

        setCategories(catData.data);
      } catch (error: unknown) {
        const err = error as Error;
        console.error("Error fetching note:", err);
        toast.error(err.message || "Failed to load data");
        router.push("/notes");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNoteAndCategories();
  }, [isEdit, session?.accessToken, noteId, router]);

  // Fetch categories for both modes
  useEffect(() => {
    const fetchCategories = async () => {
      if (!session?.accessToken) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/category`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok || !data.data) {
          throw new Error(data.message || "Failed to fetch categories");
        }

        setCategories(data.data);
        // Set default category if creating new note
        if (!isEdit && data.data.length > 0 && !categoryId) {
          setCategoryId(data.data[0]._id);
        }
      } catch (error: unknown) {
        const err = error as Error;
        toast.error(err.message || "Failed to load categories");
      }
    };

    fetchCategories();
  }, [isEdit, session?.accessToken, categoryId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreviewImage(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (!session?.accessToken) {
        throw new Error("You must be logged in");
      }

      const formData = new FormData();
      formData.append(
        "data",
        JSON.stringify({
          title,
          content,
          category: categoryId,
        })
      );

      if (image) {
        formData.append("image", image);
      } else if (previewImage && !image) {
        // Keep existing image if no new image is uploaded
        formData.append("keepExistingImage", "true");
      }

      const url = isEdit
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/note/${noteId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/note`;

      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data.message || `Failed to ${isEdit ? "update" : "create"} note`
        );
      }

      toast.success(
        data.message || `Note ${isEdit ? "updated" : "created"} successfully`
      );
      router.push("/notes");
      router.refresh();
    } catch (error: unknown) {
      const err = error as Error;
      console.error("Error submitting form:", err);
      toast.error(
        err.message || `Failed to ${isEdit ? "update" : "create"} note`
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FiLoader className="animate-spin text-4xl text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          {isEdit ? "✏️ Edit Note" : "📝 Create New Note"}
        </h1>
        <button
          onClick={() => router.push("/notes")}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter note title"
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Category
                </label>
                <select
                  id="category"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                  disabled={categories.length === 0}
                >
                  {categories.length === 0 ? (
                    <option value="">Loading categories...</option>
                  ) : (
                    <>
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                {previewImage ? (
                  <div className="relative group">
                    <div className="relative h-48 w-full rounded-md overflow-hidden">
                      <Image
                        src={previewImage}
                        alt="Note preview"
                        fill
                        className="object-cover"
                        unoptimized={previewImage.startsWith("http")}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition"
                    >
                      <FiX className="text-gray-600" />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <div className="flex flex-col items-center justify-center py-8">
                      <FiImage className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">
                        Click to upload an image
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Content
            </label>
            <textarea
              id="content"
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
              placeholder="Write your note content here..."
            />
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end border-t border-gray-200">
          <button
            type="submit"
            disabled={isSaving || !session || categories.length === 0}
            className={`px-6 py-2 text-white font-semibold rounded-lg shadow-md bg-indigo-600 hover:bg-indigo-700 transition ${
              isSaving || !session || categories.length === 0
                ? "opacity-60 cursor-not-allowed"
                : ""
            }`}
          >
            {isSaving ? (
              <span className="flex items-center">
                <FiLoader className="animate-spin mr-2" />
                {isEdit ? "Updating..." : "Creating..."}
              </span>
            ) : isEdit ? (
              "Update Note"
            ) : (
              "Create Note"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
