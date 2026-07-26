import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { orgId, userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!orgId) {
    return NextResponse.json(
      { error: "No active organization" },
      { status: 400 }
    );
  }

  const client = await clerkClient();

  const members =
    await client.organizations.getOrganizationMembershipList({
      organizationId: orgId,
    });

  return NextResponse.json(members.data);
}