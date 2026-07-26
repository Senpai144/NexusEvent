import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout'
import {
  Search, Calendar, MapPin, ChevronLeft, ChevronRight, ArrowUpRight,
  Ticket, DollarSign, TrendingUp, TrendingDown
} from 'lucide-react'
import { eventsApi, bookingsApi, dashboardApi } from '../services/api'
import { useAuth } from '../contexts/AuthContext'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function Sparkline({ data, color = '#22c55e', height = 40 }: { data: number[]; color?: string; height?: number }) {
  const w = 80
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${height - ((v - min) / range) * (height - 4) - 2}`).join(' ')
  return (
    <svg width={w} height={height} style={{ flexShrink: 0 }}>
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SparklineBar({ data, color = 'var(--accent)', height = 36 }: { data: number[]; color?: string; height?: number }) {
  const w = 60
  const max = Math.max(...data) || 1
  const barW = w / data.length - 2
  return (
    <svg width={w} height={height} style={{ flexShrink: 0 }}>
      {data.map((v, i) => (
        <rect key={i} x={i * (barW + 2) + 1} y={height - (v / max) * height} width={barW} height={(v / max) * height} rx={2} fill={color} opacity={0.7} />
      ))}
    </svg>
  )
}

function DonutChart() {
  const cx = 80, cy = 80, r = 60, sw = 20
  const segments = [
    { pct: 0.45, color: '#7c5cfc', label: 'Music' },
    { pct: 0.30, color: '#22c55e', label: 'Tech' },
    { pct: 0.25, color: '#f59e0b', label: 'Sport' },
  ]
  let offset = 0
  const circ = 2 * Math.PI * r
  return (
    <svg width={160} height={160} viewBox="0 0 160 160">
      {segments.map((seg, i) => {
        const len = seg.pct * circ
        const dash = `${len} ${circ - len}`
        const rot = offset * 360
        offset += seg.pct
        return (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={seg.color} strokeWidth={sw}
            strokeDasharray={dash} strokeLinecap="round"
            transform={`rotate(${rot} ${cx} ${cy})`} style={{ transformOrigin: 'center', opacity: 0.85 }}
          />
        )
      })}
      <circle cx={cx} cy={cy} r={r - sw / 2} fill="var(--surface)" />
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize="18" fontWeight="800" fill="var(--text)">18k</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fontSize="10" fill="var(--text3)">Sold</text>
    </svg>
  )
}

function MiniBar({ value, max = 100, color = 'var(--accent)' }: { value: number; max?: number; color?: string }) {
  return (
    <div style={{ width: 60, height: 4, background: 'var(--bg3)', borderRadius: 2, overflow: 'hidden' }}>
      <div style={{ width: `${(value / max) * 100}%`, height: '100%', background: color, borderRadius: 2 }} />
    </div>
  )
}

function CalendarWidget() {
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth())
  const [year, setYear] = useState(now.getFullYear())

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)' }}>
          {MONTHS[month]} {year}
        </span>
        <div style={{ display: 'flex', gap: 4 }}>
          <button onClick={() => setMonth(m => { if (m === 0) { setYear(y => y - 1); return 11 }; return m - 1 })} style={{ width: 28, height: 28, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} aria-label="Mois précédent">
            <ChevronLeft size={14} color="var(--text2)" />
          </button>
          <button onClick={() => setMonth(m => { if (m === 11) { setYear(y => y + 1); return 0 }; return m + 1 })} style={{ width: 28, height: 28, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} aria-label="Mois suivant">
            <ChevronRight size={14} color="var(--text2)" />
          </button>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, textAlign: 'center' }}>
        {DAYS.map(d => (
          <div key={d} style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text3)', padding: '4px 0' }}>{d}</div>
        ))}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`e${i}`} />
        ))}
        {days.map(d => {
          const selected = d === 15
          return (
            <div key={d} style={{
              padding: '6px 0', fontSize: '0.8rem', fontWeight: selected ? 700 : 500,
              color: selected ? '#fff' : 'var(--text)',
              background: selected ? 'var(--accent)' : 'transparent',
              borderRadius: 8, cursor: 'pointer',
            }}>{d}</div>
          )
        })}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const [events, setEvents] = useState<any[]>([])
  const [myBookings, setMyBookings] = useState<any[]>([])
  const [, setDbStats] = useState<any>(null)

  useEffect(() => {
    eventsApi.getAll().then(res => setEvents(res.data)).catch(() => {})
    if (user?.role === 'user') {
      bookingsApi.getMine().then(res => setMyBookings(res.data)).catch(() => {})
    }
    if (user?.role === 'admin') {
      dashboardApi.getStats().then(res => setDbStats(res.data)).catch(() => {})
    }
  }, [user])

  const totalTickets = events.reduce((s: number, e: any) => s + (e.participants || 0), 0)
  const totalSales = events.reduce((s: number, e: any) => s + Number(e.price) * (e.participants || 0), 0)
  const totalRevenue = totalSales

  const recentEvents = events.slice(0, 4)

  // User view
  if (user?.role === 'user') {
    return (
      <DashboardLayout>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>
            Bon retour, {user.name || 'Client'}
          </h1>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>Gérez vos réservations</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 32 }}>
          {[
            { label: 'Mes réservations', value: myBookings.length, icon: Ticket, color: 'var(--accent)', bg: 'var(--accent-glow)' },
            { label: 'Confirmées', value: myBookings.filter((b: any) => b.status === 'confirmed').length, icon: Calendar, color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
            { label: 'Événements disponibles', value: events.length, icon: TrendingUp, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
          ].map((s, i) => {
            const Icon = s.icon
            return (
              <div key={i} className="card" style={{ padding: '24px' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <Icon size={20} color={s.color} />
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'Syne', color: 'var(--text)', marginBottom: 4 }}>{s.value}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text3)' }}>{s.label}</div>
              </div>
            )
          })}
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)' }}>Mes réservations</h2>
            <Link to="/dashboard/my-bookings" style={{ fontSize: '0.82rem', color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>Voir tout</Link>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text3)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ textAlign: 'left', padding: '12px 24px', fontWeight: 600 }}>Événement</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600 }}>Places</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600 }}>Statut</th>
                  <th style={{ textAlign: 'right', padding: '12px 24px', fontWeight: 600 }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {myBookings.slice(0, 5).map((b: any) => (
                  <tr key={b.id} style={{ borderBottom: '1px solid var(--border)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg2)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '14px 24px', fontWeight: 600, color: 'var(--text)' }}>{b.event?.title || 'Événement'}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--text2)' }}>{b.numberOfSeats}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        display: 'inline-flex', padding: '3px 10px', borderRadius: 50, fontSize: '0.72rem', fontWeight: 600,
                        background: b.status === 'confirmed' ? 'rgba(34,197,94,0.1)' : b.status === 'cancelled' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
                        color: b.status === 'confirmed' ? '#22c55e' : b.status === 'cancelled' ? '#ef4444' : '#f59e0b',
                      }}>
                        {b.status === 'confirmed' ? 'Confirmé' : b.status === 'cancelled' ? 'Annulé' : 'En attente'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 24px', textAlign: 'right', fontWeight: 700, color: 'var(--text)' }}>
                      {Number(b.totalAmount) === 0 ? 'Gratuit' : `${Number(b.totalAmount).toLocaleString()} FCFA`}
                    </td>
                  </tr>
                ))}
                {myBookings.length === 0 && (
                  <tr><td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: 'var(--text3)' }}>Aucune réservation</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Admin / Organizer view
  return (
    <DashboardLayout>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text)', marginBottom: 2, fontFamily: 'Syne' }}>Dashboard</h1>
          <p style={{ color: 'var(--text2)', fontSize: '0.88rem' }}>Overview of your platform</p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '8px 14px' }}>
            <Search size={15} color="var(--text3)" />
            <input placeholder="Search here..." style={{ border: 'none', outline: 'none', fontSize: '0.82rem', color: 'var(--text)', background: 'transparent', width: 160 }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '8px 14px', cursor: 'pointer' }}>
            <Calendar size={15} color="var(--accent)" />
            <span style={{ fontSize: '0.82rem', color: 'var(--text)', fontWeight: 500 }}>Change Periode</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 28 }}>
        {/* Card 1: Tickets */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--accent-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Ticket size={20} color="var(--accent2)" />
            </div>
            <Sparkline data={[12, 19, 15, 22, 18, 28, 24]} color="#7c5cfc" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'Syne', color: 'var(--text)', marginBottom: 2 }}>{totalTickets.toLocaleString()}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text3)', marginBottom: 8 }}>Tickets</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem' }}>
            <TrendingUp size={14} color="#22c55e" />
            <span style={{ color: '#22c55e', fontWeight: 600 }}>+12.5%</span>
            <span style={{ color: 'var(--text3)' }}>from last week</span>
          </div>
        </div>

        {/* Card 2: Sales */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={20} color="#ef4444" />
            </div>
            <Sparkline data={[28, 24, 30, 22, 26, 20, 18]} color="#ef4444" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'Syne', color: 'var(--text)', marginBottom: 2 }}>{(totalSales / 1000).toFixed(1)}K</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text3)', marginBottom: 8 }}>Sales (FCFA)</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem' }}>
            <TrendingDown size={14} color="#ef4444" />
            <span style={{ color: '#ef4444', fontWeight: 600 }}>-2.3%</span>
            <span style={{ color: 'var(--text3)' }}>from last week</span>
          </div>
        </div>

        {/* Card 3: Revenue */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={20} color="#22c55e" />
            </div>
            <SparklineBar data={[40, 55, 48, 62, 58, 70, 65]} color="#22c55e" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'Syne', color: 'var(--text)', marginBottom: 2 }}>{totalRevenue.toLocaleString()}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text3)', marginBottom: 8 }}>Revenue (FCFA)</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem' }}>
            <TrendingUp size={14} color="#22c55e" />
            <span style={{ color: '#22c55e', fontWeight: 600 }}>+8.1%</span>
            <span style={{ color: 'var(--text3)' }}>from last week</span>
          </div>
        </div>

        {/* Card 4: Featured purple/gradient */}
        <div className="card" style={{ padding: '24px', background: 'linear-gradient(135deg, var(--accent), var(--violet))', border: 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>Ticket Sold Today</div>
            <Sparkline data={[8, 12, 10, 15, 18, 14, 20]} color="rgba(255,255,255,0.6)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'Syne', color: '#fff', marginBottom: 2 }}>456,502</div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', marginBottom: 16 }}>Pcs</div>
          <div style={{ height: 4, background: 'rgba(255,255,255,0.2)', borderRadius: 2, marginBottom: 16, overflow: 'hidden' }}>
            <div style={{ width: '68%', height: '100%', background: '#fff', borderRadius: 2 }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <SparklineBar data={[30, 45, 38, 52, 48, 60, 55]} color="rgba(255,255,255,0.5)" />
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', fontWeight: 600, color: '#fff', opacity: 0.85 }}>
              View Detail <ArrowUpRight size={14} />
            </span>
          </div>
        </div>
      </div>

      {/* Middle Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr', gap: 20, marginBottom: 28, alignItems: 'start' }}>
        {/* Donut Chart - Best Selling */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)', marginBottom: 20 }}>Best Selling</h3>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
            <DonutChart />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'Music', pct: 45, color: '#7c5cfc' },
              { label: 'Tech', pct: 30, color: '#22c55e' },
              { label: 'Sport', pct: 25, color: '#f59e0b' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: '0.82rem', color: 'var(--text2)' }}>{s.label}</span>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text)' }}>{s.pct}%</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text3)', marginBottom: 2 }}>Ticket Left</div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text)' }}>1,234</div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text3)', marginBottom: 2 }}>Ticket Sold</div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text)' }}>856</div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text3)', marginBottom: 2 }}>Event Held</div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text)' }}>{events.length}</div>
            </div>
          </div>
        </div>

        {/* Recent Events */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)' }}>Recent Event</h3>
            <Link to="/dashboard/events" style={{ fontSize: '0.78rem', color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>View All</Link>
          </div>
          <div>
            {(recentEvents.length > 0 ? recentEvents : [
              { id: '1', title: 'Tech Summit Dakar', location: 'Dakar Arena', price: 25000, participants: 420, maxParticipants: 500, cover: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=60&q=80' },
              { id: '2', title: 'Afrobeat Summer', location: "Plage de N'Gor", price: 15000, participants: 850, maxParticipants: 1000, cover: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=60&q=80' },
              { id: '3', title: 'Startup Weekend', location: 'CTIC Dakar', price: 0, participants: 120, maxParticipants: 150, cover: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=60&q=80' },
              { id: '4', title: 'Art & Culture Expo', location: 'IFAN Museum', price: 5000, participants: 200, maxParticipants: 300, cover: 'https://images.unsplash.com/photo-1578926375605-eaf7559b1458?w=60&q=80' },
            ]).map((ev: any) => (
              <div key={ev.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 24px', borderBottom: '1px solid var(--border)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <img src={ev.cover || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=60&q=80'} alt="" style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>{ev.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text3)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MapPin size={11} /> {ev.location}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text)' }}>{ev.price === 0 ? 'Free' : `${ev.price.toLocaleString()} FCFA`}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>{ev.maxParticipants - ev.participants} left</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Calendar */}
        <div className="card" style={{ padding: '24px' }}>
          <CalendarWidget />
        </div>
      </div>

      {/* Bottom Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr 1fr', gap: 20 }}>
        {/* Bar Chart - Sales Comparison */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)', marginBottom: 20 }}>Sales Comparison</h3>
          <svg width="100%" height={160} viewBox="0 0 300 160">
            {[0, 1, 2, 3, 4, 5, 6].map((_, i) => (
              <g key={i}>
                <rect x={i * 40 + 4} y={140 - (30 + Math.sin(i) * 20 + i * 5)} width={14} height={30 + Math.sin(i) * 20 + i * 5} rx={4} fill="#7c5cfc" opacity={0.8} />
                <rect x={i * 40 + 22} y={140 - (25 + Math.cos(i) * 15 + i * 3)} width={14} height={25 + Math.cos(i) * 15 + i * 3} rx={4} fill="#ff5c3a" opacity={0.6} />
              </g>
            ))}
          </svg>
          <div style={{ display: 'flex', gap: 20, marginTop: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: '#7c5cfc' }} />
              <span style={{ fontSize: '0.78rem', color: 'var(--text2)' }}>Current</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: '#ff5c3a' }} />
              <span style={{ fontSize: '0.78rem', color: 'var(--text2)' }}>Previous</span>
            </div>
          </div>
        </div>

        {/* Line Chart - Best Selling Trends */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)', marginBottom: 20 }}>Best Selling Trends</h3>
          <svg width="100%" height={140} viewBox="0 0 280 140">
            <defs>
              <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7c5cfc" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#7c5cfc" stopOpacity={0} />
              </linearGradient>
            </defs>
            <polyline points="0,120 40,100 80,105 120,70 160,85 200,40 240,55 280,20" fill="none" stroke="#7c5cfc" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <polygon points="0,120 40,100 80,105 120,70 160,85 200,40 240,55 280,20 280,140 0,140" fill="url(#lineGrad)" />
            {[[0,120],[40,100],[80,105],[120,70],[160,85],[200,40],[240,55],[280,20]].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={4} fill="var(--surface)" stroke="#7c5cfc" strokeWidth="2" />
            ))}
          </svg>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: '0.7rem', color: 'var(--text3)' }}>
            <span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span><span>Nov</span>
          </div>
        </div>

        {/* Trending Items */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)', marginBottom: 16 }}>Trending Items</h3>
          {[
            { rank: 1, label: 'Tech Summit', sales: 420, color: '#7c5cfc', max: 500 },
            { rank: 2, label: 'Afrobeat Fest', sales: 380, color: '#22c55e', max: 500 },
            { rank: 3, label: 'Art Expo', sales: 280, color: '#f59e0b', max: 500 },
            { rank: 4, label: 'Startup Meet', sales: 190, color: '#ef4444', max: 500 },
          ].map(item => (
            <div key={item.rank} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{
                width: 24, height: 24, borderRadius: 8,
                background: item.rank === 1 ? 'var(--accent-glow)' : item.rank === 2 ? 'rgba(34,197,94,0.1)' : item.rank === 3 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.72rem', fontWeight: 800, color: item.color, flexShrink: 0,
              }}>
                #{item.rank}
              </div>
              <span style={{ flex: 1, fontSize: '0.85rem', fontWeight: 500, color: 'var(--text)' }}>{item.label}</span>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text)' }}>{item.sales}</div>
                <MiniBar value={item.sales} max={item.max} color={item.color} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
