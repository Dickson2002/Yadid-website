import { Link } from 'react-router-dom'
import { PublicHeader } from '@/components/layout/PublicHeader'
import { PublicFooter } from '@/components/layout/PublicFooter'
import { Button } from '@/components/ui/Button'

export function NotFoundPage() {
  return (
    <>
      <PublicHeader />
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-lg mx-auto px-6 md:px-margin-safe">
          <p className="font-display-xl text-display-xl-mobile md:text-display-xl text-primary mb-4">
            404
          </p>
          <h1 className="font-headline-md text-headline-md text-text-primary dark:text-dark-text-primary mb-4">
            Page Not Found
          </h1>
          <p className="font-body-md text-body-md text-text-secondary mb-8">
            This page does not exist. Perhaps it was never written, or it
            wandered off like a half-finished line.
          </p>
          <Link to="/">
            <Button variant="primary">Return Home</Button>
          </Link>
        </div>
      </main>
      <PublicFooter />
    </>
  )
}
