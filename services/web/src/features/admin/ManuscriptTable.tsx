import { useQuery } from '@tanstack/react-query'
import { fetchActiveManuscripts } from '@/lib/api/analytics'
import { Badge } from '@/components/ui/Badge'

export function ManuscriptTable() {
  const { data: manuscripts } = useQuery({
    queryKey: ['active-manuscripts'],
    queryFn: fetchActiveManuscripts,
  })

  return (
    <div className="bg-surface-card dark:bg-dark-surface border border-border-subtle dark:border-dark-border">
      <div className="p-6 md:p-8 border-b border-border-subtle dark:border-dark-border flex justify-between items-center">
        <h3 className="font-headline-md text-headline-md text-primary dark:text-primary-fixed">
          Active Manuscripts
        </h3>
        <a
          href="#"
          className="font-label-sm text-label-sm text-text-secondary hover:text-primary transition-colors"
        >
          View All
        </a>
      </div>
      <div className="divide-y divide-border-subtle dark:divide-dark-border">
        {manuscripts?.map((m) => (
          <div
            key={m.id}
            className="p-4 md:p-6 flex items-center justify-between hover:bg-surface-container/50 transition-colors gap-3"
          >
            <div className="flex items-center gap-3 md:gap-4 min-w-0">
              <div
                className={`w-8 md:w-10 h-8 md:h-10 flex items-center justify-center shrink-0 ${
                  m.status === 'published'
                    ? 'bg-primary/10 text-primary'
                    : 'bg-secondary-container/20 text-secondary'
                }`}
              >
                <span className="material-symbols-outlined">{m.icon}</span>
              </div>
              <div className="min-w-0">
                <div className="font-body-md font-medium truncate">{m.title}</div>
                <div className="font-label-sm text-label-sm text-text-secondary">
                  Last edited {m.last_edited}
                </div>
              </div>
            </div>
            <Badge variant={m.status === 'published' ? 'primary' : 'draft'}>
              {m.status === 'published' ? 'Published' : 'Draft'}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  )
}
