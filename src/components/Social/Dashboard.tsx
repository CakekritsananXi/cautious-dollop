"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import PostComposer from "./PostComposer";
import PostTimeline from "./PostTimeline";
import Analytics from "./Analytics";

export default function SocialDashboard() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/social/post");
        if (response.ok) {
          const data = await response.json();
          setPosts(data);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [refreshTrigger]);

  const handlePostCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12">
        <div className="flex flex-col justify-between sm:flex-row sm:items-center">
          <div>
            <h1 className="mb-3 text-4xl font-bold text-dark dark:text-white">
              Social Media Dashboard
            </h1>
            <p className="text-lg text-body dark:text-bodydark">
              Manage and schedule posts across all your social media platforms
            </p>
          </div>
          <div className="mt-6 sm:mt-0">
            <a
              href="#analytics"
              className="inline-block rounded-lg bg-primary px-6 py-3 font-medium text-white transition hover:bg-opacity-90"
            >
              View Analytics
            </a>
          </div>
        </div>
      </div>

      <div id="analytics" className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-dark dark:text-white">
          Analytics
        </h2>
        {session?.user?.email && <Analytics userId={session.user.email} />}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PostComposer onPostCreated={handlePostCreated} />
        </div>

        <div className="rounded-lg border border-stroke bg-white p-6 shadow-lg dark:border-dark-3 dark:bg-dark">
          <h2 className="mb-4 text-xl font-bold text-dark dark:text-white">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <button className="w-full rounded-lg bg-blue-50 px-4 py-3 text-left font-medium text-blue-600 transition hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30">
              📱 Link Social Accounts
            </button>
            <button className="w-full rounded-lg bg-green-50 px-4 py-3 text-left font-medium text-green-600 transition hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30">
              📊 View Campaign Analytics
            </button>
            <button className="w-full rounded-lg bg-purple-50 px-4 py-3 text-left font-medium text-purple-600 transition hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:hover:bg-purple-900/30">
              ✨ Create Campaign
            </button>
            <button className="w-full rounded-lg bg-orange-50 px-4 py-3 text-left font-medium text-orange-600 transition hover:bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:hover:bg-orange-900/30">
              🎯 View Settings
            </button>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-dark dark:text-white">
            Recent Posts
          </h2>
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary dark:bg-primary/20">
            {posts.length} posts
          </span>
        </div>
        <PostTimeline posts={posts} loading={loading} />
      </div>
    </div>
  );
}
