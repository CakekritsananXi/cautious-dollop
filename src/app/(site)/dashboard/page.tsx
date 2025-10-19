import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import SocialDashboard from "@/components/Social/Dashboard";

export const metadata = {
  title: "Social Dashboard | Ayrshare Integration",
  description: "Manage your social media posts across multiple platforms",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }

  return (
    <main className="relative overflow-hidden pt-16 lg:pt-[100px]">
      <SocialDashboard />
    </main>
  );
}
