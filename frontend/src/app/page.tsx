"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Plus, FileText, Folder } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface CustomSession {
  accessToken?: string;
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function HomePage() {
  const { data: sessionData } = useSession();
  const session = sessionData as CustomSession | null;
  const accessToken = session?.accessToken;
  const userName = session?.user?.name || "Guest";

  const [totalNotes, setTotalNotes] = useState<number>(0);
  const [totalCategories, setTotalCategories] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!accessToken) return;

    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const [notesRes, categoriesRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/note/`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/category/`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }),
        ]);

        const notesData = await notesRes.json();
        const categoriesData = await categoriesRes.json();

        if (!notesRes.ok) throw new Error(notesData.message || "Failed to fetch notes");
        if (!categoriesRes.ok) throw new Error(categoriesData.message || "Failed to fetch categories");

        setTotalNotes(notesData.meta?.total || 0);
        setTotalCategories(categoriesData.meta?.total || 0);
      } catch (error: any) {
        toast.error(error.message || "Dashboard data fetch failed");
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(fetchDashboardData, 400);
    return () => clearTimeout(timer);
  }, [accessToken]);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* Welcome Section */}
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Welcome, {userName}!
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {session?.user
              ? "Start by creating a new note or managing your categories."
              : "Sign in to begin organizing your thoughts with NoteApp."}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/notes/new"
            className="flex items-center justify-center gap-3 py-4 px-6 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            <Plus className="h-5 w-5" />
            <span className="text-sm font-medium">New Note</span>
          </Link>
          <Link
            href="/categories"
            className="flex items-center justify-center gap-3 py-4 px-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 transition"
          >
            <Folder className="h-5 w-5 text-gray-700" />
            <span className="text-sm font-medium text-gray-700">View Categories</span>
          </Link>
        </div>

        {/* Dashboard Summary */}
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6">
            Your Dashboard
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Total Notes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isLoading ? "..." : totalNotes}
                </p>
                <p className="text-xs text-gray-500">
                  {totalNotes > 0
                    ? `${totalNotes} note${totalNotes > 1 ? "s" : ""} created`
                    : "No notes yet"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Folder className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Categories</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isLoading ? "..." : totalCategories}
                </p>
                <p className="text-xs text-gray-500">
                  {totalCategories > 0
                    ? `${totalCategories} categor${totalCategories > 1 ? "ies" : "y"} created`
                    : "No categories yet"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Notes Placeholder */}
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
            Recent Notes
          </h2>
          <p className="text-sm text-gray-600">
            {session?.user
              ? "You haven’t created any notes yet. Create one to get started!"
              : "Sign in to view your recent notes."}
          </p>
          {session?.user && (
            <Link
              href="/notes"
              className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline"
            >
              View all notes
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
