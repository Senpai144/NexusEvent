import { useState, useEffect } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import Pagination from '../components/Pagination'
import { usePagination } from '../hooks/usePagination'
import { Star, MessageSquare, Trash2, CheckCircle, XCircle } from 'lucide-react'
import { reviewsApi } from '../services/api'

export default function DashboardReviews() {
  const [reviews, setReviews] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [editId, setEditId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [editRating, setEditRating] = useState(5)

  useEffect(() => {
    reviewsApi.getAll().then(res => setReviews(res.data)).catch(() => {})
  }, [])

  const filtered = reviews.filter((r: any) =>
    r.text?.toLowerCase().includes(search.toLowerCase())
  )

  const { page, totalPages, paginated, goTo } = usePagination(filtered, 8)

  const handleToggleApprove = async (id: string) => {
    setReviews(reviews.map((r: any) => r.id === id ? { ...r, approved: !r.approved } : r))
    try {
      await reviewsApi.update(id, { approved: !reviews.find((r: any) => r.id === id)?.approved })
    } catch {}
  }

  const handleSave = async (id: string) => {
    try {
      await reviewsApi.update(id, { text: editText, rating: editRating })
      setReviews(reviews.map((r: any) => r.id === id ? { ...r, text: editText, rating: editRating } : r))
      setEditId(null)
    } catch {}
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce témoignage ?')) return
    try {
      await reviewsApi.delete(id)
      setReviews(reviews.filter((r: any) => r.id !== id))
    } catch {}
  }

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 4 }}>Témoignages</h1>
        <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>{filtered.length} avis</p>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <div className="input-wrap" style={{ flex: 1, maxWidth: 360 }}>
          <MessageSquare size={16} className="iicon" />
          <input className="form-input" placeholder="Rechercher un témoignage..." value={search} onChange={e => setSearch(e.target.value)} style={{ fontSize: '0.85rem' }} />
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text3)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                <th style={{ textAlign: 'left', padding: '14px 24px', fontWeight: 600 }}>Avis</th>
                <th style={{ textAlign: 'center', padding: '14px 16px', fontWeight: 600 }}>Note</th>
                <th style={{ textAlign: 'left', padding: '14px 16px', fontWeight: 600 }}>Rôle</th>
                <th style={{ textAlign: 'center', padding: '14px 16px', fontWeight: 600 }}>Statut</th>
                <th style={{ textAlign: 'right', padding: '14px 16px', fontWeight: 600 }}>Date</th>
                <th style={{ textAlign: 'center', padding: '14px 24px', fontWeight: 600 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((r: any) => (
                <tr key={r.id} style={{ borderBottom: '1px solid var(--border)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  {editId === r.id ? (
                    <>
                      <td style={{ padding: '10px 24px' }}>
                        <input className="form-input" value={editText} onChange={e => setEditText(e.target.value)} style={{ fontSize: '0.85rem', padding: '6px 10px', width: 300 }} />
                      </td>
                      <td style={{ padding: '10px 16px', textAlign: 'center' }}>
                        <select className="form-input" value={editRating} onChange={e => setEditRating(+e.target.value)} style={{ fontSize: '0.85rem', padding: '4px 8px', width: 60 }}>
                          {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                      </td>
                      <td colSpan={2} style={{ padding: '10px 16px', color: 'var(--text3)' }}>Édition en cours...</td>
                      <td style={{ padding: '10px 16px', textAlign: 'right', fontSize: '0.82rem', color: 'var(--text3)' }}>
                        {new Date(r.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                      </td>
                      <td style={{ padding: '10px 24px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                          <button className="btn btn-primary" style={{ padding: '4px 10px', fontSize: '0.75rem' }} onClick={() => handleSave(r.id)}>
                            <CheckCircle size={12} /> OK
                          </button>
                          <button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: '0.75rem' }} onClick={() => setEditId(null)}>
                            <XCircle size={12} /> Annuler
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td style={{ padding: '14px 24px', maxWidth: 300 }}>
                        <div style={{ fontWeight: 500, fontSize: '0.88rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.text}</div>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#f59e0b', fontWeight: 700 }}>
                          <Star size={14} fill="#f59e0b" /> {r.rating}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '0.83rem', color: 'var(--text2)', textTransform: 'capitalize' }}>{r.role || '—'}</td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        <span className={`badge ${r.approved === false ? 'badge-warning' : 'badge-success'}`} style={{ fontSize: '0.72rem' }}>
                          {r.approved === false ? 'En attente' : 'Approuvé'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: '0.82rem', color: 'var(--text3)', whiteSpace: 'nowrap' }}>
                        {new Date(r.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td style={{ padding: '14px 24px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                          <button className="btn btn-ghost" style={{ padding: '4px 8px' }} onClick={() => handleToggleApprove(r.id)} title="Approuver/Désapprouver">
                            <CheckCircle size={14} color={r.approved === false ? 'var(--text3)' : '#22c55e'} />
                          </button>
                          <button className="btn btn-ghost" style={{ padding: '4px 8px' }} onClick={() => { setEditId(r.id); setEditText(r.text); setEditRating(r.rating) }} title="Modifier">
                            <MessageSquare size={14} />
                          </button>
                          <button className="btn btn-ghost" style={{ padding: '4px 8px', color: 'var(--danger)' }} onClick={() => handleDelete(r.id)} title="Supprimer">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: '60px', textAlign: 'center' }}>
                    <MessageSquare size={36} color="var(--text3)" opacity={0.3} style={{ marginBottom: 12 }} />
                    <div style={{ color: 'var(--text3)', fontSize: '0.9rem' }}>Aucun témoignage trouvé</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination page={page} totalPages={totalPages} total={filtered.length} onPageChange={goTo} />
      </div>
    </DashboardLayout>
  )
}
