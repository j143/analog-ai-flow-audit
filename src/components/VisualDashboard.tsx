/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { CalculatedMetrics, AuditInputs } from "../types";
import { TrendingUp, Clock, Gauge, Database, ArrowRight, CornerDownRight, Check } from "lucide-react";

interface VisualDashboardProps {
  metrics: CalculatedMetrics;
  inputs: AuditInputs;
}

export default function VisualDashboard({ metrics, inputs }: VisualDashboardProps) {
  const [hoveredPhase, setHoveredPhase] = useState<string | null>(null);

  // Phases array for SVG bars
  const phasesData = [
    { key: "spec", label: "Specs & Setup", current: inputs.ratings.spec },
    { key: "sizing", label: "AI Sizing Opt", current: inputs.ratings.sizing },
    { key: "layout", label: "AI Layout Synth", current: inputs.ratings.layout },
    { key: "verification", label: "AI Sim Verification", current: inputs.ratings.verification },
    { key: "playbooks", label: "Flow Playbooks", current: inputs.ratings.playbooks },
  ];

  // Timeline values
  const {
    baselineWeeksTotal,
    projectedWeeksTotal,
    weeksSavedTotal,
    specWeeksSaved,
    sizingWeeksSaved,
    layoutWeeksSaved,
    verificationWeeksSaved,
  } = metrics;

  return (
    <div className="space-y-6 text-[#1D1D1B]">
      
      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Card 1: Annual Financial Gaps */}
        <div className="bg-[#1D1D1B] text-[#F4F2EE] rounded-none border-2 border-[#1D1D1B] p-5 shadow-[4px_4px_0px_0px_rgba(29,29,27,0.15)] relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-10 translate-x-3 translate-y-3">
            <TrendingUp className="w-24 h-24 text-white" />
          </div>
          <span className="text-[9px] font-mono tracking-widest text-[#F4F2EE]/60 font-bold uppercase block mb-1">
            Missed Annual Value
          </span>
          <div className="text-3xl font-serif font-black italic text-white mb-2">
            ${metrics.financialSavingsYear.toLocaleString()}
          </div>
          <p className="text-xs text-[#F4F2EE]/80 leading-relaxed">
            Unrecovered engineering payroll costs currently spent on manual EDA iterations.
          </p>
          <div className="mt-3.5 bg-white/10 rounded-none p-2 border border-white/10 flex items-center justify-between">
            <span className="text-[9px] uppercase font-mono text-[#F4F2EE]/60">Payroll Recovery</span>
            <span className="text-xs font-mono font-bold text-blue-400">+{metrics.overallProductivityBoostPercent}% Productivity</span>
          </div>
        </div>

        {/* Card 2: Saved Schedule (Time-to-Market) */}
        <div className="bg-white rounded-none border-2 border-[#1D1D1B] p-5 shadow-[4px_4px_0px_0px_rgba(29,29,27,0.15)] relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-5 translate-x-3 translate-y-3">
            <Clock className="w-24 h-24 text-[#1D1D1B]" />
          </div>
          <span className="text-[9px] font-mono tracking-widest text-gray-500 font-bold uppercase block mb-1">
            Time-to-Market Saved
          </span>
          <div className="text-3xl font-serif font-black italic text-[#1D1D1B] mb-2">
            {weeksSavedTotal} Weeks
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            Block layout and tapeout timeline shortened from <span className="font-semibold text-gray-800">{baselineWeeksTotal}w</span> to <span className="font-semibold text-blue-700">{projectedWeeksTotal}w</span>.
          </p>
          <div className="mt-3.5 bg-blue-50 rounded-none p-2 border border-blue-200/50 flex items-center justify-between">
            <span className="text-[9px] uppercase font-mono text-blue-800">Tapeout Speedup</span>
            <span className="text-xs font-mono font-bold text-blue-800">-{metrics.timeToMarketSpeedupPercent}% Cycle Time</span>
          </div>
        </div>

        {/* Card 3: simulation compute overhead */}
        <div className="bg-white rounded-none border-2 border-[#1D1D1B] p-5 shadow-[4px_4px_0px_0px_rgba(29,29,27,0.15)] sm:col-span-2 lg:col-span-1 relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-5 translate-x-3 translate-y-3">
            <Gauge className="w-24 h-24 text-[#1D1D1B]" />
          </div>
          <span className="text-[9px] font-mono tracking-widest text-gray-500 font-bold uppercase block mb-1">
            Simulation Compute Slack
          </span>
          <div className="text-3xl font-serif font-black italic text-[#1D1D1B] mb-2">
            {metrics.simulationComputeReductionRatio}% Savings
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            GPU-assisted and AI-tuned corner schedulers prune non-worst simulations.
          </p>
          <div className="mt-3.5 bg-[#F4F2EE] rounded-none p-2 border border-gray-200 flex items-center justify-between">
            <span className="text-[9px] uppercase font-mono text-[#1D1D1B]/60">Sweeps optimized</span>
            <span className="text-xs font-mono font-bold text-[#1D1D1B]/80">Level {inputs.ratings.verification}/5 verification</span>
          </div>
        </div>
      </div>

      {/* SVG chart 1: Maturity comparison */}
      <div className="bg-white rounded-none border-2 border-[#1D1D1B] p-6 shadow-[4px_4px_0px_0px_rgba(29,29,27,0.15)]">
        <div className="mb-4">
          <span className="text-[10px] uppercase tracking-wider text-gray-500 font-mono font-bold block">
            Visual Analysis Model
          </span>
          <h3 className="text-lg font-serif font-black italic text-[#1D1D1B]">
            AI CAD Tool Maturity Gap
          </h3>
          <p className="text-xs text-gray-600 mt-1">
            Compare your team's evaluated scores (Level 1-5) against the ideal staff-standardized reference architecture.
          </p>
        </div>

        <div className="w-full bg-[#F4F2EE]/50 border border-[#1D1D1B]/10 rounded-none p-4 overflow-x-auto">
          <div className="min-w-[480px]">
            {/* Legend */}
            <div className="flex gap-4 items-center justify-end text-[9px] font-mono mb-4 px-2">
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 bg-red-400 inline-block"></span>
                <span>CRITICAL MISSED GAP</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 bg-blue-700 inline-block"></span>
                <span>TEAM MATURITY</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 bg-gray-200 inline-block"></span>
                <span>IDEAL AUTOMATION</span>
              </div>
            </div>

            {/* Custom SVG Bar Graph */}
            <svg viewBox="0 0 600 240" className="w-full">
              {/* Grid Lines */}
              {[1, 2, 3, 4, 5].map((level) => {
                const x = 180 + level * 75;
                return (
                  <g key={level} className="opacity-40">
                    <line x1={x} y1="10" x2={x} y2="210" stroke="#1D1D1B" strokeDasharray="3,3" strokeOpacity="0.2" />
                    <text x={x} y="224" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#1D1D1B" fontWeight="bold">
                      L{level}
                    </text>
                  </g>
                );
              })}

              {/* Bars rows */}
              {phasesData.map((phase, idx) => {
                const y = 20 + idx * 38;
                const evaluatedWidth = phase.current * 75;
                const idealWidth = 5 * 75;

                // Color configuration
                const isCriticalGap = phase.current <= 2;
                const barColor = isCriticalGap ? "#F87171" : "#1D4ED8"; // dynamic alert: light-red vs royal blue

                return (
                  <g
                    key={phase.key}
                    onMouseEnter={() => setHoveredPhase(phase.key)}
                    onMouseLeave={() => setHoveredPhase(null)}
                    style={{ cursor: "pointer" }}
                  >
                    {/* Background hover highlights */}
                    <rect
                      x="5"
                      y={y - 8}
                      width="590"
                      height="34"
                      fill={hoveredPhase === phase.key ? "rgba(29, 29, 27, 0.05)" : "transparent"}
                      className="transition-colors duration-150"
                    />

                    {/* Phase label */}
                    <text x="15" y={y + 12} fontSize="11" fontFamily="sans-serif" fontWeight="bold" fill="#1D1D1B">
                      {phase.label}
                    </text>

                    {/* Score badge label */}
                    <text x="15" y={y + 24} fontSize="9" fontFamily="monospace" fill="#1D1D1B" opacity="0.6">
                      CURRENT: LEVEL {phase.current}
                    </text>

                    {/* Reference ideal line background */}
                    <rect x="180" y={y + 1} width={idealWidth} height="12" fill="#E2E8F0" />

                    {/* Evaluated Team line on top */}
                    <rect x="180" y={y + 1} width={evaluatedWidth} height="12" fill={barColor} />

                    {/* Gap Indicator circle */}
                    {phase.current < 5 && (
                      <g>
                        <circle cx={180 + evaluatedWidth + (idealWidth - evaluatedWidth)/2} cy={y + 7} r="3.5" fill="#EF4444" />
                        <text x={180 + evaluatedWidth + (idealWidth - evaluatedWidth)/2 + 8} y={y + 10} fontSize="8" fill="#EF4444" fontWeight="black" fontFamily="monospace">
                          -{5 - phase.current}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>

      {/* SVG Gantt Chart 2: Tapeout Timeline Reduction */}
      <div className="bg-white rounded-none border-2 border-[#1D1D1B] p-6 shadow-[4px_4px_0px_0px_rgba(29,29,27,0.15)]">
        <div className="mb-4">
          <span className="text-[10px] uppercase tracking-wider text-gray-500 font-mono font-bold block">
            Timeline Scheduling Model
          </span>
          <h3 className="text-lg font-serif font-black italic text-[#1D1D1B]">
            Gantt Impact: Block Tapeout Cycle Reduction
          </h3>
          <p className="text-xs text-gray-600 mt-1">
            Visual comparison of your manual block tapeout schedule vs. AI-accelerated closed loops.
          </p>
        </div>

        <div className="w-full bg-[#F4F2EE]/50 border border-[#1D1D1B]/10 rounded-none p-4 overflow-x-auto">
          <div className="min-w-[480px]">
            <svg viewBox="0 0 600 180" className="w-full">
              {/* x-axis grid */}
              {Array.from({ length: Math.ceil(baselineWeeksTotal) + 2 }).map((_, weekIdx) => {
                const x = 110 + (weekIdx * 32);
                if (x > 580) return null;
                return (
                  <g key={weekIdx} className="opacity-40">
                    <line x1={x} y1="20" x2={x} y2="150" stroke="#1D1D1B" strokeDasharray="2,2" strokeOpacity="0.2" />
                    <text x={x} y="162" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#1D1D1B">
                      W{weekIdx}
                    </text>
                  </g>
                );
              })}

              {/* Baseline Group Gantt Bar */}
              <g>
                <text x="15" y="55" fontSize="11" fontFamily="sans-serif" fontWeight="bold" fill="#1D1D1B">
                  Baseline (Manual)
                </text>
                <text x="15" y="67" fontSize="9" fontFamily="monospace" fill="#1D1D1B" opacity="0.6">
                  {baselineWeeksTotal} weeks total
                </text>

                {/* Drawn block cycle timeline */}
                <rect x="110" y="42" width={baselineWeeksTotal * 32} height="24" fill="#64748B" />
                
                {/* Visual phase cuts inside baseline */}
                <line x1={110 + (baselineWeeksTotal * 0.1 * 32)} y1="42" x2={110 + (baselineWeeksTotal * 0.1 * 32)} y2="66" stroke="#94A3B8" />
                <line x1={110 + (baselineWeeksTotal * 0.4 * 32)} y1="42" x2={110 + (baselineWeeksTotal * 0.4 * 32)} y2="66" stroke="#94A3B8" />
                <line x1={110 + (baselineWeeksTotal * 0.8 * 32)} y1="42" x2={110 + (baselineWeeksTotal * 0.8 * 32)} y2="66" stroke="#94A3B8" />

                <text x={110 + (baselineWeeksTotal * 16)} y="57" fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                  STANDARD MANUAL SEQUENCE BLOCK CYCLES
                </text>
              </g>

              {/* PROJECTED AI ACCELERATED Gantt Bar */}
              <g>
                <text x="15" y="115" fontSize="11" fontFamily="sans-serif" fontWeight="bold" fill="#1D1D1B">
                  Accelerated (AI)
                </text>
                <text x="15" y="127" fontSize="9" fontFamily="monospace" fill="#1D4ED8">
                  {projectedWeeksTotal} weeks total
                </text>

                {/* Optimised Gantt Block */}
                <rect x="110" y="102" width={projectedWeeksTotal * 32} height="24" fill="#1D4ED8" />
                
                {/* Wasted Gaps represent saved days */}
                <rect x={110 + (projectedWeeksTotal * 32)} y="102" width={weeksSavedTotal * 32} height="24" fill="#DBEAFE" stroke="#1D4ED8" strokeDasharray="3,3" fillOpacity="0.8" />

                <text x={110 + ((projectedWeeksTotal * 32) + (weeksSavedTotal * 16))} y="117" fill="#1E40AF" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                  Saved: {weeksSavedTotal}w (-{metrics.timeToMarketSpeedupPercent}%)
                </text>
                
                <text x={110 + (projectedWeeksTotal * 16)} y="117" fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                  SYSTEMIC AI CLOSED LOOPS
                </text>
              </g>
            </svg>

            {/* Gantt metadata explanation helper footer */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-[#1D1D1B]/15 text-[10px] font-mono text-[#1D1D1B]/80 mt-2">
              <div>
                <span className="font-bold text-[#1D1D1B] block">Spec/Setup Saved:</span>
                <span>{specWeeksSaved} weeks</span>
              </div>
              <div>
                <span className="font-bold text-[#1D1D1B] block">AI Sizing Saved:</span>
                <span>{sizingWeeksSaved} weeks</span>
              </div>
              <div>
                <span className="font-bold text-[#1D1D1B] block">AI Layout Saved:</span>
                <span>{layoutWeeksSaved} weeks</span>
              </div>
              <div>
                <span className="font-bold text-[#1D1D1B] block">AI Verification Saved:</span>
                <span>{verificationWeeksSaved} weeks</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Dynamic PDK Node-to-Node Migration Schema */}
      <div className="bg-white rounded-none border-2 border-[#1D1D1B] p-6 shadow-[4px_4px_0px_0px_rgba(29,29,27,0.15)]">
        <div className="mb-4">
          <span className="text-[10px] uppercase tracking-wider text-gray-500 font-mono font-bold block">
            Systemic Architectural Flow
          </span>
          <h3 className="text-lg font-serif font-black italic text-[#1D1D1B]">
            AI PDK Transition Mapping Architecture
          </h3>
          <p className="text-xs text-gray-600 mt-1">
            How closed-loop AI structures translate schemas, sizing coefficients, and placement weights dynamically across advanced foundry processes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Source node card */}
          <div className="bg-[#F4F2EE] border border-[#1D1D1B]/20 rounded-none p-4 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="bg-[#1D1D1B]/10 text-[#1D1D1B] text-[9px] font-mono px-2 py-0.5 rounded-none border border-[#1D1D1B]/15 font-bold">
                STAGE 1: SOURCE IP
              </span>
              <h4 className="text-xs font-sans font-black uppercase tracking-tight">Source Legacy PDK</h4>
              <p className="text-[11px] text-[#1D1D1B]/80 leading-relaxed">
                Legacy sizing variables (W/L widths), PVT testbenches, and standard manual layout cells.
              </p>
            </div>
            <div className="pt-3 flex items-center justify-between mt-2 font-mono text-[10px] text-[#1D1D1B]/60">
              <Database className="w-3.5 h-3.5 text-blue-700" />
              <span>PDK Node: {inputs.currentNodes[0] || "Target node"}</span>
            </div>
          </div>

          {/* AI transition pipeline */}
          <div className="bg-[#1D1D1B] text-[#F4F2EE] rounded-none p-4 flex flex-col justify-between border border-[#1D1D1B]">
            <div className="space-y-2">
              <span className="bg-blue-700 text-white text-[9px] font-mono px-2 py-0.5 rounded-none font-bold uppercase tracking-widest">
                Stage 2: AI Migration Loop
              </span>
              <h4 className="text-xs font-sans font-black text-white uppercase tracking-tight">Closed-Loop CAD Solver</h4>
              <p className="text-[11px] text-blue-300 leading-relaxed">
                ASO.ai / Virtuoso DSO automates PDK target mappings, parameter optimization, and synthesis of DRC-clean proposed layout outlines.
              </p>
            </div>
            <div className="pt-3 flex gap-1 items-center mt-2 font-mono text-[9px] text-[#F4F2EE]/70">
              <Gauge className="w-3.5 h-3.5 text-blue-400" />
              <span>Multi-Objective Pareto Frontiers</span>
            </div>
          </div>

          {/* Target node card */}
          <div className="bg-white border border-[#1D1D1B]/20 rounded-none p-4 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="bg-[#1D1D1B] text-white text-[9px] font-mono px-2 py-0.5 rounded-none font-bold uppercase">
                Stage 3: TARGET PDK IP
              </span>
              <h4 className="text-xs font-sans font-black text-[#1D1D1B] uppercase tracking-tight">Migrated Centered Design</h4>
              <p className="text-[11px] text-[#1D1D1B]/80 leading-relaxed">
                Fully centered design with customized silicon coefficients. Fully meets all supply BW margins and Gain specs.
              </p>
            </div>
            <div className="pt-3 flex justify-between items-center mt-3 font-mono text-[10px] text-blue-700 font-bold">
              <Check className="w-4 h-4" />
              <span>Active Target Node</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
