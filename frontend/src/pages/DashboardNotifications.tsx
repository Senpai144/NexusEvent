import { useState } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { Bell, AlertCircle, Info, CheckCircle, X } from 'lucide-react'

const DEMO_NOTIFICATIONS = [
  { type: 'info', msg: '15 nouvelles inscriptions pour Tech Summit', time: 'il y a 5 min', read: false },
  { type: 'success', msg: 'Paiement de 75 000 FCFA reçu pour Festival Afrobeat', time: 'il y a 1h', read: false },
  { type: 'warning', msg: 'Festival Afrobeat : capacité à 85%', time: 'il y a 3h', read: false },
  { type: 'info', msg: 'Nouvel organisateur inscrit : Fatou Sarr', time: 'il y a 1 jour', read: true },
  { type: 'success', msg: 'Événement "Startup Weekend" atteint 100 participants', time: 'il y a 2 jours', read: true },
  { type: 'info', msg: 'Rappel : Mettre à jour les photos du Tech Summit', time: 'il y a 3 jours', read: true },
  { type: 'warning', msg: 'Plongée sous-marine Gorée : 2 places restantes', time: 'il y a 4 jours', read: true },
  { type: 'success', msg: 'Revenu mensuel record : 1.2M FCFA', time: 'il y a 5 jours', read: true },
  { type: 'info', msg: 'Nouvelle fonctionnalité : Export des participants disponible', time: 'il y a 1 semaine', read: true },
]

export default function DashboardNotifications() {
  const [notifications, setNotifications] = useState(DEMO_NOTIFICATIONS)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const filtered = filter === 'all' ? notifications : notifications.filter(n => !n.read)

  const markAsRead = (index: number) => {
    setNotifications(notifications.map((n, i) => i === index ? { ...n, read: true } : n))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const unreadCount = notifications.filter(n => !n.read).length

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle size={20} color="#22c55e" />
      case 'warning': return <AlertCircle size={20} color="#f59e0b" />
      default: return <Info size={20} color="var(--violet)" />
    }
  }

  const getBg = (type: string) => {
    switch (type) {
      case 'success': return 'rgba(34,197,94,0.08)'
      case 'warning': return 'rgba(245,158,11,0.08)'
      default: return 'rgba(124,92,252,0.08)'
    }
  }

  return (
    <DashboardLayout maxWidth={900}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 4 }}>Notifications</h1>
            <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
              {unreadCount > 0 ? `${unreadCount} notification${unreadCount > 1 ? 's' : ''} non lue${unreadCount > 1 ? 's' : ''}` : 'Tout est à jour'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ display: 'flex', background: 'var(--bg3)', borderRadius: 10, padding: 3 }}>
              {(['all', 'unread'] as const).map(f => (
                <button key={f} style={{ padding: '6px 16px', borderRadius: 8, border: 'none', background: filter === f ? 'var(--surface)' : 'transparent', color: 'var(--text)', fontSize: '0.83rem', fontWeight: filter === f ? 600 : 400, cursor: 'pointer', boxShadow: filter === f ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
                  onClick={() => setFilter(f)}>
                  {f === 'all' ? 'Toutes' : 'Non lues'}
                </button>
              ))}
            </div>
            {unreadCount > 0 && (
              <button className="btn btn-secondary" style={{ fontSize: '0.83rem' }} onClick={markAllAsRead}>
                Tout marquer lu
              </button>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.length === 0 ? (
            <div className="card" style={{ padding: '60px', textAlign: 'center' }}>
              <Bell size={48} color="var(--text3)" opacity={0.3} style={{ marginBottom: 16 }} />
              <div style={{ color: 'var(--text3)', fontSize: '1rem' }}>Aucune notification</div>
            </div>
          ) : (
            filtered.map((n, i) => (
              <div key={i} className="card" style={{ padding: '18px 24px', display: 'flex', gap: 16, alignItems: 'flex-start', opacity: n.read ? 0.6 : 1, borderLeft: `3px solid ${n.type === 'success' ? '#22c55e' : n.type === 'warning' ? '#f59e0b' : 'var(--violet)'}` }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: getBg(n.type), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {getIcon(n.type)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.92rem', lineHeight: 1.5, fontWeight: n.read ? 400 : 600 }}>{n.msg}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text3)', marginTop: 6 }}>{n.time}</div>
                </div>
                {!n.read && (
                  <button style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', padding: 4 }} onClick={() => markAsRead(i)} title="Marquer comme lu">
                    <X size={16} />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
    </DashboardLayout>
  )
}
