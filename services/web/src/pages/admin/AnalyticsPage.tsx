import { useQuery } from '@tanstack/react-query'
import { fetchMonthlyGrowth, fetchDashboardStats } from '@/lib/api/analytics'
import { fetchSubscribers } from '@/lib/api/subscribers'
import { StatCard } from '@/components/ui/StatCard'

export function AnalyticsPage() {
  const { data: growth } = useQuery({
    queryKey: ['monthly-growth'],
    queryFn: fetchMonthlyGrowth,
  })
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: fetchDashboardStats,
  })
  const { data: subscribers } = useQuery({
    queryKey: ['subscribers'],
    queryFn: fetchSubscribers,
  })

  const maxCount = growth ? Math.max(...growth.map((g) => g.count)) : 0

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-headline-lg text-headline-lg text-primary dark:text-primary-fixed">
          Analytics
        </h1>
        <p className="font-body-md text-body-md text-text-secondary">
          Track readership, growth, and engagement over time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Total Views"
          value={stats ? (stats.total_views >= 1000 ? `${(stats.total_views / 1000).toFixed(1)}k` : String(stats.total_views)) : '-'}
          trend="up"
          sub={`${stats?.views_change ?? 0}% increase`}
        />
        <StatCard
          label="Total Poems"
          value={String(stats?.total_poems ?? '-')}
        />
        <StatCard
          label="Subscribers"
          value={String(stats?.subscribers ?? '-')}
        />
      </div>

      <div className="bg-surface-card dark:bg-dark-surface border border-border-subtle dark:border-dark-border p-6 md:p-8">
        <h3 className="font-headline-md text-headline-md mb-8 md:mb-10">
          Publication Growth
        </h3>

        {growth ? (
          <div className="relative h-[200px] md:h-[300px] w-full flex items-end justify-between overflow-hidden">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="border-b border-border-subtle/30 dark:border-dark-border/30 w-full h-0"
                />
              ))}
            </div>

            <div className="relative z-10 flex-1 flex items-end justify-around h-full">
              {growth.map((g) => (
                <div
                  key={g.month}
                  className="w-8 sm:w-12 bg-primary/20 flex flex-col items-center justify-end transition-all duration-500 hover:bg-primary/40"
                  style={{ height: `${(g.count / maxCount) * 100}%` }}
                >
                  <span className="text-[10px] sm:text-label-sm text-primary mb-1">
                    {g.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-[200px] md:h-[300px] flex items-center justify-center font-body-md text-text-secondary">
            Loading...
          </div>
        )}

        <div className="flex justify-between mt-4 md:mt-6 px-1 md:px-2 overflow-x-auto">
          {growth?.map((g) => (
            <span
              key={g.month}
              className="text-[10px] md:text-label-sm text-text-secondary whitespace-nowrap px-1"
            >
              {g.month}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-surface-card dark:bg-dark-surface border border-border-subtle dark:border-dark-border p-6 md:p-8">
        <h3 className="font-headline-md text-headline-md mb-8 md:mb-10">
          Newsletter Subscribers
        </h3>

        {subscribers && subscribers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border-subtle dark:border-dark-border">
                  <th className="font-label-sm text-label-sm text-text-secondary uppercase tracking-widest pb-3 pr-6">
                    Email
                  </th>
                  <th className="font-label-sm text-label-sm text-text-secondary uppercase tracking-widest pb-3">
                    Subscribed On
                  </th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b border-border-subtle/50 dark:border-dark-border/50"
                  >
                    <td className="font-body-md text-body-md text-text-primary dark:text-dark-text-primary py-4 pr-6">
                      {s.email}
                    </td>
                    <td className="font-body-md text-body-md text-text-secondary py-4">
                      {new Date(s.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="font-body-md text-body-md text-text-secondary">
            No subscribers yet.
          </p>
        )}
      </div>
    </div>
  )
}
