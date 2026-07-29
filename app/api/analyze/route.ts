import { NextResponse } from "next/server";
import { analyzeWithGemini } from "@/lib/gemini";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    //1. Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Please sign in" },
        { status: 401 }
      );
    }

    //2. Parse request body
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }
    const { documentId, organizationId, analysisType } = body;
    if (!documentId || !organizationId) {
      return NextResponse.json(
        { error: "Missing document or organization ID" },
        { status: 400 }
      );
    }

    //3. Find document
    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        organization: {
          clerkOrgId: organizationId,
          members: {
            some: {
              user: { clerkUserId: userId },
            },
          },
        },
      },
    });

    if (!document) {
      return NextResponse.json(
        { error: "Document not found or no access" },
        { status: 404 }
      );
    }

    //4. validate content
    const content = document.content || document.name;
    if (!content || content.trim().length < 5) {
      return NextResponse.json(
        { error: "Document has no content to analyze" },
        { status: 400 }
      );
    }

    //5. Analyze
    const summary = await analyzeWithGemini(content, analysisType);

    //6. Save
    const updatedDocument = await prisma.document.update({
      where: { id: documentId },
      data: {
        aiSummary: summary,
        aiKeywords: ["analyzed"],
        sentiment: "analyzed",
      },
    });

    //7. Success
    return NextResponse.json({
      success: true,
      summary,
      document: {
        id: updatedDocument.id,
        name: updatedDocument.name,
        aiSummary: updatedDocument.aiSummary,
      },
    });
  } catch (error) {
    console.error("Analysis error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}