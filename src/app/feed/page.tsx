// src/app/feed/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string | null;
  published_at: string;
  view_count: number;
  image_url?: string | null;
  user_id: string;
  profiles?: {
    id: string;
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
  };
}

export default function PublicFeed() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { user } = useAuth();

  useEffect(() => {
    fetchArticles();
  }, [selectedCategory]);

  async function fetchArticles() {
    setLoading(true);

    try {
      let query = (supabase as any)
        .from("public_articles")
        .select(
          `
          *,
          profiles:user_id(id, username, full_name, avatar_url)
        `
        )
        .eq("is_published", true)
        .order("published_at", { ascending: false });

      if (selectedCategory !== "all") {
        query = query.eq("category", selectedCategory);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Supabase query error:", error);
        throw error;
      }

      console.log("Articles fetched:", data?.length || 0);
      setArticles(data || []);
    } catch (error) {
      console.error("Error fetching articles:", error);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }

  // Format date (e.g., "Mar 15, 2024")
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Categories matching your existing ones
  const categories = [
    { value: "all", label: "All Categories" },
    { value: "ancient-history", label: "Ancient History" },
    { value: "medieval-period", label: "Medieval Period" },
    { value: "renaissance", label: "Renaissance" },
    { value: "early-modern-period", label: "Early Modern Period" },
    { value: "industrial-age", label: "Industrial Age" },
    { value: "20th-century", label: "20th Century" },
    { value: "world-wars", label: "World Wars" },
    { value: "cold-war-era", label: "Cold War Era" },
    { value: "modern-history", label: "Modern History" },
  ];

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Community Articles</h1>

      {/* Category Filter */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Category
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full md:w-64 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {categories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden article-card animate-pulse"
            >
              <div className="h-48 bg-slate-200"></div>
              <div className="p-4">
                <div className="h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
                <div className="flex items-center mb-2">
                  <div className="h-8 w-8 rounded-full bg-slate-200 mr-2"></div>
                  <div className="h-4 bg-slate-200 rounded w-24"></div>
                </div>
                <div className="h-4 bg-slate-200 rounded w-1/3 mb-3"></div>
                <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow-md">
          <p className="text-lg text-gray-600">
            No articles found in this category.
          </p>
          {user && (
            <Link
              href="/write"
              className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Write the First Article
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article: Article) => (
            <div
              key={article.id}
              className="bg-white rounded-lg shadow-md overflow-hidden article-card"
            >
              <div className="h-48 bg-slate-200 overflow-hidden">
                {article.image_url ? (
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500">
                    <span className="text-center p-4">{article.title}</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <Link href={`/articles/${article.slug}`}>
                  <h2 className="text-xl font-bold mb-2 hover:text-blue-600">
                    {article.title}
                  </h2>
                </Link>

                <Link
                  href={`/profile/${article.user_id}`}
                  className="flex items-center mb-2 group"
                >
                  <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 mr-2 overflow-hidden">
                    {article.profiles?.avatar_url ? (
                      <img
                        src={article.profiles.avatar_url}
                        alt={article.profiles.username || "User"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span>
                        {(
                          article.profiles?.username?.charAt(0) ||
                          article.profiles?.full_name?.charAt(0) ||
                          "U"
                        ).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-600 group-hover:text-blue-600">
                    {article.profiles?.full_name ||
                      article.profiles?.username ||
                      "Anonymous"}
                  </span>
                </Link>

                <p className="text-gray-600 text-sm mb-2">
                  {formatDate(article.published_at)}
                </p>

                <p className="text-gray-700 mb-3 line-clamp-3">
                  {article.excerpt || "No excerpt available"}
                </p>

                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {categories.find((c) => c.value === article.category)
                      ?.label ||
                      article.category ||
                      "Uncategorized"}
                  </span>

                  <div className="flex items-center text-sm text-gray-500">
                    <span className="flex items-center mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path
                          fillRule="evenodd"
                          d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {article.view_count || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
