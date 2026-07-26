import type { ReactNode } from 'react'

const ILLUSTRATIONS: Record<string, ReactNode> = {
  default: (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
      <rect x="20" y="30" width="80" height="60" rx="8" stroke="var(--text3)" strokeWidth="2" fill="none" opacity={0.3} />
      <line x1="35" y1="48" x2="85" y2="48" stroke="var(--text3)" strokeWidth="2" opacity={0.2} />
      <line x1="35" y1="58" x2="70" y2="58" stroke="var(--text3)" strokeWidth="2" opacity={0.15} />
      <line x1="35" y1="68" x2="60" y2="68" stroke="var(--text3)" strokeWidth="2" opacity={0.1} />
      <circle cx="60" cy="18" r="10" stroke="var(--accent)" strokeWidth="2" fill="var(--accent-glow)" opacity={0.5} />
      <line x1="60" y1="22" x2="60" y2="30" stroke="var(--accent)" strokeWidth="2" opacity={0.4} />
      <line x1="56" y1="26" x2="64" y2="26" stroke="var(--accent)" strokeWidth="2" opacity={0.4} />
    </svg>
  ),
  events: (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
      <rect x="25" y="25" width="70" height="70" rx="12" stroke="var(--violet)" strokeWidth="2" fill="none" opacity={0.3} />
      <rect x="35" y="40" width="20" height="20" rx="4" stroke="var(--violet)" strokeWidth="2" opacity={0.2} />
      <line x1="62" y1="48" x2="82" y2="48" stroke="var(--text3)" strokeWidth="2" opacity={0.15} />
      <line x1="62" y1="56" x2="78" y2="56" stroke="var(--text3)" strokeWidth="2" opacity={0.1} />
      <circle cx="60" cy="15" r="8" fill="var(--accent)" opacity={0.3} />
      <path d="M56 15h8M60 11v8" stroke="var(--accent)" strokeWidth="2" opacity={0.5} />
    </svg>
  ),
  search: (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
      <circle cx="50" cy="50" r="24" stroke="var(--warning)" strokeWidth="2" fill="none" opacity={0.3} />
      <line x1="68" y1="68" x2="88" y2="88" stroke="var(--warning)" strokeWidth="2" strokeLinecap="round" opacity={0.3} />
      <line x1="38" y1="50" x2="62" y2="50" stroke="var(--warning)" strokeWidth="2" opacity={0.15} />
      <line x1="50" y1="38" x2="50" y2="62" stroke="var(--warning)" strokeWidth="2" opacity={0.15} />
    </svg>
  ),
}

interface EmptyStateProps {
  icon?: keyof typeof ILLUSTRATIONS
  title: string
  description?: string
  action?: ReactNode
}

export default function EmptyState({ icon = 'default', title, description, action }: EmptyStateProps) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '60px 24px', textAlign: 'center',
    }}>
      <div style={{ marginBottom: 20, opacity: 0.6 }}>
        {ILLUSTRATIONS[icon] || ILLUSTRATIONS.default}
      </div>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text2)', marginBottom: 8 }}>
        {title}
      </h3>
      {description && (
        <p style={{ fontSize: '0.88rem', color: 'var(--text3)', maxWidth: 360, marginBottom: action ? 20 : 0 }}>
          {description}
        </p>
      )}
      {action}
    </div>
  )
}
