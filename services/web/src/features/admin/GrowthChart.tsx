import { useQuery } from '@tanstack/react-query'
import { fetchMonthlyGrowth } from '@/lib/api/analytics'
import { Select } from '@/components/ui/Select'

export function GrowthChart() {
  const { data: growth } = useQuery({
    queryKey: ['monthly-growth'],
    queryFn: fetchMonthlyGrowth,
  })

  if (!growth) return null

  const maxCount = Math.max(...growth.map((g) => g.count))

  return (
    <div className="bg-surface-card dark:bg-dark-surface border border-border-subtle dark:border-dark-border p-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-10">
        <div>
          <h3 className="font-headline-md text-headline-md">
            Publication Growth
          </h3>
          <p className="font-label-sm text-label-sm text-text-secondary uppercase tracking-widest">
            Last 6 Months
          </p>
        </div>
        <Select>
          <option>Monthly View</option>
          <option>Weekly View</option>
        </Select>
      </div>

      <div className="relative h-[200px] sm:h-[300px] w-full mt-8 flex items-end justify-between overflow-hidden">
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="border-b border-border-subtle/30 dark:border-dark-border/30 w-full h-0"
            />
          ))}
        </div>

        <div className="relative z-10 flex-1 flex items-end justify-around h-full">
          {growth.map((g) => {
            const height = (g.count / maxCount) * 100
            return (
              <div
                key={g.month}
                className="w-[1px] bg-primary relative transition-all duration-500 hover:scale-y-105"
                style={{ height: `${height}%` }}
              >
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rounded-full" />
                <div className="absolute -bottom-6 sm:-bottom-8 left-1/2 -translate-x-1/2 text-[10px] sm:text-label-sm text-text-secondary whitespace-nowrap">
                  {g.month}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
