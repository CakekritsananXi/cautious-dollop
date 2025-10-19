"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import PostComposer from "./PostComposer";
import PostTimeline from "./PostTimeline";

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
        <h1 className="mb-4 text-4xl font-bold text-dark dark:text-white">
          Social Media Dashboard
        </h1>
        <p className="text-lg text-body dark:text-bodydark">
          Manage and schedule posts across all your social media platforms
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PostComposer onPostCreated={handlePostCreated} />
        </div>

        <div className="rounded-lg border border-stroke bg-white p-6 shadow-lg dark:border-dark-3 dark:bg-dark">
          <h2 className="mb-4 text-xl font-bold text-dark dark:text-white">
            Quick Stats
          </h2>
          <div className="space-y-4">
            <div className="rounded-lg bg-gray-50 p-4 dark:bg-dark-2">
              <p className="text-sm text-body dark:text-bodydark">Total Posts</p>
              <p className="text-3xl font-bold text-dark dark:text-white">
                {posts.length}
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4 dark:bg-dark-2">
              <p className="text-sm text-body dark:text-bodydark">
                Posted Today
              </p>
              <p className="text-3xl font-bold text-dark dark:text-white">
                {posts.filter((p) => {
                  const today = new Date().toDateString();
                  return new Date(p.postedAt).toDateString() === today;
                }).length}
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4 dark:bg-dark-2">
              <p className="text-sm text-body dark:text-bodydark">Scheduled</p>
              <p className="text-3xl font-bold text-dark dark:text-white">
                {posts.filter((p) => p.status === "scheduled").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="mb-6 text-2xl font-bold text-dark dark:text-white">
          Recent Posts
        </h2>
        <PostTimeline posts={posts} loading={loading} />
      </div>
    </div>
  );
}
