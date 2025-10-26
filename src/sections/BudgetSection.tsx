import { motion } from 'framer-motion';
import { BarChart3, CheckCircle2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Slider } from '../components/ui/slider';
import { Badge } from '../components/ui/badge';
import { Alert } from '../components/ui/alert';
import { Toggle } from '../components/ui/toggle';
import { calculateScenarioMetrics, ScenarioMetrics } from '../lib/budget';
import { formatCurrency, formatNumber } from '../lib/utils';
import { BudgetAssumptions, BudgetScenario } from '../types';

const sliderSteps = {
  min: 0,
  max: 10000,
  step: 100
};

type Props = {
  assumptions: BudgetAssumptions;
  scenarios: BudgetScenario[];
  selectedScenarioId: string;
  onUpdateAssumptions: (value: BudgetAssumptions) => void;
  onUpdateScenario: (scenario: BudgetScenario) => void;
  onSelectScenario: (id: string) => void;
};

function formatRange([min, max]: [number, number], options?: Intl.NumberFormatOptions) {
  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    return '—';
  }
  const formattedMin = formatNumber(min, options);
  const formattedMax = formatNumber(max, options);
  return formattedMin === formattedMax ? formattedMin : `${formattedMin} – ${formattedMax}`;
}

function ScenarioCard({
  scenario,
  assumptions,
  selected,
  onChange,
  onSelect
}: {
  scenario: BudgetScenario;
  assumptions: BudgetAssumptions;
  selected: boolean;
  onChange: (scenario: BudgetScenario) => void;
  onSelect: () => void;
}) {
  const metrics: ScenarioMetrics = calculateScenarioMetrics(scenario, assumptions);
  const budgetFormatted = formatCurrency(metrics.totalBudget, { maximumFractionDigits: 0 });
  const leadsRange = formatRange(metrics.leadsRange);
  const closedRange = formatRange(metrics.closedRange);
  const cplRange = formatRange(metrics.cplRange, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  const cacRange = formatRange(metrics.cacRange, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  const margin = formatCurrency(metrics.marginDollars, { maximumFractionDigits: 0 });

  return (
    <motion.div
      layout
      transition={{ type: 'spring', stiffness: 220, damping: 25 }}
      className={`relative rounded-2xl border ${
        selected ? 'border-accent bg-white shadow-soft' : 'border-transparent bg-white/80'
      } p-6`}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-ink">{scenario.name}</h3>
            <p className="text-sm text-slate-500">{scenario.description}</p>
          </div>
          <div className="flex items-center gap-2">
            {selected ? <Badge variant="accent">Selected</Badge> : null}
            <Toggle pressed={selected} onClick={onSelect} className="whitespace-nowrap">
              <CheckCircle2 className="h-4 w-4" /> {selected ? 'Selected' : 'Select'}
            </Toggle>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Metric label="Budget" value={budgetFormatted} />
          <Metric label="Expected Leads" value={leadsRange} />
          <Metric label="Closed Jobs" value={closedRange} />
          <Metric label="Est. CAC" value={cacRange} />
        </div>
        <div className="rounded-2xl border border-dashed border-ink/10 bg-slate-50/60 p-4">
          <h4 className="text-sm font-semibold text-ink">Channel Mix</h4>
          <div className="mt-3 space-y-4">
            {scenario.channels.map((channel) => (
              <div key={channel.id} className="space-y-2">
                <div className="flex items-center justify-between text-sm font-medium text-ink/80">
                  <span>{channel.name}</span>
                  <span>{formatCurrency(channel.amount, { maximumFractionDigits: 0 })}</span>
                </div>
                <Slider
                  min={channel.min ?? sliderSteps.min}
                  max={channel.max ?? sliderSteps.max}
                  step={channel.step ?? sliderSteps.step}
                  value={channel.amount}
                  onChange={(event) => {
                    const value = Number(event.target.value);
                    onChange({
                      ...scenario,
                      channels: scenario.channels.map((item) =>
                        item.id === channel.id ? { ...item, amount: value } : item
                      )
                    });
                  }}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <Metric label="CPL" value={cplRange} subtle />
          <Metric label="Monthly Margin" value={margin} subtle />
          <Metric
            label="Target CAC"
            value={`≤ ${formatCurrency(assumptions.targetCAC, { maximumFractionDigits: 0 })}`}
            subtle
          />
        </div>
      </div>
    </motion.div>
  );
}

function Metric({
  label,
  value,
  subtle = false
}: {
  label: string;
  value: string;
  subtle?: boolean;
}) {
  return (
    <div className="flex flex-col rounded-2xl border border-ink/10 bg-white/70 px-4 py-3">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <span className={`text-lg font-semibold ${subtle ? 'text-ink/80' : 'text-ink'}`}>{value}</span>
    </div>
  );
}

export function BudgetSection({
  assumptions,
  scenarios,
  selectedScenarioId,
  onUpdateAssumptions,
  onUpdateScenario,
  onSelectScenario
}: Props) {
  const updateAssumption = (key: keyof BudgetAssumptions, value: number) => {
    onUpdateAssumptions({ ...assumptions, [key]: value });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-accent" /> Global Assumptions
          </CardTitle>
          <CardDescription>
            These drive CAC, CPL, and margin outputs. Adjust to reflect updated pricing or win rates.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <AssumptionInput
              label="Average Ticket"
              prefix="$"
              value={assumptions.avgTicket}
              onChange={(value) => updateAssumption('avgTicket', value)}
            />
            <AssumptionInput
              label="Gross Margin %"
              suffix="%"
              value={assumptions.grossMargin}
              onChange={(value) => updateAssumption('grossMargin', value)}
            />
            <AssumptionInput
              label="Close Rate %"
              suffix="%"
              value={assumptions.closeRate}
              onChange={(value) => updateAssumption('closeRate', value)}
            />
            <AssumptionInput
              label="Target CPL (Min)"
              prefix="$"
              value={assumptions.targetCPLMin}
              onChange={(value) => updateAssumption('targetCPLMin', value)}
            />
            <AssumptionInput
              label="Target CPL (Max)"
              prefix="$"
              value={assumptions.targetCPLMax}
              onChange={(value) => updateAssumption('targetCPLMax', value)}
            />
            <AssumptionInput
              label="Target CAC"
              prefix="$"
              value={assumptions.targetCAC}
              onChange={(value) => updateAssumption('targetCAC', value)}
            />
          </div>
          <Alert className="mt-6">
            <div>
              <p className="font-semibold">Tip</p>
              <p className="text-sm text-slate-600">
                Use the sliders below to craft mix scenarios. CAC and CPL will respond instantly as you reallocate spend.
              </p>
            </div>
          </Alert>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-3">
        {scenarios.map((scenario) => (
          <ScenarioCard
            key={scenario.id}
            scenario={scenario}
            assumptions={assumptions}
            selected={scenario.id === selectedScenarioId}
            onChange={onUpdateScenario}
            onSelect={() => onSelectScenario(scenario.id)}
          />
        ))}
      </div>
    </div>
  );
}

function AssumptionInput({
  label,
  value,
  onChange,
  prefix,
  suffix
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-ink/80">
      {label}
      <div className="flex items-center gap-2">
        {prefix ? <span className="text-slate-400">{prefix}</span> : null}
        <Input
          type="number"
          inputMode="decimal"
          value={Number.isFinite(value) ? value : 0}
          onChange={(event) => onChange(Number(event.target.value))}
          className="flex-1"
        />
        {suffix ? <span className="text-slate-400">{suffix}</span> : null}
      </div>
    </label>
  );
}
