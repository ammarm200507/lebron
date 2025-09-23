import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Table, TBody, TD, TH, THead, TR } from '../components/ui/table';
import { calculateScenarioMetrics } from '../lib/budget';
import { formatCurrency, formatNumber } from '../lib/utils';
import { AppState, BudgetScenario, TaskStatus } from '../types';

const statusEmojis: Record<TaskStatus, string> = {
  'On Track': '🟢',
  'At Risk': '🟡',
  'Client Needed': '🟠',
  Backlog: '⚪'
};

type Props = {
  state: AppState;
  scenario?: BudgetScenario;
};

function bulletList(text: string): string[] {
  return text
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function PrintableProposal({ state, scenario }: Props) {
  const metrics = scenario
    ? calculateScenarioMetrics(scenario, state.budgetAssumptions)
    : undefined;

  return (
    <div className="printable space-y-8">
      <section className="rounded-2xl border border-ink/15 bg-white/90 p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-accent">Auxilium × Xore Roofing</p>
            <h1 className="mt-2 text-3xl font-bold text-ink">Go-To-Market Proposal</h1>
            <p className="text-sm text-slate-500">Crafted for rapid deployment and measurable CAC.</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wide text-slate-500">Date</p>
            <p className="text-lg font-semibold text-ink">{state.date}</p>
          </div>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">BLUF</h2>
            <ul className="mt-3 space-y-2 text-sm text-ink/90">
              {bulletList(state.blufObjectives.bluf).map((item, index) => (
                <li key={index} className="flex gap-2">
                  <span className="mt-1 block h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Objectives
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-ink/90">
              {bulletList(state.blufObjectives.objectives).map((item, index) => (
                <li key={index} className="flex gap-2">
                  <span className="mt-1 block h-2 w-2 rounded-full bg-ink/50" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-ink/15 bg-white/90 p-8">
        <h2 className="text-lg font-semibold text-ink">ICP Summary</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {state.icpOutline.map((item) => (
            <Card key={item.id} className="border-ink/10 bg-slate-50/80 p-5">
              <h3 className="text-sm font-semibold text-ink">{item.label}</h3>
              <p className="mt-2 text-sm text-ink/80 whitespace-pre-line">{item.details}</p>
            </Card>
          ))}
        </div>
      </section>

      {scenario ? (
        <section className="rounded-2xl border border-ink/15 bg-white/90 p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-ink">Selected Budget Scenario</h2>
              <p className="text-sm text-slate-500">{scenario.description}</p>
            </div>
            <Badge variant="accent" className="self-start">{scenario.name}</Badge>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-4">
            <SummaryMetric label="Monthly Budget" value={formatCurrency(metrics?.totalBudget ?? 0)} />
            <SummaryMetric
              label="Expected Leads"
              value={metrics ? `${formatNumber(metrics.leadsRange[0])} – ${formatNumber(metrics.leadsRange[1])}` : '—'}
            />
            <SummaryMetric
              label="Closed Jobs"
              value={metrics ? `${formatNumber(metrics.closedRange[0])} – ${formatNumber(metrics.closedRange[1])}` : '—'}
            />
            <SummaryMetric
              label="Est. CAC"
              value={
                metrics
                  ? `${formatCurrency(metrics.cacRange[0], { maximumFractionDigits: 0 })} – ${formatCurrency(metrics.cacRange[1], {
                      maximumFractionDigits: 0
                    })}`
                  : '—'
              }
            />
          </div>
          <div className="mt-6 overflow-hidden rounded-2xl border border-ink/10">
            <Table>
              <THead>
                <TR className="bg-slate-100">
                  <TH>Channel</TH>
                  <TH className="text-right">Monthly Allocation</TH>
                </TR>
              </THead>
              <TBody>
                {scenario.channels.map((channel) => (
                  <TR key={channel.id}>
                    <TD>{channel.name}</TD>
                    <TD className="text-right">{formatCurrency(channel.amount)}</TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </div>
        </section>
      ) : null}

      <section className="rounded-2xl border border-ink/15 bg-white/90 p-8">
        <h2 className="text-lg font-semibold text-ink">KPI Targets & Capacity</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-4">
          <SummaryMetric label="Closed Jobs / mo" value={formatNumber(state.kpis.closedJobsTarget)} />
          <SummaryMetric label="Target CPL" value={formatCurrency(state.kpis.cplTarget)} />
          <SummaryMetric label="Target CAC" value={formatCurrency(state.kpis.cacTarget)} />
          <SummaryMetric label="Reviews (90d)" value={formatNumber(state.kpis.reviewsTarget)} />
        </div>
        <p className="mt-4 rounded-2xl bg-accent/10 p-4 text-sm text-ink/80 whitespace-pre-line">
          {state.kpis.capacityNote}
        </p>
      </section>

      <section className="rounded-2xl border border-ink/15 bg-white/90 p-8">
        <h2 className="text-lg font-semibold text-ink">Tasks & Owners</h2>
        <div className="mt-4 overflow-hidden rounded-2xl border border-ink/10">
          <Table>
            <THead>
              <TR className="bg-slate-100">
                <TH>Owner</TH>
                <TH>Deliverable</TH>
                <TH>Status</TH>
              </TR>
            </THead>
            <TBody>
              {state.tasks.map((task) => (
                <TR key={task.id}>
                  <TD>{task.owner}</TD>
                  <TD>{task.description}</TD>
                  <TD>
                    <span className="flex items-center gap-2">
                      <span>{statusEmojis[task.status]}</span>
                      <span>{task.status}</span>
                    </span>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </div>
      </section>

      <section className="rounded-2xl border border-ink/15 bg-white/90 p-8">
        <h2 className="text-lg font-semibold text-ink">Risks & Assumptions</h2>
        <div className="mt-4 grid gap-6 md:grid-cols-2">
          {[
            { label: 'Risks', values: state.raid.risks },
            { label: 'Assumptions', values: state.raid.assumptions },
            { label: 'Issues', values: state.raid.issues },
            { label: 'Dependencies', values: state.raid.dependencies }
          ].map((group) => (
            <div key={group.label} className="space-y-2">
              <h3 className="text-sm font-semibold text-ink">{group.label}</h3>
              <ul className="space-y-2 text-sm text-ink/80">
                {group.values.length > 0 ? (
                  group.values.map((value, index) => (
                    <li key={index} className="flex gap-2">
                      <span className="mt-1 block h-2 w-2 rounded-full bg-ink/20" aria-hidden="true" />
                      <span>{value}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-slate-400">None recorded.</li>
                )}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-ink/15 bg-white/90 p-8">
        <h2 className="text-lg font-semibold text-ink">Decision Log & Milestones</h2>
        <div className="mt-4 grid gap-6 lg:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold text-ink">Decisions</h3>
            <ul className="mt-3 space-y-2 text-sm text-ink/80">
              {state.decisions.map((decision) => (
                <li key={decision.id} className="rounded-2xl border border-ink/10 bg-slate-50/80 p-3">
                  <div className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-500">
                    <span>{decision.id.toUpperCase()}</span>
                    <span>{decision.date}</span>
                  </div>
                  <p className="mt-2 font-semibold text-ink">{decision.summary}</p>
                  <p className="text-xs text-slate-500">Decider: {decision.decider}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-ink">Milestones</h3>
            <ul className="mt-3 space-y-2 text-sm text-ink/80">
              {state.milestones.map((milestone) => (
                <li key={milestone.id} className="rounded-2xl border border-ink/10 bg-slate-50/80 p-3">
                  <div className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-500">
                    <span>{milestone.targetDate}</span>
                    <Badge variant={milestone.status === 'Complete' ? 'default' : milestone.status === 'In Progress' ? 'accent' : 'outline'}>
                      {milestone.status}
                    </Badge>
                  </div>
                  <p className="mt-2 font-semibold text-ink">{milestone.name}</p>
                  {milestone.notes ? <p className="text-xs text-slate-500">{milestone.notes}</p> : null}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <footer className="flex items-center justify-between rounded-2xl border border-ink/15 bg-white/90 p-6 text-xs uppercase tracking-wide text-slate-500">
        <span>Xore Roofing × Auxilium</span>
        <span>Prepared by Auxilium</span>
      </footer>
    </div>
  );
}

function SummaryMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-slate-50/80 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-lg font-semibold text-ink">{value}</p>
    </div>
  );
}
