import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Calendar, Users, BarChart2, Settings, Bell, Plus,
  MessageSquare, Shield, Gift, ArrowUpRight, LogOut, ChevronLeft, ChevronRight, Zap, X, Ticket
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const NAV = [
  { icon: LayoutDashboard, label: "Vue d'ensemble", to: '/dashboard', roles: ['admin', 'organizer'] },
  { icon: Calendar, label: 'Mes Événements', to: '/dashboard/events', roles: ['admin', 'organizer'] },
  { icon: Ticket, label: 'Mes Réservations', to: '/dashboard/my-bookings', roles: ['user'] },
  { icon: Users, label: 'Participants', to: '/dashboard/participants', roles: ['admin', 'organizer'] },
  { icon: BarChart2, label: 'Statistiques', to: '/dashboard/stats', roles: ['admin', 'organizer'] },
  { icon: Bell, label: 'Notifications', to: '/dashboard/notifications', badge: 3, roles: ['admin', 'organizer', 'user'] },
  { icon: Settings, label: 'Paramètres', to: '/dashboard/settings', roles: ['admin', 'organizer', 'user'] },
]

const ADMIN_NAV = [
  { icon: Shield, label: 'Utilisateurs', to: '/dashboard/users' },
  { icon: MessageSquare, label: 'Témoignages', to: '/dashboard/reviews' },
]

interface SidebarProps {
  mobileOpen?: boolean
  onMobileClose?: () => void
}

export default function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const initials = user?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'AD'

  const content = (
    <aside style={{
      width: collapsed ? 72 : 260, minHeight: '100vh',
      background: 'var(--bg2)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      transition: 'width 0.3s ease',
      flexShrink: 0, position: 'relative', zIndex: 50,
    }}>
      {/* Logo */}
      <div style={{
        padding: collapsed ? '20px 18px' : '24px 24px 20px',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between', height: 68,
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 34, height: 34, background: 'var(--accent)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 0 16px var(--accent-glow)' }}>
            <Zap size={18} color="#fff" fill="#fff" />
          </div>
          {!collapsed && <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.1rem', color: 'var(--text)', whiteSpace: 'nowrap' }}>Nexus<span style={{ color: 'var(--accent)' }}>Event</span></span>}
        </Link>
        {!collapsed && (
          <button onClick={() => setCollapsed(true)} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 0, padding: 6, color: 'var(--text3)', cursor: 'pointer' }}>
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
      {(user?.role === 'admin' || user?.role === 'organizer') && (
        <div style={{ padding: collapsed ? '16px 12px' : '16px 20px' }}>
          <Link to="/dashboard/events/new" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            background: 'var(--accent)', color: '#fff', borderRadius: 50,
            padding: collapsed ? '10px' : '10px 20px',
            fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none',
          }}>
            <Plus size={16} />
            {!collapsed && 'Créer un événement'}
          </Link>
        </div>
      )}

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '4px 16px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV.filter(item => item.roles.includes(user?.role || 'user')).map(({ icon: Icon, label, to, badge }) => {
          const active = location.pathname === to
          return (
            <Link key={to} to={to} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: collapsed ? '10px' : '10px 14px', borderRadius: 10,
              background: active ? 'var(--accent-glow)' : 'transparent',
              color: active ? 'var(--accent2)' : 'var(--text3)',
              border: active ? '1px solid rgba(255,92,58,0.2)' : '1px solid transparent',
              justifyContent: collapsed ? 'center' : 'flex-start', position: 'relative',
              fontSize: '0.88rem', textDecoration: 'none', transition: 'all 0.15s',
            }}
              onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = 'var(--surface)'; (e.currentTarget as HTMLElement).style.color = 'var(--text)' } }}
              onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--text3)' } }}
            >
              <Icon size={18} style={{ flexShrink: 0 }} />
              {!collapsed && <span style={{ fontSize: '0.88rem', fontWeight: 500, whiteSpace: 'nowrap' }}>{label}</span>}
              {badge && !collapsed && <span style={{ marginLeft: 'auto', background: 'var(--accent)', color: '#fff', borderRadius: 0, padding: '2px 8px', fontSize: '0.72rem', fontWeight: 700 }}>{badge}</span>}
              {badge && collapsed && <span style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, background: 'var(--accent)', borderRadius: '50%' }} />}
            </Link>
          )
        })}
        {user?.role === 'admin' && !collapsed && (
          <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text3)', padding: '16px 14px 8px', marginTop: 8, borderTop: '1px solid var(--border)' }}>
            Administration
          </div>
        )}
        {user?.role === 'admin' && ADMIN_NAV.map(({ icon: Icon, label, to }) => {
          const active = location.pathname === to
          return (
            <Link key={to} to={to} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: collapsed ? '10px' : '10px 14px', borderRadius: 10,
              background: active ? 'var(--accent-glow)' : 'transparent',
              color: active ? 'var(--accent2)' : 'var(--text3)',
              border: active ? '1px solid rgba(255,92,58,0.2)' : '1px solid transparent',
              justifyContent: collapsed ? 'center' : 'flex-start',
              fontSize: '0.88rem', textDecoration: 'none', transition: 'all 0.15s',
            }}
              onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = 'var(--surface)'; (e.currentTarget as HTMLElement).style.color = 'var(--text)' } }}
              onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--text3)' } }}
            >
              <Icon size={18} style={{ flexShrink: 0 }} />
              {!collapsed && <span style={{ fontSize: '0.88rem', fontWeight: 500, whiteSpace: 'nowrap' }}>{label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Promo Card */}
      {!collapsed && (
        <div style={{ padding: '16px', margin: '4px 12px 12px' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--accent), var(--violet))',
            borderRadius: 16, padding: '20px', textAlign: 'center',
          }}>
            <Gift size={32} color="rgba(255,255,255,0.3)" style={{ marginBottom: 12 }} />
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', marginBottom: 4 }}>
              Ticket Sales Weekly
            </div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', marginBottom: 16, lineHeight: 1.5 }}>
              Get the latest report
            </div>
            <Link to="#" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(255,255,255,0.2)', color: '#fff',
              borderRadius: 50, padding: '8px 20px', fontSize: '0.8rem', fontWeight: 600,
              textDecoration: 'none',
            }}>
              Learn more <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      )}

      {/* User */}
      <div style={{ padding: collapsed ? '16px 12px' : '16px 20px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12, justifyContent: collapsed ? 'center' : 'flex-start' }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--violet))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: 'Syne', fontWeight: 700, fontSize: '0.85rem', color: '#fff' }}>{initials}</div>
        {!collapsed && (
          <>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name || 'Utilisateur'}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>{user?.email || ''}</div>
            </div>
            <button onClick={() => { logout(); navigate('/login') }} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', padding: 4, transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text3)'}>
              <LogOut size={16} />
            </button>
          </>
        )}
      </div>
    </aside>
  )

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div onClick={onMobileClose} className="hide-desktop" style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          zIndex: 49,
        }} />
      )}
      <div className={`sidebar-mobile ${mobileOpen ? 'sidebar-mobile-open' : ''}`} style={{
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50,
        transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease',
      }}>
        {content}
      </div>
      <div className="hide-mobile" style={{ flexShrink: 0 }}>
        {content}
      </div>
    </>
  )
}
