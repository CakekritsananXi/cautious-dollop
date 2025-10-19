import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/utils/prismaDB";

const AYRSHARE_API_KEY = process.env.AYRSHARE_API_KEY;
const AYRSHARE_BASE_URL = "https://api.ayrshare.com/api";

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
      include: { socialAccounts: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user.socialAccounts);
  } catch (error: any) {
    console.error("Error fetching social accounts:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { platform, username, profileUrl } = await req.json();

    if (!platform || !username) {
      return NextResponse.json(
        { error: "Platform and username are required" },
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

    const account = await prisma.socialAccount.create({
      data: {
        userId: user.id,
        platform,
        username,
        profileUrl,
        isActive: true,
      },
    });

    return NextResponse.json(account, { status: 201 });
  } catch (error: any) {
    console.error("Error creating social account:", error);

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Account already exists for this platform" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
