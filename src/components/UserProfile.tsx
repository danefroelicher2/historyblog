// src/components/UserProfile.tsx
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

type ProfileData = {
  username: string;
  full_name: string;
  bio: string;
  website: string;
};

export default function UserProfile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"error" | "success" | "">("");
  const [profile, setProfile] = useState<ProfileData>({
    username: "",
    full_name: "",
    bio: "",
    website: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      getProfile();
    }
  }, [user]);

  async function getProfile() {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("profiles")
        .select("username, full_name, bio, website")
        .eq("id", user?.id)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setProfile({
          username: data.username || "",
          full_name: data.full_name || "",
          bio: data.bio || "",
          website: data.website || "",
        });
      }
    } catch (error: any) {
      console.error("Error loading profile:", error.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile() {
    try {
      setLoading(true);

      const { error } = await supabase.from("profiles").upsert({
        id: user?.id,
        username: profile.username,
        full_name: profile.full_name,
        bio: profile.bio,
        website: profile.website,
        updated_at: new Date(),
      });

      if (error) {
        throw error;
      }

      setMessageType("success");
      setMessage("Profile updated successfully!");
      setIsEditing(false);
    } catch (error: any) {
      setMessageType("error");
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
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

      <div className="mb-8 text-center">
        <div className="w-24 h-24 bg-blue-200 rounded-full mx-auto mb-4 flex items-center justify-center text-blue-700 text-2xl font-bold">
          {profile.username
            ? profile.username.charAt(0).toUpperCase()
            : user?.email?.charAt(0).toUpperCase()}
        </div>
        <h2 className="text-xl font-semibold">{user?.email}</h2>
      </div>

      {isEditing ? (
        <form className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Username</label>
            <input
              type="text"
              name="username"
              value={profile.username}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              name="full_name"
              value={profile.full_name}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Bio</label>
            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              rows={4}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Website</label>
            <input
              type="url"
              name="website"
              value={profile.website}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={updateProfile}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          <div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">Username</h3>
            <p className="text-gray-800">{profile.username || "Not set"}</p>
          </div>

          <div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">
              Full Name
            </h3>
            <p className="text-gray-800">{profile.full_name || "Not set"}</p>
          </div>

          <div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">Bio</h3>
            <p className="text-gray-800">{profile.bio || "Not set"}</p>
          </div>

          <div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">Website</h3>
            <p className="text-gray-800">
              {profile.website ? (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {profile.website}
                </a>
              ) : (
                "Not set"
              )}
            </p>
          </div>

          <button
            onClick={() => setIsEditing(true)}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
}
