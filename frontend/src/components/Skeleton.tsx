interface SkeletonProps {
  width?: string | number
  height?: string | number
  borderRadius?: string | number
  count?: number
  style?: React.CSSProperties
}

export function Skeleton({ width = '100%', height = 16, borderRadius = 8, count = 1, style }: SkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{
          width, height, borderRadius,
          background: 'linear-gradient(90deg, var(--surface) 25%, var(--surface2) 50%, var(--surface) 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s ease-in-out infinite',
          marginBottom: count > 1 ? 8 : 0,
          ...style,
        }} />
      ))}
    </>
  )
}

export function CardSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Skeleton width="60%" height={20} />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} width={`${70 + i * 10}%`} height={14} />
      ))}
    </div>
  )
}

export function TableSkeleton({ rows = 5, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', gap: 16, padding: '12px 0' }}>
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} width={`${80 / cols}%`} height={14} />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} style={{ display: 'flex', gap: 16, padding: '16px 0', borderTop: '1px solid var(--border)' }}>
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} width={`${80 / cols}%`} height={14} />
          ))}
        </div>
      ))}
    </div>
  )
}
