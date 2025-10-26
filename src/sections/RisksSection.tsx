import { Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import { RAIDBoard } from '../types';

const createId = () => Math.random().toString(36).slice(2, 9);

type Item = { id: string; value: string };

type Props = {
  raid: RAIDBoard;
  onChange: (value: RAIDBoard) => void;
};

function mapToItems(values: string[]): Item[] {
  return values.map((value) => ({ id: createId(), value }));
}

function itemsToValues(items: Item[]): string[] {
  return items.map((item) => item.value);
}

function EditableList({
  title,
  description,
  values,
  onUpdate
}: {
  title: string;
  description: string;
  values: string[];
  onUpdate: (items: string[]) => void;
}) {
  const [items, setItems] = useState<Item[]>(mapToItems(values));

  useEffect(() => {
    setItems(mapToItems(values));
  }, [values]);

  const updateItem = (id: string, value: string) => {
    const next = items.map((item) => (item.id === id ? { ...item, value } : item));
    setItems(next);
    onUpdate(itemsToValues(next));
  };

  const addItem = () => {
    const next = [...items, { id: createId(), value: '' }];
    setItems(next);
    onUpdate(itemsToValues(next));
  };

  const removeItem = (id: string) => {
    const next = items.filter((item) => item.id !== id);
    setItems(next);
    onUpdate(itemsToValues(next));
  };

  return (
    <div className="space-y-3 rounded-2xl border border-ink/10 bg-white/70 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-ink">{title}</h3>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
        <Button variant="ghost" onClick={addItem} className="text-sm text-accent">
          <Plus className="h-4 w-4" /> Add
        </Button>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex gap-2 rounded-2xl border border-ink/10 bg-slate-50/70 p-3"
          >
            <Textarea
              rows={2}
              value={item.value}
              onChange={(event) => updateItem(item.id, event.target.value)}
              aria-label={`${title} item`}
              className="min-h-[64px] flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              className="self-start text-slate-400 hover:text-red-500"
              onClick={() => removeItem(item.id)}
              aria-label={`Remove ${title} item`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {items.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-ink/10 bg-white p-4 text-xs text-slate-500">
            Nothing logged yet. Add items as they emerge.
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function RisksSection({ raid, onChange }: Props) {
  const update = (key: keyof RAIDBoard, values: string[]) => {
    onChange({ ...raid, [key]: values });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Risks / RAID</CardTitle>
        <CardDescription>
          Capture the known risks, assumptions, issues, and dependencies for this engagement.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 lg:grid-cols-2">
        <EditableList
          title="Risks"
          description="What could derail results if unmitigated?"
          values={raid.risks}
          onUpdate={(values) => update('risks', values)}
        />
        <EditableList
          title="Assumptions"
          description="Inputs we expect to hold true."
          values={raid.assumptions}
          onUpdate={(values) => update('assumptions', values)}
        />
        <EditableList
          title="Issues"
          description="Active problems we are solving now."
          values={raid.issues}
          onUpdate={(values) => update('issues', values)}
        />
        <EditableList
          title="Dependencies"
          description="Upstream data or approvals we need."
          values={raid.dependencies}
          onUpdate={(values) => update('dependencies', values)}
        />
      </CardContent>
    </Card>
  );
}
