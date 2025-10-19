import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import SocialSettings from "@/components/Social/Settings";

export const metadata = {
  title: "Social Settings | Dashboard",
  description: "Manage your social media accounts and preferences",
};

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }

  return (
    <main className="relative overflow-hidden pt-16 lg:pt-[100px]">
      <SocialSettings />
    </main>
  );
}
