import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/shared/Modal'
import { getAdminProfile, resetAllData, updateSettings } from '@/lib/api/admin'
import { useAuthStore } from '@/lib/auth-store'

export function SettingsPage() {
  const [showConfirm, setShowConfirm] = useState(false)
  const [newUsername, setNewUsername] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { data: admin, isLoading: profileLoading } = useQuery({
    queryKey: ['admin-profile'],
    queryFn: getAdminProfile,
  })

  const resetMutation = useMutation({
    mutationFn: resetAllData,
    onSuccess: () => {
      queryClient.invalidateQueries()
      setShowConfirm(false)
    },
  })

  const settingsMutation = useMutation({
    mutationFn: updateSettings,
    onSuccess: (_, vars) => {
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setNewUsername('')
      setError('')
      if (vars.password) {
        useAuthStore.getState().logout()
        navigate('/admin')
      } else {
        queryClient.invalidateQueries({ queryKey: ['admin-profile'] })
      }
    },
    onError: (err: Error) => {
      setError(err.message)
    },
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!currentPassword) {
      setError('Current password is required')
      return
    }
    if (newPassword && newPassword !== confirmPassword) {
      setError('New passwords do not match')
      return
    }
    if (newPassword && newPassword.length < 8) {
      setError('New password must be at least 8 characters')
      return
    }

    settingsMutation.mutate({
      current_password: currentPassword,
      ...(newUsername ? { username: newUsername } : {}),
      ...(newPassword ? { password: newPassword } : {}),
    })
  }

  if (profileLoading) return null

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

      <form
        onSubmit={handleSubmit}
        className="bg-surface-card dark:bg-dark-surface border border-border-subtle dark:border-dark-border p-6 md:p-8 space-y-8"
      >
        <h3 className="font-headline-md text-headline-md text-primary dark:text-primary-fixed">
          Credentials
        </h3>

        <div className="space-y-6">
          <Input
            id="current-username"
            label="USERNAME"
            defaultValue={admin?.username}
            disabled
          />
          <Input
            id="new-username"
            label="NEW USERNAME (optional)"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder="Leave blank to keep current"
          />
          <Input
            id="current-password"
            label="CURRENT PASSWORD"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <Input
            id="new-password"
            label="NEW PASSWORD (optional)"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Leave blank to keep current"
          />
          {newPassword && (
            <Input
              id="confirm-password"
              label="CONFIRM NEW PASSWORD"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={
                confirmPassword && newPassword !== confirmPassword
                  ? 'Passwords do not match'
                  : undefined
              }
            />
          )}
        </div>

        {error && (
          <p className="font-label-sm text-label-sm text-status-danger">{error}</p>
        )}

        {settingsMutation.isSuccess && !settingsMutation.variables?.password && (
          <p className="font-label-sm text-label-sm text-green-600">
            Settings saved successfully.
          </p>
        )}

        <div className="pt-4 border-t border-border-subtle dark:border-dark-border">
          <Button
            variant="primary"
            type="submit"
            disabled={settingsMutation.isPending}
          >
            {settingsMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>

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
