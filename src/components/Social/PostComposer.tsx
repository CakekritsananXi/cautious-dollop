"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import PlatformSelector from "./PlatformSelector";
import ScheduleModal from "./ScheduleModal";

interface PostComposerProps {
  onPostCreated?: () => void;
}

export default function PostComposer({ onPostCreated }: PostComposerProps) {
  const [content, setContent] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const handlePlatformToggle = (platform: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  const handleSchedule = (date: Date) => {
    setScheduledDate(date);
    setShowScheduleModal(false);
    toast.success(`Post scheduled for ${date.toLocaleString()}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error("Please write some content");
      return;
    }

    if (selectedPlatforms.length === 0) {
      toast.error("Please select at least one platform");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/social/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          mediaUrls,
          platforms: selectedPlatforms,
          scheduledFor: scheduledDate,
        }),
      });

      if (response.ok) {
        toast.success(
          scheduledDate
            ? `Post scheduled for ${scheduledDate.toLocaleString()}`
            : "Post published successfully!"
        );
        setContent("");
        setSelectedPlatforms([]);
        setMediaUrls([]);
        setScheduledDate(null);
        onPostCreated?.();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to create post");
      }
    } catch (error) {
      toast.error("Error creating post");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg border border-stroke bg-white shadow-lg dark:border-dark-3 dark:bg-dark">
      <form onSubmit={handleSubmit} className="p-6">
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
            What's on your mind?
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts, news, or updates with your audience..."
            className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none transition placeholder:text-bodydark focus:border-primary dark:border-dark-3 dark:text-white"
            rows={5}
            maxLength={280}
          />
          <div className="mt-2 text-right text-sm text-body dark:text-bodydark">
            {content.length}/280
          </div>
        </div>

        <div className="mb-6">
          <label className="mb-3 block text-sm font-medium text-dark dark:text-white">
            Select Platforms
          </label>
          <PlatformSelector
            selectedPlatforms={selectedPlatforms}
            onToggle={handlePlatformToggle}
          />
        </div>

        <div className="mb-6 flex flex-wrap gap-4">
          <button
            type="button"
            onClick={() => setShowScheduleModal(true)}
            className="flex items-center gap-2 rounded-lg border border-stroke bg-white px-4 py-2 text-sm font-medium text-dark transition hover:bg-gray-50 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Schedule
          </button>

          {scheduledDate && (
            <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 dark:bg-blue-900/20">
              <span className="text-sm text-blue-600 dark:text-blue-400">
                Scheduled for: {scheduledDate.toLocaleString()}
              </span>
              <button
                type="button"
                onClick={() => setScheduledDate(null)}
                className="ml-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                ×
              </button>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading || !content.trim() || selectedPlatforms.length === 0}
            className="flex-1 rounded-lg bg-primary px-6 py-3 font-medium text-white transition hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Publishing..." : scheduledDate ? "Schedule Post" : "Publish Now"}
          </button>
        </div>
      </form>

      {showScheduleModal && (
        <ScheduleModal
          onSchedule={handleSchedule}
          onClose={() => setShowScheduleModal(false)}
        />
      )}
    </div>
  );
}
