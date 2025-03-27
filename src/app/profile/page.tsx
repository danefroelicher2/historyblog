"use client";

import UserProfile from "@/components/UserProfile";

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-8">Your Profile</h1>
      <UserProfile />
    </div>
  );
}
