import { SelectHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/cn'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, id, children, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={id}
            className="block font-label-sm text-label-sm text-primary"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={id}
          className={cn(
            'bg-transparent border-none text-label-sm text-text-secondary focus:ring-0 cursor-pointer',
            'dark:text-dark-text-primary',
            className,
          )}
          {...props}
        >
          {children}
        </select>
      </div>
    )
  },
)
Select.displayName = 'Select'
