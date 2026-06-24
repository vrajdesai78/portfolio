import { useParams, Link } from 'react-router-dom'
import type { MDXContent } from 'mdx/types'
import { site } from '../config/site'
import { getPostBySlug } from '../lib/content'
import { mdxComponents } from '../components/MDXComponents'
import Container from '../components/Container'
import Seo from '../components/Seo'

export function Component() {
  const { slug } = useParams()
  const post = slug ? getPostBySlug(slug) : undefined
  if (!post) return (
    <Container><div className="py-24"><p className="font-mono">Post not found.</p>
      <Link to="/writing" className="text-accent">← Writing</Link></div></Container>
  )
  const { frontmatter: f, Component: Body } = post
  const PostBody = Body as unknown as MDXContent
  return (
    <Container>
      <Seo title={`${f.title} — ${site.name}`} description={f.summary} path={`/writing/${post.slug}`} ogType="article" />
      <article className="py-12">
        <Link to="/writing" className="font-mono text-xs uppercase tracking-wider text-muted hover:text-accent">← Writing</Link>
        <h1 className="font-mono text-3xl mt-4">{f.title}</h1>
        <time className="font-mono text-xs text-muted">{f.date}</time>
        <div className="mt-8"><PostBody components={mdxComponents} /></div>
      </article>
    </Container>
  )
}

