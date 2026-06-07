import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/cn'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  label?: string
  className?: string
}

export function Select({ value, onChange, options, label, className }: SelectProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selected = options.find((o) => o.value === value)

  return (
    <div className="space-y-2" ref={ref}>
      {label && (
        <label className="block font-label-sm text-label-sm text-primary">{label}</label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={cn(
            'flex items-center gap-2 px-4 py-2 border border-border-subtle dark:border-dark-border',
            'bg-surface-card dark:bg-dark-surface',
            'font-label-sm text-label-sm text-text-primary dark:text-dark-text-primary',
            'hover:border-primary transition-colors cursor-pointer',
            className,
          )}
        >
          <span className="flex-1 text-left">{selected?.label}</span>
          <span className="material-symbols-outlined text-[16px] text-text-secondary">
            {open ? 'expand_less' : 'expand_more'}
          </span>
        </button>
        {open && (
          <div className="absolute top-full left-0 right-0 mt-1 z-50 border border-border-subtle dark:border-dark-border bg-surface-card dark:bg-dark-surface shadow-lg">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value)
                  setOpen(false)
                }}
                className={cn(
                  'w-full text-left px-4 py-2 font-label-sm text-label-sm transition-colors cursor-pointer',
                  opt.value === value
                    ? 'text-primary bg-primary/5'
                    : 'text-text-primary dark:text-dark-text-primary hover:bg-surface-container dark:hover:bg-dark-surface/80',
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
