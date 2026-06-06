import { useState } from 'react'
import { useCollections, useDeleteCollection } from '@/hooks/use-collections'
import { usePoems } from '@/hooks/use-poems'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/shared/Modal'
import { CollectionCreateModal } from '@/features/admin/CollectionCreateModal'

export function CollectionsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null)
  const { data: collections, isLoading: loadingCollections } = useCollections()
  const { data: poems } = usePoems()
  const deleteCollection = useDeleteCollection()

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div className="space-y-2">
          <h1 className="font-headline-lg text-headline-lg text-primary dark:text-primary-fixed">
            Collections
          </h1>
          <p className="font-body-md text-body-md text-text-secondary">
            Group your poems into thematic collections.
          </p>
        </div>
        <Button variant="primary" size="md" onClick={() => setShowCreateModal(true)}>
          New Collection
        </Button>
      </div>

      {loadingCollections ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-surface-card dark:bg-dark-surface p-8 md:p-10 border border-border-subtle dark:border-dark-border animate-pulse"
            >
              <div className="h-6 bg-surface-container dark:bg-dark-border rounded w-1/2 mb-4" />
              <div className="h-4 bg-surface-container dark:bg-dark-border rounded w-3/4 mb-6" />
              <div className="h-4 bg-surface-container dark:bg-dark-border rounded w-1/4" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          {collections?.map((collection) => {
            const collectionPoems = poems?.filter(
              (p) => p.collection_id === collection.id,
            )
            return (
              <Card key={collection.id} hover>
                <h3 className="font-headline-md text-headline-md text-text-primary dark:text-dark-text-primary mb-2">
                  {collection.title}
                </h3>
                <p className="font-body-md text-body-md text-text-secondary mb-6">
                  {collection.description}
                </p>
                <div className="flex items-center justify-between pt-6 border-t border-border-subtle dark:border-dark-border">
                  <span className="font-label-sm text-label-sm text-text-secondary">
                    {collectionPoems?.length ?? 0} poems
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setDeleteTarget({ id: collection.id, title: collection.title })}
                      className="font-nav-link text-nav-link text-error hover:text-text-secondary transition-colors"
                    >
                      Delete
                    </button>
                    <span className="font-nav-link text-nav-link text-primary flex items-center gap-1">
                      View Collection
                      <span className="material-symbols-outlined text-[18px]">
                        arrow_forward
                      </span>
                    </span>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      <CollectionCreateModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      <Modal
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
      >
        <h2 className="font-headline-sm text-headline-sm text-text-primary dark:text-dark-text-primary mb-4">
          Delete Collection
        </h2>
        <p className="font-body-md text-body-md text-text-secondary mb-8">
          Are you sure you want to delete{' '}
          <span className="font-bold text-text-primary dark:text-dark-text-primary">
            {deleteTarget?.title}
          </span>
          ? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-4">
          <Button variant="secondary" size="md" onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            className="bg-error hover:bg-error/80"
            disabled={deleteCollection.isPending}
            onClick={() => {
              if (deleteTarget) {
                deleteCollection.mutate(deleteTarget.id, {
                  onSuccess: () => setDeleteTarget(null),
                })
              }
            }}
          >
            {deleteCollection.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </Modal>
    </div>
  )
}
