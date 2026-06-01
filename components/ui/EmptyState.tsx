import Link from 'next/link'

interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  action?: { label: string; href: string }
}

export function EmptyState({ icon = '📭', title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-10 text-center">
      <div className="mb-3 text-4xl">{icon}</div>
      <h3 className="mb-2 text-base font-semibold text-slate-200">{title}</h3>
      {description && <p className="mb-4 text-sm text-slate-400">{description}</p>}
      {action && (
        <Link
          href={action.href}
          className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition-colors"
        >
          {action.label}
        </Link>
      )}
    </div>
  )
}
