import { describe, it, expect, beforeEach } from 'vitest'
import { useThemeStore } from '@/hooks/use-theme'

describe('useThemeStore', () => {
  beforeEach(() => {
    useThemeStore.setState({ isDark: false })
    document.documentElement.classList.remove('dark')
  })

  it('starts with light mode', () => {
    const { isDark } = useThemeStore.getState()
    expect(isDark).toBe(false)
  })

  it('toggles to dark mode', () => {
    useThemeStore.getState().toggle()
    const { isDark } = useThemeStore.getState()
    expect(isDark).toBe(true)
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('toggles back to light mode', () => {
    useThemeStore.getState().toggle()
    useThemeStore.getState().toggle()
    const { isDark } = useThemeStore.getState()
    expect(isDark).toBe(false)
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })
})
