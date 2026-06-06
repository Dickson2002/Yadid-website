import { createBrowserRouter } from 'react-router-dom'
import { HomePage } from '@/pages/public/HomePage'
import { PoemPage } from '@/pages/public/PoemPage'
import { ArchivePage } from '@/pages/public/ArchivePage'
import { AboutPage } from '@/pages/public/AboutPage'
import { NotFoundPage } from '@/pages/public/NotFoundPage'
import { DashboardPage } from '@/pages/admin/DashboardPage'
import { ManuscriptsPage } from '@/pages/admin/ManuscriptsPage'
import { PoemEditorPage } from '@/pages/admin/PoemEditorPage'
import { CollectionsPage } from '@/pages/admin/CollectionsPage'
import { AnalyticsPage } from '@/pages/admin/AnalyticsPage'
import { SettingsPage } from '@/pages/admin/SettingsPage'
import { LoginPage } from '@/pages/admin/LoginPage'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { AdminRoute } from './AdminRoute'

export const router = createBrowserRouter([
  {
    path: '/',
    children: [
      { index: true, element: <HomePage /> },
      { path: 'poems', element: <ArchivePage /> },
      { path: 'poems/:slug', element: <PoemPage /> },
      { path: 'about', element: <AboutPage /> },
    ],
    errorElement: <NotFoundPage />,
  },
  {
    path: '/admin/login',
    element: <LoginPage />,
  },
  {
    path: '/admin',
    element: <AdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'manuscripts', element: <ManuscriptsPage /> },
          { path: 'manuscripts/new', element: <PoemEditorPage /> },
          { path: 'manuscripts/:id/edit', element: <PoemEditorPage /> },
          { path: 'collections', element: <CollectionsPage /> },
          { path: 'analytics', element: <AnalyticsPage /> },
          { path: 'settings', element: <SettingsPage /> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
