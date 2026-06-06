import { Link } from 'react-router-dom'
import { usePoems } from '@/hooks/use-poems'
import { PoemCard } from '@/components/shared/PoemCard'
import { ScrollReveal } from '@/components/shared/ScrollReveal'

export function LatestPoems() {
  const { data: poems, isLoading } = usePoems()

  return (
    <section className="bg-surface-container-low dark:bg-dark-bg py-16 md:py-section-gap">
      <div className="max-w-container-max mx-auto px-6 md:px-margin-safe">
        <ScrollReveal>
          <div className="flex justify-between items-end mb-8 md:mb-16">
            <div>
              <h3 className="font-headline-lg text-headline-lg text-text-primary dark:text-dark-text-primary mb-2">
                Latest Poems
              </h3>
              <p className="font-body-md text-body-md text-text-secondary">
                Fresh ink from the archive.
              </p>
            </div>
            <Link
              to="/poems"
              className="hidden md:block font-nav-link text-nav-link text-primary underline underline-offset-8"
            >
              View Archive
            </Link>
          </div>
        </ScrollReveal>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {[1, 2, 3].map((i) => (
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {poems?.slice(0, 3).map((poem, i) => (
              <PoemCard key={poem.id} poem={poem} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
