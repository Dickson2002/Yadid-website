import { usePoems } from '@/hooks/use-poems'
import { PoemCard } from '@/components/shared/PoemCard'

export function PoemList() {
  const { data: poems, isLoading } = usePoems()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-surface-card dark:bg-dark-surface p-10 border border-border-subtle dark:border-dark-border animate-pulse"
          >
            <div className="h-4 bg-surface-container dark:bg-dark-border rounded w-1/3 mb-6" />
            <div className="h-8 bg-surface-container dark:bg-dark-border rounded w-2/3 mb-4" />
            <div className="h-20 bg-surface-container dark:bg-dark-border rounded mb-8" />
          </div>
        ))}
      </div>
    )
  }

  if (!poems?.length) {
    return (
      <div className="text-center py-section-gap">
        <p className="font-body-lg text-body-lg text-text-secondary">
          No poems published yet. Check back soon.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
      {poems.map((poem, i) => (
        <PoemCard key={poem.id} poem={poem} index={i} />
      ))}
    </div>
  )
}
