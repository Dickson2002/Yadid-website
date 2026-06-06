import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ScrollReveal } from '@/components/shared/ScrollReveal'
import { subscribeToNewsletter } from '@/lib/api/subscribers'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    setErrorMsg('')
    try {
      await subscribeToNewsletter(email)
      setStatus('success')
      setEmail('')
    } catch (err: unknown) {
      setStatus('error')
      if (err && typeof err === 'object' && 'status' in err && err.status === 409) {
        setErrorMsg('This email is already subscribed.')
      } else {
        setErrorMsg('Something went wrong. Try again later.')
      }
    }
  }

  return (
    <section className="py-16 md:py-section-gap bg-background dark:bg-dark-bg">
      <ScrollReveal>
        <div className="max-w-4xl mx-auto px-6 md:px-margin-safe bg-surface-container dark:bg-dark-surface p-8 md:p-16 border border-border-subtle dark:border-dark-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="font-headline-md text-headline-md text-text-primary dark:text-dark-text-primary mb-4">
                The Weekly Verse
              </h3>
              <p className="font-body-md text-body-md text-text-secondary">
                A curated selection of the week&apos;s best poems, author
                interviews, and literary essays delivered to your inbox.
              </p>
            </div>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <Input
                id="email"
                label="EMAIL ADDRESS"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === 'loading'}
              />
              {status === 'success' && (
                <p className="font-label-sm text-label-sm text-primary">
                  Subscribed! Welcome to The Weekly Verse.
                </p>
              )}
              {status === 'error' && (
                <p className="font-label-sm text-label-sm text-error">
                  {errorMsg}
                </p>
              )}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={status === 'loading' || status === 'success'}
              >
                {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </form>
          </div>
        </div>
      </ScrollReveal>
    </section>
  )
}
