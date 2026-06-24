import type { RouteRecord } from 'vite-react-ssg'
import Layout from './components/Layout'
import { projectStaticPaths, postStaticPaths } from './lib/content'

export const routes: RouteRecord[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, lazy: () => import('./pages/Home') },
      { path: 'about', lazy: () => import('./pages/About') },
      { path: 'projects', lazy: () => import('./pages/Projects') },
      { path: 'projects/:slug', lazy: () => import('./pages/ProjectDetail'), getStaticPaths: projectStaticPaths },
      { path: 'writing', lazy: () => import('./pages/Writing') },
      { path: 'writing/:slug', lazy: () => import('./pages/PostDetail'), getStaticPaths: postStaticPaths },
      { path: 'resume', lazy: () => import('./pages/Resume') },
      { path: '*', lazy: () => import('./pages/NotFound') },
    ],
  },
]
