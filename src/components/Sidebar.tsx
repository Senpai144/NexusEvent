import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Zap, LayoutDashboard, Calendar, Users, BarChart2, Settings, LogOut, ChevronLeft, ChevronRight, Bell, Plus } from 'lucide-react'

const NAV = [
  { icon: LayoutDashboard, label: "Vue d'ensemble", to: '/dashboard' },
  { icon: Calendar, label: 'Mes Événements', to: '/dashboard/events' },
  { icon: Users, label: 'Participants', to: '/dashboard/participants' },
  { icon: BarChart2, label: 'Statistiques', to: '/dashboard/stats' },
  { icon: Bell, label: 'Notifications', to: '/dashboard/notifications', badge: 3 },
  { icon: Settings, label: 'Paramètres', to: '/dashboard/settings' },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <aside style={{
      width: collapsed ? 72 : 240, minHeight: '100vh',
      background: 'var(--bg2)', borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      transition: 'width 0.3s ease', position: 'relative', flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: collapsed ? '20px 18px' : '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between', height: 68 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, background: 'var(--accent)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 0 16px var(--accent-glow)' }}>
            <Zap size={18} color="#fff" fill="#fff" />
          </div>
          {!collapsed && <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.1rem', whiteSpace: 'nowrap' }}>Nexus<span style={{ color: 'var(--accent)' }}>Event</span></span>}
        </Link>
        {!collapsed && (
          <button onClick={() => setCollapsed(true)} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: 6, color: 'var(--text3)', cursor: 'pointer' }}>
            <ChevronLeft size={14} />
          </button>
        )}
      </div>

      {collapsed && (
        <button onClick={() => setCollapsed(false)} style={{ position: 'absolute', top: 24, right: -14, zIndex: 10, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text2)', cursor: 'pointer' }}>
          <ChevronRight size={14} />
        </button>
      )}

      {/* New Event button */}
      <div style={{ padding: collapsed ? '16px 12px' : '16px' }}>
        <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: collapsed ? '10px' : '10px 16px', fontSize: '0.85rem' }}>
          <Plus size={16} />
          {!collapsed && 'Créer un événement'}
        </button>
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV.map(({ icon: Icon, label, to, badge }) => {
          const active = location.pathname === to
          return (
            <Link key={to} to={to} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: collapsed ? '10px' : '10px 12px', borderRadius: 10, transition: 'all 0.2s',
              background: active ? 'var(--accent-glow)' : 'transparent',
              color: active ? 'var(--accent2)' : 'var(--text3)',
              border: active ? '1px solid rgba(255,92,58,0.2)' : '1px solid transparent',
              justifyContent: collapsed ? 'center' : 'flex-start', position: 'relative',
            }}
              onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = 'var(--surface)'; (e.currentTarget as HTMLElement).style.color = 'var(--text)' } }}
              onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--text3)' } }}
            >
              <Icon size={18} style={{ flexShrink: 0 }} />
              {!collapsed && <span style={{ fontSize: '0.88rem', fontWeight: 500, whiteSpace: 'nowrap' }}>{label}</span>}
              {badge && !collapsed && <span style={{ marginLeft: 'auto', background: 'var(--accent)', color: '#fff', borderRadius: 100, padding: '2px 8px', fontSize: '0.72rem', fontWeight: 700 }}>{badge}</span>}
              {badge && collapsed && <span style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, background: 'var(--accent)', borderRadius: '50%' }} />}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div style={{ padding: collapsed ? '16px 12px' : '16px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12, justifyContent: collapsed ? 'center' : 'flex-start' }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--violet))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: 'Syne', fontWeight: 700, fontSize: '0.85rem' }}>AD</div>
        {!collapsed && (
          <>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Admin User</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>admin@eventflow.com</div>
            </div>
            <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', padding: 4, transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text3)'}>
              <LogOut size={16} />
            </button>
          </>
        )}
      </div>
    </aside>
  )
}
