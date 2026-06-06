import { cn } from '@/lib/cn'

interface StatCardProps {
  label: string
  value: string
  sub?: string
  icon?: React.ReactNode
  trend?: 'up' | 'down'
  progress?: number
  className?: string
}

export function StatCard({
  label,
  value,
  sub,
  icon,
  trend,
  progress,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'bg-surface-card dark:bg-dark-surface border border-border-subtle dark:border-dark-border p-6 hover:scale-102 transition-transform duration-200',
        className,
      )}
    >
      <div className="text-label-sm text-text-secondary uppercase tracking-widest mb-4">
        {label}
      </div>
      <div className="flex items-end gap-2">
        <span className="text-headline-md font-headline-md leading-none">
          {value}
        </span>
        {sub && (
          <span
            className={cn(
              'text-label-sm',
              trend === 'up' && 'text-status-success',
              trend === 'down' && 'text-status-danger',
              !trend && 'text-text-secondary',
            )}
          >
            {sub}
          </span>
        )}
      </div>
      {icon && <div className="mt-4 flex items-center gap-1">{icon}</div>}
      {progress !== undefined && (
        <div className="mt-4 h-1 w-full bg-surface-container dark:bg-dark-border overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  )
}
