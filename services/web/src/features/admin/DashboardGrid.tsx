import { StatCard } from '@/components/ui/StatCard'
import {
  fetchDashboardStats,
} from '@/lib/api/analytics'
import { useQuery } from '@tanstack/react-query'

export function DashboardGrid() {
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: fetchDashboardStats,
  })

  if (!stats) return null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <StatCard
        label="Total Poems"
        value={String(stats.total_poems)}
        sub={`+${stats.published} published`}
        progress={70}
      />
      <StatCard
        label="Published"
        value={String(stats.published)}
        sub="Active"
        icon={
          <>
            <span className="material-symbols-outlined text-[14px] text-primary">
              check_circle
            </span>
            <span className="text-[10px] text-text-secondary">
              Archived &amp; Live
            </span>
          </>
        }
      />
      <StatCard
        label="Drafts"
        value={String(stats.drafts)}
        sub="Pending"
        icon={
          <>
            <span className="material-symbols-outlined text-[14px] text-tertiary">
              edit_note
            </span>
            <span className="text-[10px] text-text-secondary">In revision</span>
          </>
        }
      />
      <StatCard
        label="Total Views"
        value={stats.total_views >= 1000 ? `${(stats.total_views / 1000).toFixed(1)}k` : String(stats.total_views)}
        icon={
          <>
            <span className="material-symbols-outlined text-[14px] text-primary">
              trending_up
            </span>
            <span className="text-[10px] text-text-secondary">
              {stats.views_change}% increase
            </span>
          </>
        }
      />
      <StatCard
        label="Subscribers"
        value={String(stats.subscribers)}
        icon={
          <>
            <span className="material-symbols-outlined text-[14px] text-primary">
              group
            </span>
            <span className="text-[10px] text-text-secondary">
              Direct readers
            </span>
          </>
        }
      />
    </div>
  )
}
