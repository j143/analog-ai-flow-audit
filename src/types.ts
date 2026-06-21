/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type MaturityPhase = 
  | "spec"
  | "sizing"
  | "layout"
  | "verification"
  | "playbooks";

export type ToolStackOptions = "cadence" | "synopsys" | "siemens" | "mixed";

export interface AuditInputs {
  companyName: string;
  projectName: string;
  teamSize: number;
  salaryRate: number; // Annual overhead/salary per designer ($)
  blockCyclesPerYear: number;
  blockCycleWeeks: number; // Typical weeks taken to layout/tape out a manual block
  toolStack: ToolStackOptions;
  currentNodes: string[]; // ['28nm', '16nm', '5nm', '2nm'] etc
  blockTypes: string[];   // ['OpAmp', 'LDO', 'PLL', 'ADC', 'RF'] etc
  ratings: Record<MaturityPhase, number>; // 1 - 5 Scale
  selections: Record<MaturityPhase, string>; // Named tools selected
  standardCornerSweeps: number; // e.g. 200, 1000
}

export interface CalculatedMetrics {
  // Hours & Resources
  hoursSavedPerDesignerYear: number;
  totalEngineeringHoursSavedYear: number;
  financialSavingsYear: number;
  
  // Schedule Impact (Weeks)
  baselineWeeksTotal: number;
  projectedWeeksTotal: number;
  weeksSavedTotal: number;
  
  specWeeksSaved: number;
  sizingWeeksSaved: number;
  layoutWeeksSaved: number;
  verificationWeeksSaved: number;

  // Efficiency Percentages
  overallProductivityBoostPercent: number;
  simulationComputeReductionRatio: number; // percent compute saved
  timeToMarketSpeedupPercent: number;
}

export interface GeminiPlaybookResult {
  evaluationText: string; // The full markdown response from Google Gemini
  scriptTemplate: string; // An Ocean / Tcl / Command recipe generated for them
}

export interface AuditReport {
  id: string;
  title: string;
  timestamp: string;
  inputs: AuditInputs;
  metrics: CalculatedMetrics;
  playbook?: GeminiPlaybookResult;
}

export const NODE_OPTIONS = ["180nm", "65nm", "45nm", "28nm", "16nm/12nm", "7nm/5nm", "3nm/2nm"];
export const BLOCK_OPTIONS = ["OpAmp / Comparator", "LDO / Regulator", "PLL / Clocking", "ADC / DAC", "RF Front-End / Mixer", "I/O Pad Ring", "Bandgap Reference"];

export const PHASE_META: Record<MaturityPhase, { title: string; desc: string; sliderLabel: string; benchmarkNodeText: string }> = {
  spec: {
    title: "Specs & Architecture",
    desc: "Capturing higher-level parameters, sizing bounds, testbenches, and parameters into reusable templates.",
    sliderLabel: "1: Fully manual PDF/Confluence specs | 5: Linked templates, auto-TB generation",
    benchmarkNodeText: "Staff template library with standard parameter constraints."
  },
  sizing: {
    title: "Design-Space Sizing & Optimization",
    desc: "Centering multi-variate designs against conflicting specifications across corner simulations.",
    sliderLabel: "1: Manual sweeps, trail-and-error cycles | 5: closed-loop AI centering",
    benchmarkNodeText: "Saves up to 30% of standard sizing cycles (e.g. MediaTek 2nm adoption)."
  },
  layout: {
    title: "Layout Synthesis & IP Migration",
    desc: "Migrating schemas to new PDKs and automating device placement, routing, and guardrings creation.",
    sliderLabel: "1: Redraw layout/schematic from scratch | 5: AI-driven node mapping & synthesis",
    benchmarkNodeText: "Shaves off up to 40% of layout resources and migration timelines via template-free learning."
  },
  verification: {
    title: "Verification & Corner Sweeps",
    desc: "Accelerating simulation throughputs, executing PVT sweeps, and evaluating layout paracitics.",
    sliderLabel: "1: Manual corners list, overnight batches | 5: AI-assisted corner regression & live DRC",
    benchmarkNodeText: "AI schedule and solver acceleration cuts compute overheads by 25-30%."
  },
  playbooks: {
    title: "Flow Abstractions & Playbooks",
    desc: "Creating reusable AI preset configurations, scripts, and automation chains for the entire team.",
    sliderLabel: "1: Flows live in designer notebooks | 5: Team-wide standardized AI-ready playbooks",
    benchmarkNodeText: "Standardizing flow cards raises junior engineer delivery speeds by up to 35%."
  }
};
