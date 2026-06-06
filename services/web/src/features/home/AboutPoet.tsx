import { ScrollReveal } from '@/components/shared/ScrollReveal'

export function AboutPoet() {
  return (
    <section className="bg-surface-container-high dark:bg-dark-surface py-16 md:py-section-gap">
      <div className="max-w-container-max mx-auto px-6 md:px-margin-safe">
        <ScrollReveal>
          <h3 className="font-headline-lg text-headline-lg text-text-primary dark:text-dark-text-primary mb-8 md:mb-16">
            About the Poet
          </h3>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter items-center">
          <ScrollReveal>
            <div className="space-y-6">
              <p className="font-body-lg text-body-lg text-text-primary dark:text-dark-text-primary leading-relaxed">
                Every poem is an entry&mdash;a witness to the quiet moments,
                the deep emotions, and the truths that shape a life.
              </p>
              <p className="font-body-md text-body-md text-text-secondary leading-relaxed">
                Mbithe Jeddie is a poet and writer based in Nairobi, Kenya. Her
                work explores memory, identity, tenderness, and the spaces
                between words. Vault is her living archive&mdash;a digital
                sanctuary where language finds its breath and meaning finds its
                home.
              </p>
              <p className="font-body-md text-body-md text-text-secondary leading-relaxed">
                Her poetry has been described as quiet but commanding,
                personal yet universal&mdash;each piece an invitation to pause,
                reflect, and feel.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <div className="aspect-[3/4] bg-surface-container dark:bg-dark-surface border border-border-subtle dark:border-dark-border flex items-center justify-center">
              <div className="text-center p-12">
                <span className="material-symbols-outlined text-[80px] text-primary/30">
                  person
                </span>
                <p className="font-label-sm text-label-sm text-text-secondary mt-4">
                  Portrait placeholder
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
