import { useState } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import {
  Calendar, Users, TrendingUp, DollarSign, Plus, Bell, Search,
  MapPin, ArrowUpRight, Eye, Edit2, Trash2,
  ChevronRight, Star, AlertCircle
} from 'lucide-react'

interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: 'Tech' | 'Musique' | 'Business' | 'Art';
  status: 'upcoming' | 'ongoing' | 'past' | 'cancelled';
  participants: number;
  max: number;
  revenue: string;
  cover: string;
}

const STATS = [
  { label: 'Événements actifs', value: '12', change: '+3', positive: true, icon: Calendar, color: 'var(--accent)' },
  { label: 'Total participants', value: '2,840', change: '+18%', positive: true, icon: Users, color: 'var(--violet)' },
  { label: 'Revenus du mois', value: '1.24M FCFA', change: '+32%', positive: true, icon: DollarSign, color: '#22c55e' },
  { label: 'Taux de conversion', value: '68%', change: '-2%', positive: false, icon: TrendingUp, color: '#f59e0b' },
]

const EVENTS: EventItem[] = [
  { id: '1', title: 'Tech Summit Dakar 2026', date: '15 Juin 2026', time: '09:00', location: 'Dakar Arena', category: 'Tech', status: 'upcoming', participants: 420, max: 500, revenue: '525 000', cover: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=80&q=80' },
  { id: '2', title: 'Festival Afrobeat Summer', date: '22 Juin 2026', time: '18:00', location: 'Plage de N\'Gor', category: 'Musique', status: 'upcoming', participants: 850, max: 1000, revenue: '12 750 000', cover: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=80&q=80' },
  { id: '3', title: 'Startup Weekend Africa', date: '5 Juillet 2026', time: '08:00', location: 'CTIC Dakar', category: 'Business', status: 'upcoming', participants: 120, max: 150, revenue: 'Gratuit', cover: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=80&q=80' },
  { id: '4', title: 'Art & Culture Expo', date: '12 Juillet 2026', time: '10:00', location: 'IFAN Museum', category: 'Art', status: 'cancelled', participants: 0, max: 300, revenue: '0', cover: 'https://images.unsplash.com/photo-1578926375605-eaf7559b1458?w=80&q=80' },
]

const NOTIFICATIONS = [
  { type: 'info', msg: '15 nouvelles inscriptions pour Tech Summit', time: 'il y a 5 min' },
  { type: 'success', msg: 'Paiement de 75 000 FCFA reçu', time: 'il y a 1h' },
  { type: 'warning', msg: 'Festival Afrobeat : capacité à 85%', time: 'il y a 3h' },
]

const BADGE_MAP: Record<string, string> = {
  upcoming: 'badge-success', ongoing: 'badge-violet', past: 'badge-warning', cancelled: 'badge-danger'
}
const STATUS_LABEL: Record<string, string> = {
  upcoming: 'À venir', ongoing: 'En cours', past: 'Terminé', cancelled: 'Annulé'
}
const CAT_COLORS: Record<string, string> = {
  Tech: 'var(--violet)', Musique: 'var(--accent)', Business: 'var(--warning)', Art: 'var(--success)'
}

export default function Dashboard() {
  const [search, setSearch] = useState('')
  const [showNotifs, setShowNotifs] = useState(false)

  const filtered = EVENTS.filter(e => e.title.toLowerCase().includes(search.toLowerCase()))

  return (
    <div style={{ display: 'flex', flexDirection: 'row', minHeight: '100vh', background: 'var(--bg)', flexWrap: 'wrap' }}>
      <Sidebar />

      <div style={{ flex: '1 1 300px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* Header Responsive */}
        <header style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)', padding: '16px 24px', minHeight: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(12px)', flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Vue d'ensemble</h1>
            <p style={{ fontSize: '0.78rem', color: 'var(--text3)', textTransform: 'capitalize' }}>
              {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', minWidth: '160px' }}>
              <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)' }} />
              <input
                type="text" placeholder="Rechercher..." value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: '8px 12px 8px 36px', color: 'var(--text)', fontSize: '0.85rem', width: '100%', maxWidth: 200, outline: 'none' }}
              />
            </div>

            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowNotifs(!showNotifs)} style={{ position: 'relative', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text2)', cursor: 'pointer' }}>
                <Bell size={17} />
                <span style={{ position: 'absolute', top: -4, right: -4, width: 16, height: 16, background: 'var(--accent)', borderRadius: '50%', fontSize: '0.65rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--bg2)' }}>3</span>
              </button>
              {showNotifs && (
                <div style={{ position: 'absolute', top: 48, right: 0, width: window.innerWidth < 400 ? 280 : 320, background: 'var(--surface)', border: '1px solid var(--border2)', borderRadius: 16, boxShadow: '0 16px 48px rgba(0,0,0,0.5)', zIndex: 100, overflow: 'hidden' }}>
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: 'Syne', fontWeight: 700 }}>Notifications</span>
                    <span className="badge badge-accent">3 nouvelles</span>
                  </div>
                  {NOTIFICATIONS.map((n, i) => (
                    <div key={i} style={{ padding: '14px 20px', borderBottom: i < NOTIFICATIONS.length - 1 ? '1px solid var(--border)' : 'none', cursor: 'pointer' }}>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: n.type === 'success' ? 'var(--success)' : n.type === 'warning' ? 'var(--warning)' : 'var(--violet)', marginTop: 5, flexShrink: 0 }} />
                        <div>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text)', lineHeight: 1.4, marginBottom: 4 }}>{n.msg}</p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>{n.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--violet))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>AD</div>

            <Link to="/" className="btn btn-primary btn-sm" style={{ gap: 6 }}>
              <Plus size={15} /> <span style={{ display: window.innerWidth < 480 ? 'none' : 'inline' }}>Créer</span>
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main style={{ padding: window.innerWidth < 768 ? '20px' : '32px', flex: 1 }}>
          <div className="fade-up" style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 4 }}>Bonjour, Admin 👋</h2>
            <p style={{ color: 'var(--text2)', fontSize: '0.92rem' }}>Voici un résumé de vos activités récentes.</p>
          </div>

          {/* Grille des Stats - Adaptative */}
          <div className="fade-up-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20, marginBottom: 32 }}>
            {STATS.map(({ label, value, change, positive, icon: Icon, color }) => (
              <div key={label} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text3)', fontWeight: 500 }}>{label}</span>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={18} color={color} />
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'Syne', marginBottom: 4 }}>{value}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    <ArrowUpRight size={13} color={positive ? 'var(--success)' : 'var(--danger)'} style={{ transform: positive ? 'none' : 'rotate(90deg)' }} />
                    <span style={{ fontSize: '0.8rem', color: positive ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>{change}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>vs mois dernier</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Conteneur de Table avec défilement horizontal sécurisé */}
          <div className="fade-up-2 card" style={{ padding: 0, overflow: 'hidden', marginBottom: 24 }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h3 style={{ fontWeight: 700, fontSize: '1.05rem' }}>Mes Événements</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text3)', marginTop: 2 }}>{filtered.length} événement{filtered.length > 1 ? 's' : ''}</p>
              </div>
            </div>

            <div style={{ overflowX: 'auto', width: '100%' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--bg3)' }}>
                    {['Événement', 'Date & Lieu', 'Participants', 'Revenus', 'Statut', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.78rem', color: 'var(--text3)', fontWeight: 600, fontFamily: 'Syne', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((ev) => (
                    <tr key={ev.id} style={{ borderTop: '1px solid var(--border)', transition: 'background 0.2s' }}>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <img src={ev.cover} alt={ev.title} style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 4, whiteSpace: 'nowrap' }}>{ev.title}</div>
                            <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: 6, background: `${CAT_COLORS[ev.category]}22`, color: CAT_COLORS[ev.category], fontWeight: 600 }}>{ev.category}</span>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text2)', fontSize: '0.83rem', marginBottom: 4, whiteSpace: 'nowrap' }}>
                          <Calendar size={13} /> {ev.date}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text3)', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                          <MapPin size={12} /> {ev.location}
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ fontSize: '0.88rem', fontWeight: 600, marginBottom: 6 }}>
                          {ev.participants}<span style={{ color: 'var(--text3)', fontWeight: 400 }}>/{ev.max}</span>
                        </div>
                        <div style={{ background: 'var(--bg3)', borderRadius: 100, height: 5, width: 80 }}>
                          <div style={{ height: '100%', width: ev.max > 0 ? `${Math.min((ev.participants / ev.max) * 100, 100)}%` : '0%', background: ev.participants / ev.max > 0.85 ? 'var(--warning)' : 'var(--accent)', borderRadius: 100, transition: 'width 0.5s ease' }} />
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: ev.revenue === 'Gratuit' ? 'var(--success)' : 'var(--text)', whiteSpace: 'nowrap' }}>
                          {ev.revenue === 'Gratuit' ? 'Gratuit' : `${ev.revenue} FCFA`}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span className={`badge ${BADGE_MAP[ev.status]}`}>{STATUS_LABEL[ev.status]}</span>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          {[{ Icon: Eye, title: 'Voir' }, { Icon: Edit2, title: 'Modifier' }, { Icon: Trash2, title: 'Supprimer' }].map(({ Icon, title }) => (
                            <button key={title} title={title} style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--surface2)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: title === 'Supprimer' ? 'var(--danger)' : 'var(--text3)', cursor: 'pointer' }}>
                              <Icon size={14} />
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filtered.length === 0 && (
              <div style={{ padding: 60, textAlign: 'center' }}>
                <AlertCircle size={40} color="var(--text3)" style={{ margin: '0 auto 16px' }} />
                <p style={{ color: 'var(--text3)' }}>Aucun événement trouvé pour "{search}"</p>
              </div>
            )}
          </div>

          {/* Widgets du Bas - S'empilent proprement sur tablette/mobile */}
          <div className="fade-up-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>Inscriptions par mois</h3>
                <span className="badge badge-success">↑ +24%</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120 }}>
                {[45, 72, 58, 88, 64, 95, 78].map((v, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: '100%', height: `${v}%`, background: i === 6 ? 'var(--accent)' : 'var(--surface2)', borderRadius: '6px 6px 0 0', cursor: 'pointer' }} />
                    <span style={{ fontSize: '0.7rem', color: 'var(--text3)' }}>{['J', 'F', 'M', 'A', 'M', 'J', 'J'][i]}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>Top événements</h3>
                <a href="#" style={{ fontSize: '0.82rem', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  Voir tout <ChevronRight size={14} />
                </a>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {EVENTS.slice(0, 3).map((ev, i) => (
                  <div key={ev.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ width: 24, height: 24, borderRadius: 6, background: i === 0 ? 'var(--accent-glow)' : 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, fontFamily: 'Syne', color: i === 0 ? 'var(--accent)' : 'var(--text3)', flexShrink: 0 }}>
                      {i + 1}
                    </span>
                    <img src={ev.cover} alt="" style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ev.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>{ev.participants} participants</div>
                    </div>
                    {i === 0 && <Star size={14} fill="var(--gold)" color="var(--gold)" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}