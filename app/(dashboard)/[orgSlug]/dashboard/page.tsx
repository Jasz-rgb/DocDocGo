import { redirect } from "next/navigation";
import {Card,CardContent,CardDescription,CardHeader,CardTitle,} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Users, Brain, ArrowRight, Upload } from "lucide-react";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

interface OrgDashboardPageProps {
  params: Promise<{ orgSlug: string }>;     //
}
function formatFileSize(bytes: number) {
  if (bytes === 0) return "0 B";
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
}
export default async function OrgDashboardPage() {
  const { userId,orgId } = await auth();
  
  if (!userId) redirect("/sign-in");
  if (!orgId) redirect("/select-org");
  
  const organization = await prisma.organization.findUnique({
    where: {
      clerkOrgId: orgId,
    },
    include: {
      _count: {
        select: {
          documents: true,
          members: true,
        },
      },
      documents: {
        where:{
          isLatest:true
        },
        take: 5,
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!organization) {
    redirect("/select-org");
  }
  const totalDocuments = await prisma.document.count({
    where: {
      organizationId: organization.id,
      isLatest: true,
    },
  });
  const membership = await prisma.organizationMember.findFirst({  //check if member
    where: {
      organizationId: organization.id,
      user: { clerkUserId: userId },
    },
  });

  if (!membership) {
    redirect("/select-org");
  }
  
  const analyzedDocs = await prisma.document.count({
    where: {
      organizationId: organization.id,
      isLatest:true,
      aiSummary: { not: null },
    },
  });
  const storage = await prisma.document.aggregate({
    where: {
      organizationId: organization.id,
      isLatest: true,
    },
    _sum: {
      fileSize: true,
    },
  });
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{organization.name} Dashboard</h1>
        <p className="text-gray-600">Welcome to your organization workspace</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Documents</CardTitle>
            <CardDescription>In this organization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {totalDocuments}
            </div>
            <Link href={`/${organization?.slug}/documents`}>
              <Button variant="ghost" size="sm" className="mt-2">
                View Documents
                <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Team Members</CardTitle>
            <CardDescription>Organization members</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {organization._count.members}
            </div>
            <Link href="/settings/organization">
              <Button variant="ghost" size="sm" className="mt-2">
                View Team
                <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </Link>            
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Analyzed</CardTitle>
            <CardDescription>Documents with AI insights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analyzedDocs}</div>
            <p className="text-sm text-gray-500 mt-1">
              {(
                ((analyzedDocs / totalDocuments) * 100 || 0)
              ).toFixed(0)}
              % analyzed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Storage Used</CardTitle>
            <CardDescription>Total uploaded size</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="text-3xl font-bold">
              {formatFileSize(storage._sum.fileSize ?? 0)}
            </div>
          </CardContent>
        </Card>
      </div>
{/* //solve this  */}
      Recent Documents
      <Card>
        <CardHeader>
          <CardTitle>Recent Documents</CardTitle>
          <CardDescription>Latest uploads in your organization</CardDescription>
        </CardHeader>
        <CardContent>
          {organization.documents.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No documents uploaded yet</p>
              <Link href={`/${organization?.slug}/documents`}>
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload First Document
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {organization.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="h-5 w-5 text-gray-400 flex-shrink-0" />

                    <div className="min-w-0">
                      <p className="font-medium truncate">{doc.name}</p>
                      <p className="text-sm text-gray-500">
                        Uploaded {new Date(doc.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="self-start sm:self-auto">
                    {doc.aiSummary ? (
                      <Brain className="h-5 w-5 text-green-500" />
                    ) : (
                      <Button variant="outline" size="sm">
                        Analyze
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
