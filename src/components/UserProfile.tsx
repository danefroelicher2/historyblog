"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";

export default function UserProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState({
    username: "",
    full_name: "",
    interests: [] as string[],
    favorite_eras: [] as string[],
  });

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUser(user);

        // Fetch user profile
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (data) {
          setProfile(data);
        } else if (error && error.code !== "PGRST116") {
          console.error("Error fetching profile:", error);
        }
      }

      setLoading(false);
    };

    getUser();
  }, []);

  async function updateProfile() {
    try {
      setLoading(true);

      if (!user) return;

      const updates = {
        id: user.id,
        ...profile,
        updated_at: new Date(),
      };

      const { error } = await supabase.from("profiles").upsert(updates);

      if (error) throw error;

      alert("Profile updated!");
    } catch (error) {
      alert("Error updating profile!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <div>
        Please{" "}
        <a href="/auth/signin" className="text-blue-600">
          sign in
        </a>{" "}
        to view your profile.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Your Profile</h2>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Email</label>
        <input
          type="text"
          value={user?.email}
          disabled
          className="w-full p-2 border rounded bg-gray-100"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Username</label>
        <input
          type="text"
          value={profile.username || ""}
          onChange={(e) => setProfile({ ...profile, username: e.target.value })}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Full Name</label>
        <input
          type="text"
          value={profile.full_name || ""}
          onChange={(e) =>
            setProfile({ ...profile, full_name: e.target.value })
          }
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">
          Historical Interests (comma-separated)
        </label>
        <input
          type="text"
          value={(profile.interests || []).join(", ")}
          onChange={(e) =>
            setProfile({
              ...profile,
              interests: e.target.value.split(",").map((item) => item.trim()),
            })
          }
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">
          Favorite Eras (comma-separated)
        </label>
        <input
          type="text"
          value={(profile.favorite_eras || []).join(", ")}
          onChange={(e) =>
            setProfile({
              ...profile,
              favorite_eras: e.target.value
                .split(",")
                .map((item) => item.trim()),
            })
          }
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={updateProfile}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Saving..." : "Update Profile"}
        </button>

        <button
          onClick={signOut}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
