import { CalendarCheck2, CheckSquare, Plus, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Table, TBody, TD, TH, THead, TR } from '../components/ui/table';
import { Decision, Milestone, MilestoneStatus } from '../types';

const createId = () => Math.random().toString(36).slice(2, 9);

const statusColors: Record<MilestoneStatus, { label: string; variant: 'outline' | 'accent' | 'default' }> = {
  'Not Started': { label: 'Not Started', variant: 'outline' },
  'In Progress': { label: 'In Progress', variant: 'accent' },
  Complete: { label: 'Complete', variant: 'default' }
};

type Props = {
  decisions: Decision[];
  milestones: Milestone[];
  onUpdateDecisions: (value: Decision[]) => void;
  onUpdateMilestones: (value: Milestone[]) => void;
};

export function DecisionsSection({
  decisions,
  milestones,
  onUpdateDecisions,
  onUpdateMilestones
}: Props) {
  const addDecision = () => {
    onUpdateDecisions([
      ...decisions,
      { id: createId(), summary: '', decider: '', date: new Date().toISOString().slice(0, 10) }
    ]);
  };

  const updateDecision = (id: string, patch: Partial<Decision>) => {
    onUpdateDecisions(decisions.map((decision) => (decision.id === id ? { ...decision, ...patch } : decision)));
  };

  const removeDecision = (id: string) => {
    onUpdateDecisions(decisions.filter((decision) => decision.id !== id));
  };

  const addMilestone = () => {
    onUpdateMilestones([
      ...milestones,
      { id: createId(), name: '', targetDate: new Date().toISOString().slice(0, 10), status: 'Not Started', notes: '' }
    ]);
  };

  const updateMilestone = (id: string, patch: Partial<Milestone>) => {
    onUpdateMilestones(milestones.map((milestone) => (milestone.id === id ? { ...milestone, ...patch } : milestone)));
  };

  const removeMilestone = (id: string) => {
    onUpdateMilestones(milestones.filter((milestone) => milestone.id !== id));
  };

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card>
        <CardHeader className="items-start justify-between gap-4 xl:flex-row xl:items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-accent" /> Decision Log
            </CardTitle>
            <CardDescription>Document commitments and who signed off.</CardDescription>
          </div>
          <Button variant="accent" onClick={addDecision} className="whitespace-nowrap">
            <Plus className="h-4 w-4" /> Add decision
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <THead>
                <TR className="bg-transparent">
                  <TH>ID</TH>
                  <TH>Summary</TH>
                  <TH>Decider</TH>
                  <TH>Date</TH>
                  <TH className="text-right">Actions</TH>
                </TR>
              </THead>
              <TBody>
                {decisions.map((decision) => (
                  <TR key={decision.id}>
                    <TD className="font-mono text-xs text-slate-500">{decision.id.toUpperCase()}</TD>
                    <TD>
                      <Input
                        value={decision.summary}
                        onChange={(event) => updateDecision(decision.id, { summary: event.target.value })}
                        aria-label="Decision summary"
                      />
                    </TD>
                    <TD>
                      <Input
                        value={decision.decider}
                        onChange={(event) => updateDecision(decision.id, { decider: event.target.value })}
                        aria-label="Decision decider"
                      />
                    </TD>
                    <TD>
                      <Input
                        type="date"
                        value={decision.date}
                        onChange={(event) => updateDecision(decision.id, { date: event.target.value })}
                        aria-label="Decision date"
                      />
                    </TD>
                    <TD className="text-right">
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-slate-500 hover:text-red-500"
                        onClick={() => removeDecision(decision.id)}
                        aria-label="Remove decision"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TD>
                  </TR>
                ))}
                {decisions.length === 0 ? (
                  <TR>
                    <TD colSpan={5} className="text-center text-sm text-slate-500">
                      Log strategic decisions as they happen.
                    </TD>
                  </TR>
                ) : null}
              </TBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="items-start justify-between gap-4 xl:flex-row xl:items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CalendarCheck2 className="h-5 w-5 text-accent" /> Milestones
            </CardTitle>
            <CardDescription>Sequence the major deliverables and go-live checkpoints.</CardDescription>
          </div>
          <Button variant="accent" onClick={addMilestone} className="whitespace-nowrap">
            <Plus className="h-4 w-4" /> Add milestone
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <THead>
                <TR className="bg-transparent">
                  <TH>Milestone</TH>
                  <TH>Date</TH>
                  <TH>Status</TH>
                  <TH>Notes</TH>
                  <TH className="text-right">Actions</TH>
                </TR>
              </THead>
              <TBody>
                {milestones.map((milestone) => (
                  <TR key={milestone.id}>
                    <TD>
                      <Input
                        value={milestone.name}
                        onChange={(event) => updateMilestone(milestone.id, { name: event.target.value })}
                        aria-label="Milestone name"
                      />
                    </TD>
                    <TD>
                      <Input
                        type="date"
                        value={milestone.targetDate}
                        onChange={(event) => updateMilestone(milestone.id, { targetDate: event.target.value })}
                        aria-label="Milestone date"
                      />
                    </TD>
                    <TD>
                      <select
                        className="w-full rounded-2xl border border-ink/10 bg-white px-3 py-2 text-sm"
                        value={milestone.status}
                        onChange={(event) =>
                          updateMilestone(milestone.id, {
                            status: event.target.value as MilestoneStatus
                          })
                        }
                        aria-label="Milestone status"
                      >
                        {(Object.keys(statusColors) as MilestoneStatus[]).map((status) => (
                          <option key={status} value={status}>
                            {statusColors[status].label}
                          </option>
                        ))}
                      </select>
                    </TD>
                    <TD>
                      <Input
                        value={milestone.notes ?? ''}
                        onChange={(event) => updateMilestone(milestone.id, { notes: event.target.value })}
                        aria-label="Milestone notes"
                      />
                    </TD>
                    <TD className="text-right">
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-slate-500 hover:text-red-500"
                        onClick={() => removeMilestone(milestone.id)}
                        aria-label="Remove milestone"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TD>
                  </TR>
                ))}
                {milestones.length === 0 ? (
                  <TR>
                    <TD colSpan={5} className="text-center text-sm text-slate-500">
                      Add timeline checkpoints to keep momentum visible.
                    </TD>
                  </TR>
                ) : null}
              </TBody>
            </Table>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
            {(Object.keys(statusColors) as MilestoneStatus[]).map((status) => (
              <Badge key={status} variant={statusColors[status].variant}>
                {statusColors[status].label}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
