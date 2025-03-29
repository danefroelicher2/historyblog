// src/components/Navigation.tsx
"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export default function Navigation() {
  const { user, signOut, isLoading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-blue-800 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="font-bold text-xl">
              History Blog
            </Link>
            <div className="hidden md:flex ml-10 space-x-6">
              <Link href="/blog" className="hover:text-blue-200">
                Articles
              </Link>
              <Link href="/timeline" className="hover:text-blue-200">
                Timeline
              </Link>
              <Link href="/about" className="hover:text-blue-200">
                About
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isLoading ? (
              <div className="text-sm">Loading...</div>
            ) : user ? (
              <>
                <Link href="/profile" className="hover:text-blue-200">
                  Profile
                </Link>
                <button
                  onClick={signOut}
                  className="bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded-md text-sm"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/auth"
                className="bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded-md text-sm"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-blue-900 p-4">
          <div className="flex flex-col space-y-3">
            <Link
              href="/blog"
              className="hover:text-blue-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Articles
            </Link>
            <Link
              href="/timeline"
              className="hover:text-blue-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Timeline
            </Link>
            <Link
              href="/about"
              className="hover:text-blue-200"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <div className="pt-2 border-t border-blue-800">
              {isLoading ? (
                <div className="text-sm">Loading...</div>
              ) : user ? (
                <>
                  <Link
                    href="/profile"
                    className="block hover:text-blue-200 mb-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setIsMenuOpen(false);
                    }}
                    className="bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded-md text-sm w-full text-left"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/auth"
                  className="bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded-md text-sm block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
