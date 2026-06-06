import { useState } from 'react'
import { Modal } from '@/components/shared/Modal'
import { Button } from '@/components/ui/Button'
import { useCreateCollection } from '@/hooks/use-collections'

interface CollectionCreateModalProps {
  open: boolean
  onClose: () => void
}

export function CollectionCreateModal({
  open,
  onClose,
}: CollectionCreateModalProps) {
  const createCollection = useCreateCollection()
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [autoSlug, setAutoSlug] = useState(true)
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleTitleChange = (val: string) => {
    setTitle(val)
    if (autoSlug) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim() || '',
      )
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!title.trim()) {
      setError('Title is required')
      return
    }
    if (!slug.trim()) {
      setError('Slug is required')
      return
    }

    try {
      await createCollection.mutateAsync({
        title,
        slug,
        description,
      })
      setTitle('')
      setSlug('')
      setDescription('')
      setAutoSlug(true)
      onClose()
    } catch {
      setError('Failed to create collection.')
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="font-headline-md text-headline-md text-primary dark:text-primary-fixed mb-2">
        New Collection
      </h2>
      <p className="font-body-md text-body-md text-text-secondary mb-8">
        Group poems into a thematic collection.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-error-container/10 border border-error p-4">
            <p className="font-body-md text-body-md text-error">{error}</p>
          </div>
        )}

        <div>
          <label className="block font-label-sm text-label-sm text-text-secondary uppercase tracking-widest mb-2">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full bg-surface-container dark:bg-dark-surface border border-border-subtle dark:border-dark-border p-4 font-body-md text-body-md text-text-primary dark:text-dark-text-primary outline-none focus:border-primary transition-colors"
            placeholder="Collection title"
            required
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="font-label-sm text-label-sm text-text-secondary uppercase tracking-widest">
              Slug
            </label>
            <button
              type="button"
              onClick={() => setAutoSlug(!autoSlug)}
              className={`font-label-sm text-label-sm transition-colors ${
                autoSlug
                  ? 'text-primary'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {autoSlug ? 'Auto' : 'Manual'}
            </button>
          </div>
          <input
            type="text"
            value={slug}
            onChange={(e) => {
              setAutoSlug(false)
              setSlug(e.target.value)
            }}
            className="w-full bg-surface-container dark:bg-dark-surface border border-border-subtle dark:border-dark-border p-4 font-body-md text-body-md text-text-primary dark:text-dark-text-primary outline-none focus:border-primary transition-colors"
            placeholder="collection-slug"
            required
          />
        </div>

        <div>
          <label className="block font-label-sm text-label-sm text-text-secondary uppercase tracking-widest mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full bg-surface-container dark:bg-dark-surface border border-border-subtle dark:border-dark-border p-4 font-body-md text-body-md text-text-primary dark:text-dark-text-primary outline-none focus:border-primary transition-colors resize-y"
            placeholder="A brief description of this collection..."
          />
        </div>

        <div className="flex gap-3 pt-4 border-t border-border-subtle dark:border-dark-border">
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={createCollection.isPending}
          >
            {createCollection.isPending ? 'Creating...' : 'Create Collection'}
          </Button>
          <Button type="button" variant="secondary" size="md" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  )
}
