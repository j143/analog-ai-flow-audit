/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { MaturityPhase, PHASE_META, ToolStackOptions } from "../types";
import { getRatingLevelDescription } from "../utils/formulas";
import { Star, ShieldAlert, CheckCircle, FileText, Settings, Zap, Compass, Check } from "lucide-react";

interface AuditSurveyProps {
  ratings: Record<MaturityPhase, number>;
  selections: Record<MaturityPhase, string>;
  toolStack: ToolStackOptions;
  onRatingChange: (phase: MaturityPhase, value: number) => void;
  onToolSelectionChange: (phase: MaturityPhase, value: string) => void;
}

const PHASE_ICONS: Record<MaturityPhase, React.ComponentType<any>> = {
  spec: FileText,
  sizing: Compass,
  layout: Settings,
  verification: Zap,
  playbooks: CheckCircle,
};

export default function AuditSurvey({
  ratings,
  selections,
  toolStack,
  onRatingChange,
  onToolSelectionChange,
}: AuditSurveyProps) {
  
  // Custom tool suggestions based on the stack
  const getToolSuggestions = (phase: MaturityPhase): string[] => {
    switch (toolStack) {
      case "cadence":
        if (phase === "spec") return ["Manual Text/Specs", "Virtuoso ADE Explorer Templates", "ADE XL states", "Custom XML bounds"];
        if (phase === "sizing") return ["Manual Parametric Sweeps", "ADE Assembler Optimizer", "ADE Design Space Optimization (DSO)", "Custom optimers"];
        if (phase === "layout") return ["Manual drawing by layout team", "Virtuoso Layout Suite Pro", "Virtuoso Design Migration / Auto PDK mapping", "Custom Skill placement scripts"];
        if (phase === "verification") return ["Linear sweep schedules", "Spectre Multi-Corner sweeps", "In-command Calibre/DRC Real-time", "Spectre Monte Carlo optimizations"];
        return ["No collective files", "Central ADE states repo", "Ocean Script playbook templates", "Central CAD Flow repository"];
      case "synopsys":
        if (phase === "spec") return ["Manual Text", "PrimeWave Spec Sheets", "Sytematic XML constraints"];
        if (phase === "sizing") return ["Manual sweeps", "PrimeWave Optimization Solver", "ASO.ai closed-loop", "Custom PrimeSim optimizers"];
        if (phase === "layout") return ["Manual drawing", "Custom Compiler helpers", "AI Analog Layout Synthesis", "Laker-legacy PDK migrator"];
        if (phase === "verification") return ["Manual sweep list", "PrimeSim multi-corner accelerator", "GPU-accelerated PrimeSim solvers"];
        return ["Outdated scripts", "Centralized ASO.ai presets", "Unified Node Migration Playbook"];
      case "siemens":
        if (phase === "spec") return ["Manual Confluence text", "Tanner S-Edit symbol bounds", "Custom spreadsheets"];
        if (phase === "sizing") return ["Manual sweeps", "L-Edit interactive sweeps", "Custom PyTanner solvers"];
        if (phase === "layout") return ["Manual layout from scratch", "Tanner L-Edit SDL router", "Calibre real-time DRC/LVS in L-Edit"];
        if (phase === "verification") return ["Manual corners sweeps", "Eldo PVT simulator runs", "Calibre DRC/LVS standard runs"];
        return ["Local directories only", "Central Tanner playbooks", "Central Calibre setups registry"];
      case "mixed":
      default:
        if (phase === "spec") return ["Manual Confluence specs", "Mixed tool states", "Target bounds file"];
        if (phase === "sizing") return ["Manual trial and error", "Cadence DSO / Synopsys optimizer", "Custom python scripts"];
        if (phase === "layout") return ["Manual drawing from scratch", "Virtuoso schematic to Custom Compiler layout", "Custom PDK translators"];
        if (phase === "verification") return ["Manual sweeps schedule", "Spectre-Eldo mixed solvers", "In-design DRC verification run"];
        return ["Designer notebooks only", "Git repository with custom wrappers", "Full staff design-kits playbooks"];
    }
  };

  return (
    <div className="space-y-6 text-[#1D1D1B]">
      <div>
        <h2 className="text-xl font-serif font-black italic text-[#1D1D1B]">
          2. CAD Tool Maturity Assessment
        </h2>
        <p className="text-xs text-gray-600 mt-1">
          Evaluate the level of automation and toolsets used by your team at each phase of the analog design cycle.
        </p>
      </div>

      <div className="space-y-6">
        {(Object.keys(PHASE_META) as MaturityPhase[]).map((phase) => {
          const meta = PHASE_META[phase];
          const IconComponent = PHASE_ICONS[phase];
          const currentRating = ratings[phase];
          const diagnosticInfo = getRatingLevelDescription(phase, currentRating);
          const toolChoices = getToolSuggestions(phase);

          return (
            <div
              key={phase}
              id={`survey-card-${phase}`}
              className="bg-white rounded-none border-2 border-[#1D1D1B] p-5 shadow-[4px_4px_0px_0px_rgba(29,29,27,0.15)] space-y-4"
            >
              {/* Header with Title and Icon */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-3">
                  <div className="bg-[#F4F2EE] text-[#1D1D1B] p-2 rounded-none border border-[#1D1D1B] flex items-center justify-center h-10 w-10">
                    <IconComponent className="w-5 h-5 text-blue-700" />
                  </div>
                  <div>
                    <h3 className="text-sm font-sans font-black uppercase tracking-wider text-[#1D1D1B]">
                      {meta.title}
                    </h3>
                    <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                      {meta.desc}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-[#1D1D1B]/60 font-mono uppercase tracking-wider block">Level</span>
                  <div className="text-lg font-mono font-bold text-blue-700 block">
                    {currentRating}/5
                  </div>
                </div>
              </div>

              {/* Slider Input with Star Buttons */}
              <div className="bg-[#F4F2EE]/50 rounded-none p-3.5 border border-[#1D1D1B]/15 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono tracking-widest font-bold uppercase text-[#1D1D1B]/50">
                    Maturity Level selection
                  </span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((starValue) => {
                      const isHighlighted = starValue <= currentRating;
                      return (
                        <button
                          key={starValue}
                          type="button"
                          id={`star-${phase}-${starValue}`}
                          onClick={() => onRatingChange(phase, starValue)}
                          className="p-1 cursor-pointer hover:scale-110 transition-transform focus:outline-none"
                          title={`Select Level ${starValue}`}
                        >
                          <Star
                            className={`w-5 h-5 transition-all ${
                              isHighlighted
                                ? "fill-blue-700 text-blue-700 drop-shadow-xs"
                                : "text-gray-300 fill-none hover:text-blue-500"
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Micro slider element */}
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  className="w-full h-1 bg-gray-200 rounded-lg cursor-pointer accent-blue-700"
                  value={currentRating}
                  onChange={(e) => onRatingChange(phase, parseInt(e.target.value) || 1)}
                />

                {/* Interactive Diagnostic level feedback */}
                <div className="text-xs text-[#1D1D1B] leading-relaxed pt-1.5 flex gap-1.5 items-start">
                  <ShieldAlert className="w-3.5 h-3.5 text-blue-700 shrink-0 mt-0.5" />
                  <span className="font-sans italic">{diagnosticInfo}</span>
                </div>
              </div>

              {/* Tool Picklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-[#1D1D1B]/60 font-bold mb-1">
                    Current Tool Block
                  </label>
                  <select
                    className="w-full text-xs border border-[#1D1D1B] rounded-none px-2 py-1.5 bg-white focus:ring-1 focus:ring-blue-700 focus:outline-none transition-colors cursor-pointer"
                    value={selections[phase] || ""}
                    onChange={(e) => onToolSelectionChange(phase, e.target.value)}
                  >
                    <option value="">-- Select Active CAD Method --</option>
                    {toolChoices.map((choice) => (
                      <option key={choice} value={choice}>
                        {choice}
                      </option>
                    ))}
                    <option value="custom">Other custom home-grown wrapper</option>
                  </select>
                </div>

                <div className="bg-[#F4F2EE] p-2.5 rounded-none border border-[#1D1D1B]/20 text-[11px] text-[#1D1D1B] leading-relaxed font-sans">
                  <span className="font-bold block text-[9px] uppercase font-mono tracking-widest text-blue-700 mb-0.5">
                    Benchmark Potential
                  </span>
                  {meta.benchmarkNodeText}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
