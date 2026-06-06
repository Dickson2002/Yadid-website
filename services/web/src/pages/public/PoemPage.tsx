import { useParams } from 'react-router-dom'
import { PoemView } from '@/features/poems/PoemView'
import { PublicHeader } from '@/components/layout/PublicHeader'
import { PublicFooter } from '@/components/layout/PublicFooter'

export function PoemPage() {
  const { slug } = useParams<{ slug: string }>()

  return (
    <>
      <PublicHeader />
      <main className="pt-24 min-h-screen">
        {slug ? (
          <PoemView slug={slug} />
        ) : (
          <div className="max-w-3xl mx-auto px-6 md:px-margin-safe py-16 md:py-section-gap text-center">
            <p className="font-body-lg text-body-lg text-text-secondary">
              No poem specified.
            </p>
          </div>
        )}
      </main>
      <PublicFooter />
    </>
  )
}
