"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface SocialAccount {
  id: string;
  platform: string;
  username: string;
  profileUrl?: string;
  isActive: boolean;
}

export default function SocialSettings() {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    platform: "facebook",
    username: "",
    profileUrl: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const platforms = [
    { id: "facebook", name: "Facebook", icon: "📘" },
    { id: "instagram", name: "Instagram", icon: "📷" },
    { id: "linkedin", name: "LinkedIn", icon: "💼" },
    { id: "tiktok", name: "TikTok", icon: "🎵" },
    { id: "x", name: "X (Twitter)", icon: "𝕏" },
  ];

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await fetch("/api/social/accounts");
      if (response.ok) {
        const data = await response.json();
        setAccounts(data);
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
      toast.error("Failed to fetch accounts");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username) {
      toast.error("Please enter a username");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/social/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Account added successfully!");
        setFormData({ platform: "facebook", username: "", profileUrl: "" });
        setShowAddForm(false);
        fetchAccounts();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to add account");
      }
    } catch (error) {
      toast.error("Error adding account");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="mb-3 text-4xl font-bold text-dark dark:text-white">
          Social Settings
        </h1>
        <p className="text-lg text-body dark:text-bodydark">
          Manage your linked social media accounts
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-stroke bg-white p-6 shadow-lg dark:border-dark-3 dark:bg-dark">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-dark dark:text-white">
                Linked Accounts
              </h2>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="rounded-lg bg-primary px-4 py-2 font-medium text-white transition hover:bg-opacity-90"
              >
                {showAddForm ? "Cancel" : "+ Add Account"}
              </button>
            </div>

            {showAddForm && (
              <form
                onSubmit={handleAddAccount}
                className="mb-6 space-y-4 rounded-lg bg-gray-50 p-4 dark:bg-dark-2"
              >
                <div>
                  <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                    Platform
                  </label>
                  <select
                    value={formData.platform}
                    onChange={(e) =>
                      setFormData({ ...formData, platform: e.target.value })
                    }
                    className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:text-white"
                  >
                    {platforms.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                    Username
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    placeholder="@username"
                    className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                    Profile URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={formData.profileUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, profileUrl: e.target.value })
                    }
                    placeholder="https://..."
                    className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-lg bg-primary px-4 py-2 font-medium text-white transition hover:bg-opacity-90 disabled:opacity-50"
                >
                  {submitting ? "Adding..." : "Add Account"}
                </button>
              </form>
            )}

            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-stroke border-t-primary dark:border-dark-3 dark:border-t-primary"></div>
              </div>
            ) : accounts.length === 0 ? (
              <div className="rounded-lg border-2 border-dashed border-stroke py-12 text-center dark:border-dark-3">
                <p className="text-body dark:text-bodydark">
                  No accounts linked yet. Add your first social media account!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {accounts.map((account) => {
                  const platform = platforms.find((p) => p.id === account.platform);
                  return (
                    <div
                      key={account.id}
                      className="flex items-center justify-between rounded-lg border border-stroke bg-gray-50 p-4 dark:border-dark-3 dark:bg-dark-2"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-2xl">{platform?.icon}</span>
                        <div>
                          <p className="font-medium text-dark dark:text-white">
                            {platform?.name}
                          </p>
                          <p className="text-sm text-body dark:text-bodydark">
                            @{account.username}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            account.isActive
                              ? "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                              : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                          }`}
                        >
                          {account.isActive ? "Active" : "Inactive"}
                        </span>
                        {account.profileUrl && (
                          <a
                            href={account.profileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            View Profile →
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-stroke bg-white p-6 shadow-lg dark:border-dark-3 dark:bg-dark">
          <h3 className="mb-4 text-lg font-bold text-dark dark:text-white">
            Available Platforms
          </h3>
          <div className="space-y-3">
            {platforms.map((platform) => (
              <div
                key={platform.id}
                className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 dark:bg-dark-2"
              >
                <span className="text-2xl">{platform.icon}</span>
                <div>
                  <p className="font-medium text-dark dark:text-white">
                    {platform.name}
                  </p>
                  <p className="text-xs text-body dark:text-bodydark">
                    {accounts.some((a) => a.platform === platform.id)
                      ? "Linked"
                      : "Not linked"}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-lg border-l-4 border-blue-500 bg-blue-50 p-4 dark:bg-blue-900/20">
            <h4 className="font-medium text-blue-600 dark:text-blue-400">
              💡 Pro Tip
            </h4>
            <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">
              Link all your social accounts to publish across all platforms at once!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
