import { Zap, Share2, Camera, Briefcase, Code } from 'lucide-react'

export default function Footer() {
  const cols = [
    { title: 'Produit', items: ['Fonctionnalités', 'Tarifs', 'Roadmap', 'Changelog'] },
    { title: 'Ressources', items: ['Documentation', 'Guide démarrage', 'Blog', 'Support'] },
    { title: 'Entreprise', items: ['À propos', 'Équipe', 'Carrières', 'Contact'] },
  ]
  const socials = [Share2, Camera, Briefcase, Code]

  return (
    <footer style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)', padding: '60px 0 32px' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 48, marginBottom: 48 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, background: 'var(--accent)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={20} color="#fff" fill="#fff" />
              </div>
              <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.2rem' }}>Nexus<span style={{ color: 'var(--accent)' }}>Event</span></span>
            </div>
            <p style={{ color: 'var(--text2)', fontSize: '0.88rem', lineHeight: 1.7, marginBottom: 20 }}>
              La plateforme de gestion d'événements moderne pour créer des expériences inoubliables.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              {socials.map((Icon, i) => (
                <a key={i} href="#" style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text3)', border: '1px solid var(--border)', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.borderColor = 'var(--accent)' }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--text3)'; e.currentTarget.style.borderColor = 'var(--border)' }}>
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {cols.map(col => (
            <div key={col.title}>
              <h4 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.88rem', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text3)' }}>{col.title}</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {col.items.map(item => (
                  <li key={item}>
                    <a href="#" style={{ color: 'var(--text2)', fontSize: '0.88rem', transition: 'color 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--text2)'}>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="glow-line" style={{ marginBottom: 24 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ color: 'var(--text3)', fontSize: '0.85rem' }}>© 2025 NexusEvent. Tous droits réservés.</p>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Confidentialité', 'CGU', 'Cookies'].map(t => (
              <a key={t} href="#" style={{ color: 'var(--text3)', fontSize: '0.85rem' }}>{t}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
