// src/components/AchievementList.tsx
export default function AchievementList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 text-sm text-muted list-disc pl-4">
      {items.map((i) => <li key={i}>{i}</li>)}
    </ul>
  )
}
