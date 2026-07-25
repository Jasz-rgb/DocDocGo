import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import {FileText,Brain,MessageSquare,Users, ArrowRight,} from "lucide-react";

export default async function Home() {
  const { userId,orgId  } = await auth();

  console.log("Home userId:", userId);
  return (
    <main>
      {/* Hero */}
      <section className="border-b">
        <div className="container max-w-6xl mx-auto px-6 py-24">
          <div className="max-w-3xl">
            <div className="inline-flex rounded-full border bg-muted px-3 py-1 text-sm mb-6">
              AI Document Analysis
            </div>

            <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight">
              Understand your documents with AI.
            </h1>

            <p className="mt-6 text-lg text-muted-foreground leading-8">
              Upload PDFs, DOCX, TXT, or Markdown files and instantly generate
              summaries, extract key insights, analyze sentiment, and ask
              questions about your documents.
            </p>

            <div className="mt-8 flex gap-4">
              {!userId ? (
                <>
                  <Link href="/sign-up">
                    <Button size="lg">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>

                  <Link href="/sign-in">
                    <Button size="lg" variant="outline">
                      Sign In
                    </Button>
                  </Link>
                </>
              ) : orgId ? (
                <Link href="/documents">
                  <Button size="lg">
                    Go to Documents
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <Link href="/select-org">
                  <Button size="lg">
                    Select Organization
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* What is DocDocGo */}
      <section className="py-20">
        <div className="container max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6">
            What is DocDocGo?
          </h2>

          <p className="text-lg text-muted-foreground leading-8">
            DocDocGo is an AI-powered platform that helps individuals and
            organizations understand documents faster. Instead of manually
            reading lengthy reports, research papers, contracts, or notes, you
            can upload them and receive AI-generated insights within seconds.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="bg-muted/40 py-20">
        <div className="container max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Features
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-xl border bg-background p-6">
              <FileText className="h-8 w-8 mb-4" />
              <h3 className="font-semibold text-xl mb-2">
                Upload Documents
              </h3>
              <p className="text-muted-foreground">
                Upload PDF, DOCX, TXT, or Markdown files securely.
              </p>
            </div>

            <div className="rounded-xl border bg-background p-6">
              <Brain className="h-8 w-8 mb-4" />
              <h3 className="font-semibold text-xl mb-2">
                AI Analysis
              </h3>
              <p className="text-muted-foreground">
                Generate summaries, keywords, sentiment analysis, and document
                insights instantly.
              </p>
            </div>

            <div className="rounded-xl border bg-background p-6">
              <MessageSquare className="h-8 w-8 mb-4" />
              <h3 className="font-semibold text-xl mb-2">
                Ask Questions
              </h3>
              <p className="text-muted-foreground">
                Chat with your documents and get accurate answers based on their
                contents.
              </p>
            </div>

            <div className="rounded-xl border bg-background p-6">
              <Users className="h-8 w-8 mb-4" />
              <h3 className="font-semibold text-xl mb-2">
                Organization Workspace
              </h3>
              <p className="text-muted-foreground">
                Create organizations, invite members, and manage shared
                documents together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="container max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center">
            How it works
          </h2>

          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                1
              </div>

              <div>
                <h3 className="font-semibold text-lg">
                  Create an account
                </h3>

                <p className="text-muted-foreground">
                  Sign up and create or join an organization.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                2
              </div>

              <div>
                <h3 className="font-semibold text-lg">
                  Upload a document
                </h3>

                <p className="text-muted-foreground">
                  Choose a supported document and upload it securely.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                3
              </div>

              <div>
                <h3 className="font-semibold text-lg">
                  Analyze with AI
                </h3>

                <p className="text-muted-foreground">
                  Generate summaries, keywords, sentiment analysis, and ask
                  questions about the document.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                4
              </div>

              <div>
                <h3 className="font-semibold text-lg">
                  Collaborate
                </h3>

                <p className="text-muted-foreground">
                  Share documents with organization members and manage them from
                  a single workspace.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t py-20">
        <div className="container max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold">
            Ready to get started?
          </h2>

          <p className="mt-4 text-muted-foreground">
            Upload your first document and let AI do the reading.
          </p>

          <div className="mt-8">
            {userId ? (
              <Link href="/documents">
                <Button size="lg">
                  Open Documents
                </Button>
              </Link>
            ) : (
              <Link href="/sign-up">
                <Button size="lg">
                  Create Account
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}