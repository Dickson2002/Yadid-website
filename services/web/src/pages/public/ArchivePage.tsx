import { PublicLayout } from './PublicLayout'
import { PoemList } from '@/features/poems/PoemList'
import { ScrollReveal } from '@/components/shared/ScrollReveal'

export function ArchivePage() {
  return (
    <PublicLayout>
      <section className="max-w-container-max mx-auto px-6 md:px-margin-safe py-16 md:py-section-gap">
        <ScrollReveal>
          <div className="mb-16">
            <h1 className="font-headline-lg text-headline-lg text-text-primary dark:text-dark-text-primary mb-2">
              The Collection
            </h1>
            <p className="font-body-md text-body-md text-text-secondary">
              Every poem, in full. Browse the archive.
            </p>
          </div>
        </ScrollReveal>
        <PoemList />
      </section>
    </PublicLayout>
  )
}
