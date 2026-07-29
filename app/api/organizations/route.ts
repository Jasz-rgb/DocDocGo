import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const { clerkOrgId, name, slug } = body;

    if (!clerkOrgId || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingOrg = await prisma.organization.findUnique({
      where: { clerkOrgId },
    });

    if (existingOrg) {
      return NextResponse.json(
        {
          error: "Organization already exists",
          organization: existingOrg,
        },
        { status: 409 }
      );
    }

    let user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkUserId: userId,
          email: `${userId}@temp.com`,
          name: "User",
        },
      });
    }

    const organization = await prisma.organization.create({
      data: {
        clerkOrgId,
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
      },
    });

    await prisma.organizationMember.create({
      data: {
        userId: user.id,
        organizationId: organization.id,
        role: "owner",
      },
    });

    return NextResponse.json({
      success: true,
      organization,
      message: "Organization created successfully",
    });
  } catch (error) {
    console.error("[ORGANIZATIONS_POST]", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}