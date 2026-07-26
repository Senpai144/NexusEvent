import { useState, useEffect } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { TrendingUp, DollarSign, Calendar, Users, Download, Printer } from 'lucide-react'
import { eventsApi, bookingsApi } from '../services/api'
import { exportCSV, printTable } from '../utils/export'

export default function DashboardStats() {
  const [events, setEvents] = useState<any[]>([])
  const [bookings, setBookings] = useState<any[]>([])

  useEffect(() => {
    Promise.all([
      eventsApi.getAll(),
      bookingsApi.getAll(),
    ]).then(([evRes, bkRes]) => {
      setEvents(evRes.data)
      setBookings(bkRes.data)
    }).catch(() => {})
  }, [])

  const totalRevenue = bookings.reduce((s, b) => s + Number(b.totalAmount), 0)
  const totalParticipants = bookings.reduce((s, b) => s + b.numberOfSeats, 0)
  const activeEvents = events.filter(e => e.status === 'upcoming' || e.status === 'ongoing').length
  const completedEvents = events.filter(e => e.status === 'past').length
  const fillRate = events.length > 0 ? Math.round((totalParticipants / (events.reduce((s, e) => s + (e.maxParticipants || e.max), 0))) * 100) : 0

  const categoryStats = events.reduce((acc: any, e) => {
    acc[e.category] = (acc[e.category] || 0) + 1
    return acc
  }, {})

  const revenueByEvent = events.map(ev => ({
    title: ev.title,
    revenue: bookings.filter(b => b.eventId === ev.id).reduce((s, b) => s + Number(b.totalAmount), 0),
    participants: ev.participants,
    category: ev.category,
  })).sort((a, b) => b.revenue - a.revenue)

  return (
    <DashboardLayout>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 4 }}>Statistiques</h1>
            <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>Aperçu des performances de vos événements</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary" style={{ gap: 6, fontSize: '0.85rem' }} onClick={() => exportCSV('statistiques', ['Métrique', 'Valeur'], [['Revenus totaux', `${totalRevenue.toLocaleString()} FCFA`], ['Participants', `${totalParticipants}`], ['Événements actifs', `${activeEvents}`], ['Taux de remplissage', `${fillRate}%`], ['Total événements', `${events.length}`], ['À venir', `${events.filter(e => e.status === 'upcoming').length}`], ['En cours', `${events.filter(e => e.status === 'ongoing').length}`], ['Terminés', `${completedEvents}`], ['Annulés', `${events.filter(e => e.status === 'cancelled').length}`]])}>
              <Download size={15} /> CSV
            </button>
            <button className="btn btn-secondary" style={{ gap: 6, fontSize: '0.85rem' }} onClick={() => printTable('Statistiques', ['Métrique', 'Valeur'], [['Revenus totaux', `${totalRevenue.toLocaleString()} FCFA`], ['Participants', `${totalParticipants}`], ['Événements actifs', `${activeEvents}`], ['Taux de remplissage', `${fillRate}%`], ['Total événements', `${events.length}`], ['À venir', `${events.filter(e => e.status === 'upcoming').length}`], ['En cours', `${events.filter(e => e.status === 'ongoing').length}`], ['Terminés', `${completedEvents}`], ['Annulés', `${events.filter(e => e.status === 'cancelled').length}`]])}>
              <Printer size={15} /> Imprimer
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 32 }}>
          {[
            { label: 'Revenus totaux', value: `${totalRevenue.toLocaleString()} FCFA`, icon: DollarSign, color: '#22c55e' },
            { label: 'Participants', value: totalParticipants.toString(), icon: Users, color: 'var(--violet)' },
            { label: 'Événements actifs', value: activeEvents.toString(), icon: Calendar, color: 'var(--accent)' },
            { label: 'Taux de remplissage', value: `${fillRate}%`, icon: TrendingUp, color: '#f59e0b' },
          ].map((s, i) => (
            <div key={i} className="card" style={{ padding: '24px' }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <s.icon size={22} color={s.color} />
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'Syne', marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text3)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20 }}>Répartition par catégorie</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {Object.entries(categoryStats).map(([cat, count]: any) => {
                const pct = (count / events.length) * 100
                const colors: Record<string, string> = { Technologie: 'var(--violet)', Sport: '#22c55e', Atelier: '#f59e0b', Business: 'var(--accent)', Musique: '#ec4899', Art: '#8b5cf6' }
                return (
                  <div key={cat}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 6 }}>
                      <span style={{ fontWeight: 600 }}>{cat}</span>
                      <span style={{ color: 'var(--text3)' }}>{count} ({Math.round(pct)}%)</span>
                    </div>
                    <div style={{ height: 8, background: 'var(--bg3)', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: colors[cat] || 'var(--accent)', borderRadius: 4, transition: 'width 0.5s' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20 }}>Revenus par événement</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {revenueByEvent.slice(0, 5).map((ev, i) => {
                const maxRev = revenueByEvent[0]?.revenue || 1
                const pct = (ev.revenue / maxRev) * 100
                return (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 6 }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flex: 1, overflow: 'hidden' }}>
                        <span style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--accent)', color: '#fff', fontSize: '0.7rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</span>
                        <span style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.title}</span>
                      </div>
                      <span style={{ fontWeight: 700, fontFamily: 'Syne', color: 'var(--success)', whiteSpace: 'nowrap' }}>{ev.revenue.toLocaleString()} FCFA</span>
                    </div>
                    <div style={{ height: 6, background: 'var(--bg3)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, var(--accent), var(--violet))', borderRadius: 3, transition: 'width 0.5s' }} />
                    </div>
                  </div>
                )
              })}
              {revenueByEvent.length === 0 && (
                <div style={{ textAlign: 'center', padding: 40, color: 'var(--text3)' }}>Aucune donnée</div>
              )}
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20 }}>Résumé des événements</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16 }}>
            {[
              { label: 'Total événements', value: events.length, color: 'var(--violet)' },
              { label: 'À venir', value: events.filter(e => e.status === 'upcoming').length, color: 'var(--success)' },
              { label: 'En cours', value: events.filter(e => e.status === 'ongoing').length, color: 'var(--accent)' },
              { label: 'Terminés', value: completedEvents, color: '#f59e0b' },
              { label: 'Annulés', value: events.filter(e => e.status === 'cancelled').length, color: 'var(--danger)' },
              { label: 'Événements gratuits', value: events.filter(e => Number(e.price) === 0).length, color: '#8b5cf6' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '16px', background: 'var(--bg2)', borderRadius: 12 }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'Syne', color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text3)', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
    </DashboardLayout>
  )
}
