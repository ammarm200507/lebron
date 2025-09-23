import { BudgetAssumptions, BudgetScenario } from '../types';

export type ScenarioMetrics = {
  totalBudget: number;
  leadsRange: [number, number];
  closedRange: [number, number];
  cplRange: [number, number];
  cacRange: [number, number];
  marginDollars: number;
};

function safeRangeValue(value: number): number {
  if (!Number.isFinite(value) || Number.isNaN(value)) {
    return 0;
  }
  return value;
}

export function calculateScenarioMetrics(
  scenario: BudgetScenario,
  assumptions: BudgetAssumptions
): ScenarioMetrics {
  const totalBudget = scenario.channels.reduce((sum, channel) => sum + channel.amount, 0);
  const leadMinFactor = scenario.baseLeadRange[0] / scenario.baseBudget;
  const leadMaxFactor = scenario.baseLeadRange[1] / scenario.baseBudget;

  const leadsMin = safeRangeValue(totalBudget * leadMinFactor);
  const leadsMax = safeRangeValue(totalBudget * leadMaxFactor);

  const closeRate = assumptions.closeRate / 100;
  const closedMin = safeRangeValue(leadsMin * closeRate);
  const closedMax = safeRangeValue(leadsMax * closeRate);

  const cplMin = leadsMax > 0 ? totalBudget / leadsMax : totalBudget;
  const cplMax = leadsMin > 0 ? totalBudget / leadsMin : totalBudget;

  const cacMin = closedMax > 0 ? totalBudget / closedMax : totalBudget;
  const cacMax = closedMin > 0 ? totalBudget / closedMin : totalBudget;

  const closedAvg = (closedMin + closedMax) / 2;
  const marginDollars =
    closedAvg * assumptions.avgTicket * (assumptions.grossMargin / 100);

  return {
    totalBudget,
    leadsRange: [leadsMin, leadsMax],
    closedRange: [closedMin, closedMax],
    cplRange: [cplMin, cplMax],
    cacRange: [cacMin, cacMax],
    marginDollars
  };
}
