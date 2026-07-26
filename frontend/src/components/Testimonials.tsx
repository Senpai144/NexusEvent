import { useState, useEffect } from 'react'
import { Star, Quote } from 'lucide-react'
import { reviewsApi } from '../services/api'

const FALLBACK_REVIEWS = [
  { id: 1, name: 'Abdoulaye Diop', role: 'Passionné de Surf', text: "Les cours de surf à la Somone étaient incroyables. L'organisation via EventFlow est d'une fluidité rare. Je recommande !", avatar: 'AD', rating: 5 },
  { id: 2, name: 'Khady Ndiaye', role: 'Artiste Amateur', text: "L'atelier Peinture & Vin est mon rendez-vous mensuel. J'adore l'interface fluide et la facilité de paiement par Orange Money.", avatar: 'KN', rating: 5 },
  { id: 3, name: 'Mamadou Fall', role: 'Entrepreneur', text: 'Le Startup Weekend Africa a changé ma vision du business. Une communauté en or et du contenu de qualité supérieure.', avatar: 'MF', rating: 5 },
  { id: 4, name: 'Fatou Sarr', role: 'Touriste', text: "J'ai découvert Dakar grâce aux événements NexusEvent. La plongée à Gorée était l'expérience d'une vie !", avatar: 'FS', rating: 5 },
  { id: 5, name: 'Ibrahima Ba', role: 'Musicien', text: "Le Festival Afrobeat Summer était incroyable. Organisation parfaite, son de qualité et une ambiance de folie. À l'année prochaine !", avatar: 'IB', rating: 5 },
]

export default function Testimonials() {
  const [reviews, setReviews] = useState<any[]>([])

  useEffect(() => {
    reviewsApi.getAll()
      .then(res => {
        if (res.data.length > 0) {
          setReviews(res.data.map((r: any) => ({
            id: r.id,
            name: r.user?.name || 'Anonyme',
            role: r.role || 'Participant',
            text: r.text,
            avatar: (r.user?.name || 'An').split(' ').map((n: string) => n[0]).join('').toUpperCase(),
            rating: r.rating,
          })))
        } else {
          setReviews(FALLBACK_REVIEWS)
        }
      })
      .catch(() => setReviews(FALLBACK_REVIEWS))
  }, [])

  const displayed = reviews.length > 0 ? reviews : FALLBACK_REVIEWS

  return (
    <section style={{ padding: '80px 0', background: 'var(--surface)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span className="badge badge-accent" style={{ marginBottom: 16 }}>Témoignages</span>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800, fontFamily: 'Syne' }}>Ce qu'ils disent</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {displayed.slice(0, 6).map((r, i) => (
            <div key={r.id} className="card fade-up" style={{ padding: 28, position: 'relative', animationDelay: `${i * 0.08}s` }}>
              <Quote size={32} color="var(--accent)" opacity={0.15} style={{ position: 'absolute', top: 20, right: 20 }} />
              <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
                {Array.from({ length: r.rating }).map((_, j) => (
                  <Star key={j} size={16} color="var(--warning)" fill="var(--warning)" />
                ))}
              </div>
              <p style={{ color: 'var(--text2)', fontSize: '0.92rem', lineHeight: 1.7, marginBottom: 20, fontStyle: 'italic' }}>
                "{r.text}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--violet))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne', fontWeight: 700, fontSize: '0.8rem', color: '#fff' }}>
                  {r.avatar}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{r.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>{r.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
