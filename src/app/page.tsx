"use client";

import Link from "next/link";
import { useState } from "react";
import ThisDayInHistory from "@/components/ThisDayInHistory";

// Mock data for testing - expanded to include more posts
const allPosts = [
  {
    id: "1",
    title: "The Fall of Rome: Myths and Realities",
    slug: "fall-of-rome-myths-realities",
    date: "March 15, 2024",
    excerpt:
      "Exploring the complex factors that led to the decline of the Roman Empire and separating historical fact from fiction.",
  },
  {
    id: "2",
    title: "Medieval Medicine: More Advanced Than You Think",
    slug: "medieval-medicine-advancements",
    date: "March 10, 2024",
    excerpt:
      "Challenging common misconceptions about medical practices in the Middle Ages.",
  },
  {
    id: "3",
    title: "The Real Story Behind the Cuban Missile Crisis",
    slug: "cuban-missile-crisis-real-story",
    date: "March 5, 2024",
    excerpt:
      "Declassified documents reveal new insights into how close the world came to nuclear war.",
  },
  {
    id: "4",
    title: "Renaissance Art: The Hidden Symbolism",
    slug: "renaissance-art-hidden-symbolism",
    date: "February 28, 2024",
    excerpt:
      "A deep dive into the secret messages and symbols embedded in famous Renaissance paintings.",
  },
  {
    id: "5",
    title: "The Silk Road: Cultural Exchange Across Continents",
    slug: "silk-road-cultural-exchange",
    date: "February 22, 2024",
    excerpt:
      "How ancient trade routes shaped the development of civilizations from China to Europe.",
  },
  {
    id: "6",
    title: "Women Warriors: Forgotten Female Military Leaders",
    slug: "women-warriors-forgotten-leaders",
    date: "February 18, 2024",
    excerpt:
      "From Ancient China to Medieval Europe, discover the powerful women who commanded armies throughout history.",
  },
  {
    id: "7",
    title: "The Spanish Flu: Lessons from History's Deadliest Pandemic",
    slug: "spanish-flu-lessons",
    date: "February 15, 2024",
    excerpt:
      "Examining the 1918 pandemic and what it can teach us about global health crises.",
  },
  {
    id: "8",
    title: "Lost Cities: Rediscovering Ancient Urban Centers",
    slug: "lost-cities-rediscovering",
    date: "February 10, 2024",
    excerpt:
      "Archaeological breakthroughs revealing forgotten metropolises from Angkor to Cahokia.",
  },
  {
    id: "9",
    title: "The Viking Age: Beyond the Raider Stereotype",
    slug: "viking-age-beyond-stereotype",
    date: "February 5, 2024",
    excerpt:
      "Recent research uncovering the complex society, trade networks, and cultural achievements of the Norse people.",
  },
  {
    id: "10",
    title: "Great Depression Economics: Myths and Realities",
    slug: "great-depression-economics",
    date: "January 28, 2024",
    excerpt:
      "Analyzing the causes and consequences of the 1929 crash and challenging common misconceptions.",
  },
  {
    id: "11",
    title: "The Untold Story of the Harlem Renaissance",
    slug: "untold-harlem-renaissance",
    date: "January 25, 2024",
    excerpt:
      "Exploring the artistic, literary, and musical explosion that reshaped American culture in the 1920s.",
  },
  {
    id: "12",
    title: "Ancient Greek Democracy: Not What You Think",
    slug: "ancient-greek-democracy",
    date: "January 20, 2024",
    excerpt:
      "How Athens' political system differed from modern democratic ideals and what we can learn from it.",
  },
  {
    id: "13",
    title: "The Space Race: Cold War Science and Technology",
    slug: "space-race-cold-war",
    date: "January 15, 2024",
    excerpt:
      "How competition between superpowers drove unprecedented advances in aerospace technology.",
  },
  {
    id: "14",
    title: "Pirates of the Caribbean: The Real History",
    slug: "pirates-caribbean-real-history",
    date: "January 10, 2024",
    excerpt:
      "Separating historical fact from Hollywood fiction about the Golden Age of Piracy.",
  },
  {
    id: "15",
    title: "The Forgotten Pandemic of 1957",
    slug: "forgotten-pandemic-1957",
    date: "January 5, 2024",
    excerpt:
      "Examining the H2N2 influenza pandemic that killed over a million people globally but faded from memory.",
  },
  {
    id: "16",
    title: "Ancient Egyptian Engineering Marvels",
    slug: "ancient-egyptian-engineering",
    date: "December 28, 2023",
    excerpt:
      "The innovative construction techniques behind pyramids, temples, and other monumental structures.",
  },
  {
    id: "17",
    title: "The True Origins of Chess",
    slug: "true-origins-chess",
    date: "December 25, 2023",
    excerpt:
      "Tracing the evolution of the world's most enduring strategy game across cultures and millennia.",
  },
  {
    id: "18",
    title: "Colonial America's Forgotten Religions",
    slug: "colonial-america-religions",
    date: "December 20, 2023",
    excerpt:
      "Beyond the Puritans: The diverse spiritual landscape of early American settlements.",
  },
  {
    id: "19",
    title: "The Industrial Revolution's Environmental Impact",
    slug: "industrial-revolution-environment",
    date: "December 15, 2023",
    excerpt:
      "How 19th-century industrialization transformed landscapes and sparked early conservation movements.",
  },
  {
    id: "20",
    title: "Forgotten Allied Powers of World War II",
    slug: "forgotten-allied-powers",
    date: "December 10, 2023",
    excerpt:
      "The contributions of smaller nations and resistance movements that are often overlooked in WWII narratives.",
  },
  {
    id: "21",
    title: "The Quest for the Northwest Passage",
    slug: "northwest-passage-quest",
    date: "December 5, 2023",
    excerpt:
      "Centuries of dangerous expeditions seeking a northern sea route between Atlantic and Pacific.",
  },
];

