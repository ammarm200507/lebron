import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BarChart3,
  BookOpen,
  ClipboardList,
  FileDown,
  FileText,
  Layers,
  ListTodo,
  Share2,
  Target,
  Gauge
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Button } from './components/ui/button';
import { Tabs } from './components/ui/tabs';
import { Badge } from './components/ui/badge';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTrigger } from './components/ui/dialog';
import { Input } from './components/ui/input';
import { BlufObjectivesSection } from './sections/BlufObjectivesSection';
import { ICPSection } from './sections/ICPSection';
import { BudgetSection } from './sections/BudgetSection';
import { KPISection } from './sections/KPISection';
import { TasksSection } from './sections/TasksSection';
import { RisksSection } from './sections/RisksSection';
import { DecisionsSection } from './sections/DecisionsSection';
import { PrintableProposal } from './sections/PrintableProposal';
import {
  AppState,
  BudgetScenario,
  Decision,
  ICPItem,
  Milestone,
  RAIDBoard,
  Task
} from './types';
import { calculateScenarioMetrics } from './lib/budget';
import { formatCurrency } from './lib/utils';

const STORAGE_KEY = 'xore-roofing-proposal-state-v1';
const STATE_VERSION = 1;

const createId = () => Math.random().toString(36).slice(2, 9);

function createDefaultState(): AppState {
  const today = new Date().toISOString().slice(0, 10);
  const icpOutline: ICPItem[] = [
    {
      id: createId(),
      label: 'Demographics',
      details: 'Homeowners 35–65, HHI $100k+, long-term residents'
    },
    {
      id: createId(),
      label: 'Geos',
      details: 'Sugar Land, Sienna, Missouri City; ZIPs 77479, 77459, 77478, 77498'
    },
    {
      id: createId(),
      label: 'Property',
      details: '1995–2010 builds; 2.5–4k sq ft; asphalt shingles'
    },
    {
      id: createId(),
      label: 'Triggers',
      details: 'Aging roof, storm exposure, premium hikes/denials, resale prep'
    },
    {
      id: createId(),
      label: 'Financial',
      details: 'Retail/cash friendly; open to financing'
    },
    {
      id: createId(),
      label: 'Behavior',
      details: 'Google/Nextdoor heavy; needs 30+ 5⭐ reviews; education-led content'
    },
    {
      id: createId(),
      label: 'Exclusions',
      details: 'Renters, repair-only, out-of-area (>30 min)'
    }
  ];

  const budgetScenarios: BudgetScenario[] = [
    {
      id: 'scenario-a',
      name: 'Scenario A — $2k/mo',
      headline: 'Entry point to validate channels',
      description: 'Lean budget to test LSA, Nextdoor, and compounding SEO content.',
      baseLeadRange: [8, 12],
      baseBudget: 2000,
      channels: [
        { id: createId(), name: 'LSA', amount: 1000, min: 0, max: 5000 },
        { id: createId(), name: 'Nextdoor', amount: 500, min: 0, max: 4000 },
        { id: createId(), name: 'SEO / Content', amount: 500, min: 0, max: 4000 }
      ]
    },
    {
      id: 'scenario-b',
      name: 'Scenario B — $5k/mo',
      headline: 'Aggressive omni-channel mix',
      description: 'Adds PPC scale and EDDM to accelerate lead flow.',
      baseLeadRange: [20, 25],
      baseBudget: 5000,
      channels: [
        { id: createId(), name: 'LSA', amount: 2000, min: 0, max: 8000 },
        { id: createId(), name: 'PPC', amount: 1500, min: 0, max: 8000 },
        { id: createId(), name: 'Nextdoor', amount: 500, min: 0, max: 4000 },
        { id: createId(), name: 'EDDM', amount: 1000, min: 0, max: 6000 }
      ]
    },
    {
      id: 'scenario-c',
      name: 'Scenario C — $8k/mo',
      headline: 'Full-funnel acceleration',
      description: 'Adds paid social to saturate the market while direct mail sustains recall.',
      baseLeadRange: [35, 45],
      baseBudget: 8000,
      channels: [
        { id: createId(), name: 'LSA', amount: 3000, min: 0, max: 10000 },
        { id: createId(), name: 'PPC', amount: 2500, min: 0, max: 10000 },
        { id: createId(), name: 'Nextdoor', amount: 1000, min: 0, max: 5000 },
        { id: createId(), name: 'Paid Social', amount: 1000, min: 0, max: 5000 },
        { id: createId(), name: 'EDDM', amount: 500, min: 0, max: 5000 }
      ]
    }
  ];

  const tasks: Task[] = [
    {
      id: createId(),
      owner: 'Imran (Strategy)',
      description: 'Phase 0 recap + ICP; Budget model; EDDM scope',
      status: 'On Track'
    },
    {
      id: createId(),
      owner: 'Shabir (Sales)',
      description: 'Competitor scan (3–5 local roofers)',
      status: 'On Track'
    },
    {
      id: createId(),
      owner: 'Ammar (Content)',
      description:
        '10 post ideas, 3 blog angles, TikTok/IG reel concepts; quick reel “3 signs you need a new roof”',
      status: 'At Risk'
    },
    {
      id: createId(),
      owner: 'Sean & Zach (Client)',
      description:
        'Avg ticket, margin targets, close rate, CRM status; approve budget tier & primary offer; review contact fuel',
      status: 'Client Needed'
    }
  ];

  const raid: RAIDBoard = {
    risks: [
      'Lead over-influx vs 2-person team',
      'Budget burn before CAC known',
      'Duplicate review wording flagged'
    ],
    assumptions: ['4–5 jobs/mo manageable', '90-day ROI test'],
    issues: [],
    dependencies: ['Ops data from client']
  };

  const decisions: Decision[] = [
    {
      id: 'D001',
      summary: 'Proceed with phased discovery',
      decider: 'Sean',
      date: today
    }
  ];

  const milestones: Milestone[] = [
    { id: createId(), name: 'Discovery Complete', targetDate: today, status: 'In Progress' },
    { id: createId(), name: 'Proposal Delivered', targetDate: today, status: 'Not Started' },
    { id: createId(), name: 'Mailer 1–3', targetDate: today, status: 'Not Started' },
    { id: createId(), name: 'Pilot Live', targetDate: today, status: 'Not Started' },
    { id: createId(), name: 'Channel CAC Report', targetDate: today, status: 'Not Started' }
  ];

  return {
    version: STATE_VERSION,
    date: today,
    blufObjectives: {
      bluf: 'Win 2–3 full-roof installs monthly at ≤ $400 CAC\nBuild compounding demand in Fort Bend with social proof',
      objectives:
        'Stand up Auxilium GTM rhythm in 30 days\nHit 40 public reviews within 90 days\nValidate paid + organic mix to fuel 2025 scale',
      notes: 'Primary offer: full-roof replacement with financing CTA. Add upsell path for gutters & insulation.'
    },
    icpOutline,
    budgetAssumptions: {
      avgTicket: 15000,
      grossMargin: 35,
      closeRate: 20,
      targetCPLMin: 200,
      targetCPLMax: 250,
      targetCAC: 400
    },
    budgetScenarios,
    selectedScenarioId: budgetScenarios[1]?.id ?? budgetScenarios[0]?.id ?? 'scenario-a',
    kpis: {
      closedJobsTarget: 5,
      cplTarget: 250,
      cacTarget: 400,
      reviewsTarget: 40,
      capacityNote: 'Current 2-person sales team. Add overflow plan if closed jobs exceed 5 per month or stagger spend.',
      salesTeamSize: 2
    },
    tasks,
    raid,
    decisions,
    milestones
  };
}

