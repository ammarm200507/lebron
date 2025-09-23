import { Plus, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Table, TBody, TD, TH, THead, TR } from '../components/ui/table';
import { Task, TaskStatus } from '../types';

const createId = () => Math.random().toString(36).slice(2, 9);

const statusLabels: Record<TaskStatus, string> = {
  'On Track': '🟢 On Track',
  'At Risk': '🟡 At Risk',
  'Client Needed': '🟠 Client Needed',
  Backlog: '⚪ Backlog'
};

type Props = {
  tasks: Task[];
  onChange: (tasks: Task[]) => void;
};

export function TasksSection({ tasks, onChange }: Props) {
  const updateTask = (id: string, patch: Partial<Task>) => {
    onChange(tasks.map((task) => (task.id === id ? { ...task, ...patch } : task)));
  };

  const addTask = () => {
    onChange([
      ...tasks,
      { id: createId(), owner: '', description: '', status: 'Backlog' }
    ]);
  };

  const removeTask = (id: string) => {
    onChange(tasks.filter((task) => task.id !== id));
  };

  return (
    <Card>
      <CardHeader className="items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <CardTitle>Tasks & Owners</CardTitle>
          <CardDescription>
            Track who owns what across Auxilium and Xore Roofing.
          </CardDescription>
        </div>
        <Button onClick={addTask} variant="accent" className="whitespace-nowrap">
          <Plus className="h-4 w-4" /> Add task
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <THead>
              <TR className="bg-transparent">
                <TH>Owner</TH>
                <TH>Deliverable</TH>
                <TH>Status</TH>
                <TH className="text-right">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {tasks.map((task) => (
                <TR key={task.id} className="align-top">
                  <TD>
                    <Input
                      value={task.owner}
                      onChange={(event) => updateTask(task.id, { owner: event.target.value })}
                      aria-label="Task owner"
                    />
                  </TD>
                  <TD>
                    <Input
                      value={task.description}
                      onChange={(event) => updateTask(task.id, { description: event.target.value })}
                      aria-label="Task description"
                    />
                  </TD>
                  <TD>
                    <select
                      className="w-full rounded-2xl border border-ink/10 bg-white px-3 py-2 text-sm"
                      value={task.status}
                      onChange={(event) =>
                        updateTask(task.id, { status: event.target.value as TaskStatus })
                      }
                      aria-label="Task status"
                    >
                      {(Object.keys(statusLabels) as TaskStatus[]).map((status) => (
                        <option key={status} value={status}>
                          {statusLabels[status]}
                        </option>
                      ))}
                    </select>
                  </TD>
                  <TD className="text-right">
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-slate-500 hover:text-red-500"
                      onClick={() => removeTask(task.id)}
                      aria-label="Remove task"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TD>
                </TR>
              ))}
              {tasks.length === 0 ? (
                <TR>
                  <TD colSpan={4} className="text-center text-sm text-slate-500">
                    Add deliverables to show owners, deliverables, and status at a glance.
                  </TD>
                </TR>
              ) : null}
            </TBody>
          </Table>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
          {Object.entries(statusLabels).map(([status, label]) => (
            <Badge key={status} variant="outline" className="bg-white">
              {label}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
