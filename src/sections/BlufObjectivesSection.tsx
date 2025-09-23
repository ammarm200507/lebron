import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import { BlufObjectives } from '../types';

function formatPreview(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

type Props = {
  value: BlufObjectives;
  onChange: (value: BlufObjectives) => void;
};

export function BlufObjectivesSection({ value, onChange }: Props) {
  const previewBluf = formatPreview(value.bluf);
  const previewObjectives = formatPreview(value.objectives);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>BLUF (Bottom Line Up Front)</CardTitle>
          <CardDescription>
            Keep it crisp. Separate bullets with a new line. Preview updates live.
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-6">
          <Textarea
            aria-label="BLUF bullets"
            rows={8}
            value={value.bluf}
            onChange={(event) => onChange({ ...value, bluf: event.target.value })}
            placeholder={'Win 2–3 full-roof installs monthly at target CAC\nValidate Auxilium playbook within 90 days'}
          />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Preview</p>
            <ul className="mt-2 space-y-2">
              {previewBluf.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-ink/90">
                  <span className="mt-1 block h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
              {previewBluf.length === 0 ? (
                <li className="text-sm text-slate-400">Add a few bullets to summarize the proposal.</li>
              ) : null}
            </ul>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Objectives & Notes</CardTitle>
          <CardDescription>
            Outline desired outcomes, KPIs, and context. Use notes for nuance or next steps.
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500" htmlFor="objectives-input">
              Objectives
            </label>
            <Textarea
              id="objectives-input"
              rows={8}
              value={value.objectives}
              onChange={(event) =>
                onChange({ ...value, objectives: event.target.value })
              }
              placeholder={'Build predictable inbound volume\nLand 40 public reviews\nEnable Auxilium reporting rhythms'}
            />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Preview</p>
              <ul className="mt-2 space-y-2">
                {previewObjectives.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-ink/90">
                    <span className="mt-1 block h-2 w-2 rounded-full bg-ink/40" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
                {previewObjectives.length === 0 ? (
                  <li className="text-sm text-slate-400">Add the outcomes we are aiming for.</li>
                ) : null}
              </ul>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500" htmlFor="notes-input">
              Notes & Context
            </label>
            <Textarea
              id="notes-input"
              rows={5}
              value={value.notes}
              onChange={(event) => onChange({ ...value, notes: event.target.value })}
              placeholder="Key nuance, blockers, or exec-ready footnotes."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
