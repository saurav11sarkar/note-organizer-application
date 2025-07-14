"use server";

interface RegisterResponse {
  ok: boolean;
  data?: {
    accessToken: string;
    refreshToken: string;
    user: {
      _id: string;
      email: string;
      name:string;
      role: string;
      image:string;
    };
  };
  error?: string;
}

export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
}): Promise<RegisterResponse> => {
  try {
    const res = await fetch(
      `${process.env.NEXTAUTH_URL}/api/user/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );

    const result = await res.json();
    
    if (!res.ok) {
      return {
        ok: false,
        error: result.message || "Registration failed"
      };
    }

    return {
      ok: true,
      data: result
    };
  } catch (error: any) {
    return {
      ok: false,
      error: error.message || "An unexpected error occurred"
    };
  }
};