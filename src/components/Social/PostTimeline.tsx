"use client";

import { useState } from "react";
import PostCard from "./PostCard";

interface PostTimelineProps {
  posts: any[];
  loading: boolean;
}

type FilterStatus = "all" | "posted" | "scheduled" | "draft" | "failed";

export default function PostTimeline({ posts, loading }: PostTimelineProps) {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");

  const filteredPosts = posts.filter((post) => {
    if (filterStatus === "all") return true;
    return post.status === filterStatus;
  });

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-stroke border-t-primary dark:border-dark-3 dark:border-t-primary"></div>
          <p className="text-body dark:text-bodydark">Loading posts...</p>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="rounded-lg border border-stroke bg-white p-12 text-center dark:border-dark-3 dark:bg-dark">
        <svg
          className="mx-auto mb-4 h-16 w-16 text-body dark:text-bodydark"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="mb-2 text-lg font-semibold text-dark dark:text-white">
          No posts yet
        </h3>
        <p className="text-body dark:text-bodydark">
          Create your first post to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {(["all", "posted", "scheduled", "draft", "failed"] as FilterStatus[]).map(
          (status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition ${
                filterStatus === status
                  ? "bg-primary text-white"
                  : "border border-stroke bg-white text-dark dark:border-dark-3 dark:bg-dark dark:text-white"
              }`}
            >
              {status}
              <span className="ml-2 inline-block rounded-full bg-white/30 px-2 py-0.5 text-xs">
                {posts.filter((p) => p.status === status).length}
              </span>
            </button>
          )
        )}
      </div>

      {filteredPosts.length === 0 ? (
        <div className="rounded-lg border border-stroke bg-white p-8 text-center dark:border-dark-3 dark:bg-dark">
          <p className="text-body dark:text-bodydark">
            No {filterStatus} posts to display
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
