import { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export function Alert({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-3 rounded-2xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-ink',
        className
      )}
      {...props}
    />
  );
}
