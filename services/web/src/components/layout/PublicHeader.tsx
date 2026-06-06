import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { ThemeToggle } from '@/components/shared/ThemeToggle'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/poems', label: 'Archive' },
  { to: '/about', label: 'About' },
]

export function PublicHeader() {
  const { pathname } = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-md border-b border-border-subtle dark:border-dark-border">
      <nav className="flex justify-between items-center w-full px-4 md:px-margin-safe py-6 max-w-container-max mx-auto">
        <Link
          to="/"
          onClick={() => setMobileOpen(false)}
          className="font-headline-md text-headline-md text-primary dark:text-primary-fixed tracking-tight"
        >
          Vault
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                'font-nav-link text-nav-link transition-colors',
                pathname === link.to
                  ? 'text-primary dark:text-primary-fixed'
                  : 'text-text-secondary dark:text-text-secondary hover:text-primary dark:hover:text-primary-fixed',
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-text-secondary hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined">
              {mobileOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </nav>

      <div
        className={cn(
          'md:hidden overflow-hidden transition-all duration-300 border-b border-border-subtle dark:border-dark-border bg-surface dark:bg-dark-surface',
          mobileOpen ? 'max-h-64' : 'max-h-0',
        )}
      >
        <div className="px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'block px-4 py-3 font-nav-link text-nav-link transition-colors',
                pathname === link.to
                  ? 'text-primary dark:text-primary-fixed bg-action-hover dark:bg-primary-container'
                  : 'text-text-secondary dark:text-text-secondary hover:text-primary dark:hover:text-primary-fixed',
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  )
}
