import { useState, useCallback, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useCreatePoem, useUpdatePoem, useDeletePoem, usePoemById } from '@/hooks/use-poems'
import { useCollections } from '@/hooks/use-collections'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/shared/Modal'

export function PoemEditorPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const createPoem = useCreatePoem()
  const updatePoem = useUpdatePoem()
  const deletePoem = useDeletePoem()
  const { data: existingPoem } = usePoemById(id ?? '')
  const { data: collections } = useCollections()

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [autoSlug, setAutoSlug] = useState(true)
  const [author, setAuthor] = useState('Mbithe Jeddie')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [tagsStr, setTagsStr] = useState('')
  const [collectionId, setCollectionId] = useState<string>('')
  const [status, setStatus] = useState<'draft' | 'published'>('draft')
  const [error, setError] = useState<string | null>(null)
  const [showDiscardDialog, setShowDiscardDialog] = useState(false)

  useEffect(() => {
    if (existingPoem) {
      setTitle(existingPoem.title)
      setSlug(existingPoem.slug)
      setAutoSlug(false)
      setAuthor(existingPoem.author)
      setExcerpt(existingPoem.excerpt)
      setContent(existingPoem.content)
      setDate(existingPoem.date)
      setTagsStr((existingPoem.tags ?? []).join(', '))
      setCollectionId(existingPoem.collection_id ?? '')
      setStatus(existingPoem.status === 'published' ? 'published' : 'draft')
    }
  }, [existingPoem])

  const handleTitleChange = useCallback(
    (val: string) => {
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
    },
    [autoSlug],
  )

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

    const tags = tagsStr
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    const payload = {
      title,
      slug,
      author,
      excerpt,
      content,
      date,
      tags,
      collection_id: collectionId || null,
      status,
    }

    try {
      if (isEdit && id) {
        await updatePoem.mutateAsync({ id, input: payload })
      } else {
        await createPoem.mutateAsync(payload)
      }
      navigate('/admin/manuscripts')
    } catch {
      setError(isEdit ? 'Failed to update poem.' : 'Failed to create poem.')
    }
  }

  const isPending = createPoem.isPending || updatePoem.isPending || deletePoem.isPending

  if (isEdit && !existingPoem) {
    return (
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="p-8 text-center font-body-md text-body-md text-text-secondary">
          Loading...
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div className="space-y-2">
          <h1 className="font-headline-lg text-headline-lg text-primary dark:text-primary-fixed">
            {isEdit ? 'Edit Poem' : 'New Poem'}
          </h1>
          <p className="font-body-md text-body-md text-text-secondary">
            {isEdit ? 'Edit and save changes to this poem.' : 'Draft a new literary entry.'}
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            size="md"
            onClick={() => navigate('/admin/manuscripts')}
          >
            Cancel
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="bg-error-container/10 border border-error p-6">
            <p className="font-body-md text-body-md text-error">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block font-label-sm text-label-sm text-text-secondary uppercase tracking-widest mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full bg-surface-container dark:bg-dark-surface border border-border-subtle dark:border-dark-border p-4 font-body-md text-body-md text-text-primary dark:text-dark-text-primary outline-none focus:border-primary transition-colors"
              placeholder="Poem title"
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
              placeholder="poem-slug"
              required
            />
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-text-secondary uppercase tracking-widest mb-2">
              Author
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full bg-surface-container dark:bg-dark-surface border border-border-subtle dark:border-dark-border p-4 font-body-md text-body-md text-text-primary dark:text-dark-text-primary outline-none focus:border-primary transition-colors"
              placeholder="Author name"
              required
            />
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-text-secondary uppercase tracking-widest mb-2">
              Excerpt
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              className="w-full bg-surface-container dark:bg-dark-surface border border-border-subtle dark:border-dark-border p-4 font-body-md text-body-md text-text-primary dark:text-dark-text-primary outline-none focus:border-primary transition-colors resize-y"
              placeholder="A brief excerpt..."
            />
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-text-secondary uppercase tracking-widest mb-2">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={16}
              className="w-full bg-surface-container dark:bg-dark-surface border border-border-subtle dark:border-dark-border p-4 font-body-md text-body-md text-text-primary dark:text-dark-text-primary outline-none focus:border-primary transition-colors resize-y font-mono"
              placeholder="Write the poem here..."
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block font-label-sm text-label-sm text-text-secondary uppercase tracking-widest mb-2">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-surface-container dark:bg-dark-surface border border-border-subtle dark:border-dark-border p-4 font-body-md text-body-md text-text-primary dark:text-dark-text-primary outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block font-label-sm text-label-sm text-text-secondary uppercase tracking-widest mb-2">
                Collection
              </label>
              <select
                value={collectionId}
                onChange={(e) => setCollectionId(e.target.value)}
                className="w-full bg-surface-container dark:bg-dark-surface border border-border-subtle dark:border-dark-border p-4 font-body-md text-body-md text-text-primary dark:text-dark-text-primary outline-none focus:border-primary transition-colors appearance-none"
              >
                <option value="">None</option>
                {collections?.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-text-secondary uppercase tracking-widest mb-2">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tagsStr}
              onChange={(e) => setTagsStr(e.target.value)}
              className="w-full bg-surface-container dark:bg-dark-surface border border-border-subtle dark:border-dark-border p-4 font-body-md text-body-md text-text-primary dark:text-dark-text-primary outline-none focus:border-primary transition-colors"
              placeholder="love, nature, grief"
            />
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-text-secondary uppercase tracking-widest mb-3">
              Status
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStatus('draft')}
                className={`px-6 py-3 font-label-sm text-label-sm uppercase tracking-widest border transition-colors ${
                  status === 'draft'
                    ? 'border-primary text-primary bg-primary/5'
                    : 'border-border-subtle dark:border-dark-border text-text-secondary hover:border-text-secondary'
                }`}
              >
                Draft
              </button>
              <button
                type="button"
                onClick={() => setStatus('published')}
                className={`px-6 py-3 font-label-sm text-label-sm uppercase tracking-widest border transition-colors ${
                  status === 'published'
                    ? 'border-primary text-primary bg-primary/5'
                    : 'border-border-subtle dark:border-dark-border text-text-secondary hover:border-text-secondary'
                }`}
              >
                Published
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-border-subtle dark:border-dark-border">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isPending}
          >
            {isPending ? 'Saving...' : (isEdit ? 'Update Poem' : 'Save Poem')}
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="lg"
            disabled={deletePoem.isPending}
            onClick={() => {
              if (isEdit && id) {
                setShowDiscardDialog(true)
              } else {
                navigate('/admin/manuscripts')
              }
            }}
          >
            {deletePoem.isPending ? 'Discarding...' : 'Discard'}
          </Button>
        </div>
      </form>

      <Modal open={showDiscardDialog} onClose={() => setShowDiscardDialog(false)}>
        <h2 className="font-headline-sm text-headline-sm text-text-primary dark:text-dark-text-primary mb-4">
          Discard Poem
        </h2>
        <p className="font-body-md text-body-md text-text-secondary mb-8">
          Are you sure you want to discard{' '}
          <span className="font-bold text-text-primary dark:text-dark-text-primary">
            {title}
          </span>
          ? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-4">
          <Button
            variant="secondary"
            size="md"
            onClick={() => setShowDiscardDialog(false)}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            className="bg-error hover:bg-error/80"
            disabled={deletePoem.isPending}
            onClick={async () => {
              if (id) {
                await deletePoem.mutateAsync(id)
                setShowDiscardDialog(false)
                navigate('/admin/manuscripts')
              }
            }}
          >
            {deletePoem.isPending ? 'Discarding...' : 'Delete Forever'}
          </Button>
        </div>
      </Modal>
    </div>
  )
}