// First 3 posts are featured
const featuredPosts = allPosts.slice(0, 3);
// Rest of the posts for expansion
const additionalPosts = allPosts.slice(3);

export default function Home() {
  const [showAllArticles, setShowAllArticles] = useState(false);

  const historicalEras = [
    { name: "Ancient History", url: "/blog/category/ancient-history" },
    { name: "Medieval Period", url: "/blog/category/medieval-period" },
    { name: "Renaissance", url: "/blog/category/renaissance" },
    { name: "Early Modern Period", url: "/blog/category/early-modern-period" },
    { name: "Industrial Age", url: "/blog/category/industrial-age" },
    { name: "20th Century", url: "/blog/category/20th-century" },
    { name: "World Wars", url: "/blog/category/world-wars" },
    { name: "Cold War Era", url: "/blog/category/cold-war-era" },
    { name: "Modern History", url: "/blog/category/modern-history" },
  ];

  const toggleArticles = () => {
    setShowAllArticles(!showAllArticles);
  };

  return (
    <div className="container mx-auto px-4">
      {/* Hero Section */}
      <section className="bg-blue-900 text-white py-16 px-4 mb-12 rounded-lg">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            Uncovering the Past, One Story at a Time
          </h1>
          <p className="text-xl mb-8">
            Explore fascinating historical events, figures, and eras through
            in-depth articles, timelines, and analyses.
          </p>
          <Link
            href="/blog"
            className="inline-block bg-white text-blue-900 px-6 py-3 rounded-md font-semibold hover:bg-blue-100 transition-colors"
          >
            Explore Articles
          </Link>
        </div>
      </section>

      {/* This Day in History Widget */}
      <ThisDayInHistory />

      {/* Featured Posts */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Articles</h2>
          <button
            onClick={toggleArticles}
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            {showAllArticles ? "Show Less" : "View All Articles"}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`ml-1 h-5 w-5 transition-transform duration-200 ${
                showAllArticles ? "rotate-180" : ""
              }`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Featured Posts (Always visible) */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow-md overflow-hidden p-4"
            >
              <div className="h-48 bg-slate-200 mb-4 rounded overflow-hidden">
                {/* In production, use next/image component for optimized images */}
                <div className="w-full h-full flex items-center justify-center text-slate-500">
                  [Featured Image: {post.title}]
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-slate-800 hover:text-blue-600"
                  >
                    {post.title}
                  </Link>
                </h3>
                <p className="text-slate-600 text-sm mb-2">{post.date}</p>
                <p className="text-slate-700">{post.excerpt}</p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-block mt-4 text-blue-600 hover:text-blue-800"
                >
                  Read More →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Posts (Toggle Visibility) */}
        {showAllArticles && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {additionalPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg shadow-md overflow-hidden p-4 animate-fadeIn"
              >
                <div className="h-48 bg-slate-200 mb-4 rounded overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center text-slate-500">
                    [Featured Image: {post.title}]
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-slate-800 hover:text-blue-600"
                    >
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-slate-600 text-sm mb-2">{post.date}</p>
                  <p className="text-slate-700">{post.excerpt}</p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-block mt-4 text-blue-600 hover:text-blue-800"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Historical Eras */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Explore Historical Eras</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {historicalEras.map((era) => (
            <Link
              key={era.name}
              href={era.url}
              className="bg-white p-4 rounded-lg shadow text-center hover:bg-blue-50 hover:shadow-md transition-all"
            >
              {era.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="bg-slate-100 p-8 rounded-lg">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="mb-6">
            Subscribe to our newsletter to receive the latest articles and
            historical insights.
          </p>
          <form className="flex flex-col md:flex-row gap-2">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Add some animation styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
