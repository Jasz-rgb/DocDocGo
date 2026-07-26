"use client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {FileText,Brain,Trash2,Download,Loader2,Calendar,User,Tag,File,Sparkles,} from "lucide-react";
import ReactMarkdown from "react-markdown";
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue,} from "@/components/ui/select";
import { Document, AnalysisType } from "@/types";
import { analysisTypes } from "@/app/data/data";
import {jsPDF} from "jspdf";

interface DocumentCardProps {
  document: Document;
  isAnalyzing: boolean;
  selectedAnalysisType: AnalysisType;
  onAnalysisTypeChange: (type: AnalysisType) => void;
  onAnalyze: (documentId: string) => void;
  onDelete: (documentId: string) => void;
  onToggleSummary: (documentId: string) => void;
  expandedSummaries: Set<string>;
  formatFileSize: (bytes?: number) => string;
}

export function DocumentCard({
  document: doc,
  isAnalyzing,
  selectedAnalysisType,
  onAnalysisTypeChange,
  onAnalyze,
  onDelete,
  onToggleSummary,
  expandedSummaries,
  formatFileSize,
}: DocumentCardProps) {
  const isExpanded = expandedSummaries.has(doc.id);

  const getAnalysisIcon = (type: AnalysisType) => {   //analysis icon get
    const analysisType = analysisTypes.find((t) => t.value === type);
    const Icon = analysisType?.icon || Sparkles;
    return <Icon className="h-4 w-4" />;
  };

  return (
    <div className="border rounded-lg p-6 hover:shadow-lg transition-all">
      <div className="flex items-start justify-between">
        {/* Left Column: Document Info */}
        <div className="flex items-start gap-4 flex-1">
          <div className="p-3 rounded-lg bg-blue-100">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1">
            {/* Document Header */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-lg mb-1">{doc.name}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {doc.user.name || doc.user.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </span>
                  {doc.fileSize && (
                    <span className="flex items-center gap-1">
                      <File className="h-3 w-3" />
                      {formatFileSize(doc.fileSize)}
                    </span>
                  )}
                </div>
              </div>
              {doc.sentiment && (
                <Badge>
                  <div className="flex items-center gap-1">
                    <span className="capitalize">{doc.sentiment}</span>
                  </div>
                </Badge>
              )}
            </div>

            {/* AI Analysis Section */}
            {doc.aiSummary && (
              <div
                id={`ai-report-${doc.id}`}
                className="mt-4 p-4 bg-linear-to-r from-gray-50 to-blue-50 rounded-lg border"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-green-600" />
                    <span className="font-medium">AI Analysis</span>
                    <Badge variant="outline" className="ml-2">
                      Gemini AI
                    </Badge>
                  </div>
                  {doc.aiSummary.length > 200 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onToggleSummary(doc.id)}
                    >
                      {isExpanded ? "Show less" : "Read more"}
                    </Button>
                  )}
                </div>
                {/* Summary Content */}
                <div className="text-gray-700">
                  {isExpanded ? (
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown>{doc.aiSummary}</ReactMarkdown>
                    </div>
                  ) : (
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown>
                        {doc.aiSummary.length > 200
                          ? `${doc.aiSummary.substring(0, 200)}...`
                          : doc.aiSummary}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
                {/* Keywords */}
                {doc.aiKeywords.length > 0 && (
                  <div className="mt-4 pt-3 border-t">
                    <div className="flex items-center gap-2 mb-2">
                      <Tag className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium">Key Topics</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {doc.aiKeywords.slice(0, 8).map((keyword, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="px-3 py-1"
                        >
                          {keyword}
                        </Badge>
                      ))}
                      {doc.aiKeywords.length > 8 && (
                        <Badge variant="outline" className="px-3 py-1">
                          +{doc.aiKeywords.length - 8} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Actions */}
        <div className="flex flex-col gap-2 ml-4">
          {/* Download Button */}
          {doc.fileUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (!doc.aiSummary) return;

                const pdf = new jsPDF("p", "mm", "a4");
                const margin = 15;
                const pageWidth = pdf.internal.pageSize.getWidth();
                const pageHeight = pdf.internal.pageSize.getHeight();
                const maxWidth = pageWidth - 2 * margin;

                let y = 20;

                // Title
                pdf.setFont("helvetica", "bold");
                pdf.setFontSize(18);
                pdf.text("AI Document Analysis Report", margin, y);

                y += 12;

                // Document Info
                pdf.setFont("helvetica", "normal");
                pdf.setFontSize(12);
                pdf.text(`Document: ${doc.name}`, margin, y);
                y += 8;

                pdf.text(
                  `Generated: ${new Date().toLocaleString()}`,
                  margin,
                  y
                );
                y += 10;

                // Sentiment
                if (doc.sentiment) {
                  pdf.setFont("helvetica", "bold");
                  pdf.text("Sentiment:", margin, y);
                  pdf.setFont("helvetica", "normal");
                  pdf.text(doc.sentiment, margin + 30, y);
                  y += 10;
                }

                // Keywords
                if (doc.aiKeywords.length) {
                  pdf.setFont("helvetica", "bold");
                  pdf.text("Keywords:", margin, y);
                  y += 7;
                  pdf.setFont("helvetica", "normal");
                  const keywordLines = pdf.splitTextToSize(
                    doc.aiKeywords.join(", "),
                    maxWidth
                  );
                  pdf.text(keywordLines, margin, y);
                  y += keywordLines.length * 6 + 8;
                }

                // Summary
                pdf.setFont("helvetica", "bold");
                pdf.setFontSize(14);
                pdf.text("AI Summary", margin, y);
                y += 10;

                const addText = (
                  text: string,
                  size = 11,
                  indent = 0
                ) => {
                  pdf.setFontSize(size);

                  const wrappedLines = pdf.splitTextToSize(
                    text.replace(/\*\*/g, ""),
                    maxWidth - indent
                  );

                  let remaining = text;

                  for (const wrapped of wrappedLines) {
                    if (y > pageHeight - 15) {
                      pdf.addPage();
                      y = 20;
                    }

                    let x = margin + indent;
                    let plainCount = 0;

                    while (plainCount < wrapped.length && remaining.length > 0) {
                      const boldStart = remaining.indexOf("**");

                      // No bold left
                      if (boldStart === -1) {
                        const part = remaining.substring(0, wrapped.length - plainCount);
                        pdf.setFont("helvetica", "normal");
                        pdf.text(part, x, y);
                        x += pdf.getTextWidth(part);
                        remaining = remaining.substring(part.length);
                        plainCount += part.length;
                        break;
                      }

                      // Normal text before bold
                      if (boldStart > 0) {
                        const normal = remaining.substring(0, boldStart);
                        const take = Math.min(normal.length, wrapped.length - plainCount);
                        const piece = normal.substring(0, take);
                        pdf.setFont("helvetica", "normal");
                        pdf.text(piece, x, y);
                        x += pdf.getTextWidth(piece);
                        remaining = remaining.substring(take);
                        plainCount += take;
                        if (take < normal.length) break;
                      }

                      // Bold text
                      if (remaining.startsWith("**")) {
                        const end = remaining.indexOf("**", 2);
                        if (end === -1) break;
                        const bold = remaining.substring(2, end);
                        const take = Math.min(bold.length, wrapped.length - plainCount);
                        const piece = bold.substring(0, take);
                        pdf.setFont("helvetica", "bold");
                        pdf.text(piece, x, y);
                        x += pdf.getTextWidth(piece);
                        if (take === bold.length) {
                          remaining = remaining.substring(end + 2);
                        } else {
                          remaining =
                            "**" +
                            bold.substring(take) +
                            "**" +
                            remaining.substring(end + 2);
                        }
                        plainCount += take;
                      }
                    }
                    y += size * 0.45 + 2;
                  }
                };
                const lines = doc.aiSummary.split("\n");
                for (let line of lines) {
                  line = line.trim();
                  if (!line) {
                    y += 3;
                    continue;
                  }
                  // Horizontal rule
                  if (/^-{3,}$/.test(line)) {
                    y += 2;
                    pdf.line(margin, y, pageWidth - margin, y);
                    y += 5;
                    continue;
                  }
                  // ### Heading
                  if (line.startsWith("### ")) {
                    pdf.setFont("helvetica", "bold");
                    addText(line.replace(/^###\s*/, ""), 13);
                    y += 2;
                    continue;
                  }
                  // ## Heading
                  if (line.startsWith("## ")) {
                    pdf.setFont("helvetica", "bold");
                    addText(line.replace(/^##\s*/, ""), 15);
                    y += 3;
                    continue;
                  }
                  // # Heading
                  if (line.startsWith("# ")) {
                    pdf.setFont("helvetica", "bold");
                    addText(line.replace(/^#\s*/, ""), 17);
                    y += 4;
                    continue;
                  }
                  // Numbered list
                  if (/^\d+\./.test(line)) {
                    pdf.setFont("helvetica", "normal");
                    addText(line, 11, 5);
                    continue;
                  }
                  // Bullet list
                  if (line.startsWith("- ") || line.startsWith("* ")) {
                    pdf.setFont("helvetica", "normal");
                    addText("• " + line.substring(2), 11, 5);
                    continue;
                  }
                  // Bold paragraph title (**text**)
                  const boldMatch = line.match(/^\*\*(.+?)\*\*:?\s*$/);
                  if (boldMatch) {
                    pdf.setFont("helvetica", "bold");
                    addText(boldMatch[1], 12);
                    continue;
                  }
                  // Remove inline markdown markers
                  // line = line
                  //   .replace(/\*\*(.*?)\*\*/g, "$1")
                  //   .replace(/__(.*?)__/g, "$1")
                  //   .replace(/`(.*?)`/g, "$1");
                  line = line.replace(/`(.*?)`/g, "$1");
                  addText(line);
                }

                pdf.save(`${doc.name}-AI-Report.pdf`);
              }}
              disabled={!doc.aiSummary}
            >
              <Download className="h-4 w-4 mr-2" />
              Download AI Report
            </Button>
          )}

          {/* Analysis Section */}
          <div className="space-y-2">
            <div className="text-xs text-gray-500">
              {doc.aiSummary ? "Re-analyze with:" : "Analyze with:"}
            </div>

            <Select
              value={selectedAnalysisType}
              onValueChange={(value: AnalysisType) =>
                onAnalysisTypeChange(value)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    {getAnalysisIcon(selectedAnalysisType)}
                    {
                      analysisTypes.find(
                        (type) => type.value === selectedAnalysisType,
                      )?.label
                    }
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {analysisTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <type.icon className="h-4 w-4" />
                      {type.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant={doc.aiSummary ? "outline" : "default"}
              size="sm"
              onClick={() => onAnalyze(doc.id)}
              disabled={isAnalyzing}
              className="justify-start w-full"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {doc.aiSummary ? "Re-analyzing..." : "Analyzing..."}
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  {doc.aiSummary ? "Re-analyze" : "Analyze"}
                </>
              )}
            </Button>
          </div>

          {/* Delete Button */}
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50 justify-start"
            onClick={() => onDelete(doc.id)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
