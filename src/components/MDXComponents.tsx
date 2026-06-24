// src/components/MDXComponents.tsx
import type { ComponentProps } from 'react'

export const mdxComponents = {
  h2: (p: ComponentProps<'h2'>) => <h2 className="font-mono text-lg mt-8 mb-2" {...p} />,
  h3: (p: ComponentProps<'h3'>) => <h3 className="font-mono mt-6 mb-2" {...p} />,
  p: (p: ComponentProps<'p'>) => <p className="text-[15px] leading-relaxed text-muted my-3" {...p} />,
  ul: (p: ComponentProps<'ul'>) => <ul className="list-disc pl-5 my-3 text-muted space-y-1" {...p} />,
  a: (p: ComponentProps<'a'>) => <a className="text-accent hover:underline" target="_blank" rel="noopener noreferrer" {...p} />,
  code: (p: ComponentProps<'code'>) => <code className="font-mono text-sm bg-surface px-1 py-0.5 border border-border" {...p} />,
}
