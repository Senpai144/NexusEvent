import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout'
import { Calendar, MapPin, DollarSign, Users, Image, Type, AlignLeft, Clock, Save, ArrowLeft } from 'lucide-react'
import { eventsApi } from '../services/api'

const CATEGORIES = ['Technologie', 'Sport', 'Atelier', 'Business', 'Musique', 'Art']

export default function DashboardCreateEvent() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialDate = searchParams.get('date') || ''
  const [form, setForm] = useState({
    title: '', description: '', date: initialDate, time: '', duration: '',
    location: '', category: 'Technologie', price: 0, maxParticipants: 50, cover: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (field: string, value: any) => setForm({ ...form, [field]: value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await eventsApi.create({
        ...form,
        price: Number(form.price),
        maxParticipants: Number(form.maxParticipants),
      })
      navigate('/dashboard/events')
    } catch (err: any) {
      const detail = err.response?.data?.message || err.message || 'Erreur lors de la création'
      const status = err.response?.status ? `[${err.response.status}] ` : ''
      setError(`${status}${detail}`)
      if (err.response?.status === 401) navigate('/login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout maxWidth={800}>
      <button onClick={() => navigate('/dashboard/events')} className="btn btn-ghost" style={{ gap: 6, marginBottom: 24, fontSize: '0.88rem' }}>
        <ArrowLeft size={16} /> Retour aux événements
      </button>

      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 4 }}>Nouvel événement</h1>
        <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>Créez un nouvel événement pour attirer des participants</p>
      </div>

      {error && (
        <div style={{ padding: '14px 20px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, color: 'var(--danger)', fontWeight: 600, fontSize: '0.88rem', marginBottom: 24 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="card" style={{ padding: '28px', marginBottom: 24 }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Type size={20} /> Informations générales
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Titre de l'événement</label>
              <input className="form-input" value={form.title} onChange={e => handleChange('title', e.target.value)} required placeholder="Ex: Tech Summit Dakar 2026" style={{ fontSize: '0.9rem' }} />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Description</label>
              <textarea className="form-input" value={form.description} onChange={e => handleChange('description', e.target.value)} rows={4} required placeholder="Décrivez votre événement en détail..." style={{ fontSize: '0.9rem', resize: 'vertical', minHeight: 100, fontFamily: 'inherit' }} />
            </div>
            <div className="form-group">
              <label className="form-label">Catégorie</label>
              <select className="form-input" value={form.category} onChange={e => handleChange('category', e.target.value)} style={{ fontSize: '0.9rem', padding: '12px 16px' }}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Image de couverture (URL)</label>
              <div className="input-wrap">
                <Image size={16} className="iicon" />
                <input className="form-input" value={form.cover} onChange={e => handleChange('cover', e.target.value)} placeholder="https://..." style={{ fontSize: '0.9rem' }} />
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '28px', marginBottom: 24 }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Calendar size={20} /> Date & Lieu
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 20 }}>
            <div className="form-group">
              <label className="form-label">Date</label>
              <div className="input-wrap">
                <Calendar size={16} className="iicon" />
                <input className="form-input" type="date" value={form.date} onChange={e => handleChange('date', e.target.value)} required style={{ fontSize: '0.9rem' }} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Heure</label>
              <div className="input-wrap">
                <Clock size={16} className="iicon" />
                <input className="form-input" type="time" value={form.time} onChange={e => handleChange('time', e.target.value)} style={{ fontSize: '0.9rem' }} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Durée</label>
              <input className="form-input" value={form.duration} onChange={e => handleChange('duration', e.target.value)} placeholder="Ex: 3h" style={{ fontSize: '0.9rem' }} />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Lieu</label>
              <div className="input-wrap">
                <MapPin size={16} className="iicon" />
                <input className="form-input" value={form.location} onChange={e => handleChange('location', e.target.value)} required placeholder="Ex: Dakar, Sénégal" style={{ fontSize: '0.9rem' }} />
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '28px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
            <DollarSign size={20} /> Tarifs & Capacité
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
            <div className="form-group">
              <label className="form-label">Prix (FCFA)</label>
              <div className="input-wrap">
                <DollarSign size={16} className="iicon" />
                <input className="form-input" type="number" min={0} value={form.price} onChange={e => handleChange('price', e.target.value)} style={{ fontSize: '0.9rem' }} />
              </div>
              <small style={{ color: 'var(--text3)', fontSize: '0.78rem', marginTop: 4, display: 'block' }}>Laissez 0 pour un événement gratuit</small>
            </div>
            <div className="form-group">
              <label className="form-label">Nombre max. de participants</label>
              <div className="input-wrap">
                <Users size={16} className="iicon" />
                <input className="form-input" type="number" min={1} value={form.maxParticipants} onChange={e => handleChange('maxParticipants', e.target.value)} required style={{ fontSize: '0.9rem' }} />
              </div>
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ gap: 8, padding: '14px 32px', fontSize: '0.95rem' }} disabled={loading}>
            <Save size={18} /> {loading ? 'Création en cours...' : 'Créer l\'événement'}
          </button>
        </div>
      </form>
    </DashboardLayout>
  )
}
