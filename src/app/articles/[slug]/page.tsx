// src/app/articles/[slug]/page.tsx - UPDATED WITH NEW LAYOUT
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Head from "next/head";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import FeatureArticleButton from "@/components/FeatureArticleButton";
import PinButton from "@/components/PinButton";
import ShareButton from "@/components/ShareButton";

export default function ArticlePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authorProfile, setAuthorProfile] = useState<any>(null);

  // Extract slug from params
  const slugParam = params.slug;
  const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam;

  useEffect(() => {
    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  async function fetchArticle() {
    setLoading(true);
    try {
      console.log("Fetching article with slug:", slug);

      const { data, error } = await (supabase as any)
        .from("public_articles")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .single();

      if (error) {
        console.error("Error fetching article:", error);
        setError("Article not found or has been removed.");
        return;
      }

      console.log("Article found:", data);
      setArticle(data);

      // Fetch author profile information
      if (data.user_id) {
        try {
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("id, username, full_name, avatar_url")
            .eq("id", data.user_id)
            .single();

          if (!profileError && profileData) {
            setAuthorProfile(profileData);
          }
        } catch (profileErr) {
          console.warn("Error fetching author profile:", profileErr);
        }
      }

      // Update view count if article was found
      if (data?.id) {
        const currentViewCount =
          typeof data.view_count === "number" ? data.view_count : 0;
        await (supabase as any)
          .from("public_articles")
          .update({ view_count: currentViewCount + 1 })
          .eq("id", data.id);
      }
    } catch (error) {
      console.error("Error in article fetch flow:", error);
      setError("An error occurred while loading the article.");
    } finally {
      setLoading(false);
    }
  }

  // Check if current user is the author
  const isAuthor = user && article && user.id === article.user_id;

  // Generate metadata for Twitter Cards
  const generateMetaTags = () => {
    if (!article) return null;

    const articleUrl = `${window.location.origin}/articles/${article.slug}`;
    const authorName = authorProfile
      ? authorProfile.full_name || authorProfile.username || "Anonymous"
      : "Anonymous";

    // Clean and truncate description
    const description = article.excerpt
      ? article.excerpt.length > 200
        ? article.excerpt.substring(0, 197) + "..."
        : article.excerpt
      : article.content
      ? article.content.length > 200
        ? article.content.substring(0, 197) + "..."
        : article.content
      : "Read this article on LOSTLIBRARY";

    return (
      <Head>
        {/* Basic Meta Tags */}
        <title>{article.title} | LOSTLIBRARY</title>
        <meta name="description" content={description} />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={articleUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="LOSTLIBRARY" />
        {article.image_url && (
          <meta property="og:image" content={article.image_url} />
        )}

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@lostxlibrary" />
        <meta name="twitter:creator" content="@lostxlibrary" />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={description} />
        {article.image_url && (
          <meta name="twitter:image" content={article.image_url} />
        )}

        {/* Article specific meta tags */}
        <meta property="article:author" content={authorName} />
        <meta
          property="article:published_time"
          content={article.published_at}
        />
        {article.category && (
          <meta property="article:section" content={article.category} />
        )}
      </Head>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4 dark:text-white">
            Article Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <Link
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  // Article not found
  if (!article) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4 dark:text-white">
            Article Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Generate meta tags for Twitter Cards */}
      {generateMetaTags()}

      <div className="container mx-auto py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-4 dark:text-white">
            {article.title}
          </h1>

          {/* Cover Image - THEME-AWARE SIDE BARS */}
          {article.image_url && (
            <div className="mb-8">
              <div className="relative w-full max-h-96 overflow-hidden rounded-lg bg-white dark:bg-gray-900">
                <img
                  src={article.image_url}
                  alt={article.title}
                  className="w-full h-auto max-h-96 object-contain rounded-lg"
                  style={{
                    maxHeight: "24rem", // 384px (same as max-h-96)
                    width: "100%",
                    height: "auto",
                  }}
                  onLoad={(e) => {
                    // Optional: Add fade-in effect when image loads
                    e.currentTarget.style.opacity = "1";
                  }}
                  onError={(e) => {
                    // Hide the container if image fails to load
                    const container =
                      e.currentTarget.parentElement?.parentElement;
                    if (container) {
                      container.style.display = "none";
                    }
                  }}
                />
              </div>
            </div>
          )}
          {/* Article content - with whitespace preserved */}
          <div className="prose dark:prose-invert max-w-none mb-8">
            <div className="whitespace-pre-line dark:text-gray-300">
              {article.content}
            </div>
          </div>
          {/* UPDATED: Author, Date, and Category Section - NEW LAYOUT */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-6">
            {/* Author Section - Now first */}
            <div className="flex items-center mb-4">
              {/* Author Avatar and Info */}
              {authorProfile && (
                <Link
                  href={`/user/${authorProfile.id}`}
                  className="flex items-center hover:opacity-80"
                >
                  <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 overflow-hidden mr-3">
                    {authorProfile.avatar_url ? (
                      <img
                        src={authorProfile.avatar_url}
                        alt={authorProfile.username || "Author"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-semibold">
                        {(
                          authorProfile.full_name ||
                          authorProfile.username ||
                          "U"
                        )
                          .charAt(0)
                          .toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {authorProfile.full_name ||
                        authorProfile.username ||
                        "Anonymous"}
                    </div>
                    {authorProfile.username && (
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        @{authorProfile.username}
                      </div>
                    )}
                  </div>
                </Link>
              )}
            </div>

            {/* Category Badge and Date Section - Now below author */}
            <div className="flex items-center gap-4">
              {/* Category Badge */}
              {article.category && (
                <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 px-2 py-1 rounded text-sm">
                  {article.category}
                </span>
              )}

              {/* Date - Now to the right of the badge */}
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(article.published_at).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>
          {/* Bottom Action Bar with Views, Pin, and Share */}
          <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-6 mb-6">
            {/* Left side - Views, Pin (if author), Share */}
            <div className="flex items-center space-x-6">
              {/* View count */}
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <span className="text-sm">
                  {article.view_count || 0}{" "}
                  {article.view_count === 1 ? "View" : "Views"}
                </span>
              </div>

              {/* Pin Button - Only show for article author */}
              {isAuthor && (
                <PinButton articleId={article.id} showLabel={true} />
              )}

              {/* Share Button - Show for everyone */}
              <ShareButton
                articleId={article.id}
                articleSlug={article.slug}
                title={article.title}
                showLabel={true}
              />
            </div>

            {/* Right side - Author Actions */}
            <div className="flex items-center space-x-4">
              {/* Edit link for author */}
              {isAuthor && (
                <Link
                  href={`/articles/${article.slug}/edit`}
                  className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 text-sm"
                >
                  Edit
                </Link>
              )}
            </div>
          </div>
          {/* Feature Article Button - Admin only */}
          {article.id && <FeatureArticleButton articleId={article.id} />}
        </div>
      </div>
    </>
  );
}
