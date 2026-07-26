import { useState, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from './Sidebar'
import { Search, Bell, Gift, ChevronDown, Menu } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

interface Props {
  children: ReactNode
}

export default function DashboardLayout({ children }: Props) {
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <Sidebar mobileOpen={sidebarOpen} onMobileClose={() => setSidebarOpen(false)} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Navbar */}
        <header style={{
          height: 68, background: 'var(--bg2)', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 32px', position: 'sticky', top: 0, zIndex: 40,
        }}>
          <button className="hide-desktop btn btn-ghost" style={{ padding: 8, marginRight: 8 }} onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            background: 'var(--bg3)', borderRadius: 10, padding: '8px 16px', width: 320,
          }}>
            <Search size={16} color="var(--text3)" />
            <input placeholder="Search here..." style={{
              border: 'none', background: 'transparent', outline: 'none',
              fontSize: '0.85rem', color: 'var(--text)', width: '100%',
            }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button style={{ width: 38, height: 38, borderRadius: 10, border: 'none', background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}>
              <Bell size={17} color="var(--text2)" />
              <span style={{ position: 'absolute', top: 6, right: 6, width: 7, height: 7, background: 'var(--danger)', borderRadius: '50%' }} />
            </button>
            <button style={{ width: 38, height: 38, borderRadius: 10, border: 'none', background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}>
              <Gift size={17} color="var(--text2)" />
              <span style={{ position: 'absolute', top: 6, right: 6, width: 7, height: 7, background: 'var(--danger)', borderRadius: '50%' }} />
            </button>
            <button style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 12px 6px 6px', borderRadius: 10, border: 'none',
              background: 'var(--bg3)', cursor: 'pointer', fontSize: '0.82rem', color: 'var(--text)', fontWeight: 500,
            }}>
              <span style={{ fontSize: '0.8rem' }}>🇬🇧</span>
              <span>English</span>
              <ChevronDown size={14} color="var(--text3)" />
            </button>
            {user && (
              <Link to="/dashboard/settings" style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '4px 12px 4px 4px', borderRadius: 10, textDecoration: 'none',
                background: 'var(--bg3)', cursor: 'pointer',
              }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.78rem', color: '#fff' }}>
                  {user.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'U'}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)' }}>{user.name || 'Admin'}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text3)' }}>Super Admin</div>
                </div>
              </Link>
            )}
          </div>
        </header>

        {/* Main content */}
        <main style={{ flex: 1, padding: '28px 32px', overflow: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
