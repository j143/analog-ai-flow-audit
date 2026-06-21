/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { AuditInputs, ToolStackOptions, NODE_OPTIONS, BLOCK_OPTIONS } from "../types";
import { Users, DollarSign, Calendar, Layers, Activity } from "lucide-react";

interface BusinessCalculatorProps {
  inputs: AuditInputs;
  onChange: (updated: Partial<AuditInputs>) => void;
}

export default function BusinessCalculator({ inputs, onChange }: BusinessCalculatorProps) {
  const handleNodeToggle = (node: string) => {
    const nextArr = inputs.currentNodes.includes(node)
      ? inputs.currentNodes.filter((n) => n !== node)
      : [...inputs.currentNodes, node];
    onChange({ currentNodes: nextArr });
  };

  const handleBlockToggle = (block: string) => {
    const nextArr = inputs.blockTypes.includes(block)
      ? inputs.blockTypes.filter((b) => b !== block)
      : [...inputs.blockTypes, block];
    onChange({ blockTypes: nextArr });
  };

  return (
    <div className="bg-white rounded-none border-2 border-[#1D1D1B] p-6 space-y-6 shadow-[4px_4px_0px_0px_rgba(29,29,27,0.15)]">
      <div>
        <h2 className="text-xl font-serif font-black italic text-[#1D1D1B] flex items-center gap-2">
          <span>1. Operational Parameters</span>
        </h2>
        <p className="text-xs text-gray-600 mt-1">
          Provide baseline demographics and volumes. These define your total engineering capacity and financial overheads.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-widest text-[#1D1D1B]/60 font-bold mb-1.5">
            Company / Division
          </label>
          <input
            type="text"
            className="w-full text-xs border border-[#1D1D1B] rounded-none px-3 py-2 bg-[#F4F2EE]/40 focus:bg-white focus:ring-1 focus:ring-blue-700 focus:outline-none transition-colors"
            placeholder="e.g. ASIC North division"
            value={inputs.companyName}
            onChange={(e) => onChange({ companyName: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-widest text-[#1D1D1B]/60 font-bold mb-1.5">
            Project / IP Block Target
          </label>
          <input
            type="text"
            className="w-full text-xs border border-[#1D1D1B] rounded-none px-3 py-2 bg-[#F4F2EE]/40 focus:bg-white focus:ring-1 focus:ring-blue-700 focus:outline-none transition-colors"
            placeholder="e.g. Multispec LDO & PLL PLL-TSMC16"
            value={inputs.projectName}
            onChange={(e) => onChange({ projectName: e.target.value })}
          />
        </div>
      </div>

      <hr className="border-[#1D1D1B]/15" />

      {/* Main Parameters */}
      <div className="space-y-5">
        {/* Team Headcount */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-[10px] font-mono uppercase tracking-wider text-[#1D1D1B]/80 font-bold flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-blue-700" />
              Team Size (Analog Designers)
            </label>
            <span className="text-xs font-mono font-bold text-[#1D1D1B] bg-[#1D1D1B]/5 px-2.5 py-0.5 border border-[#1D1D1B]/10 rounded-none">
              {inputs.teamSize} Designers
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="100"
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1D4ED8]"
            value={inputs.teamSize}
            onChange={(e) => onChange({ teamSize: parseInt(e.target.value) || 1 })}
          />
        </div>

        {/* Designer Overhead Rate */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-[10px] font-mono uppercase tracking-wider text-[#1D1D1B]/80 font-bold flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-blue-700" />
              Avg Overhead / Salary per Head
            </label>
            <span className="text-xs font-mono font-bold text-[#1D1D1B] bg-[#1D1D1B]/5 px-2.5 py-0.5 border border-[#1D1D1B]/10 rounded-none">
              ${inputs.salaryRate.toLocaleString()} / Yr
            </span>
          </div>
          <input
            type="range"
            min="100000"
            max="500000"
            step="10000"
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1D4ED8]"
            value={inputs.salaryRate}
            onChange={(e) => onChange({ salaryRate: parseInt(e.target.value) || 120000 })}
          />
        </div>

        {/* Typical Block Cycle Weeks */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-[10px] font-mono uppercase tracking-wider text-[#1D1D1B]/80 font-bold flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-700" />
              Manual Block Development Time
            </label>
            <span className="text-xs font-mono font-bold text-[#1D1D1B] bg-[#1D1D1B]/5 px-2.5 py-0.5 border border-[#1D1D1B]/10 rounded-none">
              {inputs.blockCycleWeeks} Weeks
            </span>
          </div>
          <input
            type="range"
            min="4"
            max="30"
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1D4ED8]"
            value={inputs.blockCycleWeeks}
            onChange={(e) => onChange({ blockCycleWeeks: parseInt(e.target.value) || 4 })}
          />
        </div>

        {/* Block throughput */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-[10px] font-mono uppercase tracking-wider text-[#1D1D1B]/80 font-bold flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-700" />
              Blocks Completed / Migrated Per Year
            </label>
            <span className="text-xs font-mono font-bold text-[#1D1D1B] bg-[#1D1D1B]/5 px-2.5 py-0.5 border border-[#1D1D1B]/10 rounded-none">
              {inputs.blockCyclesPerYear} Blocks
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="40"
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1D4ED8]"
            value={inputs.blockCyclesPerYear}
            onChange={(e) => onChange({ blockCyclesPerYear: parseInt(e.target.value) || 1 })}
          />
        </div>

        {/* Sim count */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-[#1D1D1B]/60 font-bold mb-1 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-blue-700" />
              Standard corners swept
            </label>
            <input
              type="number"
              min="5"
              max="5000"
              className="w-full text-xs border border-[#1D1D1B] rounded-none px-3 py-2 bg-[#F4F2EE]/40 focus:bg-white focus:ring-1 focus:ring-blue-700 focus:outline-none transition-colors"
              value={inputs.standardCornerSweeps}
              onChange={(e) => onChange({ standardCornerSweeps: parseInt(e.target.value) || 5 })}
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-[#1D1D1B]/60 font-bold mb-1">
              Main CAD Tool Suite Base
            </label>
            <select
              className="w-full text-xs border border-[#1D1D1B] rounded-none px-3 py-2 bg-white focus:ring-1 focus:ring-blue-700 focus:outline-none transition-colors cursor-pointer"
              value={inputs.toolStack}
              onChange={(e) => onChange({ toolStack: e.target.value as ToolStackOptions })}
            >
              <option value="cadence">Cadence (Virtuoso ADE Studio suite)</option>
              <option value="synopsys">Synopsys (Custom Compiler / ASO.ai)</option>
              <option value="siemens">Siemens (Tanner / L-Edit / Calibre)</option>
              <option value="mixed">Mixed/Heterogeneous toolchains</option>
            </select>
          </div>
        </div>
      </div>

      <hr className="border-[#1D1D1B]/15" />

      {/* Target nodes multiselect */}
      <div>
        <span className="block text-[10px] font-mono uppercase tracking-wider text-[#1D1D1B]/60 font-bold mb-2">
          Target Silicon Processes (PDKs)
        </span>
        <div className="flex flex-wrap gap-1.5">
          {NODE_OPTIONS.map((node) => {
            const isSelected = inputs.currentNodes.includes(node);
            return (
              <button
                key={node}
                type="button"
                id={`node-${node.replace("/", "-")}`}
                onClick={() => handleNodeToggle(node)}
                className={`text-[11px] font-mono px-3 py-1.5 rounded-none border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#1D1D1B] border-[#1D1D1B] text-[#F4F2EE] font-bold"
                    : "bg-[#F4F2EE]/60 border-[#1D1D1B]/30 text-[#1D1D1B] hover:bg-[#1D1D1B]/5"
                }`}
              >
                {node}
              </button>
            );
          })}
        </div>
      </div>

      {/* Target Block kinds multiselect */}
      <div>
        <span className="block text-[10px] font-mono uppercase tracking-wider text-[#1D1D1B]/60 font-bold mb-2">
          Active Block Categories
        </span>
        <div className="flex flex-wrap gap-1.5">
          {BLOCK_OPTIONS.map((b) => {
            const isSelected = inputs.blockTypes.includes(b);
            return (
              <button
                key={b}
                type="button"
                id={`block-${b.split(" ")[0]}`}
                onClick={() => handleBlockToggle(b)}
                className={`text-[11px] font-mono px-2.5 py-1 rounded-none border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-blue-700 border-blue-700 text-white font-bold"
                    : "bg-[#F4F2EE]/60 border-[#1D1D1B]/30 text-[#1D1D1B]/80 hover:bg-[#1D1D1B]/5"
                }`}
              >
                {b}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
