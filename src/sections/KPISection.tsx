import { AlertTriangle, Gauge, Users } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { ScenarioMetrics } from '../lib/budget';
import { formatCurrency, formatNumber } from '../lib/utils';
import { KPISettings } from '../types';

type Props = {
  kpis: KPISettings;
  onChange: (value: KPISettings) => void;
  activeMetrics?: ScenarioMetrics;
};

export function KPISection({ kpis, onChange, activeMetrics }: Props) {
  const update = (patch: Partial<KPISettings>) => {
    onChange({ ...kpis, ...patch });
  };

  const capacityRisk =
    activeMetrics && activeMetrics.closedRange[1] > kpis.closedJobsTarget;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gauge className="h-5 w-5 text-accent" /> KPI Targets
          </CardTitle>
          <CardDescription>
            Define success thresholds that we will monitor weekly. These align with dashboard alerts.
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <MetricField
              label="Closed Jobs / month"
              value={kpis.closedJobsTarget}
              onChange={(value) => update({ closedJobsTarget: value })}
            />
            <MetricField
              label="Target CPL"
              value={kpis.cplTarget}
              prefix="$"
              onChange={(value) => update({ cplTarget: value })}
            />
            <MetricField
              label="Target CAC"
              value={kpis.cacTarget}
              prefix="$"
              onChange={(value) => update({ cacTarget: value })}
            />
            <MetricField
              label="Reviews in 90 days"
              value={kpis.reviewsTarget}
              onChange={(value) => update({ reviewsTarget: value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500" htmlFor="capacity-note">
              Capacity Note
            </label>
            <Textarea
              id="capacity-note"
              rows={4}
              value={kpis.capacityNote}
              onChange={(event) => update({ capacityNote: event.target.value })}
              placeholder="Highlight current staffing, intake rhythms, or off-ramps if volume exceeds the plan."
            />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-accent" /> Capacity Snapshot
          </CardTitle>
          <CardDescription>
            Pressure-test the active budget plan against sales bandwidth.
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-4">
          <div className="flex items-center gap-3 rounded-2xl border border-ink/10 bg-slate-50/80 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">Sales Team</p>
              <p className="text-sm text-slate-600">{kpis.salesTeamSize} closers active</p>
            </div>
            <Input
              type="number"
              min={0}
              className="ml-auto w-24"
              value={kpis.salesTeamSize}
              onChange={(event) => update({ salesTeamSize: Number(event.target.value) })}
              aria-label="Sales team size"
            />
          </div>
          {activeMetrics ? (
            <div className="space-y-3 rounded-2xl border border-ink/10 bg-white/70 p-4">
              <p className="text-sm font-semibold text-ink">Projected from selected scenario</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <InfoBlock label="Closed Jobs" value={formatRange(activeMetrics.closedRange)} />
                <InfoBlock label="Leads" value={formatRange(activeMetrics.leadsRange)} />
                <InfoBlock label="CAC" value={formatCurrency(activeMetrics.cacRange[1], { maximumFractionDigits: 0 })} />
                <InfoBlock label="Margin" value={formatCurrency(activeMetrics.marginDollars, { maximumFractionDigits: 0 })} />
              </div>
              {capacityRisk ? (
                <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                  <AlertTriangle className="mt-0.5 h-5 w-5" />
                  <div>
                    <p className="font-semibold">Capacity Risk</p>
                    <p>
                      Selected plan projects up to {formatNumber(activeMetrics.closedRange[1])} closed jobs/mo which exceeds the target of
                      {formatNumber(kpis.closedJobsTarget)}. Confirm staffing or stage the rollout.
                    </p>
                  </div>
                </div>
              ) : (
                <Badge variant="accent" className="w-fit">Capacity Aligned</Badge>
              )}
            </div>
          ) : (
            <p className="rounded-2xl border border-dashed border-ink/10 bg-white p-6 text-sm text-slate-500">
              Select a budget scenario to view projected throughput.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function MetricField({
  label,
  value,
  onChange,
  prefix
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
}) {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-ink/80">
      {label}
      <div className="flex items-center gap-2">
        {prefix ? <span className="text-slate-400">{prefix}</span> : null}
        <Input
          type="number"
          value={Number.isFinite(value) ? value : 0}
          onChange={(event) => onChange(Number(event.target.value))}
        />
      </div>
    </label>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-slate-50/60 p-3 text-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-base font-semibold text-ink">{value}</p>
    </div>
  );
}

function formatRange(range: [number, number]) {
  const [min, max] = range;
  return `${formatNumber(min)} – ${formatNumber(max)}`;
}
