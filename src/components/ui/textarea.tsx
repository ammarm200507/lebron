import { TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      'w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink shadow-inner shadow-black/5 transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40 disabled:cursor-not-allowed disabled:bg-slate-100',
      className
    )}
    {...props}
  />
));

Textarea.displayName = 'Textarea';
