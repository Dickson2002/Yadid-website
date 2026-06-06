import { useNavigate } from 'react-router-dom'
import { useAllPoems, useUpdatePoem } from '@/hooks/use-poems'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { PoemResponse } from '@/lib/api/types'

const iconMap: Record<string, 'article' | 'history_edu'> = {
  published: 'article',
  draft: 'history_edu',
}

export function ManuscriptsPage() {
  const navigate = useNavigate()
  const { data: poems, isLoading } = useAllPoems()
  const updatePoem = useUpdatePoem()

  const handleStatusToggle = (
    e: React.MouseEvent,
    poem: PoemResponse,
  ) => {
    e.stopPropagation()
    e.preventDefault()
    const newStatus = poem.status === 'published' ? 'draft' : 'published'
    updatePoem.mutate({ id: poem.id, input: { status: newStatus } })
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div className="space-y-2">
          <h1 className="font-headline-lg text-headline-lg text-primary dark:text-primary-fixed">
            Manuscripts
          </h1>
          <p className="font-body-md text-body-md text-text-secondary">
            Manage your poems — write, edit, publish, or archive.
          </p>
        </div>
        <Button variant="primary" size="md" onClick={() => navigate('/admin/manuscripts/new')}>
          New Poem
        </Button>
      </div>

      {isLoading ? (
        <div className="p-8 text-center font-body-md text-body-md text-text-secondary bg-surface-card dark:bg-dark-surface border border-border-subtle dark:border-dark-border">
          Loading...
        </div>
      ) : (
        <div className="bg-surface-card dark:bg-dark-surface border border-border-subtle dark:border-dark-border">
          {/* Desktop header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-4 border-b border-border-subtle dark:border-dark-border font-label-sm text-label-sm text-text-secondary uppercase tracking-widest">
            <div className="col-span-5">Title</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-3">Date</div>
            <div className="col-span-2 text-right">Views</div>
          </div>

          <div className="divide-y divide-border-subtle dark:divide-dark-border">
            {poems?.map((poem) => (
              <div
                key={poem.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 px-6 md:px-8 py-5 items-center hover:bg-surface-container/50 transition-colors cursor-pointer"
                onClick={() => navigate(`/admin/manuscripts/${poem.id}/edit`)}
              >
                {/* Desktop layout */}
                <div className="hidden md:flex col-span-5 items-center gap-4">
                  <div
                    className={`w-10 h-10 flex items-center justify-center ${
                      poem.status === 'published'
                        ? 'bg-primary/10 text-primary'
                        : 'bg-secondary-container/20 text-secondary'
                    }`}
                  >
                    <span className="material-symbols-outlined">
                      {iconMap[poem.status]}
                    </span>
                  </div>
                  <span className="font-body-md font-medium truncate">{poem.title}</span>
                </div>
                <div className="hidden md:block col-span-2">
                  <span
                    className="inline-block"
                    onClick={(e) => handleStatusToggle(e, poem)}
                  >
                    <Badge
                      variant={poem.status === 'published' ? 'primary' : 'draft'}
                      className="cursor-pointer"
                    >
                      {poem.status === 'published' ? 'Published' : 'Draft'}
                    </Badge>
                  </span>
                </div>
                <div className="hidden md:block col-span-3 font-label-sm text-label-sm text-text-secondary">
                  {new Date(poem.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
                <div className="hidden md:block col-span-2 text-right font-label-sm text-label-sm text-text-secondary">
                  {poem.views.toLocaleString()}
                </div>

                {/* Mobile card layout */}
                <div className="flex md:hidden items-center gap-4">
                  <div
                    className={`w-10 h-10 flex items-center justify-center shrink-0 ${
                      poem.status === 'published'
                        ? 'bg-primary/10 text-primary'
                        : 'bg-secondary-container/20 text-secondary'
                    }`}
                  >
                    <span className="material-symbols-outlined">
                      {iconMap[poem.status]}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-body-md font-medium truncate">{poem.title}</div>
                    <div className="font-label-sm text-label-sm text-text-secondary mt-1">
                      {new Date(poem.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      onClick={(e) => handleStatusToggle(e, poem)}
                    >
                      <Badge
                        variant={poem.status === 'published' ? 'primary' : 'draft'}
                        className="cursor-pointer"
                      >
                        {poem.status === 'published' ? 'Published' : 'Draft'}
                      </Badge>
                    </span>
                    <span className="material-symbols-outlined text-text-secondary">
                      chevron_right
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
