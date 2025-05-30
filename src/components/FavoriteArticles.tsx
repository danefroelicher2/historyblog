// src/components/FavoriteArticles.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { getUserFavorites } from "@/lib/favoritesUtils";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  image_url: string | null;
  published_at: string;
}

interface FavoriteArticlesProps {
  userId: string;
}

export default function FavoriteArticles({ userId }: FavoriteArticlesProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      fetchFavoriteArticles();
    }
  }, [userId]);

  async function fetchFavoriteArticles() {
    try {
      setLoading(true);

      // Get favorite article IDs from localStorage
      const favoriteIds = getUserFavorites(userId);

      if (favoriteIds.length === 0) {
        // No favorites set, don't show anything
        setArticles([]);
        setLoading(false);
        return;
      }

      // Fetch the favorite articles based on the IDs
      const { data, error } = await (supabase as any)
        .from("public_articles")
        .select(
          `
          id, 
          title, 
          slug, 
          excerpt,
          image_url,
          published_at
        `
        )
        .in("id", favoriteIds)
        .eq("is_published", true);

      if (error) throw error;

      // Ensure articles are in the same order as favoriteIds
      const orderedArticles = favoriteIds
        .map((id) => data.find((article: Article) => article.id === id))
        .filter(Boolean); // Remove any undefined entries

      setArticles(orderedArticles || []);
    } catch (err) {
      console.error("Error fetching favorite articles:", err);
      setError("Failed to load favorite articles");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="bg-gray-200 aspect-[2/3] rounded-lg"
          ></div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (articles.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">FAVORITE ARTICLES</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/articles/${article.slug}`}
            className="block bg-gray-800 rounded-lg overflow-hidden aspect-[2/3] relative group"
          >
            {article.image_url ? (
              <img
                src={article.image_url}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center p-4 bg-gradient-to-b from-gray-700 to-gray-900">
                <span className="text-center text-white font-medium text-sm">
                  {article.title}
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-end transition-all duration-300">
              <div className="p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <h3 className="font-bold text-sm">{article.title}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
