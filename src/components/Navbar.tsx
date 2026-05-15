import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Zap, Menu, X } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  const links = ['Événements', 'Comment ça marche', 'Témoignages', 'Contact']

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, background: 'var(--accent)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px var(--accent-glow)' }}>
            <Zap size={20} color="#fff" fill="#fff" />
          </div>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.02em' }}>
            Nexus<span style={{ color: 'var(--accent)' }}>Event</span>
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="hide-mobile">
          {links.map(l => (
            <a key={l} href={`#${l}`} style={{ padding: '8px 16px', borderRadius: 8, fontSize: '0.9rem', color: 'var(--text2)', transition: 'all 0.2s', fontWeight: 500 }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.background = 'var(--surface)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text2)'; e.currentTarget.style.background = 'transparent' }}>
              {l}
            </a>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }} className="hide-mobile">
          <Link to="/login" className="btn btn-ghost btn-sm">Connexion</Link>
          <Link to="/register" className="btn btn-primary btn-sm">S'inscrire</Link>
        </div>

        <button className="btn btn-ghost hide-desktop" style={{ padding: 8 }} onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)', padding: '16px 24px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {links.map(l => (
            <a key={l} href={`#${l}`} style={{ padding: '12px 16px', borderRadius: 8, color: 'var(--text2)', fontSize: '0.95rem' }} onClick={() => setOpen(false)}>{l}</a>
          ))}
          <div style={{ height: 1, background: 'var(--border)', margin: '8px 0' }} />
          <Link to="/login" className="btn btn-secondary" onClick={() => setOpen(false)}>Connexion</Link>
          <Link to="/register" className="btn btn-primary" onClick={() => setOpen(false)}>S'inscrire</Link>
        </div>
      )}
    </nav>
  )
}
