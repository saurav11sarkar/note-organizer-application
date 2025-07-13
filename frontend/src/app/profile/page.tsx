"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import Image from "next/image";
import { useUserContext } from "@/provider/UserContext";

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
  const { data: session, update: updateSession } = useSession();
  const { setUser: setGlobalUser } = useUserContext();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!session?.accessToken) return;

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user`, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch profile");
        }

        setUser(data.data);
        setFormData({
          name: data.data.name,
          image: null,
        });
      } catch (error: any) {
        toast.error(error.message || "Failed to load profile");
      }
    };

    fetchUserProfile();
  }, [session?.accessToken]);

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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-md">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Profile Settings
        </h1>

        <div className="flex items-center gap-4 mb-6">
          <Image
            src={user.image || "/default-avatar.png"}
            alt="Profile"
            width={96}
            height={96}
            className="rounded-full object-cover border-2 border-gray-200"
          />
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-500 capitalize">
              Role: {user.role}
            </p>
            <p className="text-sm text-gray-500 capitalize">
              Method: {user.method}
            </p>
            <p className="text-sm text-gray-500">
              Joined: {new Date(user.createdAt).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-500">
              Last updated: {new Date(user.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Profile Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  image: e.target.files?.[0] || null,
                }))
              }
              className="mt-1 block w-full text-sm text-gray-700"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
