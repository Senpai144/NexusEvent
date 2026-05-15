import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import plongeeImg from './plongee.jpg';
import { 
  Zap, ArrowRight, Calendar, Users, BarChart2, MapPin, 
  Star, CheckCircle, Play, TrendingUp, Shield, Headphones 
} from 'lucide-react'

const EVENTS = [
  { id: '1', title: 'Tech Summit Dakar 2026', category: 'Technologie', date: '15 Juin 2026', location: 'Dakar Arena', participants: 420, max: 500, price: 25000, cover: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80' },
  { id: '2', title: 'Cours de Surf à Somone', category: 'Sport', date: '18 Juin 2026', location: 'Plage de la Somone', participants: 8, max: 12, price: 15000, cover: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400&q=80' },
  { id: '3', title: 'Atelier Peinture & Vin', category: 'Atelier', date: '20 Juin 2026', location: 'Galerie du Fleuve', participants: 15, max: 20, price: 35000, cover: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&q=80' },
  { id: '4', title: 'Startup Weekend Africa', category: 'Business', date: '5 Juillet 2026', location: 'CTIC Dakar', participants: 120, max: 150, price: 0, cover: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=400&q=80' },
  { id: '5', title: 'Plongée sous-marine Gorée', category: 'Sport', date: '25 Juin 2026', location: 'Club Nautique Dakar', participants: 5, max: 8, price: 45000, cover: 'plongeeImg' },
  { id: '6', title: 'Initiation Poterie Artisanale', category: 'Atelier', date: '28 Juin 2026', location: 'Village des Arts', participants: 10, max: 10, price: 12000, cover: 'https://images.unsplash.com/photo-1565191999001-551c187427bb?w=400&q=80' },
  { id: '7', title: 'Festival Afrobeat Summer', category: 'Musique', date: '22 Juin 2026', location: 'Plage de N\'Gor', participants: 850, max: 1000, price: 15000, cover: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&q=80' },
  { id: '8', title: 'Art & Culture Expo', category: 'Art', date: '12 Juillet 2026', location: 'IFAN Museum, Dakar', participants: 200, max: 300, price: 5000, cover: 'https://images.unsplash.com/photo-1578926375605-eaf7559b1458?w=400&q=80' },
];

const STATS = [
  { value: '12K+', label: 'Événements créés' }, 
  { value: '850K+', label: 'Participants' },
  { value: '98%', label: 'Satisfaction' },
  { value: '54', label: 'Pays couverts' },
]

const FEATURES = [
  { icon: Calendar, title: 'Création facile', desc: 'Créez un événement professionnel en moins de 5 minutes avec nos outils intuitifs.' },
  { icon: Users, title: 'Gestion participants', desc: 'Gérez vos inscriptions, envoyez des confirmations et suivez la présence en temps réel.' },
  { icon: BarChart2, title: 'Analytics avancés', desc: 'Visualisez vos données : ventes, taux de conversion, engagement et bien plus.' },
  { icon: Shield, title: 'Paiements sécurisés', desc: 'Intégration Wave, Orange Money et cartes bancaires avec protection anti-fraude.' },
  { icon: TrendingUp, title: 'Promotion intégrée', desc: 'Partagez sur les réseaux sociaux et touchez votre audience directement depuis la plateforme.' },
  { icon: Headphones, title: 'Support 24/7', desc: 'Notre équipe est disponible à tout moment pour vous accompagner dans vos projets.' },
]

function CategoryBadge({ cat }: { cat: string }) {
  const map: Record<string, string> = { 
    'Technologie': 'badge-violet', 
    'Musique': 'badge-accent', 
    'Business': 'badge-warning', 
    'Art': 'badge-success',
    'Sport': 'badge-success', // Vert pour le sport
    'Atelier': 'badge-warning' // Jaune pour les ateliers
  }
  return <span className={`badge ${map[cat] || 'badge-accent'}`}>{cat}</span>
}

export default function LandingPage() {
  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden', paddingTop: 68,
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', backgroundSize: '60px 60px', opacity: 0.3 }} />
        <div style={{ position: 'absolute', top: '20%', left: '10%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(255,92,58,0.12) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(124,92,252,0.12) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(60px)' }} />

        <div className="container" style={{ position: 'relative', textAlign: 'center', padding: '80px 24px' }}>
          <div className="fade-up" style={{ marginBottom: 24 }}>
            <span className="badge badge-accent" style={{ fontSize: '0.85rem', padding: '6px 16px' }}>
              <Zap size={14} fill="currentColor" style={{ marginRight: 8 }} /> Plateforme #1 en Afrique
            </span>
          </div>

          <h1 className="fade-up-1" style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)', fontWeight: 800, marginBottom: 24, letterSpacing: '-0.03em', maxWidth: 950, margin: '0 auto 24px', lineHeight: 1.1 }}>
            Vivez des <span className="gradient-text">expériences</span> uniques
          </h1>

          <p className="fade-up-2" style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'var(--text2)', maxWidth: 650, margin: '0 auto 40px', lineHeight: 1.7 }}>
            Des ateliers créatifs aux sports extrêmes, <strong>EventFlow</strong> centralise les meilleurs événements et activités près de chez vous.
          </p>

          <div className="fade-up-3" style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 64 }}>
            <Link to="/register" className="btn btn-primary btn-lg">
              Commencer gratuitement <ArrowRight size={20} />
            </Link>
            <Link to="/dashboard" className="btn btn-secondary btn-lg">
               Accéder au Dashboard
            </Link>
          </div>

          <div className="fade-up-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 1, maxWidth: 800, margin: '0 auto', background: 'var(--border)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden' }}>
            {STATS.map((s, i) => (
              <div key={i} style={{ padding: '30px 20px', textAlign: 'center', background: 'var(--surface)' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'Syne', color: i % 2 === 0 ? 'var(--accent)' : 'var(--violet)' }}>{s.value}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text3)', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- EVENTS EXPLORER --- */}
      <section id="events" style={{ padding: '100px 0', background: 'var(--bg2)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: 16, fontFamily: 'Syne' }}>
              Explorez les <span className="gradient-text">activités</span>
            </h2>
            <p style={{ color: 'var(--text2)', maxWidth: 500, margin: '0 auto' }}>
              Réservez votre place pour des moments inoubliables.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {EVENTS.map((ev, i) => (
              <div key={ev.id} className="card fade-up" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ position: 'relative', height: 200 }}>
                  <img src={ev.cover} alt={ev.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: 12, left: 12 }}><CategoryBadge cat={ev.category} /></div>
                  <div style={{ position: 'absolute', bottom: 12, right: 12, background: 'rgba(0,0,0,0.8)', padding: '4px 12px', borderRadius: 8, fontSize: '0.8rem', fontWeight: 700 }}>
                    {ev.price === 0 ? 'Gratuit' : `${ev.price.toLocaleString()} FCFA`}
                  </div>
                </div>
                <div style={{ padding: 20 }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: 12, fontWeight: 700 }}>{ev.title}</h3>
                  <div style={{ color: 'var(--text3)', fontSize: '0.85rem', marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Calendar size={14} /> {ev.date}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><MapPin size={14} /> {ev.location}</div>
                  </div>
                  <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>Réserver <ArrowRight size={14} style={{marginLeft: 8}}/></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA --- */}
      <section style={{ padding: '100px 0' }}>
        <div className="container">
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 28, padding: '80px 40px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 16 }}>Un projet en tête ?</h2>
            <p style={{ color: 'var(--text2)', marginBottom: 32 }}>Publiez votre activité et gérez vos participants en toute simplicité.</p>
            <Link to="/register" className="btn btn-primary btn-lg">Devenir organisateur</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}