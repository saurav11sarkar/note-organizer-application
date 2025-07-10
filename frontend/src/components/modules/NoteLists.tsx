"use client";

import React, { useState, useEffect } from "react";
import { FiEdit2, FiTrash2, FiClock, FiUser, FiTag, FiCalendar, FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FiPlus } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";

interface Category {
  _id: string;
  name: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
}

interface Note {
  _id: string;
  title: string;
  content: string;
  image?: string[];
  category: Category;
  user: User;
  createdAt: string;
  updatedAt: string;
}

interface NoteListsProps {
  notes: Note[];
}

const NoteLists: React.FC<NoteListsProps> = ({ notes: initialNotes }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const notesPerPage = 6;

  // Filter notes based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setNotes(initialNotes);
      setCurrentPage(1);
    } else {
      const filtered = initialNotes.filter(
        (note) =>
          note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.category.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setNotes(filtered);
      setCurrentPage(1);
    }
  }, [searchTerm, initialNotes]);

  // Pagination logic
  const indexOfLastNote = currentPage * notesPerPage;
  const indexOfFirstNote = indexOfLastNote - notesPerPage;
  const currentNotes = notes.slice(indexOfFirstNote, indexOfLastNote);
  const totalPages = Math.ceil(notes.length / notesPerPage);

  const handleDelete = (id: string) => {
    // Add your delete logic here
    console.log("Deleting note with id:", id);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-900">My Notes</h1>
          
          <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-4">
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search notes..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Link
              href="/notes/new"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200 whitespace-nowrap"
            >
              <FiPlus className="mr-2" />
              Add Note
            </Link>
          </div>
        </div>

        {notes.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              {searchTerm ? "No matching notes found" : "No notes yet"}
            </h3>
            <p className="mt-1 text-gray-500">
              {searchTerm ? "Try a different search term" : "Get started by creating a new note."}
            </p>
            {!searchTerm && (
              <div className="mt-6">
                <Link
                  href="/notes/create"
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  <FiPlus className="mr-2" />
                  New Note
                </Link>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {currentNotes.map((note) => (
                <div
                  key={note._id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100"
                >
                  {note.image && note.image.length > 0 && (
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={note.image[0]}
                        alt={note.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={false}
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <h2 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
                        {note.title}
                      </h2>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => console.log("Edit note:", note._id)}
                          className="text-gray-500 hover:text-indigo-600 transition-colors duration-200"
                          aria-label="Edit note"
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(note._id)}
                          className="text-gray-500 hover:text-red-600 transition-colors duration-200"
                          aria-label="Delete note"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-3">{note.content}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="inline-flex items-center bg-indigo-50 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full">
                        <FiTag className="mr-1" size={12} />
                        {note.category.name}
                      </span>
                      <span className="inline-flex items-center bg-green-50 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
                        <FiUser className="mr-1" size={12} />
                        {note.user.name}
                      </span>
                    </div>

                    <div className="border-t border-gray-100 pt-3 mt-3">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span className="inline-flex items-center">
                          <FiCalendar className="mr-1" size={12} />
                          {new Date(note.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        <span className="inline-flex items-center">
                          <FiClock className="mr-1" size={12} />
                          {new Date(note.updatedAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-8">
                <div className="text-sm text-gray-500">
                  Showing <span className="font-medium">{indexOfFirstNote + 1}</span> to{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastNote, notes.length)}
                  </span>{" "}
                  of <span className="font-medium">{notes.length}</span> results
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-md ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"}`}
                  >
                    <FiChevronLeft size={18} />
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => {
                        setCurrentPage(page);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className={`px-3 py-1 rounded-md ${currentPage === page ? "bg-indigo-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-md ${currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"}`}
                  >
                    <FiChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NoteLists;