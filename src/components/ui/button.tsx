import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

type ButtonVariant = 'default' | 'outline' | 'ghost' | 'accent';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variantStyles: Record<ButtonVariant, string> = {
  default: 'bg-ink text-white hover:bg-ink/90',
  accent: 'bg-accent text-white hover:bg-accent/90',
  outline:
    'border border-ink/10 bg-white text-ink hover:border-ink/30 hover:bg-slate-50',
  ghost: 'text-ink hover:bg-ink/5'
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-60',
        variantStyles[variant],
        className
      )}
      {...props}
    />
  )
);

Button.displayName = 'Button';
