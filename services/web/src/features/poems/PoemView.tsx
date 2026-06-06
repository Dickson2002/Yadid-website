import { useEffect } from 'react'
import { usePoemBySlug } from '@/hooks/use-poems'
import { recordPoemView } from '@/lib/api/poems'
import { ScrollReveal } from '@/components/shared/ScrollReveal'
import { Button } from '@/components/ui/Button'
import { useNavigate, Link } from 'react-router-dom'

interface PoemViewProps {
  slug: string
}

export function PoemView({ slug }: PoemViewProps) {
  const { data: poem, isLoading, error } = usePoemBySlug(slug)
  const navigate = useNavigate()

  useEffect(() => {
    if (poem) {
      recordPoemView(slug).catch(() => {})
    }
  }, [slug, poem])

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-6 md:px-margin-safe py-16 md:py-section-gap">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-surface-container dark:bg-dark-border rounded w-1/3" />
          <div className="h-12 bg-surface-container dark:bg-dark-border rounded w-2/3" />
          <div className="h-6 bg-surface-container dark:bg-dark-border rounded w-1/4" />
          <div className="h-64 bg-surface-container dark:bg-dark-border rounded" />
        </div>
      </div>
    )
  }

  if (error || !poem) {
    return (
      <div className="max-w-3xl mx-auto px-6 md:px-margin-safe py-16 md:py-section-gap text-center">
        <h2 className="font-headline-lg text-headline-lg text-text-primary mb-4">
          Poem not found
        </h2>
        <p className="font-body-md text-body-md text-text-secondary mb-8">
          This poem may have been removed or doesn&apos;t exist.
        </p>
        <Button variant="primary" onClick={() => navigate('/poems')}>
          Back to Archive
        </Button>
      </div>
    )
  }

  return (
    <article className="max-w-3xl mx-auto px-6 md:px-margin-safe py-16 md:py-section-gap">
      <ScrollReveal>
        <Link
          to="/poems"
          className="font-nav-link text-nav-link text-text-secondary hover:text-primary transition-colors inline-flex items-center gap-2 mb-12"
        >
          <span className="material-symbols-outlined text-[18px]">
            arrow_back
          </span>
          Back to Archive
        </Link>

        <header className="mb-16">
          <div className="flex flex-wrap gap-2 mb-6">
            {poem.tags.map((tag) => (
              <span
                key={tag}
                className="font-label-sm text-label-sm text-primary bg-primary/10 px-3 py-1"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="font-headline-lg text-headline-lg text-text-primary dark:text-dark-text-primary mb-4">
            {poem.title}
          </h1>
          <p className="font-body-md text-body-md italic text-primary mb-2">
            {poem.author}
          </p>
          <time className="font-label-sm text-label-sm text-text-secondary">
            {new Date(poem.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </header>

        <div className="font-body-lg text-body-lg text-text-primary dark:text-dark-text-primary leading-relaxed whitespace-pre-line border-t border-border-subtle dark:border-dark-border pt-12">
          {poem.content}
        </div>
      </ScrollReveal>
    </article>
  )
}
