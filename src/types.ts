export type BlufObjectives = {
  bluf: string;
  objectives: string;
  notes: string;
};

export type ICPItem = {
  id: string;
  label: string;
  details: string;
};

export type BudgetChannel = {
  id: string;
  name: string;
  amount: number;
  min: number;
  max: number;
  step?: number;
};

export type BudgetScenario = {
  id: string;
  name: string;
  headline: string;
  description: string;
  channels: BudgetChannel[];
  baseLeadRange: [number, number];
  baseBudget: number;
};

export type BudgetAssumptions = {
  avgTicket: number;
  grossMargin: number;
  closeRate: number;
  targetCPLMin: number;
  targetCPLMax: number;
  targetCAC: number;
};

export type KPISettings = {
  closedJobsTarget: number;
  cplTarget: number;
  cacTarget: number;
  reviewsTarget: number;
  capacityNote: string;
  salesTeamSize: number;
};

export type TaskStatus = 'On Track' | 'At Risk' | 'Client Needed' | 'Backlog';

export type Task = {
  id: string;
  owner: string;
  description: string;
  status: TaskStatus;
};

export type RAIDBoard = {
  risks: string[];
  assumptions: string[];
  issues: string[];
  dependencies: string[];
};

export type Decision = {
  id: string;
  summary: string;
  decider: string;
  date: string;
};

export type MilestoneStatus = 'Not Started' | 'In Progress' | 'Complete';

export type Milestone = {
  id: string;
  name: string;
  targetDate: string;
  status: MilestoneStatus;
  notes?: string;
};

export type AppState = {
  version: number;
  date: string;
  blufObjectives: BlufObjectives;
  icpOutline: ICPItem[];
  budgetAssumptions: BudgetAssumptions;
  budgetScenarios: BudgetScenario[];
  selectedScenarioId: string;
  kpis: KPISettings;
  tasks: Task[];
  raid: RAIDBoard;
  decisions: Decision[];
  milestones: Milestone[];
};
