/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { GeminiPlaybookResult, AuditInputs, CalculatedMetrics } from "../types";
import { Copy, FileDown, Printer, Check, Clipboard, Sparkles, AlertCircle, CornerDownRight } from "lucide-react";

interface PlaybookReportProps {
  playbook: GeminiPlaybookResult;
  inputs: AuditInputs;
  metrics: CalculatedMetrics;
  onSaveReportInstance?: () => void;
  reportSavedStatus?: boolean;
}

export default function PlaybookReport({
  playbook,
  inputs,
  metrics,
  onSaveReportInstance,
  reportSavedStatus,
}: PlaybookReportProps) {
  const [copiedStatus, setCopiedStatus] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  // Extract the code block from the evaluation markdown
  const extractCodeBlock = (text: string): string => {
    const codeBlockRegex = /```(?:ocn|tcl|python|tcl\/python|tcl\/ocean|ocean|cl|sh)?\n([\s\S]*?)```/;
    const match = text.match(codeBlockRegex);
    return match ? match[1].trim() : "";
  };

  const scriptSnippet = extractCodeBlock(playbook.evaluationText);

  const handleCopyReport = () => {
    navigator.clipboard.writeText(playbook.evaluationText);
    setCopiedStatus(true);
    setTimeout(() => setCopiedStatus(false), 2000);
  };

  const handleCopyScriptOnly = () => {
    if (scriptSnippet) {
      navigator.clipboard.writeText(scriptSnippet);
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2000);
    }
  };

  const handleDownloadMarkdown = () => {
    const filename = `${inputs.companyName.replace(/\s+/g, "_") || "Analog_AI_Audit"}_Report.md`;
    const headerPrefix = `
# STAFF REPORT: ANALOG AI FLOW AUDIT & PLAYBOOK
*Generated on: ${new Date().toLocaleDateString()}*
*Company: ${inputs.companyName || "NDA Restricted"}*
*Project target: ${inputs.projectName || "General Analog block"}*
*Silicon PDK: ${inputs.currentNodes.join(", ")}*

## Baselines & Financial Gaps
- Team Count: ${inputs.teamSize} Designers
- Annual payroll savings potential: \$${metrics.financialSavingsYear.toLocaleString()} / year
- Productivity Hours recovered per designer: ${metrics.hoursSavedPerDesignerYear} hours / year
- Block development cycle time reduction: from ${metrics.baselineWeeksTotal}w down to ${metrics.projectedWeeksTotal}w (-${metrics.timeToMarketSpeedupPercent}%)

---
`;

    const fullBlobText = headerPrefix + playbook.evaluationText;
    const blob = new Blob([fullBlobText], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pt-4 print:p-0 text-[#1D1D1B]" id="playbook-report-root">
      
      {/* Playbook Header Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#1D1D1B] border-2 border-[#1D1D1B] text-white rounded-none p-4 shadow-[4px_4px_0px_0px_rgba(29,29,27,0.15)] print:hidden">
        <div className="flex items-center gap-2">
          <div className="bg-white/10 text-blue-400 p-1.5 rounded-none border border-white/15">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-sans font-black uppercase tracking-wider">Staff Architect Playbook Generated</h3>
            <span className="text-[9px] text-[#F4F2EE]/60 font-mono">POWERED BY GEMINI ANALYTICS</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {onSaveReportInstance && (
            <button
              onClick={onSaveReportInstance}
              className={`text-xs font-mono font-bold uppercase tracking-wider px-3 py-1.5 rounded-none border transition-all cursor-pointer ${
                reportSavedStatus
                  ? "bg-blue-700/20 border-blue-500 text-blue-400"
                  : "bg-white/10 border-white/20 hover:bg-white/20 text-white"
              }`}
            >
              {reportSavedStatus ? "✓ Report Saved" : "Save to History"}
            </button>
          )}

          <button
            onClick={handleDownloadMarkdown}
            className="bg-white/10 border border-white/20 hover:bg-white/20 text-xs font-mono font-bold text-white px-3 py-1.5 rounded-none transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Download full document as Markdown"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Download .MD</span>
          </button>

          <button
            onClick={handlePrint}
            className="bg-white/10 border border-white/20 hover:bg-white/20 text-xs font-mono font-bold text-white px-3 py-1.5 rounded-none transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Print report to PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print PDF</span>
          </button>

          <button
            onClick={handleCopyReport}
            className="bg-blue-750 hover:bg-blue-800 text-xs font-mono font-black uppercase tracking-widest text-[#F4F2EE] px-3 py-1.5 rounded-none transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {copiedStatus ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedStatus ? "Copied!" : "Copy Report"}</span>
          </button>
        </div>
      </div>

      {/* Main Printed Document Frame */}
      <div className="bg-white border-2 border-[#1D1D1B] rounded-none shadow-[5px_5px_0px_0px_rgba(29,29,27,0.15)] overflow-hidden printable-area">
        
        {/* Print Header only displayed during print */}
        <div className="hidden print:block p-6 border-b-2 border-[#1D1D1B]">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs uppercase font-mono tracking-widest text-blue-700 font-bold">
                CONFIDENTIAL STAFF CAD ANALYSIS
              </p>
              <h1 className="text-xl font-serif font-black mt-1">Analog AI Flow Architect Playbook</h1>
            </div>
            <div className="text-right text-xs font-mono text-gray-700">
              <p>Company: {inputs.companyName || "NDA Protected"}</p>
              <p>PDK Targets: {inputs.currentNodes.join(", ")}</p>
            </div>
          </div>
        </div>

        {/* Dynamic ROI highlight summary for physical printing */}
        <div className="bg-[#F4F2EE] border-b-2 border-[#1D1D1B] p-6 grid grid-cols-2 md:grid-cols-4 gap-4 print:bg-white print:border-gray-300">
          <div>
            <span className="text-[10px] uppercase font-mono text-[#1D1D1B]/55 font-bold block">
              Missed Annual ROI
            </span>
            <span className="text-lg font-mono font-bold text-gray-950 block mt-0.5">
              ${metrics.financialSavingsYear.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono text-[#1D1D1B]/55 font-bold block">
              Cycle shortened
            </span>
            <span className="text-lg font-mono font-bold text-blue-700 block mt-0.5">
              -{metrics.timeToMarketSpeedupPercent}% weeks
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono text-[#1D1D1B]/55 font-bold block">
              Hours Recovered
            </span>
            <span className="text-lg font-mono font-bold text-gray-950 block mt-0.5">
              {metrics.totalEngineeringHoursSavedYear.toLocaleString()} Hrs
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono text-[#1D1D1B]/55 font-bold block">
              Compute Efficiency
            </span>
            <span className="text-lg font-mono font-bold text-gray-950 block mt-0.5">
              {metrics.simulationComputeReductionRatio}% saved
            </span>
          </div>
        </div>

        {/* Written content block */}
        <div className="p-6 md:p-8 space-y-6">
          <div className="prose max-w-none text-[#1D1D1B] leading-relaxed text-sm space-y-4">
            
            {/* Split generated text into neat readable paragraphs/sections manually */}
            {playbook.evaluationText.split("\n\n").map((paragraph, index) => {
              const trimmed = paragraph.trim();
              if (!trimmed) return null;

              // If it's a code block output, render it beautifully with a direct copy helper!
              if (trimmed.startsWith("```")) {
                const codeContent = scriptSnippet;
                return (
                  <div key={index} className="my-5 border-2 border-[#1D1D1B] bg-[#1D1D1B] text-[#F4F2EE] rounded-none overflow-hidden shadow-[3px_3px_0px_0px_rgba(29,29,27,0.15)] print:border-gray-400 print:text-black print:bg-white print:shadow-none">
                    <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10 print:hidden">
                      <span className="text-[10px] font-mono tracking-wider font-bold uppercase text-[#F4F2EE]/60">
                        Synthesized CAD Script / Configuration Template
                      </span>
                      <button
                        onClick={handleCopyScriptOnly}
                        className="text-[11px] font-mono font-semibold text-blue-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        {copiedScript ? <Check className="w-3.5 h-3.5" /> : <Clipboard className="w-3.5 h-3.5" />}
                        <span>{copiedScript ? "Script Copied!" : "Copy Code"}</span>
                      </button>
                    </div>
                    
                    <pre className="p-4 overflow-x-auto text-xs font-mono leading-relaxed text-blue-200 print:text-black">
                      <code>{codeContent || trimmed.replace(/```[a-z]*/g, "").trim()}</code>
                    </pre>
                  </div>
                );
              }

              // Heading formatting checks
              if (trimmed.startsWith("###")) {
                return (
                  <h4 key={index} className="text-xs font-mono tracking-widest font-black text-blue-750 uppercase pt-2 flex items-center gap-2 border-b border-[#1D1D1B]/15 pb-1">
                    <CornerDownRight className="w-3.5 h-3.5 inline text-blue-700" />
                    {trimmed.replace("###", "").trim()}
                  </h4>
                );
              }

              if (trimmed.startsWith("##")) {
                return (
                  <h3 key={index} className="text-base font-serif font-black italic text-[#1D1D1B] tracking-tight pt-4 border-l-4 border-blue-700 pl-3">
                    {trimmed.replace("##", "").trim()}
                  </h3>
                );
              }

              if (trimmed.startsWith("#")) {
                return (
                  <h2 key={index} className="text-xl font-serif font-black text-[#1D1D1B] tracking-tight pt-5 pb-1 border-b-2 border-[#1D1D1B]">
                    {trimmed.replace("#", "").trim()}
                  </h2>
                );
              }

              // List items formatting
              if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
                return (
                  <ul key={index} className="list-disc pl-5 space-y-1.5">
                    {trimmed.split("\n").map((li, liIdx) => (
                      <li key={liIdx} className="text-[#1D1D1B] text-xs">
                        {li.replace(/^[\s-*]+/, "").trim()}
                      </li>
                    ))}
                  </ul>
                );
              }

              // Standard content block
              return (
                <p key={index} className="text-[#1D1D1B] leading-relaxed text-xs">
                  {trimmed}
                </p>
              );
            })}

          </div>

          <div className="bg-[#F4F2EE] rounded-none p-4 border-2 border-[#1D1D1B] border-l-8 border-l-blue-700 flex items-start gap-3 print:hidden">
            <AlertCircle className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
            <div className="text-xs text-[#1D1D1B] leading-relaxed">
              <span className="font-bold block uppercase tracking-wider text-[10px] font-mono text-blue-700 mb-0.5">Staff CAD Advisory Notice:</span> The Ocean Script / ASO.ai configuration code blocks yielded here are blueprint frameworks referencing standard parameter ranges. Always load designs in test benches or sandbox setups first before deploying in main custom design-kit registers.
            </div>
          </div>
        </div>

        {/* Print only footer */}
        <div className="hidden print:block p-6 mt-12 border-t-2 border-[#1D1D1B] text-[10px] text-gray-500 font-mono text-center">
          <p>© {new Date().getFullYear()} Analog AI CAD Auditor Core. Automated Playbook Assessment.</p>
          <p>Confidential corporate intellectual artifact.</p>
        </div>

      </div>

    </div>
  );
}
