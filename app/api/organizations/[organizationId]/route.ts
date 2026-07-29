import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deleteFromBlob } from "@/lib/blob";

interface RouteParams {
  params: Promise<{ organizationId: string }>;
}

export async function DELETE(
  request: Request,
  { params }: RouteParams
) {
  try {
    const { organizationId } = await params;
    const { userId, orgId, orgRole } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!orgId || orgId !== organizationId) {
      return NextResponse.json(
        { error: "Invalid organization" },
        { status: 403 }
      );
    }

    if (orgRole !== "org:owner") {
      return NextResponse.json(
        { error: "Only the organization owner can delete it." },
        { status: 403 }
      );
    }

    const organization = await prisma.organization.findUnique({
      where: {
        clerkOrgId: organizationId,
      },
    });

    if (!organization) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    //get all documents and delete files
    const documents = await prisma.document.findMany({
      where: {
        organizationId: organization.id,
      },
    });
    for (const doc of documents) {
      if (doc.fileUrl) {
        try {
          await deleteFromBlob(doc.fileUrl);
        } catch (err) {
          console.error(
            `Failed to delete blob for ${doc.id}:`,
            err
          );
        }
      }
    }

    //delete documents
    await prisma.document.deleteMany({
      where: {
        organizationId: organization.id,
      },
    });

    //delete organization members
    await prisma.organizationMember.deleteMany({
      where: {
        organizationId: organization.id,
      },
    });

    //delete organization from database
    await prisma.organization.delete({
      where: {
        id: organization.id,
      },
    });

    //delete organization from clerk
    const client = await clerkClient();
    await client.organizations.deleteOrganization(organizationId);

    return NextResponse.json({
      success: true,
      message: "Organization deleted successfully",
    });
  } catch (error) {
    console.error("Delete organization error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}