import type { ReactNode } from 'react'
export default function Container({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return <div className={`mx-auto w-full px-5 ${wide ? 'max-w-5xl' : 'max-w-2xl'}`}>{children}</div>
}
