"use client";

const platformIcons: { [key: string]: string } = {
  facebook: "📘",
  instagram: "📷",
  linkedin: "💼",
  tiktok: "🎵",
  x: "𝕏",
};

const statusConfig: { [key: string]: { color: string; label: string } } = {
  posted: { color: "text-green-600 dark:text-green-400", label: "Published" },
  scheduled: { color: "text-blue-600 dark:text-blue-400", label: "Scheduled" },
  draft: { color: "text-gray-600 dark:text-gray-400", label: "Draft" },
  failed: { color: "text-red-600 dark:text-red-400", label: "Failed" },
};

interface PostCardProps {
  post: {
    id: string;
    content: string;
    platforms: string[];
    status: string;
    postedAt?: string;
    scheduledFor?: string;
    createdAt: string;
    error?: string;
  };
}

export default function PostCard({ post }: PostCardProps) {
  const config = statusConfig[post.status] || statusConfig.draft;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="rounded-lg border border-stroke bg-white p-6 shadow-md transition hover:shadow-lg dark:border-dark-3 dark:bg-dark">
      <div className="mb-4 flex items-start justify-between">
        <div className={`font-semibold ${config.color}`}>{config.label}</div>
        {post.error && (
          <div className="text-xs text-red-600 dark:text-red-400">
            {post.error.substring(0, 20)}...
          </div>
        )}
      </div>

      <p className="mb-4 line-clamp-3 text-dark dark:text-white">{post.content}</p>

      <div className="mb-4 flex flex-wrap gap-2">
        {post.platforms.map((platform) => (
          <span
            key={platform}
            className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-dark dark:bg-dark-2 dark:text-white"
          >
            <span>{platformIcons[platform] || "📱"}</span>
            {platform.charAt(0).toUpperCase() + platform.slice(1)}
          </span>
        ))}
      </div>

      <div className="space-y-2 border-t border-stroke pt-4 dark:border-dark-3">
        <div className="flex justify-between text-xs text-body dark:text-bodydark">
          <span>Created</span>
          <span>{formatDate(post.createdAt)}</span>
        </div>

        {post.postedAt && (
          <div className="flex justify-between text-xs text-body dark:text-bodydark">
            <span>Published</span>
            <span>{formatDate(post.postedAt)}</span>
          </div>
        )}

        {post.scheduledFor && (
          <div className="flex justify-between text-xs text-body dark:text-bodydark">
            <span>Scheduled for</span>
            <span>{formatDate(post.scheduledFor)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
