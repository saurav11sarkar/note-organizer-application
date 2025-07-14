"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/provider/UserContext";
import { Loader2 } from "lucide-react";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: string;
  method: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

interface FormData {
  name: string;
  image: File | null;
}

const ProfilePage = () => {
  const router = useRouter();
  const { data: session, update: updateSession, status } = useSession();
  const { setUser: setGlobalUser } = useUserContext();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      toast.error("Please login first to access your profile");
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (!session?.user?.email) return;

    const fetchUserProfile = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user`, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch profile");

        setUser(data.data);
        setFormData({ name: data.data.name, image: null });
      } catch (err: any) {
        toast.error(err.message || "Failed to load profile");
      }
    };

    fetchUserProfile();
  }, [session]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({ ...prev, image: file }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.accessToken || !user) return;

    try {
      setLoading(true);
      const form = new FormData();
      form.append("data", JSON.stringify({ name: formData.name }));

      if (formData.image) {
        form.append("image", formData.image);
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: form,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      toast.success("Profile updated successfully");

      // Update all states and session with fresh data
      const updatedUser = data.data;
      setUser(updatedUser);
      setFormData({
        name: updatedUser.name,
        image: null,
      });
      setImagePreview(null);

      setGlobalUser({
        name: updatedUser.name,
        image: updatedUser.image,
        email: updatedUser.email,
        role: updatedUser.role,
      });

      // Update NextAuth session with fresh data
      await updateSession({
        ...session,
        user: {
          ...session.user,
          name: updatedUser.name,
          image: updatedUser.image,
        },
      });
    } catch (error: any) {
      toast.error(error.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Loading your profile</h2>
          <p className="text-gray-600 mt-2">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-lg">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Profile Settings</h1>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs sm:text-sm font-medium rounded-full capitalize">
            {user.role}
          </span>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="flex-shrink-0">
            <div className="relative group">
              <Image
                src={imagePreview || user.image || "/default-avatar.png"}
                alt="Profile"
                width={128}
                height={128}
                className="rounded-full object-cover border-4 border-white shadow-md w-32 h-32"
              />
              <div className="absolute inset-0 rounded-full bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-sm font-medium">Change</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">{user.name}</h2>
            <p className="text-gray-600 flex items-center">
              <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
              </svg>
              {user.email}
            </p>
            <p className="text-sm text-gray-500 flex items-center">
              <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
              </svg>
              Joined: {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <p className="text-sm text-gray-500 flex items-center">
              <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd"></path>
              </svg>
              Last updated: {new Date(user.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profile Image
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  id="profile-image"
                />
                <label
                  htmlFor="profile-image"
                  className="block w-full px-4 py-2 border border-gray-300 rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate text-sm text-gray-600">
                      {formData.image ? formData.image.name : "Choose an image"}
                    </span>
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {imagePreview && (
            <div className="mt-2">
              <p className="text-sm font-medium text-gray-700 mb-2">Image Preview:</p>
              <div className="w-24 h-24 rounded-md overflow-hidden border border-gray-200">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium rounded-lg shadow-md hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-70 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Updating...
                </>
              ) : (
                "Update Profile"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;