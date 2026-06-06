import { useThemeStore } from '@/hooks/use-theme'

export function ThemeToggle() {
  const { isDark, toggle } = useThemeStore()

  return (
    <button
      onClick={toggle}
      className="p-2 text-primary dark:text-primary-fixed hover:bg-action-hover dark:hover:bg-inverse-surface transition-all"
      aria-label="Toggle theme"
    >
      <span className="material-symbols-outlined">
        {isDark ? 'light_mode' : 'dark_mode'}
      </span>
    </button>
  )
}
