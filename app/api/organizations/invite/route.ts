import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { orgId, orgRole, userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!orgId) {
    return NextResponse.json(
      { error: "No active organization" },
      { status: 400 }
    );
  }

  if (orgRole !== "org:admin" && orgRole !== "org:owner") {
    return NextResponse.json(
      { error: "Only admins can invite members." },
      { status: 403 }
    );
  }

  const { email } = await req.json();

  if (!email) {
    return NextResponse.json(
      { error: "Email is required." },
      { status: 400 }
    );
  }

  const client = await clerkClient();

  try {
    const invitation =
      await client.organizations.createOrganizationInvitation({
        organizationId: orgId,
        inviterUserId: userId,
        emailAddress: email,
        role: "org:member",
      });

    return NextResponse.json(invitation);
  } catch (err: any) {
    console.error(err.errors);

    return NextResponse.json(
      {
        error: err.errors,
      },
      { status: 400 }
    );
  }
}
const client = await clerkClient();
