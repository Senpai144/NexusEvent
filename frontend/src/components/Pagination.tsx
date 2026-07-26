import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  page: number
  totalPages: number
  total: number
  onPageChange: (p: number) => void
}

export default function Pagination({ page, totalPages, total, onPageChange }: Props) {
  if (totalPages <= 1) return null
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderTop: '1px solid var(--border)', fontSize: '0.85rem' }}>
      <span style={{ color: 'var(--text3)' }}>{total} résultat{total > 1 ? 's' : ''}</span>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <button className="btn btn-ghost" style={{ padding: '6px 10px' }} disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          <ChevronLeft size={16} />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
          .map((p, idx, arr) => (
            <span key={p} style={{ display: 'inline-flex' }}>
              {idx > 0 && arr[idx - 1] !== p - 1 && <span style={{ padding: '6px 4px', color: 'var(--text3)' }}>…</span>}
              <button
                style={{
                  padding: '6px 12px', borderRadius: 8, border: 'none',
                  background: p === page ? 'var(--accent)' : 'transparent',
                  color: p === page ? '#fff' : 'var(--text)', fontWeight: p === page ? 700 : 400,
                  cursor: 'pointer', fontSize: '0.85rem', minWidth: 32,
                }}
                onClick={() => onPageChange(p)}
              >
                {p}
              </button>
            </span>
          ))}
        <button className="btn btn-ghost" style={{ padding: '6px 10px' }} disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
