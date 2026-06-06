import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { ScrollReveal } from '@/components/shared/ScrollReveal'

export function Hero() {
  return (
    <section className="max-w-container-max mx-auto px-6 md:px-margin-safe py-16 md:py-section-gap grid grid-cols-1 md:grid-cols-12 gap-gutter items-center min-h-0 md:min-h-[819px]">
      <div className="md:col-span-7">
        <ScrollReveal>
          <div className="bg-primary-fixed dark:bg-on-primary-fixed px-6 md:px-12 py-12 md:py-16">
            <h1 className="font-display-xl text-display-xl-mobile md:text-display-xl text-on-primary-fixed dark:text-primary-fixed mb-6 md:mb-8">
              Words that stay.
            </h1>
            <p className="font-body-md md:font-body-lg text-body-md md:text-body-lg text-on-primary-fixed-variant dark:text-primary-fixed-dim max-w-xl mb-8 md:mb-12">
              A quiet space for poetry that lingers — where language finds its
              breath and meaning finds its home.
            </p>
            <div className="flex flex-wrap gap-4 md:gap-6">
              <Link to="/poems">
                <Button variant="primary" size="lg">
                  Read Collection
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="secondary" size="lg">
                  About the Poet
                </Button>
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>

      <div className="md:col-span-5">
        <ScrollReveal delay={200}>
          <div className="bg-surface-container dark:bg-dark-surface p-6 md:p-12 border border-border-subtle dark:border-dark-border relative">
            <div className="absolute -top-4 -left-4 w-12 h-12 border-t border-l border-primary opacity-50" />
            <span className="font-label-sm text-label-sm text-primary uppercase mb-6 block tracking-widest">
              Featured Poem
            </span>
            <h2 className="font-headline-md text-headline-md text-text-primary dark:text-dark-text-primary mb-4 italic">
              In Quiet Words
            </h2>
            <p className="font-label-sm text-label-sm text-text-secondary mb-8">
              From the Vault
            </p>
            <div className="font-body-md text-body-md text-text-primary dark:text-dark-text-primary italic border-l-2 border-primary pl-6 mb-10 leading-relaxed">
              &ldquo;The world speaks in shadows,
              <br />
              but here, the ink is light.
              <br />
              Tracing the curve of a syllable
              <br />
              until the silence sounds right.&rdquo;
            </div>
            <Link
              to="/poems/in-quiet-words"
              className="font-nav-link text-nav-link text-primary dark:text-primary-fixed flex items-center group"
            >
              Read full poem
              <span className="material-symbols-outlined ml-2 text-[18px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
