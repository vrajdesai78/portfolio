import type { RouteRecord } from 'vite-react-ssg'
import Layout from './components/Layout'

export const routes: RouteRecord[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, lazy: () => import('./pages/Home') },
      { path: 'resume', lazy: () => import('./pages/Resume') },
      { path: '*', lazy: () => import('./pages/NotFound') },
    ],
  },
]
