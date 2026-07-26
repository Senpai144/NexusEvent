import { useState, useEffect } from 'react'
import { Star, Quote, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { reviewsApi } from '../services/api'

const FALLBACK_REVIEWS = [
  { id: 1, name: 'Abdoulaye Diop', role: 'Passionné de Surf', text: "Les cours de surf à la Somone étaient incroyables. L'organisation via EventFlow est d'une fluidité rare. Je recommande !", avatar: 'AD', rating: 5 },
  { id: 2, name: 'Khady Ndiaye', role: 'Artiste Amateur', text: "L'atelier Peinture & Vin est mon rendez-vous mensuel. J'adore l'interface fluide et la facilité de paiement par Orange Money.", avatar: 'KN', rating: 5 },
  { id: 3, name: 'Mamadou Fall', role: 'Entrepreneur', text: 'Le Startup Weekend Africa a changé ma vision du business. Une communauté en or et du contenu de qualité supérieure.', avatar: 'MF', rating: 5 },
  { id: 4, name: 'Fatou Sarr', role: 'Touriste', text: "J'ai découvert Dakar grâce aux événements NexusEvent. La plongée à Gorée était l'expérience d'une vie !", avatar: 'FS', rating: 5 },
  { id: 5, name: 'Ibrahima Ba', role: 'Musicien', text: "Le Festival Afrobeat Summer était incroyable. Organisation parfaite, son de qualité et une ambiance de folie. À l'année prochaine !", avatar: 'IB', rating: 5 },
]

export default function TestimonialsPage() {
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
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '100px 0' }}>
      <div className="container">
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--text3)', fontSize: '0.85rem', marginBottom: 32 }}>
          <ArrowLeft size={16} /> Retour à l'accueil
        </Link>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <span className="badge badge-success" style={{ marginBottom: '16px' }}>Témoignages</span>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, fontFamily: 'Syne' }}>
            Ils font confiance à <span className="gradient-text">NexusEvent</span>
          </h2>
          <p style={{ color: 'var(--text2)', marginTop: '16px', maxWidth: '600px', margin: '16px auto 0' }}>
            Découvrez les retours de notre communauté d'organisateurs et de participants.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
          {displayed.map((review: any) => (
            <div key={review.id} className="card" style={{ padding: '32px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '24px', position: 'relative', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Quote size={40} style={{ position: 'absolute', top: 20, right: 20, opacity: 0.05, color: 'var(--accent)' }} />
              <div style={{ display: 'flex', gap: '4px' }}>
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} size={16} fill="var(--warning)" color="var(--warning)" />
                ))}
              </div>
              <p style={{ color: 'var(--text2)', fontSize: '1rem', lineHeight: '1.6', fontStyle: 'italic', flexGrow: 1 }}>
                "{review.text}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--accent), var(--violet))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.9rem' }}>
                  {review.avatar}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>{review.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>{review.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
