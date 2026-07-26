import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import WeatherDatePicker, { type ForecastDay } from '../components/WeatherDatePicker'
import { ArrowLeft, Calendar } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

export default function WeatherPlannerPage() {
  const navigate = useNavigate()

  const handleConfirm = (day: ForecastDay) => {
    // nothing extra needed - confirmation bar links to create event
  }

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh' }}>
      <Navbar />

      <div style={{ paddingTop: 100, paddingBottom: 80 }}>
        <div className="container" style={{ maxWidth: 1100 }}>
          <Link to="/" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            color: 'var(--text2)', fontSize: '0.88rem', marginBottom: 28,
            textDecoration: 'none', transition: 'color 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--accent)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text2)'}
          >
            <ArrowLeft size={16} /> Retour à l'accueil
          </Link>

          <WeatherDatePicker onConfirm={handleConfirm} city="Dakar"
            onCreateEvent={(day) => navigate(`/dashboard/events/new?date=${day.date}`)}
          />
        </div>
      </div>

      <Footer />
    </div>
  )
}
