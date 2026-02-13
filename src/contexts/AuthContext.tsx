import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
  }, [token]);

  const base64Encode = (value: string) => {
    try {
      return btoa(unescape(encodeURIComponent(value)));
    } catch {
      // Last-resort fallback; token just needs to be a stable string.
      return `${value}`.replace(/[^a-z0-9]/gi, "_");
    }
  };

  const login = async (email: string, password: string) => {
    // Frontend-only auth: do not call backend API.
    // If VITE_AUTH_EMAIL and VITE_AUTH_PASSWORD are set, enforce them; otherwise accept any credentials.
    const expectedEmail = import.meta.env.VITE_AUTH_EMAIL as string | undefined;
    const expectedPassword = import.meta.env.VITE_AUTH_PASSWORD as
      | string
      | undefined;
    const expectedRole =
      (import.meta.env.VITE_AUTH_ROLE as string | undefined) || "ADMIN";
    const expectedName = import.meta.env.VITE_AUTH_NAME as string | undefined;

    const hasEnvCredentials = !!expectedEmail && !!expectedPassword;
    const ok =
      (email || "").trim().length > 0 &&
      (password || "").trim().length > 0 &&
      (!hasEnvCredentials ||
        ((email || "").trim().toLowerCase() ===
          expectedEmail.trim().toLowerCase() &&
          password === expectedPassword));

    if (!ok) {
      throw new Error("Invalid credentials");
    }

    const normalizedEmail = (email || "").trim();
    const derivedName =
      expectedName ||
      normalizedEmail
        .split("@")[0]
        ?.replace(/[._-]+/g, " ")
        ?.trim() ||
      "User";

    const nextUser: User = {
      id: normalizedEmail.toLowerCase(),
      email: normalizedEmail,
      name: derivedName,
      role: expectedRole,
    };

    const nextToken = `frontend.${base64Encode(
      JSON.stringify({
        sub: nextUser.id,
        email: nextUser.email,
        role: nextUser.role,
        iat: Date.now(),
      })
    )}`;

    setUser(nextUser);
    setToken(nextToken);
    localStorage.setItem("token", nextToken);
    localStorage.setItem("user", JSON.stringify(nextUser));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token && !!user,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
