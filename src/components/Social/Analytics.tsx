"use client";

import { useState, useEffect } from "react";

interface AnalyticsProps {
  userId: string;
}

export default function Analytics({ userId }: AnalyticsProps) {
  const [stats, setStats] = useState({
    totalPosts: 0,
    postedToday: 0,
    scheduled: 0,
    failed: 0,
    topPlatform: "facebook",
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/social/post");
        if (response.ok) {
          const posts = await response.json();
          const today = new Date().toDateString();

          const postedToday = posts.filter((p: any) => {
            return p.postedAt && new Date(p.postedAt).toDateString() === today;
          }).length;

          const platformCounts: { [key: string]: number } = {};
          posts.forEach((p: any) => {
            p.platforms.forEach((platform: string) => {
              platformCounts[platform] = (platformCounts[platform] || 0) + 1;
            });
          });

          const topPlatform =
            Object.entries(platformCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ||
            "facebook";

          setStats({
            totalPosts: posts.length,
            postedToday,
            scheduled: posts.filter((p: any) => p.status === "scheduled").length,
            failed: posts.filter((p: any) => p.status === "failed").length,
            topPlatform,
          });
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({
    label,
    value,
    trend,
    icon,
  }: {
    label: string;
    value: number;
    trend?: string;
    icon: string;
  }) => (
    <div className="rounded-lg border border-stroke bg-white p-6 shadow-md dark:border-dark-3 dark:bg-dark">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-body dark:text-bodydark">
            {label}
          </p>
          <p className="mt-2 text-3xl font-bold text-dark dark:text-white">
            {value}
          </p>
          {trend && (
            <p className="mt-2 text-xs text-green-600 dark:text-green-400">
              ↑ {trend}
            </p>
          )}
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Total Posts"
        value={stats.totalPosts}
        icon="📊"
        trend="12% increase"
      />
      <StatCard
        label="Posted Today"
        value={stats.postedToday}
        icon="✅"
        trend="Real-time"
      />
      <StatCard
        label="Scheduled"
        value={stats.scheduled}
        icon="⏱️"
        trend="Upcoming"
      />
      <StatCard
        label="Failed"
        value={stats.failed}
        icon="⚠️"
        trend="Needs attention"
      />
    </div>
  );
}
