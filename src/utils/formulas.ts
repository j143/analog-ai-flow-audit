/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AuditInputs, CalculatedMetrics, MaturityPhase } from "../types";

// Maximum achievable percentage productivity gain in each phase under full AI adoption (Level 5)
export const MAX_AI_POTENTIALS: Record<MaturityPhase, { effortAllocation: number; efficiencyGain: number }> = {
  spec: { effortAllocation: 0.10, efficiencyGain: 0.25 },          // Spec setup is 10% of flow, AI templates boost efficiency by 25%
  sizing: { effortAllocation: 0.30, efficiencyGain: 0.40 },        // Sizing is 30% of flow, AI optimization (Virtuoso DSO/ASO) boosts efficiency by 40%
  layout: { effortAllocation: 0.40, efficiencyGain: 0.50 },        // Layout/migration is 40% of flow, AI schematic/layout synthesis boosts by 50%
  verification: { effortAllocation: 0.20, efficiencyGain: 0.30 },  // Verification is 20% of flow, AI-tuned corner sweep schedules boost by 30%
  playbooks: { effortAllocation: 0.00, efficiencyGain: 0.00 }      // Standardizing acts as a general multiplier of other savings
};

/**
 * Computes highly realistic financial and cycle-time impact of AI CAD adoption
 */
export function calculateAuditMetrics(inputs: AuditInputs): CalculatedMetrics {
  const { teamSize, salaryRate, blockCycleWeeks, blockCyclesPerYear, ratings } = inputs;

  // 1. Calculate general multipliers
  // Playbooks rating acts as a booster coefficient (more standardized playbooks mean 10% to 25% higher actual realization of AI potential)
  const playbookBooster = 0.8 + (ratings.playbooks - 1) * 0.10; // Level 1 = 0.8x, Level 5 = 1.2x multiplier on realized gains

  // 2. Iterate through each phase to calculate:
  // - Current Missed Potential (Rating 1 = 100% missed, Rating 5 = 0% missed)
  // - Realized Efficiency (Rating 5 = 100% realized, Rating 1 = 0% realized)
  let overallRealizedGainFactor = 0;
  let overallMissedGainFactor = 0;

  const phaseGains: Record<MaturityPhase, { realized: number; missed: number }> = {} as any;

  (Object.keys(MAX_AI_POTENTIALS) as MaturityPhase[]).forEach((phase) => {
    if (phase === "playbooks") return;

    const { effortAllocation, efficiencyGain } = MAX_AI_POTENTIALS[phase];
    const rating = ratings[phase];

    // Standard scoring mapping:
    // Level 1: 0% realized (100% missed)
    // Level 2: 25% realized (75% missed)
    // Level 3: 50% realized (50% missed)
    // Level 4: 75% realized (25% missed)
    // Level 5: 100% realized (0% missed)
    const realizedFraction = (rating - 1) / 4;
    const missedFraction = 1 - realizedFraction;

    const phaseMaxPotential = effortAllocation * efficiencyGain;

    const realized = phaseMaxPotential * realizedFraction * playbookBooster;
    const missed = phaseMaxPotential * missedFraction * playbookBooster;

    phaseGains[phase] = { realized, missed };
    overallRealizedGainFactor += realized;
    overallMissedGainFactor += missed;
  });

  // Calculate annual active designer hours (typical standard is 1920 hours per year)
  const hoursPerHeadPerYear = 1920;
  const totalTeamHoursAvailable = teamSize * hoursPerHeadPerYear;

  // Let's compute actual recovered hours and financial savings specifically targeting MISSED potential
  // (the potential they are currently leaving on the table)
  const hoursSavedPerDesignerYear = Math.round(hoursPerHeadPerYear * overallMissedGainFactor);
  const totalEngineeringHoursSavedYear = hoursSavedPerDesignerYear * teamSize;
  
  // Total potential payroll savings per year
  const financialSavingsYear = Math.round(teamSize * salaryRate * overallMissedGainFactor);

  // 3. Cycle Time calculations (Weeks)
  // Standard development cycle is blockCycleWeeks
  const baselineWeeksTotal = blockCycleWeeks;
  
  // Time optimization percentages map smoothly to baseline weeks saved
  const specWeeksSaved = parseFloat((blockCycleWeeks * MAX_AI_POTENTIALS.spec.effortAllocation * MAX_AI_POTENTIALS.spec.efficiencyGain * (1 - (ratings.spec - 1)/4) * playbookBooster).toFixed(1));
  const sizingWeeksSaved = parseFloat((blockCycleWeeks * MAX_AI_POTENTIALS.sizing.effortAllocation * MAX_AI_POTENTIALS.sizing.efficiencyGain * (1 - (ratings.sizing - 1)/4) * playbookBooster).toFixed(1));
  const layoutWeeksSaved = parseFloat((blockCycleWeeks * MAX_AI_POTENTIALS.layout.effortAllocation * MAX_AI_POTENTIALS.layout.efficiencyGain * (1 - (ratings.layout - 1)/4) * playbookBooster).toFixed(1));
  const verificationWeeksSaved = parseFloat((blockCycleWeeks * MAX_AI_POTENTIALS.verification.effortAllocation * MAX_AI_POTENTIALS.verification.efficiencyGain * (1 - (ratings.verification - 1)/4) * playbookBooster).toFixed(1));

  const totalWeeksSavedExact = specWeeksSaved + sizingWeeksSaved + layoutWeeksSaved + verificationWeeksSaved;
  const weeksSavedTotal = parseFloat(Math.min(baselineWeeksTotal - 1, totalWeeksSavedExact).toFixed(1));
  const projectedWeeksTotal = parseFloat((baselineWeeksTotal - weeksSavedTotal).toFixed(1));

  // 4. Efficiency percentages
  const overallProductivityBoostPercent = Math.round(overallMissedGainFactor * 100);
  const timeToMarketSpeedupPercent = Math.round((weeksSavedTotal / baselineWeeksTotal) * 100);
  
  // Simulation compute schedule efficiency is modeled on verification ratings:
  // Rating 1 = 30% max compute overhead wasted. Mature rating decreases simulation waste.
  const computeMaturityProgress = (ratings.verification - 1) / 4;
  const simulationComputeReductionRatio = Math.round((0.30 * (1 - computeMaturityProgress)) * 100);

  return {
    hoursSavedPerDesignerYear,
    totalEngineeringHoursSavedYear,
    financialSavingsYear,
    baselineWeeksTotal,
    projectedWeeksTotal,
    weeksSavedTotal,
    specWeeksSaved,
    sizingWeeksSaved,
    layoutWeeksSaved,
    verificationWeeksSaved,
    overallProductivityBoostPercent,
    simulationComputeReductionRatio,
    timeToMarketSpeedupPercent
  };
}

