import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/lib/auth-store'
import { login } from '@/lib/api/auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { useThemeStore } from '@/hooks/use-theme'

export function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const loginStore = useAuthStore((s) => s.login)
  const navigate = useNavigate()
  const isDark = useThemeStore((s) => s.isDark)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await login(username, password)
      loginStore(res.access_token, res.refresh_token)
      navigate('/admin')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface dark:bg-dark-bg flex items-center justify-center px-4 md:px-margin-safe">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        <div className="mb-8 md:mb-12 text-center">
          <h1 className="font-headline-lg text-headline-lg text-primary dark:text-primary-fixed mb-2">
            Vault
          </h1>
          <p className="font-body-md text-body-md text-text-secondary">
            Editorial Desk — Sign In
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-surface-card dark:bg-dark-surface border border-border-subtle dark:border-dark-border p-8 md:p-10 space-y-6"
        >
          {error && (
            <div className="font-label-sm text-label-sm text-status-danger bg-status-danger/10 px-4 py-3">
              {error}
            </div>
          )}

          <Input
            id="username"
            label="USERNAME"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="admin"
            required
          />

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block font-label-sm text-label-sm text-primary"
            >
              PASSWORD
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-transparent border-b border-border-subtle dark:border-dark-border focus:border-primary outline-none py-2 font-body-md text-body-md placeholder:text-text-secondary/50 dark:text-dark-text-primary transition-colors pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-text-secondary hover:text-primary transition-colors"
                tabIndex={-1}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  )
}
