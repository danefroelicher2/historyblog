"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

export default function Navigation() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    // Initial check
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <nav className="bg-blue-900 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          History Blog
        </Link>

        <div className="flex items-center space-x-4">
          <Link href="/blog" className="hover:text-blue-200">
            Articles
          </Link>
          <Link href="/history/eras" className="hover:text-blue-200">
            Historical Eras
          </Link>

          {user ? (
            <div className="flex items-center">
              <Link href="/profile" className="hover:text-blue-200">
                Profile
              </Link>
              <span className="mx-2">|</span>
              <button
                onClick={() => supabase.auth.signOut()}
                className="hover:text-blue-200"
              >
                Sign Out
              </button>
            </div>
          ) : (
            // In Navigation.tsx
            // In Navigation.tsx, change:
            <Link
              href="/signin"
              className="bg-white text-blue-900 px-3 py-1 rounded hover:bg-blue-100"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
