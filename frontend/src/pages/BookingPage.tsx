import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import {
  Calendar, MapPin, Users, ArrowLeft, CreditCard,
  CheckCircle, Clock, ChevronRight, Phone, Mail, User,
  Ticket, Shield, Star, AlertCircle, UserPlus
} from 'lucide-react'
import { eventsApi, bookingsApi } from '../services/api'
import { useAuth } from '../contexts/AuthContext'

type Step = 'info' | 'paiement' | 'confirmation'

interface FormData {
  prenom: string
  nom: string
  email: string
  telephone: string
  nombre: number
  modePaiement: 'wave' | 'orange_money' | 'carte' | 'especes'
  commentaire: string
}

export default function BookingPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    eventsApi.getOne(id)
      .then(res => setEvent(res.data))
      .catch(() => setError('Événement non trouvé'))
      .finally(() => setLoading(false))
  }, [id])

  const [step, setStep] = useState<Step>('info')
  const [form, setForm] = useState<FormData>({
    prenom: '', nom: '', email: '', telephone: '',
    nombre: 1, modePaiement: 'wave', commentaire: ''
  })
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})

  useEffect(() => {
    if (step === 'confirmation' && event && !submitting) {
      setSubmitting(true)
      bookingsApi.create({
        firstName: form.prenom,
        lastName: form.nom,
        email: form.email,
        phone: form.telephone,
        numberOfSeats: form.nombre,
        paymentMethod: form.modePaiement,
        comment: form.commentaire || undefined,
        eventId: event.id,
        userId: user?.id || undefined,
      }).catch(() => {})
    }
  }, [step])

  if (loading) {
    return (
      <div style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Navbar />
        <div style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ width: 40, height: 40, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--text3)' }}>Chargement de l'événement...</p>
        </div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Navbar />
        <div style={{ textAlign: 'center', padding: 40 }}>
          <AlertCircle size={48} color="var(--danger)" style={{ marginBottom: 16 }} />
          <h2 style={{ marginBottom: 12 }}>{error || 'Événement introuvable'}</h2>
          <Link to="/" className="btn btn-primary">Retour à l'accueil</Link>
        </div>
      </div>
    )
  }
  
  const maxP = event.maxParticipants ?? event.max ?? 100
  const placesRestantes = maxP - event.participants
  const totalPrice = event.price * form.nombre

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormData, string>> = {}
    if (!form.prenom.trim()) e.prenom = 'Le prénom est requis'
    if (!form.nom.trim()) e.nom = 'Le nom est requis'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email invalide'
    if (!form.telephone.trim() || form.telephone.replace(/\D/g,'').length < 9) e.telephone = 'Numéro invalide'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleNext = async () => {
    if (step === 'info' && validate()) {
      setStep(event.price === 0 ? 'confirmation' : 'paiement')
    } else if (step === 'paiement') {
      setStep('confirmation')
    }
    if (step === 'confirmation') return
  }

  const refCode = `EVT-${event.id}-${Math.random().toString(36).substring(2,8).toUpperCase()}`

  const CAT_COLORS: Record<string, string> = {
    Technologie: 'var(--violet)', Musique: 'var(--accent)', Business: 'var(--warning)',
    Art: 'var(--success)', Sport: 'var(--success)', Atelier: 'var(--warning)'
  }

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh' }}>
      <Navbar />

      <div style={{ paddingTop: 88, paddingBottom: 80 }}>
        <div className="container" style={{ maxWidth: 1100 }}>

          {/* Back link */}
          {step !== 'confirmation' && (
            <button onClick={() => step === 'paiement' ? setStep('info') : navigate(-1)}
              style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: 'var(--text2)', fontSize: '0.9rem', marginBottom: 32, cursor: 'pointer', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--accent)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text2)'}>
              <ArrowLeft size={16} /> Retour
            </button>
          )}

          {/* Steps indicator */}
          {step !== 'confirmation' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 40, maxWidth: 420 }}>
              {(['info', 'paiement', 'confirmation'] as Step[]).map((s, i) => {
                const labels = ['Informations', 'Paiement', 'Confirmation']
                const active = s === step
                const done = (step === 'paiement' && i === 0) || (step as Step === 'confirmation' && i < 2)
                return (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < 2 ? 1 : 'none' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, fontFamily: 'Syne', transition: 'all 0.3s', background: done ? 'var(--success)' : active ? 'var(--accent)' : 'var(--surface2)', color: done || active ? '#fff' : 'var(--text3)', boxShadow: active ? 'var(--shadow-accent)' : 'none' }}>
                        {done ? <CheckCircle size={16} /> : i + 1}
                      </div>
                      <span style={{ fontSize: '0.72rem', color: active ? 'var(--accent)' : done ? 'var(--success)' : 'var(--text3)', fontWeight: active ? 600 : 400, whiteSpace: 'nowrap' }}>{labels[i]}</span>
                    </div>
                    {i < 2 && <div style={{ flex: 1, height: 2, background: done ? 'var(--success)' : 'var(--surface2)', margin: '0 8px', marginTop: -12, transition: 'background 0.4s' }} />}
                  </div>
                )
              })}
            </div>
          )}

          {/* CONFIRMATION */}
          {step === 'confirmation' ? (
            <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto' }}>
              <div style={{ width: 96, height: 96, borderRadius: '50%', background: 'rgba(34,197,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px', animation: 'float 3s ease-in-out infinite' }}>
                <CheckCircle size={48} color="var(--success)" />
              </div>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 12 }}>Réservation confirmée !</h1>
              <p style={{ color: 'var(--text2)', marginBottom: 32 }}>
                Un e-mail de confirmation a été envoyé à <strong style={{ color: 'var(--text)' }}>{form.email}</strong>
              </p>

              <div className="card" style={{ marginBottom: 24, textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text3)', fontFamily: 'Syne', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Référence</span>
                  <span style={{ fontFamily: 'Syne', fontWeight: 700, color: 'var(--accent)', fontSize: '1.1rem' }}>{refCode}</span>
                </div>
                <div style={{ display: 'flex', gap: 14, marginBottom: 16 }}>
                  <img src={event.cover} alt="" style={{ width: 64, height: 64, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }} />
                  <div>
                    <h3 style={{ fontWeight: 700, marginBottom: 6 }}>{event.title}</h3>
                    <div style={{ fontSize: '0.83rem', color: 'var(--text3)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Calendar size={13} /> {event.date} · {event.time}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><MapPin size={13} /> {event.location}</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '16px 0', borderTop: '1px solid var(--border)' }}>
                  {[
                    ['Participant', `${form.prenom} ${form.nom}`],
                    ['Places', `${form.nombre} place${form.nombre > 1 ? 's' : ''}`],
                    ['Total', event.price === 0 ? 'Gratuit' : `${(totalPrice).toLocaleString()} FCFA`],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                      <span style={{ color: 'var(--text3)' }}>{k}</span>
                      <span style={{ fontWeight: 600 }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/" className="btn btn-primary">Explorer d'autres événements</Link>
                <Link to="/dashboard" className="btn btn-secondary">Mon espace</Link>
              </div>
            </div>

          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 32, alignItems: 'start' }}>

              {/* FORM */}
              <div>
                {/* Step 1: Info */}
                {step === 'info' && (
                  <div className="card fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 4 }}>Vos informations</h2>

                    {!user && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', background: 'rgba(255,92,58,0.08)', border: '1px solid rgba(255,92,58,0.2)', borderRadius: 'var(--radius)' }}>
                        <UserPlus size={20} color="var(--accent)" style={{ flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '0.88rem', fontWeight: 600, marginBottom: 2 }}>Vous n'avez pas de compte ?</p>
                          <p style={{ fontSize: '0.82rem', color: 'var(--text2)' }}>
                            Créez un compte pour suivre vos réservations et les gérer facilement.
                          </p>
                        </div>
                        <Link to="/register-client" className="btn btn-primary btn-sm" style={{ flexShrink: 0, gap: 6, whiteSpace: 'nowrap' }}>
                          <UserPlus size={14} /> S'inscrire
                        </Link>
                      </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      {/* Prénom */}
                      <div className="form-group">
                        <label className="form-label">Prénom *</label>
                        <div className="input-wrap">
                          <User size={16} className="iicon" />
                          <input className="form-input" placeholder="Aminata" value={form.prenom}
                            onChange={e => setForm(f => ({ ...f, prenom: e.target.value }))}
                            style={{ borderColor: errors.prenom ? 'var(--danger)' : '' }} />
                        </div>
                        {errors.prenom && <span style={{ fontSize: '0.78rem', color: 'var(--danger)' }}>{errors.prenom}</span>}
                      </div>
                      {/* Nom */}
                      <div className="form-group">
                        <label className="form-label">Nom *</label>
                        <div className="input-wrap">
                          <User size={16} className="iicon" />
                          <input className="form-input" placeholder="Diallo" value={form.nom}
                            onChange={e => setForm(f => ({ ...f, nom: e.target.value }))}
                            style={{ borderColor: errors.nom ? 'var(--danger)' : '' }} />
                        </div>
                        {errors.nom && <span style={{ fontSize: '0.78rem', color: 'var(--danger)' }}>{errors.nom}</span>}
                      </div>
                    </div>

                    {/* Email */}
                    <div className="form-group">
                      <label className="form-label">Email *</label>
                      <div className="input-wrap">
                        <Mail size={16} className="iicon" />
                        <input className="form-input" type="email" placeholder="aminata@gmail.com" value={form.email}
                          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                          style={{ borderColor: errors.email ? 'var(--danger)' : '' }} />
                      </div>
                      {errors.email && <span style={{ fontSize: '0.78rem', color: 'var(--danger)' }}>{errors.email}</span>}
                    </div>

                    {/* Téléphone */}
                    <div className="form-group">
                      <label className="form-label">Téléphone *</label>
                      <div className="input-wrap">
                        <Phone size={16} className="iicon" />
                        <input className="form-input" placeholder="+221 77 000 00 00" value={form.telephone}
                          onChange={e => setForm(f => ({ ...f, telephone: e.target.value }))}
                          style={{ borderColor: errors.telephone ? 'var(--danger)' : '' }} />
                      </div>
                      {errors.telephone && <span style={{ fontSize: '0.78rem', color: 'var(--danger)' }}>{errors.telephone}</span>}
                    </div>

                    {/* Nombre de places */}
                    <div className="form-group">
                      <label className="form-label">Nombre de places</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        {[1,2,3,4,5].filter(n => n <= Math.min(placesRestantes, 5)).map(n => (
                          <button key={n} onClick={() => setForm(f => ({ ...f, nombre: n }))}
                            style={{ width: 44, height: 44, borderRadius: 10, border: `1.5px solid ${form.nombre === n ? 'var(--accent)' : 'var(--border)'}`, background: form.nombre === n ? 'var(--accent)' : 'var(--bg3)', color: form.nombre === n ? '#fff' : 'var(--text2)', fontWeight: 700, fontFamily: 'Syne', cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.95rem' }}>
                            {n}
                          </button>
                        ))}
                      </div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>
                        {placesRestantes} place{placesRestantes > 1 ? 's' : ''} restante{placesRestantes > 1 ? 's' : ''}
                      </span>
                    </div>

                    {/* Commentaire */}
                    <div className="form-group">
                      <label className="form-label">Message / demande spéciale <span style={{ color: 'var(--text3)' }}>(optionnel)</span></label>
                      <textarea className="form-input" rows={3} placeholder="Allergie, besoin particulier..."
                        value={form.commentaire}
                        onChange={e => setForm(f => ({ ...f, commentaire: e.target.value }))}
                        style={{ resize: 'vertical', minHeight: 80 }} />
                    </div>

                    <button className="btn btn-primary" onClick={handleNext} style={{ alignSelf: 'flex-start', gap: 10 }}>
                      {event.price === 0 ? 'Confirmer la réservation' : 'Continuer vers le paiement'} <ChevronRight size={16} />
                    </button>
                  </div>
                )}

                {/* Step 2: Paiement */}
                {step === 'paiement' && (
                  <div className="card fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Mode de paiement</h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {[
                        { key: 'wave', label: 'Wave', desc: 'Paiement instantané via Wave', color: '#00B4FF', emoji: '🌊' },
                        { key: 'orange_money', label: 'Orange Money', desc: 'Paiement via Orange Money', color: '#FF6600', emoji: '🟠' },
                        { key: 'carte', label: 'Carte bancaire', desc: 'Visa, Mastercard', color: 'var(--violet)', emoji: '💳' },
                        { key: 'especes', label: 'Espèces sur place', desc: 'Payer à l\'entrée de l\'événement', color: 'var(--success)', emoji: '💵' },
                      ].map(({ key, label, desc, color, emoji }) => (
                        <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', borderRadius: 'var(--radius)', border: `2px solid ${form.modePaiement === key ? color : 'var(--border)'}`, background: form.modePaiement === key ? `${color}10` : 'var(--bg3)', cursor: 'pointer', transition: 'all 0.2s' }}>
                          <input type="radio" name="paiement" value={key} checked={form.modePaiement === key as any}
                            onChange={() => setForm(f => ({ ...f, modePaiement: key as any }))}
                            style={{ display: 'none' }} />
                          <span style={{ fontSize: '1.5rem' }}>{emoji}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{label}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>{desc}</div>
                          </div>
                          <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${form.modePaiement === key ? color : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {form.modePaiement === key && <div style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />}
                          </div>
                        </label>
                      ))}
                    </div>

                    <div style={{ padding: '16px 20px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', gap: 12 }}>
                      <Shield size={18} color="var(--success)" />
                      <p style={{ fontSize: '0.83rem', color: 'var(--text2)' }}>Paiement sécurisé. Vos données sont protégées et ne sont jamais stockées.</p>
                    </div>

                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.9rem' }}>
                        <span style={{ color: 'var(--text2)' }}>{form.nombre} × {event.price.toLocaleString()} FCFA</span>
                        <span>{totalPrice.toLocaleString()} FCFA</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 700 }}>
                        <span>Total</span>
                        <span style={{ color: 'var(--accent)' }}>{totalPrice.toLocaleString()} FCFA</span>
                      </div>
                    </div>

                    <button className="btn btn-primary" onClick={handleNext} style={{ gap: 10 }}>
                      <CreditCard size={16} /> Confirmer le paiement de {totalPrice.toLocaleString()} FCFA
                    </button>
                  </div>
                )}
              </div>

              {/* RECAP SIDEBAR */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 100 }}>
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                  <img src={event.cover} alt={event.title} style={{ width: '100%', height: 180, objectFit: 'cover' }} />
                  <div style={{ padding: 20 }}>
                    <div style={{ marginBottom: 12 }}>
                      <span style={{ fontSize: '0.75rem', padding: '3px 10px', borderRadius: 6, background: `${CAT_COLORS[event.category]}22`, color: CAT_COLORS[event.category], fontWeight: 600, fontFamily: 'Syne' }}>{event.category}</span>
                    </div>
                    <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 12 }}>{event.title}</h3>
                    <p style={{ fontSize: '0.83rem', color: 'var(--text2)', lineHeight: 1.6, marginBottom: 16 }}>{event.description}</p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                      {[
                        { Icon: Calendar, text: `${event.date} · ${event.time}` },
                        { Icon: Clock, text: `Durée : ${event.duration}` },
                        { Icon: MapPin, text: event.location },
                        { Icon: Users, text: `${placesRestantes} places restantes` },
                        { Icon: Ticket, text: event.price === 0 ? 'Gratuit' : `${event.price.toLocaleString()} FCFA / personne` },
                      ].map(({ Icon, text }, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.85rem', color: 'var(--text2)' }}>
                          <Icon size={14} color="var(--accent)" style={{ flexShrink: 0 }} />
                          <span>{text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recap total */}
                {step === 'paiement' && event.price > 0 && (
                  <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <h4 style={{ fontWeight: 700, fontSize: '0.95rem' }}>Récapitulatif</h4>
                    <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text3)' }}>{form.prenom} {form.nom}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text3)' }}>{form.nombre} place{form.nombre > 1 ? 's' : ''}</span>
                        <span style={{ fontWeight: 600 }}>{totalPrice.toLocaleString()} FCFA</span>
                      </div>
                    </div>
                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                      <span>Total</span>
                      <span style={{ color: 'var(--accent)' }}>{totalPrice.toLocaleString()} FCFA</span>
                    </div>
                  </div>
                )}

                {/* Trust badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 10 }}>
                  <Star size={14} fill="var(--gold)" color="var(--gold)" />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text2)' }}>98% de participants satisfaits</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {step !== 'confirmation' && <Footer />}
    </div>
  )
}
