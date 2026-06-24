import { Outlet } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import SkipLink from './SkipLink'
import Header from './Header'
import Footer from './Footer'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <SkipLink />
      <Header />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      {import.meta.env.PROD && <Analytics />}
    </div>
  )
}
