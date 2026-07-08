import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import satori from 'satori'
import type { ReactNode } from 'react'
import { Resvg } from '@resvg/resvg-js'
import { listRoutes } from './content-fs'
import { ogImagePath } from '../src/lib/og'

const regular = readFileSync(join('scripts', 'og-fonts', 'JetBrainsMono-Regular.ttf'))
const bold = readFileSync(join('scripts', 'og-fonts', 'JetBrainsMono-Bold.ttf'))

const card = (r: { eyebrow: string; title: string; subtitle?: string; metric?: string }) => ({
  type: 'div',
  props: {
    style: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '64px',
      backgroundColor: '#1b1c1f',
      color: '#f0f1f2',
      fontFamily: 'JetBrains Mono',
    },
    children: [
      {
        type: 'div',
        props: {
          style: {
            fontFamily: 'JetBrains Mono',
            fontWeight: 400,
            fontSize: 24,
            letterSpacing: 4,
            color: '#16db95',
          },
          children: r.eyebrow,
        },
      },
      {
        type: 'div',
        props: {
          style: { display: 'flex', flexDirection: 'column' },
          children: [
            {
              type: 'div',
              props: {
                style: {
                  fontFamily: 'JetBrains Mono',
                  fontSize: 76,
                  fontWeight: 700,
                },
                children: r.title,
              },
            },
            ...(r.subtitle
              ? [
                  {
                    type: 'div',
                    props: {
                      style: {
                        fontFamily: 'JetBrains Mono',
                        fontWeight: 400,
                        fontSize: 32,
                        color: '#9aa0ac',
                        marginTop: 8,
                      },
                      children: r.subtitle,
                    },
                  },
                ]
              : []),
          ],
        },
      },
      {
        type: 'div',
        props: {
          style: {
            fontFamily: 'JetBrains Mono',
            fontWeight: 400,
            fontSize: 28,
            color: '#9aa0ac',
            display: 'flex',
            justifyContent: 'space-between',
          },
          children: [
            { type: 'div', props: { children: 'vrajdesai.dev' } },
            { type: 'div', props: { children: r.metric ?? '' } },
          ],
        },
      },
    ],
  },
})

const run = async () => {
  mkdirSync(join('dist', 'og'), { recursive: true })
  for (const r of listRoutes()) {
    const svg = await satori(card(r) as ReactNode, {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'JetBrains Mono', data: regular, weight: 400, style: 'normal' },
        { name: 'JetBrains Mono', data: bold, weight: 700, style: 'normal' },
      ],
    })
    const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng()
    const file = join('dist', ogImagePath(r.path))
    writeFileSync(file, png)
    console.log('OG:', file)
  }
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
