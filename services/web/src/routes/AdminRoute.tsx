import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/lib/auth-store'

export function AdminRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return <Outlet />
}
