/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import BusinessCalculator from "./components/BusinessCalculator";
import AuditSurvey from "./components/AuditSurvey";
import VisualDashboard from "./components/VisualDashboard";
import PlaybookReport from "./components/PlaybookReport";
import SavedReports from "./components/SavedReports";
import { calculateAuditMetrics } from "./utils/formulas";
import { AuditInputs, AuditReport, MaturityPhase, ToolStackOptions, GeminiPlaybookResult } from "./types";
import { Sparkles, Save, Brain, HelpCircle, Loader2, AlertCircle, FileSpreadsheet, RotateCcw } from "lucide-react";

const DEFAULT_INPUTS: AuditInputs = {
  companyName: "Acme Semiconductor Corp",
  projectName: "Phase-Lock Loop PLL-TSMC16",
  teamSize: 12,
  salaryRate: 220000,
  blockCyclesPerYear: 8,
  blockCycleWeeks: 12,
  toolStack: "cadence",
  currentNodes: ["16nm/12nm", "7nm/5nm"],
  blockTypes: ["PLL / Clocking", "OpAmp / Comparator", "LDO / Regulator"],
  ratings: {
    spec: 2,
    sizing: 2,
    layout: 1,
    verification: 2,
    playbooks: 1,
  },
  selections: {
    spec: "Manual Text/Specs",
    sizing: "Manual Parametric Sweeps",
    layout: "Manual drawing by layout team",
    verification: "Linear sweep schedules",
    playbooks: "No collective files",
  },
  standardCornerSweeps: 200,
};

