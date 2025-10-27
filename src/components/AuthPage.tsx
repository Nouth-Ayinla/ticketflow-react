import React, { useState } from "react";
import { Home } from "lucide-react";
import { useAuth } from "./AuthProvider";
import Toast from "./Toast";

interface AuthPageProps {
  mode: "login" | "signup";
  onNavigate: (route: string) => void;
}

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

interface ToastState {
  message: string;
  type: "success" | "error" | "warning" | "info";
}

const AuthPage: React.FC<AuthPageProps> = ({ mode, onNavigate }) => {
  const { login, signup } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<ToastState | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!formData.email.includes("@")) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Confirm password validation (only for signup)
    if (mode === "signup") {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords must match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoading) return;

    if (!validate()) {
      setToast({
        message: "Please fix the errors in the form",
        type: "error",
      });
      return;
    }

    setIsLoading(true);

    try {
      const result =
        mode === "login"
          ? login(formData.email, formData.password)
          : signup(formData.email, formData.password, formData.confirmPassword);

      if (!result.success) {
        setToast({ message: result.error!, type: "error" });
      } else {
        setToast({ message: "Authentication successful!", type: "success" });
        setTimeout(() => onNavigate("dashboard"), 500);
      }
    } catch (error) {
      setToast({
        message: "An unexpected error occurred. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleSubmit(e as any);
    }
  };

  const switchMode = () => {
    onNavigate(mode === "login" ? "signup" : "login");
    setErrors({});
    setFormData({ email: "", password: "", confirmPassword: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4 py-8">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Decorative Circles */}
      <div className="absolute top-10 left-10 w-40 h-40 bg-purple-200 rounded-full opacity-30"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-200 rounded-full opacity-30"></div>

      <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full relative z-10">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          {mode === "login" ? "Welcome Back" : "Create Account"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="you@example.com"
              autoComplete="email"
            />
            {errors.email && (
              <p
                id="email-error"
                className="text-red-500 text-sm mt-1"
                role="alert"
              >
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password <span className="text-red-500">*</span>
            </label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="••••••••"
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
            />
            {errors.password && (
              <p
                id="password-error"
                className="text-red-500 text-sm mt-1"
                role="alert"
              >
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password Field (Signup Only) */}
          {mode === "signup" && (
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={
                  errors.confirmPassword ? "confirm-password-error" : undefined
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="••••••••"
                autoComplete="new-password"
              />
              {errors.confirmPassword && (
                <p
                  id="confirm-password-error"
                  className="text-red-500 text-sm mt-1"
                  role="alert"
                >
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-lg font-semibold transition shadow-md transform duration-200 ${
              isLoading
                ? "bg-blue-400 cursor-not-allowed opacity-70"
                : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:scale-105 text-white"
            }`}
          >
            {isLoading
              ? "Please wait..."
              : mode === "login"
              ? "Sign In"
              : "Sign Up"}
          </button>
        </form>

        {/* Additional Links */}
        <div className="mt-6 text-center space-y-3">
          <button
            onClick={switchMode}
            disabled={isLoading}
            className="text-blue-600 hover:underline text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {mode === "login"
              ? "Don't have an account? Sign up"
              : "Already have an account? Login"}
          </button>

          <button
            onClick={() => onNavigate("landing")}
            disabled={isLoading}
            className="w-full text-gray-600 hover:text-gray-800 flex items-center justify-center gap-2 text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Home size={16} /> Back to Home
          </button>
        </div>

        {/* Demo Credentials Hint */}
        <div className="mt-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-600 text-center">
            <strong>Demo credentials:</strong>
            <br />
            Email: demo@test.com
            <br />
            Password: password
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
