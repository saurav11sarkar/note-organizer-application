import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

import { AuthProvider } from "@/provider/authProvider";
import Sidebar from "@/components/shared/Sidebar";
import { UserProvider } from "@/provider/UserContext";

export const metadata: Metadata = {
  title: "NoteApp - Your Personal Note Taking App",
  description: "Organize your thoughts and ideas with NoteApp",

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </head>
      <body className={` bg-gray-50 text-gray-900`} cz-shortcut-listen="true">
        <AuthProvider>
          <UserProvider>
            <Sidebar />
            <Toaster
              richColors
              position="top-center"
              toastOptions={{
                classNames: {
                  toast: "!font-sans",
                  title: "!font-medium",
                },
              }}
            />
            <main
              className={`
              min-h-screen
              transition-all duration-300 ease-in-out
              ml-0 md:ml-64
              pt-16 md:pt-0
              px-4 sm:px-6 lg:px-8
              pb-8
            `}
            >
              <div className="max-w-6xl mx-auto">{children}</div>
            </main>
          </UserProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
