import { Plus, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { ICPItem } from '../types';

const createId = () => Math.random().toString(36).slice(2, 9);

type Props = {
  items: ICPItem[];
  onChange: (items: ICPItem[]) => void;
};

export function ICPSection({ items, onChange }: Props) {
  const updateItem = (id: string, patch: Partial<ICPItem>) => {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const addItem = () => {
    onChange([
      ...items,
      {
        id: createId(),
        label: 'New Attribute',
        details: ''
      }
    ]);
  };

  const removeItem = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
  };

  return (
    <Card>
      <CardHeader className="items-start justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <CardTitle>Ideal Customer Profile</CardTitle>
          <CardDescription>
            Edit demographics, triggers, and exclusions. This is the field playbook for prospecting.
          </CardDescription>
        </div>
        <Button variant="accent" onClick={addItem} className="whitespace-nowrap">
          <Plus className="h-4 w-4" /> Add row
        </Button>
      </CardHeader>
      <CardContent className="gap-6">
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-ink/10 bg-slate-50/60 p-4 transition hover:border-accent/40 hover:bg-accent-tint"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1 space-y-3">
                  <Input
                    aria-label={`${item.label} label`}
                    value={item.label}
                    onChange={(event) => updateItem(item.id, { label: event.target.value })}
                  />
                  <Textarea
                    aria-label={`${item.label} details`}
                    rows={3}
                    value={item.details}
                    onChange={(event) => updateItem(item.id, { details: event.target.value })}
                    placeholder="Enter the nuance, qualifiers, or watch-outs for this slice of the ICP."
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  aria-label="Remove ICP row"
                  onClick={() => removeItem(item.id)}
                  className="self-start text-slate-500 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {items.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-ink/10 bg-white p-8 text-center text-sm text-slate-500">
              Add segments to define who we market to — demographics, triggers, buying signals, and exclusions.
            </p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
