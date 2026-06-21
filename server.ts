/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response } from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";

// Read environment variables (dev relies on dotenv, which is in package.json)
import dotenv from "dotenv";
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing JSON payloads
  app.use(express.json());

  // Server-side lazy initialization for Google GenAI SDK
  let aiClient: GoogleGenAI | null = null;
  function getAi(): GoogleGenAI {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY environment variable is missing. Configure it in Settings > Secrets.");
      }
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
    return aiClient;
  }

  // Health check API
  app.get("/api/health", (req: Request, res: Response) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
  });

  // Server-side Gemini Flow Analysis Endpoint
  app.post("/api/audit/analyze", async (req: Request, res: Response): Promise<void> => {
    try {
      const inputs = req.body;
      const {
        companyName,
        projectName,
        teamSize,
        salaryRate,
        blockCyclesPerYear,
        blockCycleWeeks,
        toolStack,
        currentNodes,
        blockTypes,
        ratings,
        selections,
        standardCornerSweeps,
      } = inputs;

      // Quick input safety guard
      if (!ratings || !toolStack) {
        res.status(400).json({ error: "Invalid audit inputs payload" });
        return;
      }

      const client = getAi();

      // Formulate a structured, engineering-grade prompt focusing on real analog EDA flows
      const prompt = `
You are a Staff Analog CAD Architect expert in EDA tools (Cadence Virtuoso Studio, Synopsys Custom Compiler/ASO.ai, Siemens Tanner, PrimeWave, Specte).
Review the following audit details for a real design team and generate a professional, fully complete Staff Engineer's AI Flow play-book.

--- AUDIT METADATA ---
Company Name / Unit: ${companyName || "NDA Restricted"}
Project Name: ${projectName || "Analog Block Core"}
Design Team Size: ${teamSize} Analog IC Designers
Average overhead cost per designer: $${salaryRate.toLocaleString()}/year
Typical design & layout cycle time for a block: ${blockCycleWeeks} weeks
Designs / Block migrations completed per year: ${blockCyclesPerYear} blocks
Standard corner sweeps count per block: ${standardCornerSweeps} corners

CAD Tool Stack Base: ${toolStack.toUpperCase()}
Target Silicon Nodes: ${currentNodes.join(", ") || "Advanced nodes"}
IC Block Categories: ${blockTypes.join(", ") || "Standard analog block"}

--- MATURITY RATINGS (Scale 1 to 5) ---
1. Specs & Architecture Setup: ${ratings.spec}/5 (Current Tool: ${selections.spec || "Manual"})
2. Design Space Optimization & Sizing: ${ratings.sizing}/5 (Current Tool: ${selections.sizing || "Manual sweeps"})
3. Layout Synthesis & IP Migration: ${ratings.layout}/5 (Current Tool: ${selections.layout || "Manual drawings"})
4. Verification & Simulation Sweeps: ${ratings.verification}/5 (Current Tool: ${selections.verification || "Manual sweep list"})
5. Standard Flow Playbooks: ${ratings.playbooks}/5 (Current Tool: ${selections.playbooks || "No collective flow"})

Please construct a comprehensive Staff Report including:
1. Executive Assessment: Analyze their score profile. Reference production benchmarks (e.g., MediaTek's 30% productivity gain at 2nm from Virtuoso Studio AI optimization/prototyping, Synopsys/TSMC references saving weeks off layout migration). Contrast this with their current ratings.
2. Sizing & Optimization Strategy: How to set up proper multi-variable design centering boundaries as playbooks, avoiding under/over-constraining. Explain specific tools (e.g. Virtuoso ADE Design Space Optimization or Synopsys ASO.ai matched to their stack choice: ${toolStack}).
3. Layout Synthesis & Migration Roadmap: Specific PDK-to-PDK mapping practices (e.g. migrating their specific block categories ${blockTypes.join(", ")} to ${currentNodes.join(", ")}). What layout-aware optimization constraints should be used.
4. Detailed Automation Script Template: Provide a valid, fully complete, real syntax-compliant script block in a code block targeting their stack. Keep it highly realistic:
   - If Tool Stack is CADENCE or MIXED: Provide a detailed Cadence Ocean Script (.ocn) template setting up an ADE simulation & optimization block with 'ocnSession', 'ocnSetOptimizations', defining variable ranges (W, L, Ibias, CC) and goals for OpAmps/LDOs.
   - If Tool Stack is SYNOPSYS: Provide a clear Synopsys ASO.ai Tcl configuration snippet defining boundaries, design specs, PVT corners, and 'aso::run' commands.
   - If Tool Stack is SIEMENS: Provide a custom Tcl/Python layout template script interfacing Tanner S-Edit/L-Edit with Calibre batch commands.
5. Human-in-the-Loop Safeguards: Define what is safe to fully automate (e.g., bias networks, non-critical buffer sizing) and what requires critical expert review (matching layout structures, guard ring checks, electromigration/high-frequency cores).

Ensure your output is professional, objective, elegant, and uses clean Markdown. Write this as a highly detailed Staff Engineer report. Maintain strict technical relevance. Ensure that your script/code block is complete and has accurate syntax rather than simple placeholder dots.
`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          temperature: 0.2, // Objective, analytical
        },
      });

      const evaluationText = response.text || "No report generated.";

      // Send the beautifully compiled response
      res.json({
        evaluationText,
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      console.error("Gemini flow client error:", err);
      res.status(500).json({ error: err.message || "An error occurred during Gemini analysis" });
    }
  });

  // Integrate Vite for development, otherwise serve the compiled production build
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // Serve client index.html for all fallback routes
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express custom server boot complete. Running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
