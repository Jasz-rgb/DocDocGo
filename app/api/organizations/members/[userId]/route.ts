import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const {
    userId: currentUserId,
    orgId,
    orgRole,
  } = await auth();

  if (!currentUserId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  if (!orgId) {
    return NextResponse.json(
      { error: "No active organization" },
      { status: 400 }
    );
  }

  if (orgRole !== "org:admin" && orgRole !== "org:owner") {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  const { userId } = await params;

  const client = await clerkClient();

  const deletedMembership =
    await client.organizations.deleteOrganizationMembership({
      organizationId: orgId,
      userId,
    });

  console.log("Deleted membership:", deletedMembership);

  return NextResponse.json(deletedMembership);
}