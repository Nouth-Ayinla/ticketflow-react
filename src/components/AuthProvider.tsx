import React, { createContext, useState, useEffect, useContext } from "react";

interface User {
  email: string;
  id: number;
  loginTime: string;
}

interface AuthResult {
  success: boolean;
  error?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => AuthResult;
  signup: (
    email: string,
    password: string,
    confirmPassword: string
  ) => AuthResult;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkSessionExpiry = (userData: User): boolean => {
    const loginTime = new Date(userData.loginTime);
    const now = new Date();
    const hoursDiff = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60);
    return hoursDiff <= 24; // 24-hour session
  };

  useEffect(() => {
    // Check for existing session on mount
    const session = localStorage.getItem("ticketapp_session");
    if (session) {
      try {
        const userData: User = JSON.parse(session);

        // Check if session is expired
        if (checkSessionExpiry(userData)) {
          setUser(userData);
        } else {
          localStorage.removeItem("ticketapp_session");
          console.log("Session expired");
        }
      } catch (e) {
        console.error("Invalid session data:", e);
        localStorage.removeItem("ticketapp_session");
      }
    }
    setLoading(false);
  }, []);

  const login = (email: string, password: string): AuthResult => {
    if (!email || !password) {
      return { success: false, error: "Email and password are required" };
    }

    if (password.length < 6) {
      return {
        success: false,
        error: "Password must be at least 6 characters",
      };
    }

    // Demo credentials for testing
    if (email === "demo@test.com" && password === "password") {
      const userData: User = {
        email,
        id: Date.now(),
        loginTime: new Date().toISOString(),
      };
      localStorage.setItem("ticketapp_session", JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    }

    // Regular validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, error: "Please enter a valid email address" };
    }

    const userData: User = {
      email,
      id: Date.now(),
      loginTime: new Date().toISOString(),
    };
    localStorage.setItem("ticketapp_session", JSON.stringify(userData));
    setUser(userData);
    return { success: true };
  };

  const signup = (
    email: string,
    password: string,
    confirmPassword: string
  ): AuthResult => {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, error: "Please enter a valid email address" };
    }

    // Validate password match
    if (password !== confirmPassword) {
      return { success: false, error: "Passwords do not match" };
    }

    // Validate password length
    if (password.length < 6) {
      return {
        success: false,
        error: "Password must be at least 6 characters",
      };
    }

    // If all validations pass, proceed with login
    return login(email, password);
  };

  const logout = () => {
    localStorage.removeItem("ticketapp_session");
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    login,
    signup,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for using auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthProvider;
