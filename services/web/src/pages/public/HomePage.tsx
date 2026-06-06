import { PublicLayout } from './PublicLayout'
import { Hero } from '@/features/home/Hero'
import { LatestPoems } from '@/features/home/LatestPoems'
import { QuoteSection } from '@/features/home/QuoteSection'
import { AboutPoet } from '@/features/home/AboutPoet'
import { Newsletter } from '@/features/home/Newsletter'

export function HomePage() {
  return (
    <PublicLayout>
      <Hero />
      <LatestPoems />
      <QuoteSection />
      <AboutPoet />
      <Newsletter />
    </PublicLayout>
  )
}
