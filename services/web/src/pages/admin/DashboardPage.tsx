import { useNavigate } from 'react-router-dom'
import { DashboardGrid } from '@/features/admin/DashboardGrid'
import { GrowthChart } from '@/features/admin/GrowthChart'
import { ManuscriptTable } from '@/features/admin/ManuscriptTable'
import { ActivityFeed } from '@/features/admin/ActivityFeed'
import { Button } from '@/components/ui/Button'
import { exportLedger } from '@/lib/api/analytics'

function handleExportLedger() {
  const btn = document.activeElement as HTMLButtonElement | null
  if (btn) btn.disabled = true
  exportLedger()
    .then((csv) => {
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const today = new Date().toISOString().slice(0, 10)
      a.download = `ledger-${today}.csv`
      a.click()
      URL.revokeObjectURL(url)
    })
    .finally(() => {
      if (btn) btn.disabled = false
    })
}

export function DashboardPage() {
  const navigate = useNavigate()
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div className="space-y-2">
          <h1 className="font-headline-lg text-headline-lg text-primary dark:text-primary-fixed">
            The Desk
          </h1>
          <p className="font-body-md text-body-md text-text-secondary max-w-md">
            Overview of your literary contributions and archive performance for
            the current seasonal cycle.
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="secondary" size="sm" onClick={handleExportLedger}>
            Export Ledger
          </Button>
        </div>
      </div>

      <DashboardGrid />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        <div className="lg:col-span-2 space-y-6">
          <GrowthChart />
          <ManuscriptTable />
        </div>
        <div className="space-y-gutter">
          <div className="bg-primary dark:bg-primary-container p-8 text-on-primary dark:text-on-primary-container relative overflow-hidden group">
            <div className="absolute -right-10 -bottom-10 opacity-10 rotate-12 transition-transform duration-700 group-hover:rotate-0">
              <span className="material-symbols-outlined text-[200px]">
                auto_stories
              </span>
            </div>
            <h3 className="font-headline-md text-headline-md mb-2 relative z-10">
              Capture a Spark
            </h3>
            <p className="font-label-sm text-label-sm opacity-80 mb-8 relative z-10 uppercase tracking-widest">
              Immediate Archive Entry
            </p>
            <Button
              variant="primary"
              size="lg"
              className="w-full bg-white dark:bg-dark-surface text-primary dark:text-primary-fixed hover:bg-white/90"
              onClick={() => navigate('/admin/manuscripts/new')}
            >
              Create New Poem
            </Button>
          </div>
          <ActivityFeed />
        </div>
      </div>
    </>
  )
}
