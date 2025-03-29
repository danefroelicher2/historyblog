// src/app/auth/page.tsx (rename from sign-in/page.tsx if needed)
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"error" | "success" | "">("");
  const [isSignIn, setIsSignIn] = useState(true);
  const [forgotPassword, setForgotPassword] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      if (forgotPassword) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setMessageType("success");
        setMessage("Password reset instructions sent to your email");
      } else if (isSignIn) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/");
        router.refresh();
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setMessageType("success");
        setMessage("Check your email for the confirmation link");
      }
    } catch (error: any) {
      setMessageType("error");
      setMessage(error.message || `An error occurred during ${isSignIn ? "sign in" : "sign up"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-6">
          {forgotPassword ? "Reset Password" : isSignIn ? "Sign In" : "Create Account"}
        </h1>

        {message && (
          <div 
            className={`px-4 py-3 rounded mb-4 ${
              messageType === "error" 
                ? "bg-red-100 border border-red-400 text-red-700" 
                : "bg-green-100 border border-green-400 text-green-700"
            }`}
          >
            {message}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleAuth}>
          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {!forgotPassword && (
            <div>
              <label className="block text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
          >
            {loading
              ? "Loading..."
              : forgotPassword
              ? "Send Reset Instructions"
              : isSignIn
              ? "Sign In"
              : "Sign Up"}
          </button>
        </form>

        <div className="mt-4 text-center">
          {!forgotPassword && (
            <button
              onClick={() => setIsSignIn(!isSignIn)}
              className="text-blue-600 hover:underline"
            >
              {isSignIn ? "Need an account? Sign Up" : "Already have an account? Sign In"}
            </button>
          )}
        </div>

        <div className="mt-2 text-center">
          {isSignIn && !forgotPassword ? (
            <button
              onClick={() => setForgotPassword(true)}
              className="text-blue-600 hover:underline text-sm"
            >
              Forgot your password?
            </button>
          ) : forgotPassword ? (
            <button
              onClick={() => setForgotPassword(false)}
              className="text-blue-600 hover:underline text-sm"
            >
              Back to Sign In
            </button>
          ) : null}
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-center text-gray-600 text-sm">
            Or continue with social accounts
          </p>
          <div className="flex justify-center mt-4 space-x-4">
            <button className="bg-gray-100 p-2 rounded-full hover:bg-gray-200">
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M12 5.02c1.7 0 3.22.57 4.42 1.53l3.38-3.38C17.77 1.15 15.01 0 12 0 7.31 0 3.21 2.7 1.25 6.68l3.92 3.04C6.09 7.1 8.89 5.02 12 5.02z"
                />
                <path
                  fill="#34A853"
                  d="M23.54 12.23c0-.83-.07-1.42-.21-2.04H12v3.91h6.47c-.14.92-.57 2.31-1.64 3.24l3.83 2.97c2.24-2.06 3.53-5.09 3.53-8.08z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.16 14.28c-.2-.58-.31-1.2-.31-1.83 0-.64.11-1.25.31-1.83L1.24 7.57C.45 9.02 0 10.71 0 12.45s.45 3.43 1.24 4.88l3.92-3.05z"
                />
                <path
                  fill="#EA4335"
                  d="M12 24c3.24 0 5.95-1.07 7.94-2.9l-3.83-2.97c-1.05.7-2.39 1.18-4.1 1.18-3.11 0-5.91-2.08-6.83-4.96l-3.92 3.04C3.21 21.3 7.31 24 12 24z"
                />
              </svg>
            </button>
            <button className="bg-gray-100 p-2 rounded-full hover:bg-gray-200">
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="#1877F2"
                  d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}