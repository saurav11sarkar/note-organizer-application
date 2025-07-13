"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useSession } from "next-auth/react";

interface User {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);

  // Initialize user from session
  useEffect(() => {
    if (session?.user) {
      setUser({
        name: session.user.name || null,
        email: session.user.email || null,
        image: session.user.image || null,
        role: (session.user as any).role || null,
      });
    }
  }, [session]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};