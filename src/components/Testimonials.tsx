import { Star, Quote } from 'lucide-react'

const REVIEWS = [
  { 
    id: 1, 
    name: 'Abdoulaye Diop', 
    role: 'Passionné de Surf', 
    text: "Les cours de surf à la Somone étaient incroyables. L'organisation via EventFlow est d'une fluidité rare. Je recommande !", 
    avatar: 'AD', 
    rating: 5 
  },
  { 
    id: 2, 
    name: 'Khady Ndiaye', 
    role: 'Artiste Amateur', 
    text: "L'atelier Peinture & Vin est mon rendez-vous mensuel. J'adore l'interface fluide et la facilité de paiement par Orange Money.", 
    avatar: 'KN', 
    rating: 5 
  },
  { 
    id: 3, 
    name: 'Ndeye Anta FOMBA', 
    role: 'Touriste', 
    text: "La plongée à Gorée était magique. Le système de rappel par email d'EventFlow m'a évité d'oublier l'heure du RDV.", 
    avatar: 'ML', 
    rating: 5 
  },
   { 
    id: 4, 
    name: 'Penda BADIANE', 
    role: 'Touriste', 
    text: "L'atelier Peinture & l'ambiance était une expérience enrichissante. J'ai adoré chaque instant !", 
    avatar: 'PD', 
    rating: 5 
  },
   { 
    id: 4, 
    name: 'Modou LO', 
    role: 'Touriste', 
    text: "l'exposition Art & Culture à l'IFAN était fascinante. La plateforme EventFlow a rendu la réservation simple et rapide.", 
    avatar: 'ML', 
    rating: 5 
  },
]

const TestimonialCard = ({ name, role, text, avatar, rating }: any) => (
  <div className="card" style={{ 
    padding: '32px', 
    background: 'var(--surface)', 
    border: '1px solid var(--border)', 
    borderRadius: '24px',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  }}>
    <Quote size={40} style={{ position: 'absolute', top: 20, right: 20, opacity: 0.05, color: 'var(--accent)' }} />
    
    <div style={{ display: 'flex', gap: '4px' }}>
      {[...Array(rating)].map((_, i) => (
        <Star key={i} size={16} fill="var(--gold)" color="var(--gold)" />
      ))}
    </div>

    <p style={{ color: 'var(--text2)', fontSize: '1rem', lineHeight: '1.6', fontStyle: 'italic', flexGrow: 1 }}>
      "{text}"
    </p>

    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
      <div style={{ 
        width: '45px', height: '45px', borderRadius: '12px', 
        background: 'linear-gradient(135deg, var(--accent), var(--violet))',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'white', fontWeight: 700, fontSize: '0.9rem' 
      }}>
        {avatar}
      </div>
      <div>
        <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>{name}</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>{role}</div>
      </div>
    </div>
  </div>
)

export default function Testimonials() {
  return (
    <section id="avis" style={{ padding: '100px 0', background: 'var(--bg)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <span className="badge badge-success" style={{ marginBottom: '16px' }}>Témoignages</span>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, fontFamily: 'Syne' }}>
            Ils font confiance à <span className="gradient-text">NexusEvent</span>
          </h2>
          <p style={{ color: 'var(--text2)', marginTop: '16px', maxWidth: '600px', margin: '16px auto 0' }}>
            Découvrez les retours de notre communauté d'organisateurs et de participants.
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '32px' 
        }}>
          {REVIEWS.map((review) => (
            <TestimonialCard key={review.id} {...review} />
          ))}
        </div>
      </div>
    </section>
  )
}