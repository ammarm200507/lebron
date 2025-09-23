import { ReactNode } from 'react';
import { cn } from '../../lib/utils';

type TabsProps = {
  tabs: Array<{ id: string; label: string; icon?: ReactNode }>;
  activeId: string;
  onTabChange: (id: string) => void;
};

export function Tabs({ tabs, activeId, onTabChange }: TabsProps) {
  return (
    <div className="flex flex-wrap gap-2 rounded-2xl bg-white/60 p-2">
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold text-slate-600 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
              isActive ? 'bg-ink text-white shadow-soft' : 'hover:bg-white'
            )}
            aria-pressed={isActive}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
