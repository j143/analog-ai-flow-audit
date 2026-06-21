/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Cpu, Zap } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b-4 border-[#1D1D1B] bg-[#F4F2EE] sticky top-0 z-50 print:hidden px-4 py-5">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-baseline gap-4">
          <div className="flex items-start gap-3">
            <div className="bg-[#1D1D1B] text-[#F4F2EE] p-2 rounded-sm flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-widest text-blue-700 uppercase font-black">
                  EDA Copilot • CAD Maturity Engine
                </span>
                <span className="bg-[#1D1D1B] text-[#F4F2EE] text-[9px] font-mono px-2 py-0.5 rounded-sm font-bold uppercase tracking-tight">
                  v2.5 Staff Edition
                </span>
              </div>
              <h1 className="text-3xl font-serif font-black italic text-[#1D1D1B] select-none tracking-tight">
                Analog AI Flow Auditor
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2.5 flex-wrap md:self-end">
            <div className="flex items-center gap-1.5 text-[10px] text-[#1D1D1B]/80 font-mono bg-[#1D1D1B]/5 px-3 py-1 border border-[#1D1D1B]/20 rounded-xs">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-700 animate-pulse"></div>
              <span className="font-bold">CAD CLEARANCE GRANTED</span>
            </div>
            
            <div className="flex items-center gap-1.5 text-[10px] text-[#1D1D1B]/80 font-mono bg-[#1D1D1B]/5 px-3 py-1 border border-[#1D1D1B]/20 rounded-xs">
              <Zap className="w-3 h-3 text-blue-700" />
              <span className="font-bold">GEMINI-3.5-FLASH</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

