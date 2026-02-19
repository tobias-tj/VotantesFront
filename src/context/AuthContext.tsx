import { createContext, useContext, useEffect, useState } from "react";

export type User = {
  id: string;
  nombre: string;
  isAdmin: boolean;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = sessionStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState<string | null>(
    sessionStorage.getItem("token")
  );

  const login = (user: User, token: string) => {
    sessionStorage.setItem("user", JSON.stringify(user));
    sessionStorage.setItem("token", token);

    setUser(user);
    setToken(token);
  };

  const logout = () => {
    sessionStorage.clear();
    setUser(null);
    setToken(null);
  };

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    const storedToken = sessionStorage.getItem("token");

    if (!storedUser || !storedToken) {
        setUser(null);
        setToken(null);
    }
  }, []);

  const value: AuthContextType = {
    user,
    token,
    isAdmin: user?.isAdmin ?? false,
    isAuthenticated: !!token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
};
