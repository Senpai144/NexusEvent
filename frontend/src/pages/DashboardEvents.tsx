import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout'
import Pagination from '../components/Pagination'
import { usePagination } from '../hooks/usePagination'
import { MapPin, Plus, Search, Edit2, Trash2, AlertCircle, ChevronDown, Filter, CheckCircle, XCircle, ArrowUpDown, Printer, Download } from 'lucide-react'
import { eventsApi } from '../services/api'
import { exportCSV, printTable } from '../utils/export'

const CATEGORIES = ['Toutes', 'Technologie', 'Sport', 'Atelier', 'Business', 'Musique', 'Art']
const STATUS_FILTERS = ['Tous', 'upcoming', 'ongoing', 'past', 'cancelled']

export default function DashboardEvents() {
  const [events, setEvents] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('Toutes')
  const [statusFilter, setStatusFilter] = useState('Tous')
  const [showCatDropdown, setShowCatDropdown] = useState(false)
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<any>({})

  useEffect(() => {
    eventsApi.getAll().then(res => setEvents(res.data)).catch(() => {})
  }, [])

  const filtered = events.filter((e: any) => {
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase())
    const matchCat = catFilter === 'Toutes' || e.category === catFilter
    const matchStatus = statusFilter === 'Tous' || e.status === statusFilter
    return matchSearch && matchCat && matchStatus
  })

  const { page, totalPages, paginated, sortKey, sortDir, toggleSort, goTo } = usePagination(filtered, 8)

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cet événement ?')) return
    try {
      await eventsApi.delete(id)
      setEvents(events.filter(e => e.id !== id))
    } catch {}
  }

  const handleEdit = (ev: any) => {
    setEditingId(ev.id)
    setEditForm({
      title: ev.title,
      description: ev.description || '',
      date: ev.date?.split('T')[0] || '',
      time: ev.time || '',
      location: ev.location,
      price: ev.price,
      maxParticipants: ev.maxParticipants || ev.max,
      status: ev.status,
      category: ev.category,
    })
  }

  const handleSave = async (id: string) => {
    try {
      await eventsApi.update(id, editForm)
      setEvents(events.map(e => e.id === id ? { ...e, ...editForm } : e))
      setEditingId(null)
    } catch {}
  }

  const SortHeader = ({ field, label }: { field: string; label: string }) => (
    <th style={{ textAlign: field === 'participants' ? 'center' : field === 'price' ? 'right' : 'left', padding: '14px 16px', fontWeight: 600, cursor: 'pointer', userSelect: 'none' }}
      onClick={() => toggleSort(field as any)}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        {label}
        <ArrowUpDown size={12} style={{ opacity: sortKey === field ? 1 : 0.3, color: sortKey === field ? 'var(--accent)' : 'var(--text3)' }} />
        {sortKey === field && <span style={{ fontSize: '0.65rem' }}>{sortDir === 'asc' ? '▲' : '▼'}</span>}
      </div>
    </th>
  )

  return (
    <DashboardLayout>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 4 }}>Gestion des événements</h1>
            <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>{filtered.length} événement{filtered.length > 1 ? 's' : ''} au total</p>
          </div>
          <Link to="/dashboard/events/new" className="btn btn-primary" style={{ gap: 8 }}>
            <Plus size={18} /> Nouvel événement
          </Link>
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="input-wrap" style={{ flex: 1, minWidth: 240, maxWidth: 360 }}>
            <Search size={16} className="iicon" />
            <input className="form-input" placeholder="Rechercher un événement..." value={search} onChange={e => setSearch(e.target.value)} style={{ fontSize: '0.85rem' }} />
          </div>
          <button className="btn btn-secondary" style={{ gap: 6, fontSize: '0.85rem' }} onClick={() => exportCSV('evenements', ['Titre', 'Catégorie', 'Date', 'Statut', 'Participants', 'Prix'], filtered.map((e: any) => [e.title, e.category || '', new Date(e.date).toLocaleDateString('fr-FR'), e.status, String(e.participants), e.price === 0 ? 'Gratuit' : `${e.price} FCFA`]))}>
            <Download size={15} /> CSV
          </button>
          <button className="btn btn-secondary" style={{ gap: 6, fontSize: '0.85rem' }} onClick={() => printTable('Liste des événements', ['Titre', 'Catégorie', 'Date', 'Statut', 'Participants', 'Prix'], filtered.map((e: any) => [e.title, e.category || '', new Date(e.date).toLocaleDateString('fr-FR'), e.status, String(e.participants), e.price === 0 ? 'Gratuit' : `${e.price} FCFA`]))}>
            <Printer size={15} /> Imprimer
          </button>

          <div style={{ position: 'relative' }}>
            <button className="btn btn-secondary" style={{ gap: 6, fontSize: '0.85rem' }} onClick={() => { setShowCatDropdown(!showCatDropdown); setShowStatusDropdown(false) }}>
              <Filter size={15} /> {catFilter} <ChevronDown size={14} />
            </button>
            {showCatDropdown && (
              <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: 4, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 0, boxShadow: '0 10px 40px rgba(0,0,0,0.2)', zIndex: 50, minWidth: 180, overflow: 'hidden' }}>
                {CATEGORIES.map(c => (
                  <button key={c} style={{ display: 'block', width: '100%', padding: '10px 16px', textAlign: 'left', background: catFilter === c ? 'var(--bg2)' : 'transparent', border: 'none', color: 'var(--text)', fontSize: '0.85rem', cursor: 'pointer' }}
                    onClick={() => { setCatFilter(c); setShowCatDropdown(false) }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg2)'}
                    onMouseLeave={e => e.currentTarget.style.background = catFilter === c ? 'var(--bg2)' : 'transparent'}>
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div style={{ position: 'relative' }}>
            <button className="btn btn-secondary" style={{ gap: 6, fontSize: '0.85rem' }} onClick={() => { setShowStatusDropdown(!showStatusDropdown); setShowCatDropdown(false) }}>
              <Filter size={15} /> {statusFilter === 'Tous' ? 'Statut' : statusFilter} <ChevronDown size={14} />
            </button>
            {showStatusDropdown && (
              <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: 4, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 0, boxShadow: '0 10px 40px rgba(0,0,0,0.2)', zIndex: 50, minWidth: 160, overflow: 'hidden' }}>
                {STATUS_FILTERS.map(s => (
                  <button key={s} style={{ display: 'block', width: '100%', padding: '10px 16px', textAlign: 'left', background: statusFilter === s ? 'var(--bg2)' : 'transparent', border: 'none', color: 'var(--text)', fontSize: '0.85rem', cursor: 'pointer' }}
                    onClick={() => { setStatusFilter(s); setShowStatusDropdown(false) }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg2)'}
                    onMouseLeave={e => e.currentTarget.style.background = statusFilter === s ? 'var(--bg2)' : 'transparent'}>
                    {s === 'Tous' ? 'Tous les statuts' : s === 'upcoming' ? 'À venir' : s === 'ongoing' ? 'En cours' : s === 'past' ? 'Terminé' : 'Annulé'}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text3)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  <SortHeader field="title" label="Événement" />
                  <SortHeader field="category" label="Catégorie" />
                  <SortHeader field="date" label="Date" />
                  <SortHeader field="status" label="Statut" />
                  <th style={{ textAlign: 'center', padding: '14px 16px', fontWeight: 600 }}>Places</th>
                  <SortHeader field="price" label="Prix" />
                  <th style={{ textAlign: 'center', padding: '14px 24px', fontWeight: 600 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((ev: any) => (
                  <tr key={ev.id} style={{ borderBottom: '1px solid var(--border)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg2)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    {editingId === ev.id ? (
                      <>
                        <td style={{ padding: '10px 24px' }}>
                          <input className="form-input" value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} style={{ fontSize: '0.85rem', padding: '6px 10px' }} />
                        </td>
                        <td style={{ padding: '10px 16px' }}>
                          <select className="form-input" value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value})} style={{ fontSize: '0.85rem', padding: '6px 10px' }}>
                            {CATEGORIES.filter(c => c !== 'Toutes').map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </td>
                        <td style={{ padding: '10px 16px' }}>
                          <input className="form-input" type="date" value={editForm.date} onChange={e => setEditForm({...editForm, date: e.target.value})} style={{ fontSize: '0.85rem', padding: '6px 10px', width: 130 }} />
                        </td>
                        <td style={{ padding: '10px 16px' }}>
                          <select className="form-input" value={editForm.status} onChange={e => setEditForm({...editForm, status: e.target.value})} style={{ fontSize: '0.85rem', padding: '6px 10px' }}>
                            <option value="upcoming">À venir</option>
                            <option value="ongoing">En cours</option>
                            <option value="past">Terminé</option>
                            <option value="cancelled">Annulé</option>
                          </select>
                        </td>
                        <td style={{ padding: '10px 16px', textAlign: 'center' }}>
                          <input className="form-input" type="number" value={editForm.maxParticipants} onChange={e => setEditForm({...editForm, maxParticipants: +e.target.value})} style={{ fontSize: '0.85rem', padding: '6px 10px', width: 70, textAlign: 'center' }} />
                        </td>
                        <td style={{ padding: '10px 16px', textAlign: 'right' }}>
                          <input className="form-input" type="number" value={editForm.price} onChange={e => setEditForm({...editForm, price: +e.target.value})} style={{ fontSize: '0.85rem', padding: '6px 10px', width: 90, textAlign: 'right' }} />
                        </td>
                        <td style={{ padding: '10px 24px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                            <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.78rem' }} onClick={() => handleSave(ev.id)}>
                              <CheckCircle size={14} /> Sauver
                            </button>
                            <button className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: '0.78rem' }} onClick={() => setEditingId(null)}>
                              <XCircle size={14} /> Annuler
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td style={{ padding: '14px 24px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <img src={ev.cover || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=80&q=80'} alt="" style={{ width: 40, height: 40, borderRadius: 10, objectFit: 'cover' }} />
                            <div>
                              <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{ev.title}</div>
                              <div style={{ fontSize: '0.78rem', color: 'var(--text3)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                <MapPin size={11} /> {ev.location}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: '0.85rem', color: 'var(--text2)' }}>{ev.category}</td>
                        <td style={{ padding: '14px 16px', fontSize: '0.85rem', color: 'var(--text2)', whiteSpace: 'nowrap' }}>
                          {new Date(ev.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span className={`badge ${ev.status === 'upcoming' ? 'badge-success' : ev.status === 'ongoing' ? 'badge-violet' : ev.status === 'past' ? 'badge-warning' : 'badge-danger'}`} style={{ fontSize: '0.72rem' }}>
                            {ev.status === 'upcoming' ? 'À venir' : ev.status === 'ongoing' ? 'En cours' : ev.status === 'past' ? 'Terminé' : 'Annulé'}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'center', fontSize: '0.85rem' }}>
                          <span style={{ fontWeight: 600 }}>{ev.participants}</span>
                          <span style={{ color: 'var(--text3)' }}>/{ev.maxParticipants || ev.max}</span>
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 700, fontFamily: 'Syne', fontSize: '0.85rem' }}>
                          {ev.price === 0 ? 'Gratuit' : `${ev.price.toLocaleString()} FCFA`}
                        </td>
                        <td style={{ padding: '14px 24px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                            <button className="btn btn-ghost" style={{ padding: '6px 10px' }} onClick={() => handleEdit(ev)} title="Modifier">
                              <Edit2 size={15} />
                            </button>
                            <button className="btn btn-ghost" style={{ padding: '6px 10px', color: 'var(--danger)' }} onClick={() => handleDelete(ev.id)} title="Supprimer">
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
                {paginated.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ padding: '60px', textAlign: 'center' }}>
                      <AlertCircle size={36} color="var(--text3)" opacity={0.3} style={{ marginBottom: 12 }} />
                      <div style={{ color: 'var(--text3)', fontSize: '0.9rem' }}>Aucun événement trouvé</div>
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
