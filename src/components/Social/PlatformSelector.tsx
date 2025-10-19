"use client";

interface PlatformSelectorProps {
  selectedPlatforms: string[];
  onToggle: (platform: string) => void;
}

const platforms = [
  {
    id: "facebook",
    name: "Facebook",
    icon: "📘",
    color: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: "📷",
    color: "bg-pink-100 dark:bg-pink-900/30",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: "💼",
    color: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: "🎵",
    color: "bg-black dark:bg-gray-800",
  },
  {
    id: "x",
    name: "X (Twitter)",
    icon: "𝕏",
    color: "bg-gray-100 dark:bg-gray-800",
  },
];

export default function PlatformSelector({
  selectedPlatforms,
  onToggle,
}: PlatformSelectorProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {platforms.map((platform) => (
        <button
          key={platform.id}
          type="button"
          onClick={() => onToggle(platform.id)}
          className={`rounded-lg border-2 p-4 text-center transition ${
            selectedPlatforms.includes(platform.id)
              ? "border-primary bg-primary/10 dark:bg-primary/20"
              : "border-stroke bg-gray-50 dark:border-dark-3 dark:bg-dark-2"
          }`}
        >
          <div className="text-2xl">{platform.icon}</div>
          <div className="mt-2 text-sm font-medium text-dark dark:text-white">
            {platform.name}
          </div>
          <div className="mt-1">
            {selectedPlatforms.includes(platform.id) && (
              <span className="text-xs font-semibold text-primary">✓ Selected</span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
