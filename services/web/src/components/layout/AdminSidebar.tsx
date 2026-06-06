import { Link, useLocation, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { useAuthStore } from '@/lib/auth-store'

const sidebarLinks = [
  { to: '/admin', label: 'Dashboard', icon: 'dashboard' },
  { to: '/admin/manuscripts', label: 'Manuscripts', icon: 'menu_book' },
  { to: '/admin/collections', label: 'Collections', icon: 'auto_stories' },
  { to: '/admin/analytics', label: 'Analytics', icon: 'bar_chart' },
  { to: '/admin/settings', label: 'Settings', icon: 'settings' },
]

interface AdminSidebarProps {
  mobileOpen: boolean
  onClose: () => void
}

export function AdminSidebar({ mobileOpen, onClose }: AdminSidebarProps) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const logout = useAuthStore((s) => s.logout)

  const handleSignOut = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-ink/60 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'bg-surface-container dark:bg-dark-surface border-r border-border-subtle dark:border-dark-border flex flex-col h-screen py-8 overflow-y-auto transition-transform duration-300 z-50',
          'fixed inset-y-0 left-0 w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
          'md:sticky md:top-0 md:translate-x-0 md:inset-auto',
        )}
      >
        <div className="px-8 mb-12">
          <div className="font-headline-md text-headline-md text-primary dark:text-primary-fixed tracking-tight mb-1">
            Vault
          </div>
          <div className="font-label-sm text-label-sm text-text-secondary uppercase tracking-[0.2em]">
            Editorial Desk
          </div>
        </div>

        <nav className="flex-1 space-y-2 px-4">
          {sidebarLinks.map((link) => {
            const isActive =
              link.to === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(link.to)
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={onClose}
                className={cn(
                  'px-4 py-3 flex items-center gap-3 transition-all font-label-sm text-label-sm',
                  isActive
                    ? 'bg-action-hover dark:bg-primary-container text-primary dark:text-on-primary-container border-l-4 border-primary font-medium'
                    : 'text-text-secondary dark:text-text-secondary hover:bg-surface-container-high dark:hover:bg-inverse-surface',
                )}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {link.icon}
                </span>
                <span>{link.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto px-4 py-6 border-t border-border-subtle dark:border-dark-border space-y-1">
          <Link
            to="/"
            onClick={onClose}
            className="text-text-secondary dark:text-text-secondary hover:text-primary px-4 py-2 flex items-center gap-3 transition-colors font-label-sm text-label-sm"
          >
            <span className="material-symbols-outlined text-[20px]">
              open_in_new
            </span>
            View Site
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full text-left text-text-secondary dark:text-text-secondary hover:text-primary px-4 py-2 flex items-center gap-3 transition-colors font-label-sm text-label-sm"
          >
            <span className="material-symbols-outlined text-[20px]">
              logout
            </span>
            Sign Out
          </button>
        </div>
      </aside>
    </>
  )
}
