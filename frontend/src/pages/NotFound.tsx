import { Link } from 'react-router-dom'
import { Zap, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)', padding: 24, textAlign: 'center',
    }}>
      <div style={{
        fontSize: '8rem', fontWeight: 900, fontFamily: 'Syne, sans-serif',
        background: 'linear-gradient(135deg, var(--accent), var(--violet))',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        lineHeight: 1, marginBottom: 8,
      }}>
        404
      </div>
      <div style={{
        width: 80, height: 80, borderRadius: '50%',
        background: 'var(--accent-glow)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 24,
      }}>
        <Zap size={36} color="var(--accent)" fill="var(--accent)" />
      </div>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 8 }}>
        Page introuvable
      </h1>
      <p style={{ color: 'var(--text2)', fontSize: '0.95rem', marginBottom: 32, maxWidth: 400 }}>
        Oups ! Cette page n'existe pas ou a été déplacée.
        Revenez à l'accueil pour continuer votre expérience NexusEvent.
      </p>
      <Link to="/" className="btn btn-primary" style={{ gap: 8, padding: '14px 32px' }}>
        <Home size={18} /> Retour à l'accueil
      </Link>
    </div>
  )
}
