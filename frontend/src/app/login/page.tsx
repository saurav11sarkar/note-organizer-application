"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

interface FormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false, // Changed to false to handle redirect manually
        callbackUrl,
      });

      if (result?.error) {
        toast.error("Invalid credentials");
      } else {
        toast.success("Login successful");
        router.push(callbackUrl);
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: "github" | "google") => {
    signIn(provider, { callbackUrl });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6 bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
            Sign in to NoteApp
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              onClick={() => handleSocialLogin("github")}
              className="w-full flex justify-center items-center py-2.5 px-4 border border-gray-200 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors"
            >
              <Image
                src="/github-icon.png"
                alt="GitHub"
                width={20}
                height={20}
                className="h-5 w-5"
              />
              <span className="ml-2">GitHub</span>
            </button>

            <button
              onClick={() => handleSocialLogin("google")}
              className="w-full flex justify-center items-center py-2.5 px-4 border border-gray-200 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors"
            >
              <Image
                src="/google-icon.png"
                alt="Google"
                width={20}
                height={20}
                className="h-5 w-5"
              />
              <span className="ml-2">Google</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}