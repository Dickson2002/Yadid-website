import { PublicLayout } from './PublicLayout'
import { ScrollReveal } from '@/components/shared/ScrollReveal'

export function AboutPage() {
  return (
    <PublicLayout>
      <section className="py-16 md:py-section-gap">
        <div className="max-w-container-max mx-auto px-6 md:px-margin-safe">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter min-h-[70vh]">
            <ScrollReveal>
              <div className="bg-primary p-8 md:p-16 flex flex-col justify-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-[0.06] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzR2LTRoLTJ2NGgtNHYyaDR2NGgydi00aDR2LTJoLTR6bTAtMzBWMGgtMnY0aC00djJoNHY0aDJWNmg0VjRoLTR6TTYgMzR2LTRINHY0SDB2Mmg0djRoMnYtNGg0di0ySDZ6TTYgNFYwSDR2NEgwdjJoNHY0aDJWNmg0VjRINnoiLz48L2c+PC9nPjwvc3ZnPg==')]" />
                <p className="font-label-sm text-label-sm text-on-primary/70 uppercase tracking-[0.35em] mb-6 relative z-10">
                  The Vault
                </p>
                <h1 className="font-headline-lg text-headline-lg text-on-primary mb-4 relative z-10">
                  A living
                  <br />
                  <em className="italic opacity-75">archive</em>
                  <br />
                  of the soul.
                </h1>
                <p className="font-body-lg text-body-lg text-on-primary/90 max-w-sm relative z-10">
                  Vault is a personal poetry space — a place to hold what words
                  can hold, and release what only silence can carry.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="bg-surface-container dark:bg-dark-surface p-8 md:p-16 flex flex-col justify-center border border-border-subtle dark:border-dark-border">
                <div className="grid grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
                  <div>
                    <p className="font-display-xl text-display-xl-mobile text-primary leading-none mb-2">
                      12
                    </p>
                    <p className="text-[10px] md:text-label-sm text-text-secondary uppercase tracking-widest">
                      Poems Published
                    </p>
                  </div>
                  <div>
                    <p className="font-display-xl text-display-xl-mobile text-primary leading-none mb-2">
                      2
                    </p>
                    <p className="text-[10px] md:text-label-sm text-text-secondary uppercase tracking-widest">
                      Collections
                    </p>
                  </div>
                  <div>
                    <p className="font-display-xl text-display-xl-mobile text-primary leading-none mb-2">
                      12.4k
                    </p>
                    <p className="text-[10px] md:text-label-sm text-text-secondary uppercase tracking-widest">
                      Total Reads
                    </p>
                  </div>
                  <div>
                    <p className="font-display-xl text-display-xl-mobile text-primary leading-none mb-2">
                      1
                    </p>
                    <p className="text-[10px] md:text-label-sm text-text-secondary uppercase tracking-widest">
                      Voice Behind It All
                    </p>
                  </div>
                </div>

                <p className="font-body-md text-body-md text-text-secondary italic mb-6">
                  Every poem begins with a conversation. Reach out —
                  for collaborations, readings, or just to share what a line
                  meant to you.
                </p>

                <a
                  href="mailto:mbithejeddie@gmail.com"
                  className="font-nav-link text-nav-link text-primary border-b border-primary self-start pb-1 hover:opacity-80 transition-opacity"
                >
                  mbithejeddie@gmail.com
                </a>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