function encodeState(state: AppState): string {
  const json = JSON.stringify(state);
  return typeof window === 'undefined'
    ? ''
    : window.btoa(encodeURIComponent(json));
}

function decodeState(encoded: string): AppState | null {
  try {
    const json = decodeURIComponent(window.atob(encoded));
    const parsed = JSON.parse(json);
    if (typeof parsed === 'object' && parsed !== null && parsed.version === STATE_VERSION) {
      return parsed as AppState;
    }
    return null;
  } catch (error) {
    console.error('Failed to decode shared state', error);
    return null;
  }
}

function downloadState(state: AppState) {
  const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(state, null, 2)
  )}`;
  const anchor = document.createElement('a');
  anchor.href = dataStr;
  anchor.download = 'xore-roofing-proposal.json';
  anchor.click();
  anchor.remove();
}

function loadInitialState(): AppState {
  if (typeof window === 'undefined') {
    return createDefaultState();
  }

  const hash = window.location.hash.replace('#', '');
  if (hash.startsWith('state=')) {
    const shared = decodeState(hash.replace('state=', ''));
    if (shared) {
      return shared;
    }
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as AppState;
      if (parsed.version === STATE_VERSION) {
        return parsed;
      }
    } catch (error) {
      console.error('Failed to parse stored state', error);
    }
  }

  return createDefaultState();
}

function clearHash() {
  if (typeof window === 'undefined') return;
  window.history.replaceState(null, '', window.location.pathname + window.location.search);
}

const tabs = [
  { id: 'bluf', label: 'BLUF & Objectives', icon: <BookOpen className="h-4 w-4" /> },
  { id: 'icp', label: 'ICP Outline', icon: <Target className="h-4 w-4" /> },
  { id: 'budget', label: 'Budget Scenarios', icon: <BarChart3 className="h-4 w-4" /> },
  { id: 'kpis', label: 'KPIs & Capacity', icon: <Gauge className="h-4 w-4" /> },
  { id: 'tasks', label: 'Tasks & Owners', icon: <ListTodo className="h-4 w-4" /> },
  { id: 'risks', label: 'Risks / RAID', icon: <Layers className="h-4 w-4" /> },
  { id: 'decisions', label: 'Decision Log & Milestones', icon: <ClipboardList className="h-4 w-4" /> },
  { id: 'printable', label: 'Printable Proposal', icon: <FileText className="h-4 w-4" /> }
];

function ShareDialog({ state }: { state: AppState }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const encoded = encodeState(state);
    const url = `${window.location.origin}${window.location.pathname}#state=${encoded}`;
    return url;
  }, [state]);

  useEffect(() => {
    setCopied(false);
  }, [shareUrl]);

  const copyLink = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      window.history.replaceState(null, '', shareUrl);
      setCopied(true);
    } catch (error) {
      console.error('Clipboard copy failed', error);
      setCopied(false);
    }
  };

  const downloadJson = () => {
    downloadState(state);
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="outline" className="whitespace-nowrap">
          <Share2 className="h-4 w-4" /> Share Link
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader title="Share proposal" subtitle="Copy a live link or export the JSON snapshot." />
        <div className="space-y-4">
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Shareable URL
          </label>
          <div className="flex gap-2">
            <Input value={shareUrl} readOnly aria-label="Shareable URL" />
            <Button onClick={copyLink} variant="accent" className="whitespace-nowrap">
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
          <p className="text-xs text-slate-500">
            Anyone with the link can view the proposal state. Embed in email or Slack threads.
          </p>
          <div className="rounded-2xl border border-ink/10 bg-slate-50/70 p-4 text-sm text-ink/80">
            <p className="font-semibold text-ink">Offline backup</p>
            <p className="mt-1 text-slate-600">Download the JSON to store or hand-off.</p>
            <Button onClick={downloadJson} variant="ghost" className="mt-3 w-full justify-start">
              <FileDown className="h-4 w-4" /> Download JSON
            </Button>
          </div>
          <DialogClose>
            <Button className="w-full" variant="outline">
              Close
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function App() {
  const [state, setState] = useState<AppState>(() => loadInitialState());
  const [activeTab, setActiveTab] = useState<string>('bluf');
  const printableRef = useRef<HTMLDivElement>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const selectedScenario = useMemo(
    () => state.budgetScenarios.find((scenario) => scenario.id === state.selectedScenarioId),
    [state.budgetScenarios, state.selectedScenarioId]
  );

  const activeMetrics = useMemo(
    () => (selectedScenario ? calculateScenarioMetrics(selectedScenario, state.budgetAssumptions) : undefined),
    [selectedScenario, state.budgetAssumptions]
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const resetState = () => {
    if (window.confirm('Reset proposal to the default template?')) {
      const defaults = createDefaultState();
      setState(defaults);
      clearHash();
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
  };

  const updateBluf = (value: AppState['blufObjectives']) => {
    setState((prev) => ({ ...prev, blufObjectives: value }));
  };

  const updateICP = (items: ICPItem[]) => {
    setState((prev) => ({ ...prev, icpOutline: items }));
  };

  const updateBudgetAssumptions = (value: AppState['budgetAssumptions']) => {
    setState((prev) => ({ ...prev, budgetAssumptions: value }));
  };

  const updateScenario = (scenario: BudgetScenario) => {
    setState((prev) => ({
      ...prev,
      budgetScenarios: prev.budgetScenarios.map((item) => (item.id === scenario.id ? scenario : item))
    }));
  };

  const updateSelectedScenario = (id: string) => {
    setState((prev) => ({ ...prev, selectedScenarioId: id }));
  };

  const updateKPIs = (value: AppState['kpis']) => {
    setState((prev) => ({ ...prev, kpis: value }));
  };

  const updateTasks = (tasks: Task[]) => {
    setState((prev) => ({ ...prev, tasks }));
  };

  const updateRaid = (raid: RAIDBoard) => {
    setState((prev) => ({ ...prev, raid }));
  };

  const updateDecisions = (decisions: Decision[]) => {
    setState((prev) => ({ ...prev, decisions }));
  };

  const updateMilestones = (milestones: Milestone[]) => {
    setState((prev) => ({ ...prev, milestones }));
  };

  const updateDate = (value: string) => {
    setState((prev) => ({ ...prev, date: value }));
  };

  const handleExportPDF = async () => {
    if (!printableRef.current) return;
    const element = printableRef.current;
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#ffffff'
    });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'pt', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save('xore-roofing-gtm-proposal.pdf');
  };

  const triggerUpload = () => {
    uploadInputRef.current?.click();
  };

  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      try {
        const text = String(loadEvent.target?.result ?? '');
        const parsed = JSON.parse(text) as AppState;
        if (parsed.version === STATE_VERSION) {
          setState(parsed);
        } else {
          alert('Version mismatch. Please use a compatible export.');
        }
      } catch (error) {
        alert('Unable to parse JSON file.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const metricsSummary = activeMetrics
    ? `${formatCurrency(activeMetrics.totalBudget)} budget → ${formatCurrency(
        activeMetrics.cacRange[0],
        { maximumFractionDigits: 0 }
      )}–${formatCurrency(activeMetrics.cacRange[1], { maximumFractionDigits: 0 })} CAC`
    : 'Select a scenario to view CAC';

  const downloadJson = () => downloadState(state);

  return (
    <div className="min-h-screen bg-slate-100 pb-20">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10">
        <header className="flex flex-col gap-6 rounded-2xl border border-white/70 bg-white/90 p-6 shadow-soft lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-accent">Xore Roofing — GTM Proposal</p>
            <h1 className="text-3xl font-bold text-ink">Auxilium Growth Playbook</h1>
            <p className="text-sm text-slate-500">{metricsSummary}</p>
          </div>
          <div className="flex flex-col gap-3 lg:items-end">
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 text-sm font-medium text-ink/70">
                Date
                <Input type="date" value={state.date} onChange={(event) => updateDate(event.target.value)} />
              </label>
              <Button variant="accent" onClick={handleExportPDF} className="whitespace-nowrap">
                <FileDown className="h-4 w-4" /> Export PDF
              </Button>
              <ShareDialog state={state} />
              <Button variant="outline" onClick={downloadJson} className="whitespace-nowrap">
                <FileDown className="h-4 w-4" /> Download JSON
              </Button>
              <Button variant="outline" onClick={triggerUpload} className="whitespace-nowrap">
                <UploadIcon /> Upload JSON
              </Button>
              <Button variant="ghost" onClick={resetState} className="whitespace-nowrap text-red-500">
                Reset
              </Button>
            </div>
            {selectedScenario ? (
              <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500">
                <span>Active Scenario:</span>
                <Badge variant="accent">{selectedScenario.name}</Badge>
              </div>
            ) : null}
          </div>
        </header>

        <Tabs tabs={tabs} activeId={activeTab} onTabChange={setActiveTab} />

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {activeTab === 'bluf' ? <BlufObjectivesSection value={state.blufObjectives} onChange={updateBluf} /> : null}
            {activeTab === 'icp' ? <ICPSection items={state.icpOutline} onChange={updateICP} /> : null}
            {activeTab === 'budget' ? (
              <BudgetSection
                assumptions={state.budgetAssumptions}
                scenarios={state.budgetScenarios}
                selectedScenarioId={state.selectedScenarioId}
                onUpdateAssumptions={updateBudgetAssumptions}
                onUpdateScenario={updateScenario}
                onSelectScenario={updateSelectedScenario}
              />
            ) : null}
            {activeTab === 'kpis' ? (
              <KPISection kpis={state.kpis} onChange={updateKPIs} activeMetrics={activeMetrics} />
            ) : null}
            {activeTab === 'tasks' ? <TasksSection tasks={state.tasks} onChange={updateTasks} /> : null}
            {activeTab === 'risks' ? <RisksSection raid={state.raid} onChange={updateRaid} /> : null}
            {activeTab === 'decisions' ? (
              <DecisionsSection
                decisions={state.decisions}
                milestones={state.milestones}
                onUpdateDecisions={updateDecisions}
                onUpdateMilestones={updateMilestones}
              />
            ) : null}
            {activeTab === 'printable' ? (
              <div className="rounded-2xl border border-white/70 bg-white/90 p-6">
                <PrintableProposal state={state} scenario={selectedScenario} />
              </div>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>
      <div
        ref={printableRef}
        className="pointer-events-none fixed left-[-10000px] top-0 w-[794px] bg-white p-10"
        aria-hidden="true"
      >
        <PrintableProposal state={state} scenario={selectedScenario} />
      </div>
      <input
        type="file"
        accept="application/json"
        ref={uploadInputRef}
        onChange={handleUpload}
        className="hidden"
      />
    </div>
  );
}

function UploadIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12V4m0 0l-3 3m3-3l3 3" />
    </svg>
  );
}
