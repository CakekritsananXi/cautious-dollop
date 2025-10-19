import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/utils/prismaDB";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { name, description, platforms, postIds } = await req.json();

    if (!name || !platforms || platforms.length === 0) {
      return NextResponse.json(
        { error: "Campaign name and platforms are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const campaign = {
      id: `campaign-${Date.now()}`,
      name,
      description,
      platforms,
      postIds: postIds || [],
      userId: user.id,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return NextResponse.json(campaign, { status: 201 });
  } catch (error: any) {
    console.error("Error creating campaign:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { posts: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const postedCount = user.posts.filter((p) => p.status === "posted").length;
    const scheduledCount = user.posts.filter(
      (p) => p.status === "scheduled"
    ).length;

    const campaigns = [
      {
        id: "campaign-1",
        name: "Overall Campaign",
        description: "All posts",
        platforms: ["facebook", "instagram", "linkedin", "tiktok", "x"],
        postCount: user.posts.length,
        status: "active",
      },
    ];

    return NextResponse.json(campaigns);
  } catch (error: any) {
    console.error("Error fetching campaigns:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
