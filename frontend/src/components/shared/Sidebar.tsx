"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut, ChevronDown, ChevronUp } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import clsx from "clsx";

const navLinks = [
  { href: "/", label: "Dashboard", icon: "📊" },
  { href: "/notes", label: "My Notes", icon: "📝" },
  { href: "/categories", label: "Categories", icon: "🗂️" },
  { href: "/profile", label: "Profile", icon: "👤" },
];

const Sidebar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setOpen(true);
      } else {
        setOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  const toggleSidebar = () => {
    if (isMobile) {
      setOpen(!open);
    }
  };

  return (
    <>
      {/* Mobile Topbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-lg px-4 py-3 flex justify-between items-center border-b border-gray-200">
        <Link href="/" className="text-xl font-semibold text-blue-600">
          NoteApp
        </Link>
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          {open ? (
            <X className="h-6 w-6 text-gray-600" />
          ) : (
            <Menu className="h-6 w-6 text-gray-600" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={clsx(
          "fixed top-0 left-0 h-full bg-white shadow-xl w-64 z-40 transition-all duration-300 ease-in-out",
          "border-r border-gray-200",
          {
            "translate-x-0": open,
            "-translate-x-full": !open,
            "md:translate-x-0": true,
          }
        )}
      >
        <div className="p-5 flex items-center justify-between border-b border-gray-200">
          <Link 
            href="/" 
            className="text-2xl font-semibold text-blue-600 flex items-center gap-3"
            onClick={() => isMobile && setOpen(false)}
          >
            <span className="text-2xl">📒</span>
            <span>NoteApp</span>
          </Link>
          <button 
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <nav className="mt-6 flex flex-col gap-2 px-3">
          {navLinks.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              onClick={toggleSidebar}
              className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                {
                  "bg-blue-50 text-blue-600": pathname === href,
                  "text-gray-700 hover:bg-gray-100": pathname !== href,
                }
              )}
            >
              <span className="text-lg">{icon}</span>
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        {/* Footer User Area */}
        <div className="absolute bottom-0 left-0 w-full p-5 border-t border-gray-200 bg-white">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={user.image || "/default-avatar.png"}
                    alt="User"
                    width={40}
                    height={40}
                    className="rounded-full border-2 border-gray-200"
                  />
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-900">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate max-w-[150px]">
                      {user.email}
                    </p>
                  </div>
                </div>
                {showUserDropdown ? (
                  <ChevronUp className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                )}
              </button>

              {showUserDropdown && (
                <div className="absolute bottom-full mb-3 left-0 w-full bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="block w-full text-center py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold text-sm"
              onClick={() => isMobile && setOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Content padding */}
      <div className={clsx(
        "transition-all duration-300 ease-in-out",
        {
          "md:ml-64": open,
          "ml-0": !open,
        }
      )} />
    </>
  );
};

export default Sidebar;