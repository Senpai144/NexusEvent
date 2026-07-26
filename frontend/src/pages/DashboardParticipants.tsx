import { useState, useEffect } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import Pagination from '../components/Pagination'
import { usePagination } from '../hooks/usePagination'
import { Users, Search, AlertCircle, Filter, ChevronDown, ArrowUpDown, Download, Printer } from 'lucide-react'
import { bookingsApi, eventsApi } from '../services/api'
import { exportCSV, printTable } from '../utils/export'

const SORTABLE = ['firstName', 'eventId', 'numberOfSeats', 'paymentMethod', 'status', 'totalAmount', 'createdAt'] as const

export default function DashboardParticipants() {
  const [bookings, setBookings] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [eventFilter, setEventFilter] = useState('Tous')
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    bookingsApi.getAll().then(res => setBookings(res.data)).catch(() => {})
    eventsApi.getAll().then(res => setEvents(res.data)).catch(() => {})
  }, [])

  const getEventTitle = (eventId: string) => events.find(e => e.id === eventId)?.title || 'Événement inconnu'

  const filtered = bookings.filter(b => {
    const matchSearch = b.firstName?.toLowerCase().includes(search.toLowerCase()) || b.lastName?.toLowerCase().includes(search.toLowerCase()) || b.email?.toLowerCase().includes(search.toLowerCase())
    const matchEvent = eventFilter === 'Tous' || b.eventId === eventFilter
    return matchSearch && matchEvent
  })

  const { page, totalPages, paginated, sortKey, sortDir, toggleSort, goTo } = usePagination(filtered, 8)

  const eventBookingsCount = (eventId: string) => bookings.filter(b => b.eventId === eventId).length

  const SortHeader = ({ field, label }: { field: string; label: string }) => (
    <th style={{ textAlign: field === 'numberOfSeats' || field === 'totalAmount' ? 'right' : 'left', padding: '14px 16px', fontWeight: 600, cursor: 'pointer', userSelect: 'none' }}
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
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 4 }}>Participants</h1>
            <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>{filtered.length} réservation{filtered.length > 1 ? 's' : ''}</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="input-wrap" style={{ flex: 1, minWidth: 240, maxWidth: 360 }}>
            <Search size={16} className="iicon" />
            <input className="form-input" placeholder="Rechercher un participant..." value={search} onChange={e => setSearch(e.target.value)} style={{ fontSize: '0.85rem' }} />
          </div>
          <div style={{ position: 'relative' }}>
            <button className="btn btn-secondary" style={{ gap: 6, fontSize: '0.85rem' }} onClick={() => setShowDropdown(!showDropdown)}>
              <Filter size={15} /> {eventFilter === 'Tous' ? 'Tous les événements' : getEventTitle(eventFilter).substring(0, 25) + '...'} <ChevronDown size={14} />
            </button>
            {showDropdown && (
              <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: 4, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 0, boxShadow: '0 10px 40px rgba(0,0,0,0.2)', zIndex: 50, minWidth: 240, maxHeight: 300, overflowY: 'auto' }}>
                <button style={{ display: 'block', width: '100%', padding: '10px 16px', textAlign: 'left', background: eventFilter === 'Tous' ? 'var(--bg2)' : 'transparent', border: 'none', color: 'var(--text)', fontSize: '0.85rem', cursor: 'pointer' }}
                  onClick={() => { setEventFilter('Tous'); setShowDropdown(false) }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  Tous les événements
                </button>
                {events.map(ev => (
                  <button key={ev.id} style={{ display: 'block', width: '100%', padding: '10px 16px', textAlign: 'left', background: eventFilter === ev.id ? 'var(--bg2)' : 'transparent', border: 'none', color: 'var(--text)', fontSize: '0.85rem', cursor: 'pointer' }}
                    onClick={() => { setEventFilter(ev.id); setShowDropdown(false) }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg2)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <div style={{ fontWeight: 600 }}>{ev.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>{eventBookingsCount(ev.id)} réservation{eventBookingsCount(ev.id) > 1 ? 's' : ''} · {ev.participants}/{ev.maxParticipants} places</div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="btn btn-secondary" style={{ gap: 6, fontSize: '0.85rem' }} onClick={() => exportCSV('participants', ['Nom', 'Email', 'Événement', 'Places', 'Paiement', 'Statut', 'Total'], filtered.map((b: any) => [`${b.firstName} ${b.lastName}`, b.email, getEventTitle(b.eventId), String(b.numberOfSeats), b.paymentMethod || '', b.status, Number(b.totalAmount) === 0 ? 'Gratuit' : `${Number(b.totalAmount).toLocaleString()} FCFA`]))}>
            <Download size={15} /> CSV
          </button>
          <button className="btn btn-secondary" style={{ gap: 6, fontSize: '0.85rem' }} onClick={() => printTable('Liste des participants', ['Nom', 'Email', 'Événement', 'Places', 'Paiement', 'Statut', 'Total'], filtered.map((b: any) => [`${b.firstName} ${b.lastName}`, b.email, getEventTitle(b.eventId), String(b.numberOfSeats), b.paymentMethod || '', b.status, Number(b.totalAmount) === 0 ? 'Gratuit' : `${Number(b.totalAmount).toLocaleString()} FCFA`]))}>
            <Printer size={15} /> Imprimer
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 28 }}>
          {events.map(ev => (
            <div key={ev.id} className="card" style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{ev.title}</span>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, padding: '2px 10px', borderRadius: 6, background: ev.participants >= ev.maxParticipants ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)', color: ev.participants >= ev.maxParticipants ? '#ef4444' : '#22c55e' }}>
                  {ev.participants >= ev.maxParticipants ? 'Complet' : `${ev.maxParticipants - ev.participants} places`}
                </span>
              </div>
              <div style={{ height: 6, background: 'var(--bg3)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${Math.min((ev.participants / ev.maxParticipants) * 100, 100)}%`, background: ev.participants >= ev.maxParticipants ? 'var(--danger)' : 'var(--success)', borderRadius: 3, transition: 'width 0.3s' }} />
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text3)', marginTop: 6, display: 'flex', justifyContent: 'space-between' }}>
                <span>{ev.participants}/{ev.maxParticipants} réservé{ev.participants > 1 ? 's' : ''}</span>
                <span>{eventBookingsCount(ev.id)} inscription{eventBookingsCount(ev.id) > 1 ? 's' : ''}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text3)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  <SortHeader field="firstName" label="Participant" />
                  <SortHeader field="eventId" label="Événement" />
                  <SortHeader field="numberOfSeats" label="Places" />
                  <SortHeader field="paymentMethod" label="Paiement" />
                  <SortHeader field="status" label="Statut" />
                  <SortHeader field="totalAmount" label="Total" />
                  <SortHeader field="createdAt" label="Date" />
                </tr>
              </thead>
              <tbody>
                {paginated.map((b: any) => (
                  <tr key={b.id} style={{ borderBottom: '1px solid var(--border)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg2)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '14px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--violet))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.8rem', fontFamily: 'Syne' }}>
                          {b.firstName?.[0]}{b.lastName?.[0]}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{b.firstName} {b.lastName}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>{b.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '0.85rem', color: 'var(--text2)' }}>
                      {getEventTitle(b.eventId)}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'center', fontWeight: 600 }}>
                      {b.numberOfSeats}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className="badge badge-accent" style={{ fontSize: '0.72rem', textTransform: 'capitalize' }}>
                        {b.paymentMethod?.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className={`badge ${b.status === 'confirmed' ? 'badge-success' : b.status === 'cancelled' ? 'badge-danger' : 'badge-warning'}`} style={{ fontSize: '0.72rem' }}>
                        {b.status === 'confirmed' ? 'Confirmé' : b.status === 'cancelled' ? 'Annulé' : 'En attente'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 700, fontFamily: 'Syne', fontSize: '0.88rem' }}>
                      {Number(b.totalAmount) === 0 ? 'Gratuit' : `${Number(b.totalAmount).toLocaleString()} FCFA`}
                    </td>
                    <td style={{ padding: '14px 24px', textAlign: 'right', fontSize: '0.82rem', color: 'var(--text3)', whiteSpace: 'nowrap' }}>
                      {new Date(b.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
                {paginated.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ padding: '60px', textAlign: 'center' }}>
                      <AlertCircle size={36} color="var(--text3)" opacity={0.3} style={{ marginBottom: 12 }} />
                      <div style={{ color: 'var(--text3)', fontSize: '0.9rem' }}>Aucun participant trouvé</div>
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
