// src/components/LikeButton.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

interface LikeButtonProps {
  articleId: string;
  initialLikeCount?: number;
  className?: string;
}

export default function LikeButton({
  articleId,
  initialLikeCount = 0,
  className = "",
}: LikeButtonProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLoading, setIsLoading] = useState(false);
  const [checkingLike, setCheckingLike] = useState(true);

  // Check if user has already liked this article
  useEffect(() => {
    async function checkIfLiked() {
      if (!user) {
        setCheckingLike(false);
        return;
      }

      try {
        setCheckingLike(true);

        const { data, error } = await supabase
          .from("likes")
          .select("id")
          .eq("article_id", articleId)
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) throw error;

        setIsLiked(!!data);
      } catch (error) {
        console.error("Error checking like status:", error);
      } finally {
        setCheckingLike(false);
      }
    }

    checkIfLiked();
  }, [user, articleId]);

  // Function to handle like/unlike
  async function handleLikeToggle() {
    if (!user) {
      // Redirect to sign in page
      router.push(
        `/signin?redirect=${encodeURIComponent(window.location.pathname)}`
      );
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    try {
      if (isLiked) {
        // Unlike
        const { error } = await supabase
          .from("likes")
          .delete()
          .eq("article_id", articleId)
          .eq("user_id", user.id);

        if (error) throw error;

        setLikeCount((prev) => Math.max(0, prev - 1));
        setIsLiked(false);
      } else {
        // Like
        const { error } = await supabase.from("likes").insert({
          article_id: articleId,
          user_id: user.id,
        });

        if (error) throw error;

        setLikeCount((prev) => prev + 1);
        setIsLiked(true);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      onClick={handleLikeToggle}
      disabled={isLoading || checkingLike}
      className={`flex items-center space-x-1 transition-colors focus:outline-none ${
        isLiked
          ? "text-red-600 dark:text-red-500"
          : "text-gray-600 dark:text-gray-400"
      } ${className} ${isLoading ? "opacity-50" : ""}`}
      aria-label={isLiked ? "Unlike this article" : "Like this article"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-6 w-6 transition-transform ${isLiked ? "scale-110" : ""}`}
        fill={isLiked ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      <span>
        {likeCount} {likeCount === 1 ? "Like" : "Likes"}
      </span>
    </button>
  );
}
