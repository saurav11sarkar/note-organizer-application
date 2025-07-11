"use client";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React from "react";

interface CustomSession {
  accessToken?: string;
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

const CategoryById = () => {
  const params = useParams();
  const id = params.id;
  const { data: sessionData } = useSession();
  const session = sessionData as CustomSession | null;
  console.log(session);
  return <div>CategoryById {id} </div>;
};

export default CategoryById;
