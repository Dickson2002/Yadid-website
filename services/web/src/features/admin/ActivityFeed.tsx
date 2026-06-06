import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchActivityFeed } from '@/lib/api/analytics'

const dotColors: Record<string, string> = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  tertiary: 'bg-tertiary',
  muted: 'bg-border-subtle',
}

export function ActivityFeed() {
  const navigate = useNavigate()
  const { data: activities } = useQuery({
    queryKey: ['activity-feed'],
    queryFn: fetchActivityFeed,
  })

  return (
    <div className="bg-surface-card dark:bg-dark-surface border border-border-subtle dark:border-dark-border p-6 md:p-8">
      <h3 className="font-headline-md text-headline-md text-primary dark:text-primary-fixed mb-6 md:mb-8">
        Journal Log
      </h3>
      <div className="space-y-6 md:space-y-8 relative">
        <div className="absolute left-3 top-2 bottom-2 w-[1px] bg-border-subtle dark:bg-dark-border" />
        {activities?.map((a) => (
          <div key={a.id} className="relative pl-10">
            <div
              className={`absolute left-[6px] top-2 w-3 h-3 rounded-full ${dotColors[a.type]} ring-4 ring-white dark:ring-dark-surface`}
            />
            <div className="font-label-sm text-label-sm text-text-secondary mb-1">
              {a.timestamp}
            </div>
            <div
              className="font-body-md text-body-md"
              dangerouslySetInnerHTML={{ __html: a.message }}
            />
          </div>
        ))}
      </div>
      <button
        onClick={() => navigate('/admin/analytics')}
        className="w-full mt-10 py-3 border-t border-border-subtle dark:border-dark-border font-label-sm text-label-sm text-text-secondary hover:text-primary transition-colors flex items-center justify-center gap-2"
      >
        View Full Archive Log
        <span className="material-symbols-outlined text-[18px]">
          arrow_forward
        </span>
      </button>
    </div>
  )
}
