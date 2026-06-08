import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
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
        <input
          ref={ref}
          id={id}
          className={cn(
            'w-full bg-transparent border-b border-border-subtle dark:border-dark-border',
            'focus:border-primary outline-none py-2 font-body-md text-body-md',
            'placeholder:text-text-secondary/50 dark:text-dark-text-primary transition-colors',
            'autofill:!bg-[#1C1E1A] autofill:!text-dark-text-primary',
            '[-webkit-autofill]:!bg-[#1C1E1A] [-webkit-autofill]:!text-dark-text-primary',
            '[-webkit-autofill]:shadow-[inset_0_0_0_1000px_#1C1E1A]',
            error && 'border-status-danger',
            className,
          )}
          {...props}
        />
        {error && (
          <p className="font-label-sm text-label-sm text-status-danger">
            {error}
          </p>
        )}
      </div>
    )
  },
)
Input.displayName = 'Input'
