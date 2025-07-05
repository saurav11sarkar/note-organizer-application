"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Plus, FileText, Folder } from "lucide-react";

export default function HomePage() {
  const { data: session } = useSession();
  const userName = session?.user?.name || "Guest";

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
            Welcome, {userName}!
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {session?.user
              ? "Get started by creating a new note or exploring your categories."
              : "Sign in to start organizing your thoughts with NoteApp."}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/notes/new"
            className="flex items-center justify-center gap-3 py-4 px-6 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span className="text-sm font-medium">New Note</span>
          </Link>
          <Link
            href="/categories"
            className="flex items-center justify-center gap-3 py-4 px-6 bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors"
          >
            <Folder className="h-5 w-5 text-gray-700" />
            <span className="text-sm font-medium text-gray-700">
              View Categories
            </span>
          </Link>
        </div>

        {/* Dashboard Summary */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
            Your Dashboard
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Total Notes</p>
                <p className="text-2xl font-semibold text-gray-900">0</p>
                <p className="text-xs text-gray-500">No notes created yet</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Folder className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Categories</p>
                <p className="text-2xl font-semibold text-gray-900">0</p>
                <p className="text-xs text-gray-500">
                  No categories created yet
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Notes (Placeholder) */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
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
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              View all notes
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
