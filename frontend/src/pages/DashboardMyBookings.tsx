import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout'
import { Calendar, MapPin, Clock, Ticket, AlertCircle, Search } from 'lucide-react'
import { bookingsApi } from '../services/api'

const STATUS_LABEL: Record<string, string> = {
  pending: 'En attente', confirmed: 'Confirmé', cancelled: 'Annulé'
}
const STATUS_COLOR: Record<string, string> = {
  pending: 'badge-warning', confirmed: 'badge-success', cancelled: 'badge-danger'
}

export default function DashboardMyBookings() {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    bookingsApi.getMine()
      .then(res => setBookings(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = bookings.filter(b =>
    b.event?.title?.toLowerCase().includes(search.toLowerCase()) ||
    b.firstName?.toLowerCase().includes(search.toLowerCase()) ||
    b.lastName?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 4 }}>Mes Réservations</h1>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>{filtered.length} réservation{filtered.length > 1 ? 's' : ''}</p>
        </div>
        <Link to="/" className="btn btn-primary" style={{ gap: 8 }}>
          <Ticket size={16} /> Réserver un événement
        </Link>
      </div>

      <div style={{ marginBottom: 24 }}>
        <div className="input-wrap" style={{ maxWidth: 360 }}>
          <Search size={16} className="iicon" />
          <input className="form-input" placeholder="Rechercher une réservation..." value={search} onChange={e => setSearch(e.target.value)} style={{ fontSize: '0.85rem' }} />
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center' }}>
          <div style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--text3)' }}>Chargement de vos réservations...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ padding: '60px', textAlign: 'center' }}>
          <AlertCircle size={48} color="var(--text3)" opacity={0.3} style={{ marginBottom: 16 }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 8 }}>Aucune réservation</h3>
          <p style={{ color: 'var(--text3)', marginBottom: 24 }}>Vous n'avez pas encore réservé d'événement.</p>
          <Link to="/" className="btn btn-primary">Explorer les événements</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
          {filtered.map((b: any) => (
            <div key={b.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              {b.event?.cover && (
                <img src={b.event.cover} alt="" style={{ width: '100%', height: 160, objectFit: 'cover' }} />
              )}
              <div style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>{b.event?.title || 'Événement'}</span>
                  <span className={`badge ${STATUS_COLOR[b.status] || 'badge-accent'}`} style={{ fontSize: '0.72rem' }}>
                    {STATUS_LABEL[b.status] || b.status}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                  {b.event?.date && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: 'var(--text2)' }}>
                      <Calendar size={14} color="var(--accent)" />
                      {new Date(b.event.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      {b.event?.time && <><Clock size={12} /> {b.event.time}</>}
                    </div>
                  )}
                  {b.event?.location && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: 'var(--text2)' }}>
                      <MapPin size={14} color="var(--accent)" /> {b.event.location}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid var(--border)', fontSize: '0.88rem' }}>
                  <div>
                    <span style={{ color: 'var(--text3)' }}>{b.numberOfSeats} place{b.numberOfSeats > 1 ? 's' : ''}</span>
                    <span style={{ margin: '0 8px', color: 'var(--text3)' }}>·</span>
                    <span style={{ color: 'var(--text3)', textTransform: 'capitalize' }}>{b.paymentMethod?.replace('_', ' ')}</span>
                  </div>
                  <span style={{ fontWeight: 700, fontFamily: 'Syne', color: Number(b.totalAmount) === 0 ? 'var(--success)' : 'var(--accent)' }}>
                    {Number(b.totalAmount) === 0 ? 'Gratuit' : `${Number(b.totalAmount).toLocaleString()} FCFA`}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