export default function App() {
  const [inputs, setInputs] = useState<AuditInputs>(DEFAULT_INPUTS);
  const [savedReports, setSavedReports] = useState<AuditReport[]>([]);
  const [activeTab, setActiveTab] = useState<"calc" | "charts" | "gemini">("calc");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Custom playbook results
  const [currentPlaybook, setCurrentPlaybook] = useState<GeminiPlaybookResult | null>(null);
  const [currentReportId, setCurrentReportId] = useState<string | undefined>(undefined);
  const [reportSavedStatus, setReportSavedStatus] = useState(false);

  // Load saved list and initial state from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("analog_ai_audit_list");
    if (stored) {
      try {
        setSavedReports(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse saved list", e);
      }
    }
  }, []);

  // Sync state helpers
  const handleInputChange = (updated: Partial<AuditInputs>) => {
    setInputs((prev) => ({ ...prev, ...updated }));
    setReportSavedStatus(false);
  };

  const handleRatingChange = (phase: MaturityPhase, rating: number) => {
    setInputs((prev) => ({
      ...prev,
      ratings: { ...prev.ratings, [phase]: rating },
    }));
    setReportSavedStatus(false);
  };

  const handleToolSelectionChange = (phase: MaturityPhase, value: string) => {
    setInputs((prev) => ({
      ...prev,
      selections: { ...prev.selections, [phase]: value },
    }));
    setReportSavedStatus(false);
  };

  // Reset inputs
  const handleResetInputs = () => {
    if (window.confirm("Are you sure you want to reset currently edited inputs back to standard baselines?")) {
      setInputs(DEFAULT_INPUTS);
      setCurrentPlaybook(null);
      setCurrentReportId(undefined);
      setReportSavedStatus(false);
    }
  };

  // Apply Industry Standard Preset Profiles
  const handleLoadPreset = (presetName: string) => {
    if (presetName === "mediatek") {
      setInputs({
        companyName: "MediaTek 2nm Pilot Team",
        projectName: "Ultra-low power ADC Block",
        teamSize: 15,
        salaryRate: 260000,
        blockCyclesPerYear: 12,
        blockCycleWeeks: 10,
        toolStack: "cadence",
        currentNodes: ["3nm/2nm"],
        blockTypes: ["ADC / DAC", "Bandgap Reference"],
        ratings: {
          spec: 3,
          sizing: 4, // ADE DSO in actively
          layout: 3,
          verification: 4,
          playbooks: 4, // Shared flow presets
        },
        selections: {
          spec: "Virtuoso ADE Explorer Templates",
          sizing: "ADE Design Space Optimization (DSO)",
          layout: "Virtuoso Layout Suite Pro",
          verification: "Spectre Multi-Corner sweeps",
          playbooks: "Central CAD Flow repository",
        },
        standardCornerSweeps: 500,
      });
    } else if (presetName === "synopsys") {
      setInputs({
        companyName: "Silicon IP Lead Team (Synopsys standard)",
        projectName: "High UGBW Operational Amplifier",
        teamSize: 45,
        salaryRate: 240000,
        blockCyclesPerYear: 24,
        blockCycleWeeks: 8,
        toolStack: "synopsys",
        currentNodes: ["7nm/5nm"],
        blockTypes: ["OpAmp / Comparator", "PLL / Clocking"],
        ratings: {
          spec: 4,
          sizing: 4, // ASO.ai custom optimization
          layout: 3,
          verification: 4,
          playbooks: 5, // central flows configs
        },
        selections: {
          spec: "PrimeWave Spec Sheets",
          sizing: "ASO.ai closed-loop",
          layout: "Custom Compiler helpers",
          verification: "PrimeSim multi-corner accelerator",
          playbooks: "Standardized Team Preset Playbooks",
        },
        standardCornerSweeps: 800,
      });
    } else if (presetName === "heritage") {
      setInputs({
        companyName: "Heritage Analog Studio LLC",
        projectName: "Standard Bandgap & OpAmp core",
        teamSize: 8,
        salaryRate: 180000,
        blockCyclesPerYear: 4,
        blockCycleWeeks: 16,
        toolStack: "mixed",
        currentNodes: ["180nm", "45nm"],
        blockTypes: ["OpAmp / Comparator", "Bandgap Reference", "LDO / Regulator"],
        ratings: {
          spec: 1, // manual text
          sizing: 1, // manual loops sizing sweeps
          layout: 1, // fully manual layout draw
          verification: 1, // manual sweep corners
          playbooks: 1, // designer notebooks
        },
        selections: {
          spec: "Manual Text/Specs",
          sizing: "Manual Parametric Sweeps",
          layout: "Manual drawing by layout team",
          verification: "Linear sweep schedules",
          playbooks: "No collective files",
        },
        standardCornerSweeps: 50,
      });
    }
    setCurrentPlaybook(null);
    setCurrentReportId(undefined);
    setReportSavedStatus(false);
  };

  // Saved Local Report loading/saving/deleting
  const handleLoadReport = (report: AuditReport) => {
    setInputs(report.inputs);
    setCurrentPlaybook(report.playbook || null);
    setCurrentReportId(report.id);
    setReportSavedStatus(true);
    setActiveTab(report.playbook ? "gemini" : "calc");
  };

  const handleSaveReport = () => {
    const currentMetrics = calculateAuditMetrics(inputs);
    
    // Check if updating existing
    const isNew = !currentReportId;
    const reportId = currentReportId || `rep_${Date.now()}`;
    
    const newReport: AuditReport = {
      id: reportId,
      title: `${inputs.companyName || "NDA Audit"} - ${inputs.projectName || "General block"}`,
      timestamp: new Date().toISOString(),
      inputs: inputs,
      metrics: currentMetrics,
      playbook: currentPlaybook || undefined,
    };

    let nextReports = [...savedReports];
    if (isNew) {
      nextReports.unshift(newReport);
    } else {
      nextReports = nextReports.map((r) => (r.id === reportId ? newReport : r));
    }

    setSavedReports(nextReports);
    localStorage.setItem("analog_ai_audit_list", JSON.stringify(nextReports));
    setCurrentReportId(reportId);
    setReportSavedStatus(true);
  };

  const handleDeleteReport = (id: string) => {
    const nextList = savedReports.filter((r) => r.id !== id);
    setSavedReports(nextList);
    localStorage.setItem("analog_ai_audit_list", JSON.stringify(nextList));
    if (currentReportId === id) {
      setCurrentReportId(undefined);
      setReportSavedStatus(false);
    }
  };

  const handleClearAllReports = () => {
    if (window.confirm("Are you sure you want to purge all saved historical reports? This action is permanent.")) {
      setSavedReports([]);
      localStorage.removeItem("analog_ai_audit_list");
      setCurrentReportId(undefined);
      setReportSavedStatus(false);
    }
  };

  // Trigger server-side Google Gemini play-book synthesis
  const handleTriggerGeminiAnalysis = async () => {
    setIsAnalyzing(true);
    setErrorMessage(null);
    setActiveTab("gemini");

    try {
      const response = await fetch("/api/audit/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs),
      });

      if (!response.ok) {
        throw new Error(`Server returned error rate: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      const playbookRes: GeminiPlaybookResult = {
        evaluationText: data.evaluationText,
        scriptTemplate: "", // derived dynamically in component text parser
      };

      setCurrentPlaybook(playbookRes);
      
      // Auto save current report with its newly generated playbook!
      const currentMetrics = calculateAuditMetrics(inputs);
      const reportId = currentReportId || `rep_${Date.now()}`;
      
      const updatedReport: AuditReport = {
        id: reportId,
        title: `${inputs.companyName || "NDA Audit"} - ${inputs.projectName || "General block"}`,
        timestamp: new Date().toISOString(),
        inputs: inputs,
        metrics: currentMetrics,
        playbook: playbookRes,
      };

      let nextReports = [...savedReports];
      const isExisting = savedReports.some((r) => r.id === reportId);
      if (isExisting) {
        nextReports = nextReports.map((r) => (r.id === reportId ? updatedReport : r));
      } else {
        nextReports.unshift(updatedReport);
      }
      
      setSavedReports(nextReports);
      localStorage.setItem("analog_ai_audit_list", JSON.stringify(nextReports));
      setCurrentReportId(reportId);
      setReportSavedStatus(true);

    } catch (err: any) {
      console.error("Gemini full-stack client failure:", err);
      setErrorMessage(err.message || "Unable to reach full-stack analysis portal. Confirm your GEMINI_API_KEY secret state.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Dynamically calculate metrics
  const currentMetrics = calculateAuditMetrics(inputs);

  return (
    <div className="min-h-screen bg-[#F4F2EE] text-[#1D1D1B] flex flex-col font-sans antialiased text-base">
      <Header />

      {/* Main double-bento body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Parameters input survey panel (span 8) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Sub menu tabs for switching visualizer dashboard vs parameters configuration */}
          <div className="flex bg-white rounded-none border-2 border-[#1D1D1B] p-1.5 justify-between items-center shadow-[3px_3px_0px_0px_rgba(29,29,27,0.15)]">
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => setActiveTab("calc")}
                className={`text-xs font-mono font-bold px-3 py-2 rounded-none transition-colors cursor-pointer uppercase tracking-wider ${
                  activeTab === "calc"
                    ? "bg-[#1D1D1B] text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                1. Operational Audit
              </button>

              <button
                onClick={() => setActiveTab("charts")}
                className={`text-xs font-mono font-bold px-3 py-2 rounded-none transition-colors cursor-pointer uppercase tracking-wider ${
                  activeTab === "charts"
                    ? "bg-[#1D1D1B] text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                2. ROI Charts
              </button>

              <button
                onClick={() => setActiveTab("gemini")}
                className={`text-xs font-mono font-bold px-3 py-2 rounded-none transition-colors cursor-pointer uppercase tracking-wider ${
                  activeTab === "gemini"
                    ? "bg-[#1D1D1B] text-white flex items-center gap-1.5"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 flex items-center gap-1.5"
                }`}
              >
                <Brain className="w-3.5 h-3.5 text-blue-700" />
                <span>3. Staff Playbook</span>
              </button>
            </div>

            <div className="flex gap-1.5">
              <button
                onClick={handleResetInputs}
                className="p-1 px-2.5 rounded-none border border-[#1D1D1B] text-xs font-mono text-gray-700 hover:bg-gray-100 flex items-center gap-1 cursor-pointer"
                title="Reset sliders back to baseline values"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>

              <button
                onClick={handleSaveReport}
                className="p-1.5 px-3 rounded-none bg-blue-700 text-white text-xs font-mono font-bold uppercase tracking-wider hover:bg-blue-800 flex items-center gap-1 cursor-pointer shadow-[2px_2px_0px_0px_rgba(29,29,27,0.15)]"
                title="Save current parameters config to Local History"
              >
                <Save className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Save</span>
              </button>
            </div>
          </div>

          {/* Conditional Screen Rendering */}
          {activeTab === "calc" && (
            <div className="space-y-6">
              <BusinessCalculator inputs={inputs} onChange={handleInputChange} />
              <AuditSurvey
                ratings={inputs.ratings}
                selections={inputs.selections}
                toolStack={inputs.toolStack}
                onRatingChange={handleRatingChange}
                onToolSelectionChange={handleToolSelectionChange}
              />

              {/* Dynamic Action Banner triggers Gemini Analysis */}
              <div className="bg-[#1D1D1B] text-white rounded-none p-6 shadow-[5px_5px_0px_0px_rgba(29,29,27,0.15)] border-2 border-[#1D1D1B] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1.5 md:max-w-md">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-700 text-white text-[9px] font-mono px-2 py-0.5 rounded-none font-bold uppercase tracking-widest">
                      Staff CAD Intelligence
                    </span>
                  </div>
                  <h3 className="text-xl font-serif font-black italic text-white leading-tight">
                    Synthesize Staff CAD automation recipes with Gemini AI
                  </h3>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Fuses your audited scores, designers cost index, silicon nodes, and current EDA tool blocks to generate a custom Ocean/Tcl automation template.
                  </p>
                </div>
                
                <button
                  type="button"
                  onClick={handleTriggerGeminiAnalysis}
                  className="bg-blue-700 hover:bg-blue-800 text-white font-sans font-black uppercase tracking-wider text-xs px-5 py-3 rounded-none flex items-center gap-2 shadow-[3px_3px_0px_0px_rgba(255,255,255,0.2)] transition-all self-stretch md:self-auto justify-center cursor-pointer border border-blue-400"
                >
                  <Brain className="w-4 h-4" />
                  <span>Synthesize Blueprint</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === "charts" && (
            <VisualDashboard metrics={currentMetrics} inputs={inputs} />
          )}

          {activeTab === "gemini" && (
            <div className="space-y-4">
              
              {/* If Currently Loading AI response */}
              {isAnalyzing && (
                <div className="bg-white border-2 border-[#1D1D1B] rounded-none p-12 text-center shadow-[4px_4px_0px_0px_rgba(29,29,27,0.15)] flex flex-col items-center justify-center space-y-4 min-h-[360px]">
                  <Loader2 className="w-10 h-10 text-blue-750 animate-spin" />
                  <div className="space-y-1">
                    <h3 className="text-base font-sans font-black uppercase tracking-wide text-[#1D1D1B]">Synthesizing CAD Playbook...</h3>
                    <p className="text-xs text-gray-600 max-w-sm">
                      Aligning EDA constraints across advanced PDK registries. Loading Ocean/Tcl target scripting templates.
                    </p>
                  </div>
                </div>
              )}

              {/* If Analysis failed */}
              {errorMessage && !isAnalyzing && (
                <div className="bg-red-50 border-2 border-red-500 rounded-none p-5 flex gap-3 text-red-900 shadow-[4px_4px_0px0px_rgba(239,68,68,0.15)]">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
                  <div className="text-xs space-y-1.5">
                    <p className="font-bold uppercase tracking-wider font-sans">CAD Synthesis Connection Failure</p>
                    <p className="leading-relaxed">{errorMessage}</p>
                    <button
                      onClick={handleTriggerGeminiAnalysis}
                      className="bg-red-100 hover:bg-red-200 text-red-950 font-bold px-3 py-1.5 rounded-none border border-red-300 cursor-pointer text-[11px]"
                    >
                      Retry Analysis Connect
                    </button>
                  </div>
                </div>
              )}

              {/* If Report successfully loaded and available */}
              {currentPlaybook && !isAnalyzing && (
                <PlaybookReport
                  playbook={currentPlaybook}
                  inputs={inputs}
                  metrics={currentMetrics}
                  onSaveReportInstance={handleSaveReport}
                  reportSavedStatus={reportSavedStatus}
                />
              )}

              {/* Prompt fallback if they haven't generated anything yet */}
              {!currentPlaybook && !isAnalyzing && !errorMessage && (
                <div className="bg-white border-2 border-[#1D1D1B] rounded-none p-10 text-center shadow-[4px_4px_0px_0px_rgba(29,29,27,0.15)] flex flex-col items-center justify-center space-y-5 min-h-[300px]">
                  <div className="bg-[#F4F2EE] text-[#1D1D1B] p-3 rounded-none border border-[#1D1D1B]">
                    <Brain className="w-8 h-8 text-blue-700" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-base font-sans font-black uppercase tracking-wider text-[#1D1D1B]">No Playbook Generated Yet</h3>
                    <p className="text-xs text-gray-600 max-w-md leading-relaxed">
                      Set up your team's size, tool stack selections, and maturity sliders inside the Operational Audit panel first, then trigger custom play-book synthesis.
                    </p>
                  </div>
                  <button
                    onClick={handleTriggerGeminiAnalysis}
                    className="bg-blue-700 hover:bg-blue-800 text-white font-sans font-black uppercase tracking-widest text-xs px-5 py-3 rounded-none shadow-[2px_2px_0px_0px_rgba(29,29,27,0.15)] cursor-pointer"
                  >
                    Generate AI Staff Playbook
                  </button>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Right Side Column: Benchmarks & Saved Audit History (span 4) */}
        <div className="lg:col-span-4 space-y-6 print:hidden">
          
          {/* ROI Metric side stats card */}
          <div className="bg-[#1D1D1B] text-[#F4F2EE] rounded-none border-2 border-[#1D1D1B] p-5 shadow-[4px_4px_0px_0px_rgba(29,29,27,0.15)]">
            <span className="text-[10px] font-mono tracking-widest font-black text-blue-400 uppercase block mb-1">
              Missed Value Indicators
            </span>
            
            <div className="space-y-3 mt-4">
              <div className="flex justify-between items-end border-b border-white/10 pb-2">
                <span className="text-xs text-[#F4F2EE]/80">Financial Value leaving:</span>
                <span className="text-base font-bold text-white font-mono">
                  ${currentMetrics.financialSavingsYear.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-end border-b border-white/10 pb-2">
                <span className="text-xs text-[#F4F2EE]/80">Time-to-Market saved:</span>
                <span className="text-base font-bold text-white font-mono text-blue-400">
                  -{currentMetrics.weeksSavedTotal}w / block
                </span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-xs text-[#F4F2EE]/80">Recurrent designer-hours saved:</span>
                <span className="text-base font-bold text-white font-mono">
                  +{currentMetrics.totalEngineeringHoursSavedYear.toLocaleString()} hrs
                </span>
              </div>
            </div>
          </div>

          <SavedReports
            savedList={savedReports}
            onLoadReport={handleLoadReport}
            onDeleteReport={handleDeleteReport}
            onClearAll={handleClearAllReports}
            onLoadPreset={handleLoadPreset}
            currentReportId={currentReportId}
          />
        </div>

      </main>

      {/* Corporate disclaimer footer */}
      <footer className="bg-white border-t-2 border-[#1D1D1B] py-6 mt-12 print:hidden">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-gray-500 font-mono">
          <p>© {new Date().getFullYear()} Analog AI CAD Audit & Optimization Core. All Rights Reserved.</p>
          <p className="mt-1 opacity-70">
            For evaluation on team parameters. Securely persisted in local browser storage assets.
          </p>
        </div>
      </footer>
    </div>
  );
}
