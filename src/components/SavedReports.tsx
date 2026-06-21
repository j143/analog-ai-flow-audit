/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { AuditReport, AuditInputs } from "../types";
import { Calendar, Trash2, ArrowUpRight, FolderOpen, Award, CheckCircle } from "lucide-react";

interface SavedReportsProps {
  savedList: AuditReport[];
  onLoadReport: (report: AuditReport) => void;
  onDeleteReport: (id: string) => void;
  onClearAll: () => void;
  onLoadPreset: (presetName: string) => void;
  currentReportId?: string;
}

export default function SavedReports({
  savedList,
  onLoadReport,
  onDeleteReport,
  onClearAll,
  onLoadPreset,
  currentReportId,
}: SavedReportsProps) {
  
  return (
    <div className="bg-white rounded-none border-2 border-[#1D1D1B] p-5 shadow-[4px_4px_0px_0px_rgba(29,29,27,0.15)] space-y-5 text-[#1D1D1B]">
      <div>
        <h3 className="text-xs font-mono font-black uppercase tracking-wider text-[#1D1D1B] flex items-center gap-2">
          <span>Benchmarking & Saved History</span>
        </h3>
        <p className="text-[11px] text-gray-600 mt-1">
          Load standard industry production benchmarks or manage your team's historical audits.
        </p>
      </div>

      {/* Preset Benchmarks */}
      <div className="space-y-2">
        <span className="block text-[10px] font-mono uppercase tracking-widest text-blue-700 font-bold mb-1">
          Apply Standard Profiles
        </span>
        <div className="grid grid-cols-1 gap-2.5">
          <button
            type="button"
            id="preset-mediatek"
            onClick={() => onLoadPreset("mediatek")}
            className="text-left p-3 rounded-none border border-[#1D1D1B] bg-white hover:bg-[#F4F2EE] transition-all group cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold font-sans text-[#1D1D1B] group-hover:text-blue-800 flex items-center gap-1">
                MediaTek 2nm Pilot Benchmark
              </span>
              <Award className="w-4 h-4 text-blue-700 opacity-80" />
            </div>
            <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">
              12 Designers, Virtuoso Studio DSO setup, highly optimized sizing (Level 4).
            </p>
          </button>

          <button
            type="button"
            id="preset-tsmc"
            onClick={() => onLoadPreset("synopsys")}
            className="text-left p-3 rounded-none border border-[#1D1D1B] bg-white hover:bg-[#F4F2EE] transition-all group cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold font-sans text-[#1D1D1B] group-hover:text-blue-800 flex items-center gap-1">
                TSMC / Synopsys ASO.ai Flow
              </span>
              <Award className="w-4 h-4 text-blue-700 opacity-80" />
            </div>
            <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">
              50 Designers, Custom Compiler layout + ASO.ai optimization (Level 4).
            </p>
          </button>

          <button
            type="button"
            id="preset-heritage"
            onClick={() => onLoadPreset("heritage")}
            className="text-left p-3 rounded-none border border-[#1D1D1B] bg-white hover:bg-[#F4F2EE] transition-all group cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold font-sans text-[#1D1D1B] group-hover:text-red-700">
                Highly Manual Heritage Flow
              </span>
              <span className="text-[9px] font-mono text-red-700 bg-red-50 px-1 py-0.5 rounded-none border border-red-300 font-bold">
                Level 1 Manual
              </span>
            </div>
            <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">
              10 Designers, manual parametric calculations, fully unoptimized.
            </p>
          </button>
        </div>
      </div>

      <hr className="border-[#1D1D1B]/15" />

      {/* Saved Audits List */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#1D1D1B]/60 font-bold">
            Saved Audits ({savedList.length})
          </span>
          {savedList.length > 0 && (
            <button
              onClick={onClearAll}
              className="text-[10px] text-red-600 hover:text-red-800 font-mono font-bold cursor-pointer transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {savedList.length === 0 ? (
          <div className="bg-[#F4F2EE]/50 border-2 border-dashed border-[#1D1D1B]/20 rounded-none p-4 text-center">
            <FolderOpen className="w-6 h-6 text-gray-400 mx-auto" />
            <p className="text-[10px] text-gray-500 mt-1 leading-normal">
              No custom saved audits. Fill out inputs and click "Analyze" or "Save" to persist audits.
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {savedList.map((rep) => {
              const isCurrent = rep.id === currentReportId;
              return (
                <div
                  key={rep.id}
                  id={`saved-card-${rep.id}`}
                  className={`p-3 rounded-none border-2 transition-all ${
                    isCurrent
                      ? "bg-[#1D1D1B] border-[#1D1D1B] text-[#F4F2EE] shadow-xs"
                      : "bg-[#F4F2EE]/30 border-gray-200 text-[#1D1D1B] hover:bg-[#F4F2EE]"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div
                      className="cursor-pointer space-y-1 select-none flex-1"
                      onClick={() => onLoadReport(rep)}
                    >
                      <h4 className="text-xs font-bold leading-tight line-clamp-1 font-sans">
                        {rep.title || "Custom Audit"}
                      </h4>
                      <p className={`text-[10px] ${isCurrent ? "text-gray-300" : "text-gray-500"} flex items-center gap-1`}>
                        <Calendar className="w-3 h-3 text-blue-700" />
                        <span>{new Date(rep.timestamp).toLocaleDateString()}</span>
                      </p>
                      
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className={`text-[9px] font-mono font-semibold px-1 py-0.5 rounded-none ${isCurrent ? "bg-white/10 text-white" : "bg-blue-50 text-blue-700 border border-blue-100"}`}>
                          ${rep.metrics.financialSavingsYear.toLocaleString()} Gap
                        </span>
                        
                        <span className={`text-[9px] font-mono font-semibold px-1 py-0.5 rounded-none ${isCurrent ? "bg-white/10 text-gray-300" : "bg-gray-100 text-gray-600"}`}>
                          {rep.metrics.weeksSavedTotal}w shorter
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onDeleteReport(rep.id)}
                      className={`p-1.5 rounded-none hover:bg-red-600 hover:text-white transition-colors cursor-pointer ${isCurrent ? "text-gray-400" : "text-gray-400"}`}
                      title="Delete Report"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
