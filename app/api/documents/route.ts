import { NextResponse } from "next/server";
import { uploadToBlob } from "@/lib/blob";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { extractText } from "@/lib/extract-text";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let formData;
    try {
      formData = await request.formData();
    } catch (error) {
      console.error("Invalid form data:", error);
      return NextResponse.json(
        { error: "Invalid form data" },
        { status: 400 },
      );
    }
    const name = formData.get("name") as string;
    const content = formData.get("content") as string;
    const clerkOrgId = formData.get("organizationId") as string; //Reame to clarify
    const file = formData.get("file") as File;

    console.log("🔍 API Input:", {
      name,
      clerkOrgId,
      file: file?.name,
      fileSize: file?.size,
    });

    if (!name || !clerkOrgId) {
      return NextResponse.json(
        { error: "Name and organization ID are required" },
        { status: 400 },
      );
    }

    const organization = await prisma.organization.findUnique({  //get org from db using clerkid
      where: { clerkOrgId: clerkOrgId },
    });

    console.log("🔍 Found organization:", {
      found: !!organization,
      clerkId: clerkOrgId,
      dbId: organization?.id,
      name: organization?.name,
    });

    if (!organization) {
      return NextResponse.json(
        { error: `Organization not found for Clerk ID: ${clerkOrgId}` },
        { status: 404 },
      );
    }

    const user = await prisma.user.findUnique({  //get user
      where: { clerkUserId: userId },
      include: {
        memberships: {
          where: { organizationId: organization.id }, //us dbid
          include: {
            organization: true,
          },
        },
      },
    });

    console.log("🔍 User and memberships:", {
      userFound: !!user,
      userId: user?.id,
      email: user?.email,
      membershipsCount: user?.memberships?.length,
      membershipOrgIds: user?.memberships?.map((m) => m.organizationId),
    });

    if (!user || user.memberships.length === 0) {
      return NextResponse.json(
        {
          error: "You do not have access to this organization",
          details: `User ${userId} is not a member of ${organization.name}`,
        },
        { status: 403 },
      );
    }

    let fileUrl = null;
    let fileSize = null;
    let fileType = null;
    let extractedContent = content;

    if (file && file.size > 0) {    //upload file to vercelblob if exists
      let blob;
      try {
        blob = await uploadToBlob(file, clerkOrgId, userId);
      } catch (error) {
        console.error("Blob upload failed:", error);
        return NextResponse.json(
          { error: "Failed to upload file" },
          { status: 500 },
        );
      }
      fileUrl = blob.url;
      fileSize = file.size;
      fileType = file.type;

    if (!extractedContent) {
      try {
        extractedContent = await Promise.race([
          extractText(file),
          new Promise<string>((_, reject) =>
            setTimeout(
              () => reject(new Error("Text extraction timed out")),
              30000 // 30 seconds
            )
          ),
        ]);
        console.log("Extracted length:", extractedContent.length);
        console.log(
          extractedContent
            ? extractedContent.substring(0, 500)
            : "No text extracted"
        );
      } catch (err) {
        console.error("Text extraction failed:", err);
        extractedContent = "";
      }
    }
      console.log("Extracted content length:", extractedContent?.length);
      console.log("First 300 chars:");
      console.log(extractedContent?.slice(0, 300));

      console.log("✅ File uploaded:", { fileUrl, fileSize, fileType });
    }

    console.log("📝 Creating document with:", {         //create document-use dbids
      name,
      organizationId: organization.id,
      userId: user.id, 
    });
    const latest = await prisma.document.findFirst({
      where: {
        organizationId: organization.id,
        name,
        isLatest: true,
      },
      orderBy: {
        version: "desc",
      },
    });

    // const document = await prisma.$transaction(async (tx) => {
    let document;
    try {
      document = await prisma.$transaction(async (tx) => {
        if (latest) {
          await tx.document.update({
            where: { id: latest.id },
            data: { isLatest: false },
          });
        }

        return tx.document.create({
          data: {
            name,
            content: extractedContent || null,

            fileUrl,
            fileSize: fileSize || 0,
            fileType: fileType || "unknown",

            organizationId: organization.id,
            userId: user.id,

            version: latest ? latest.version + 1 : 1,
            parentId: latest ? (latest.parentId ?? latest.id) : null,
            isLatest: true,

            aiKeywords: [],
          },
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
            organization: {
              select: {
                name: true,
                clerkOrgId: true,
              },
            },
          },
        });
      });
    } catch (error) {
      console.error("Database transaction failed:", error);

      return NextResponse.json(
        { error: "Failed to save document" },
        { status: 500 },
      );
    }
      
    console.log("✅ Document created successfully:", document.id);

    return NextResponse.json({
      success: true,
      message: "Document uploaded successfully",
      document: {
        id: document.id,
        name: document.name,
        fileUrl: document.fileUrl,
        organization: document.organization.name,
        clerkOrgId: document.organization.clerkOrgId,
        uploadedBy: document.user.name,
      },
    });
  } catch (error) {
    console.error("Document upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const clerkOrgId = searchParams.get("organizationId");

    if (!clerkOrgId) {
      return NextResponse.json(
        { error: "Organization ID is required" },
        { status: 400 },
      );
    }

    const organization = await prisma.organization.findUnique({  //get org from db, wait
      where: { clerkOrgId: clerkOrgId },
    });

    if (!organization) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 },
      );
    }

    const user = await prisma.user.findUnique({   //vreify user has access to orgi
      where: { clerkUserId: userId },
      include: {
        memberships: {
          where: { organizationId: organization.id }, //Use dbif
          include: {
            organization: true,
          },
        },
      },
    });

    console.log("User", user);

    if (!user || user.memberships.length === 0) {
      return NextResponse.json(
        { error: "You do not have access to this organization" },
        { status: 403 },
      );
    }

    const documents = await prisma.document.findMany({
      where: {
        organizationId: organization.id,
        isLatest: true,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        organization: {
          select: {
            name: true,
            clerkOrgId: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      documents,
      metadata: {
        organization: organization.name,
        clerkOrgId: organization.clerkOrgId,
        documentCount: documents.length,
      },
    });
  } catch (error) {
    console.error("Get documents error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
