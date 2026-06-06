import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/cn'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

const variants = {
  primary:
    'bg-primary text-on-primary border border-primary hover:bg-transparent hover:text-primary',
  secondary:
    'bg-transparent text-text-primary border border-border-subtle dark:border-dark-border dark:text-dark-text-primary hover:bg-action-hover dark:hover:bg-inverse-surface',
  ghost:
    'bg-transparent text-text-secondary border-none hover:text-primary dark:hover:text-primary-fixed',
}

const sizes = {
  sm: 'px-4 py-2 text-label-sm',
  md: 'px-6 py-3 text-label-sm',
  lg: 'px-8 py-4 text-nav-link',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'font-label-sm transition-all duration-300',
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'
