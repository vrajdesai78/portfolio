// src/components/SkillGroup.tsx
import type { SkillGroupData } from '../data/about'
export default function SkillGroup({ group }: { group: SkillGroupData }) {
  return (
    <div className="grid sm:grid-cols-[1fr_2fr] gap-1 sm:gap-6 py-3 border-b border-border">
      <div className="font-mono text-xs uppercase tracking-wider text-muted">{group.label}</div>
      <div className="flex flex-wrap gap-2">
        {group.items.map((i) => <span key={i} className="font-mono text-xs text-fg">{i}</span>)}
      </div>
    </div>
  )
}
