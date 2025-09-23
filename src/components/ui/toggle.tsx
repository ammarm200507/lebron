import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

type ToggleProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  pressed?: boolean;
};

export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  ({ className, pressed = false, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-pressed={pressed}
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-ink/15 px-4 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        pressed ? 'bg-ink text-white shadow-soft' : 'bg-white hover:bg-ink/5',
        className
      )}
      {...props}
    />
  )
);

Toggle.displayName = 'Toggle';
