"use client";

import React, { useState } from "react";
import jsPDF from "jspdf";
import { 
  FileText, 
  Download, 
  Eye, 
  Settings2, 
  Check, 
  FileCheck2, 
  Sparkles,
  Heading,
  AlignLeft
} from "lucide-react";

export default function PdfMakerTool() {
  const [docTitle, setDocTitle] = useState("My Document");
  const [docAuthor, setDocAuthor] = useState("DevDrop User");
  const [textContent, setTextContent] = useState(
`PROJECT PROPOSAL & SPECIFICATION

1. Executive Summary
This document was generated directly in the browser using DevDrop's client-side PDF Engine. Zero data was uploaded to any remote server, ensuring 100% privacy and lightning-fast speed.

2. Key Deliverables
- Fully vectorized typography and clean pagination.
- Support for custom fonts, margins, headers, and footers.
- Multi-page intelligent text-wrapping with automated page breaks.
- Crisp vector output compatible with Adobe Acrobat and all standard PDF readers.

3. Security & Privacy
All document compilation is executed inside the client's local memory sandbox. Your sensitive business documents, contracts, and notes never leave your personal computer.

4. Conclusion
DevDrop provides high-speed, ad-supported, privacy-first everyday web utilities for developers, students, and professionals worldwide.`
  );
  const [pageSize, setPageSize] = useState<"a4" | "letter">("a4");
  const [orientation, setOrientation] = useState<"p" | "l">("p");
  const [fontFamily, setFontFamily] = useState<"helvetica" | "times" | "courier">("helvetica");
  const [fontSize, setFontSize] = useState<number>(11);
  const [lineHeight, setLineHeight] = useState<number>(1.4);
  const [includePageNumbers, setIncludePageNumbers] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const generatePdfBlob = (): jsPDF => {
    const doc = new jsPDF({
      orientation: orientation,
      unit: "mm",
      format: pageSize
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 18;
    const maxContentWidth = pageWidth - (margin * 2);

    doc.setFont(fontFamily, "bold");
    doc.setFontSize(20);
    doc.text(docTitle, margin, margin + 4);

    doc.setFont(fontFamily, "normal");
    doc.setFontSize(9);
    doc.setTextColor(110, 110, 110);
    doc.text(`Author: ${docAuthor} | Date: ${new Date().toLocaleDateString()}`, margin, margin + 11);
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, margin + 14, pageWidth - margin, margin + 14);

    // Body text
    doc.setFont(fontFamily, "normal");
    doc.setFontSize(fontSize);
    doc.setTextColor(20, 20, 20);

    const splitText = doc.splitTextToSize(textContent, maxContentWidth);
    let cursorY = margin + 22;
    const lineStep = fontSize * 0.352778 * lineHeight + 1.2;

    for (let i = 0; i < splitText.length; i++) {
      if (cursorY + lineStep > pageHeight - margin - 8) {
        doc.addPage();
        cursorY = margin + 8;
      }
      doc.text(splitText[i], margin, cursorY);
      cursorY += lineStep;
    }

    // Footers
    if (includePageNumbers) {
      const totalPages = doc.getNumberOfPages();
      for (let p = 1; p <= totalPages; p++) {
        doc.setPage(p);
        doc.setFont(fontFamily, "normal");
        doc.setFontSize(8);
        doc.setTextColor(140, 140, 140);
        doc.text(
          `Page ${p} of ${totalPages} - Generated via devdrop.online`,
          pageWidth / 2,
          pageHeight - 8,
          { align: "center" }
        );
      }
    }

    return doc;
  };

  const handleDownload = () => {
    setIsGenerating(true);
    try {
      const doc = generatePdfBlob();
      doc.save(`${docTitle.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } catch (e) {
      console.error(e);
      alert("Error generating PDF. Please check your content.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePreview = () => {
    try {
      const doc = generatePdfBlob();
      const stringUri = doc.output("bloburl");
      window.open(stringUri as unknown as string, "_blank");
    } catch (e) {
      console.error(e);
      alert("Preview error.");
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Editor Area */}
        <div className="lg:col-span-8 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-400" />
              Document Content & Editor
            </h3>
            <span className="text-xs text-neutral-400">
              {textContent.split(/\s+/).filter(Boolean).length} words • {textContent.length} chars
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">Document Title</label>
              <input
                type="text"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 focus:border-emerald-500 rounded-lg px-3 py-2 text-sm text-neutral-100 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">Author / Organization</label>
              <input
                type="text"
                value={docAuthor}
                onChange={(e) => setDocAuthor(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 focus:border-emerald-500 rounded-lg px-3 py-2 text-sm text-neutral-100 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-1">Body Text & Notes</label>
            <textarea
              rows={14}
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Paste or write your document text here..."
              className="w-full bg-neutral-950 border border-neutral-700 focus:border-emerald-500 rounded-xl p-4 text-sm text-neutral-200 outline-none font-mono resize-y leading-relaxed"
            />
          </div>
        </div>

        {/* Formatting & Controls Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-neutral-800">
              <Settings2 className="w-4 h-4 text-emerald-400" />
              Page Setup & Typography
            </h3>

            <div>
              <label className="text-xs text-neutral-400 block mb-1">Page Format</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPageSize("a4")}
                  className={`py-2 text-xs font-semibold rounded-lg border transition ${
                    pageSize === "a4"
                      ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                      : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white"
                  }`}
                >
                  A4 (Standard)
                </button>
                <button
                  type="button"
                  onClick={() => setPageSize("letter")}
                  className={`py-2 text-xs font-semibold rounded-lg border transition ${
                    pageSize === "letter"
                      ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                      : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white"
                  }`}
                >
                  US Letter
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs text-neutral-400 block mb-1">Orientation</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setOrientation("p")}
                  className={`py-2 text-xs font-semibold rounded-lg border transition ${
                    orientation === "p"
                      ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                      : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white"
                  }`}
                >
                  Portrait
                </button>
                <button
                  type="button"
                  onClick={() => setOrientation("l")}
                  className={`py-2 text-xs font-semibold rounded-lg border transition ${
                    orientation === "l"
                      ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                      : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white"
                  }`}
                >
                  Landscape
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs text-neutral-400 block mb-1">Font Family</label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value as any)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-xs text-neutral-300 outline-none"
              >
                <option value="helvetica">Helvetica (Clean Sans-Serif)</option>
                <option value="times">Times New Roman (Formal Serif)</option>
                <option value="courier">Courier (Monospace Code)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-neutral-400 block mb-1">Font Size</label>
                <select
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-xs text-neutral-300 outline-none"
                >
                  <option value={9}>9 pt (Compact)</option>
                  <option value={10}>10 pt (Small)</option>
                  <option value={11}>11 pt (Standard)</option>
                  <option value={12}>12 pt (Large)</option>
                  <option value={14}>14 pt (Extra Large)</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-neutral-400 block mb-1">Line Spacing</label>
                <select
                  value={lineHeight}
                  onChange={(e) => setLineHeight(Number(e.target.value))}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-xs text-neutral-300 outline-none"
                >
                  <option value={1.2}>1.2 (Tight)</option>
                  <option value={1.4}>1.4 (Standard)</option>
                  <option value={1.6}>1.6 (Double)</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includePageNumbers}
                  onChange={(e) => setIncludePageNumbers(e.target.checked)}
                  className="accent-emerald-500 w-4 h-4 rounded"
                />
                Include Footer & Page Numbers
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6 space-y-3">
            <button
              onClick={handleDownload}
              disabled={isGenerating}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              {success ? <Check className="w-5 h-5" /> : <Download className="w-5 h-5" />}
              {success ? "PDF Downloaded!" : "Generate & Download PDF"}
            </button>

            <button
              onClick={handlePreview}
              className="w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold text-xs rounded-xl border border-neutral-700 flex items-center justify-center gap-2 transition"
            >
              <Eye className="w-4 h-4 text-emerald-400" />
              Preview in New Tab
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
