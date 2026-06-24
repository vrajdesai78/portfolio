import type { RouteRecord } from 'vite-react-ssg'
import Layout from './components/Layout'
import { projectStaticPaths } from './lib/content'

export const routes: RouteRecord[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, lazy: () => import('./pages/Home') },
      { path: 'about', lazy: () => import('./pages/About') },
      { path: 'projects', lazy: () => import('./pages/Projects') },
      { path: 'projects/:slug', lazy: () => import('./pages/ProjectDetail'), getStaticPaths: projectStaticPaths },
      { path: 'resume', lazy: () => import('./pages/Resume') },
      { path: '*', lazy: () => import('./pages/NotFound') },
    ],
  },
]