/**
 * Get dynamic descriptions detailing what current rating level means
 */
export function getRatingLevelDescription(phase: MaturityPhase, rating: number): string {
  const descriptions: Record<MaturityPhase, string[]> = {
    spec: [
      "Level 1: Specs are manual text spreadsheets or Confluence pages. High errors translating variables to ADE.",
      "Level 2: Basic cell templates created but setups are copy-pasted manually.",
      "Level 3: Global template parameters used across similar blocks. Average time saved.",
      "Level 4: Testbenches are pre-configured; parameter lists automatically populate simulator setups.",
      "Level 5: AI-assisted configuration; variables are dynamically bound; testbenches auto-adjust parameters."
    ],
    sizing: [
      "Level 1: Manual sizing. Designers manually change gate lengths/widths, Ibias, and re-run simulations.",
      "Level 2: Standard parametric sweeps inside Explorer. Inefficient exploration of design space.",
      "Level 3: Using simple optimizer tool solvers but without robust corner alignment or model learning.",
      "Level 4: Using Cadence ADE DSO / Synopsys ASO.ai actively. Automatic sizing across standard PvT corners.",
      "Level 5: Closed-loop AI design-space centering. Pareto trade-off curves automatically suggest optimal block variations."
    ],
    layout: [
      "Level 1: Manual schematic node mapping & manual layout drawing from scratch. Extremely high effort.",
      "Level 2: Basic customized scripting for schematic PDK migration. Standard layout is drawn manually.",
      "Level 3: Schematic migrator used. Simple placement helpers used by layout engineers.",
      "Level 4: PDK mapping + schematic auto-translation + AI layout synthesis proposal used as starting candidate.",
      "Level 5: Full AI Analog Layout Synthesis (DRC-clean floorplans, smart placing, EM & parasitic-aware route synthesis)."
    ],
    verification: [
      "Level 1: All corners swept linearly. Design verification takes days, slowing down the tapeout loop.",
      "Level 2: PVT sweeps are managed, but corner lists are built manually by senior staff.",
      "Level 3: Smart sweeps reduce clean runs. Parasitics computed but layout-aware opt run sequentially.",
      "Level 4: GPU-accelerated solvers + smart simulator task scheduling. Corner pruning actively optimization.",
      "Level 5: Full AI sweep schedules. Adaptive corner selection & simulation solvers reduce compute and corner sweep workloads by 30%."
    ],
    playbooks: [
      "Level 1: No standardized flows or playbooks. Every designer runs things custom out of local directories.",
      "Level 2: Shared folder with some ocean files or Tcl scripts but outdated and lacking parameters.",
      "Level 3: Flow configs stored in centralized git repository. Basic onboarding guides.",
      "Level 4: Organized CAD Templates for common blocks (OpAmp, LDO) detailing exact AI variables bounds.",
      "Level 5: Unified Team Ecosystem. Junior engineers clone unified blueprints containing complete optimization set rules."
    ]
  };

  return descriptions[phase][Math.max(0, Math.min(4, rating - 1))];
}
