import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { AdminSidebar } from './AdminSidebar'
import { ThemeToggle } from '@/components/shared/ThemeToggle'

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen">
      <AdminSidebar
        mobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <main className="flex-1 bg-surface dark:bg-dark-bg overflow-y-auto min-w-0">
        <header className="sticky top-0 z-10 flex items-center justify-between px-4 md:px-margin-safe py-6 bg-transparent backdrop-blur-md border-b border-border-subtle dark:border-dark-border">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-text-secondary hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div className="flex items-center gap-2 font-label-sm text-label-sm text-text-secondary">
              <span className="hidden sm:inline">Archive</span>
              <span className="material-symbols-outlined text-xs hidden sm:inline">
                chevron_right
              </span>
              <span className="text-primary dark:text-primary-fixed font-medium">
                Editorial Desk
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            <div className="relative group hidden lg:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-[20px]">
                search
              </span>
              <input
                className="bg-surface-container dark:bg-dark-surface border-none focus:ring-1 focus:ring-primary py-2 pl-10 pr-4 font-label-sm w-48 xl:w-64 transition-all"
                placeholder="Search manuscripts..."
                type="text"
              />
            </div>
            <ThemeToggle />
            <button className="relative text-text-secondary hover:text-primary transition-colors">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
            </button>
          </div>
        </header>

        <div className="p-4 md:p-margin-safe max-w-container-max mx-auto space-y-gutter">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
