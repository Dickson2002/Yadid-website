import { ScrollReveal } from '@/components/shared/ScrollReveal'

export function QuoteSection() {
  return (
    <section className="py-16 md:py-section-gap relative overflow-hidden bg-background dark:bg-dark-bg">
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none flex items-center justify-center">
        <span className="text-[200px] md:text-[400px] font-display-xl text-primary select-none">
          &ldquo;
        </span>
      </div>
      <ScrollReveal>
        <div className="max-w-3xl mx-auto px-6 md:px-margin-safe text-center">
          <h2 className="font-headline-lg text-headline-lg text-text-primary dark:text-dark-text-primary italic mb-8 leading-tight">
            &ldquo;Poetry is the spontaneous overflow of powerful feelings: it
            takes its origin from emotion recollected in tranquillity.&rdquo;
          </h2>
          <div className="w-12 h-px bg-primary mx-auto mb-6" />
          <p className="font-label-sm text-label-sm text-primary uppercase tracking-[0.3em]">
            William Wordsworth
          </p>
        </div>
      </ScrollReveal>
    </section>
  )
}
