import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import type { PoemResponse } from '@/lib/api/types'

interface PoemCardProps {
  poem: PoemResponse
  index?: number
}

export function PoemCard({ poem, index = 0 }: PoemCardProps) {
  const navigate = useNavigate()

  return (
    <Card
      className="group cursor-pointer"
      onClick={() => navigate(`/poems/${poem.slug}`)}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="h-1 w-0 bg-primary group-hover:w-full transition-all duration-500 mb-6" />
      <span className="font-label-sm text-label-sm text-text-secondary block mb-2">
        {new Date(poem.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </span>
      <h4 className="font-headline-md text-headline-md text-text-primary dark:text-dark-text-primary mb-4">
        {poem.title}
      </h4>
      <p className="font-body-md text-body-md text-text-secondary line-clamp-3 mb-8">
        {poem.excerpt}
      </p>
      <div className="flex justify-between items-center pt-6 border-t border-border-subtle dark:border-dark-border">
        <span className="font-body-md text-body-md italic text-primary">
          {poem.author}
        </span>
        <span className="material-symbols-outlined text-text-secondary text-[20px]">
          bookmark_add
        </span>
      </div>
    </Card>
  )
}
