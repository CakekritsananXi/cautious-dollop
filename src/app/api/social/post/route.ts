import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/utils/prismaDB";

const AYRSHARE_API_KEY = process.env.AYRSHARE_API_KEY;
const AYRSHARE_BASE_URL = "https://api.ayrshare.com/api";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { content, mediaUrls = [], platforms, scheduledFor } = await req.json();

    if (!content || !platforms || platforms.length === 0) {
      return NextResponse.json(
        { error: "Content and at least one platform are required" },
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

    const post = await prisma.socialPost.create({
      data: {
        userId: user.id,
        content,
        mediaUrls,
        platforms,
        scheduledFor: scheduledFor ? new DateTime(scheduledFor) : null,
        status: scheduledFor ? "scheduled" : "draft",
      },
    });

    if (!scheduledFor) {
      const postPayload = {
        post: content,
        platforms,
        mediaUrls: mediaUrls.length > 0 ? mediaUrls : undefined,
      };

      try {
        const response = await fetch(`${AYRSHARE_BASE_URL}/post`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AYRSHARE_API_KEY}`,
          },
          body: JSON.stringify(postPayload),
        });

        const result = await response.json();

        if (response.ok) {
          await prisma.socialPost.update({
            where: { id: post.id },
            data: {
              ayrshareId: result.id,
              status: "posted",
              postedAt: new Date(),
            },
          });
        } else {
          await prisma.socialPost.update({
            where: { id: post.id },
            data: {
              status: "failed",
              error: result.message || "Failed to post",
            },
          });
        }
      } catch (error: any) {
        await prisma.socialPost.update({
          where: { id: post.id },
          data: {
            status: "failed",
            error: error.message,
          },
        });
      }
    }

    return NextResponse.json(post, { status: 201 });
  } catch (error: any) {
    console.error("Error creating post:", error);
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
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const posts = await prisma.socialPost.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json(posts);
  } catch (error: any) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
