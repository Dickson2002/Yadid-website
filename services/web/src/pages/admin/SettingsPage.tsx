import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/shared/Modal'
import { resetAllData } from '@/lib/api/admin'

export function SettingsPage() {
  const [showConfirm, setShowConfirm] = useState(false)
  const queryClient = useQueryClient()

  const resetMutation = useMutation({
    mutationFn: resetAllData,
    onSuccess: () => {
      queryClient.invalidateQueries()
      setShowConfirm(false)
    },
  })

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="space-y-2">
        <h1 className="font-headline-lg text-headline-lg text-primary dark:text-primary-fixed">
          Settings
        </h1>
        <p className="font-body-md text-body-md text-text-secondary">
          Manage your profile and site preferences.
        </p>
      </div>

      <div className="bg-surface-card dark:bg-dark-surface border border-border-subtle dark:border-dark-border p-6 md:p-8 space-y-8">
        <h3 className="font-headline-md text-headline-md text-primary dark:text-primary-fixed">
          Profile
        </h3>

        <div className="space-y-6">
          <Input
            id="display-name"
            label="DISPLAY NAME"
            defaultValue="Mbithe Jeddie"
          />
          <Input
            id="email"
            label="EMAIL ADDRESS"
            type="email"
            defaultValue="mbithejeddie@gmail.com"
          />
          <div>
            <label className="block font-label-sm text-label-sm text-primary mb-2">
              BIO
            </label>
            <textarea
              className="w-full bg-transparent border border-border-subtle dark:border-dark-border focus:border-primary outline-none p-4 font-body-md text-body-md transition-colors dark:text-dark-text-primary resize-none"
              rows={4}
              defaultValue="Poet and writer based in Nairobi, Kenya. Her work explores memory, identity, tenderness, and the spaces between words."
            />
          </div>
        </div>

        <div className="pt-4 border-t border-border-subtle dark:border-dark-border">
          <Button variant="primary">Save Changes</Button>
        </div>
      </div>

      <div className="bg-surface-card dark:bg-dark-surface border border-border-subtle dark:border-dark-border p-6 md:p-8 space-y-8">
        <h3 className="font-headline-md text-headline-md text-status-danger">
          Danger Zone
        </h3>
        <p className="font-body-md text-body-md text-text-secondary">
          Irreversible actions. Proceed with care.
        </p>
        <Button
          variant="secondary"
          size="sm"
          className="border-status-danger text-status-danger"
          onClick={() => setShowConfirm(true)}
        >
          Delete Archive
        </Button>
      </div>

      <Modal open={showConfirm} onClose={() => setShowConfirm(false)}>
        <h2 className="font-headline-sm text-headline-sm text-text-primary dark:text-dark-text-primary mb-4">
          Delete Archive
        </h2>
        <p className="font-body-md text-body-md text-text-secondary mb-8">
          This permanently deletes all poems, collections, activities, and
          subscribers. Your admin account will remain. This action cannot be
          undone.
        </p>
        <div className="flex justify-end gap-4">
          <Button
            variant="secondary"
            size="md"
            onClick={() => setShowConfirm(false)}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            className="bg-error hover:bg-error/80"
            disabled={resetMutation.isPending}
            onClick={() => resetMutation.mutate()}
          >
            {resetMutation.isPending ? 'Deleting...' : 'Delete Everything'}
          </Button>
        </div>
      </Modal>
    </div>
  )
}
