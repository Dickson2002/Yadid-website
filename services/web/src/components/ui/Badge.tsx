import { cn } from '@/lib/cn'

interface BadgeProps {
  variant?: 'primary' | 'secondary' | 'draft'
  children: React.ReactNode
  className?: string
}

const badgeVariants = {
  primary: 'bg-primary/10 text-primary',
  secondary: 'bg-surface-container text-text-secondary',
  draft: 'bg-secondary-container/20 text-secondary',
}

export function Badge({ variant = 'primary', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'px-3 py-1 text-[10px] uppercase tracking-widest font-bold',
        badgeVariants[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
