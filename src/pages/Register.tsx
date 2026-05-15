import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Zap, Mail, Lock, Eye, EyeOff, User, ArrowRight, Globe, CheckCircle } from 'lucide-react'

const PERKS = ['Créez jusqu\'à 5 événements gratuitement', 'Accès au dashboard complet', 'Support par email inclus', 'Aucune carte bancaire requise']

export default function Register() {
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ name: '', email: '', password: '', agree: false })
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 1) { setStep(2); return }
    setLoading(true)
    setTimeout(() => { setLoading(false); navigate('/dashboard') }, 1500)
  }

  const pwdStrength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3
  const strengthColors = ['', 'var(--danger)', 'var(--warning)', 'var(--success)']
  const strengthLabels = ['', 'Faible', 'Moyen', 'Fort']

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg)' }}>
      {/* Left - Perks */}
      <div className="hide-mobile" style={{ flex: 1, background: 'var(--bg2)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 60, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '10%', right: '10%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(124,92,252,0.15) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(60px)' }} />
        <div style={{ position: 'relative', maxWidth: 420 }}>
          <span className="badge badge-success" style={{ marginBottom: 20 }}>Gratuit pour commencer</span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: 16, letterSpacing: '-0.02em' }}>
            Rejoignez <span className="gradient-text">12 000+</span> organisateurs
          </h2>
          <p style={{ color: 'var(--text2)', lineHeight: 1.7, marginBottom: 36 }}>
            Commencez à créer vos événements dès aujourd'hui. Aucune carte bancaire requise.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {PERKS.map(p => (
              <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <CheckCircle size={18} color="var(--success)" />
                <span style={{ color: 'var(--text2)', fontSize: '0.92rem' }}>{p}</span>
              </div>
            ))}
          </div>

          {/* Fake avatars */}
          <div style={{ marginTop: 48, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex' }}>
              {['AD', 'MN', 'FS', 'KB'].map((a, i) => (
                <div key={i} style={{ width: 36, height: 36, borderRadius: '50%', background: `hsl(${i * 60 + 10}, 70%, 55%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne', fontWeight: 700, fontSize: '0.75rem', marginLeft: i > 0 ? -10 : 0, border: '2px solid var(--bg2)' }}>{a}</div>
              ))}
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text2)' }}>+12 000 organisateurs actifs</span>
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 'clamp(24px, 5vw, 60px)' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <div className="hide-desktop" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32, justifyContent: 'center' }}>
            <div style={{ width: 36, height: 36, background: 'var(--accent)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={20} color="#fff" fill="#fff" />
            </div>
            <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.2rem' }}>Event<span style={{ color: 'var(--accent)' }}>Flow</span></span>
          </div>

          {/* Step indicator */}
          <div className="fade-up" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28 }}>
            {[1, 2].map(s => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.8rem', fontWeight: 700, fontFamily: 'Syne',
                  background: step >= s ? 'var(--accent)' : 'var(--surface)',
                  color: step >= s ? '#fff' : 'var(--text3)',
                  border: step >= s ? 'none' : '1px solid var(--border)',
                  transition: 'all 0.3s',
                }}>{s}</div>
                {s < 2 && <div style={{ width: 40, height: 2, background: step > 1 ? 'var(--accent)' : 'var(--border)', borderRadius: 2, transition: 'background 0.3s' }} />}
              </div>
            ))}
            <span style={{ fontSize: '0.82rem', color: 'var(--text3)', marginLeft: 4 }}>
              {step === 1 ? 'Informations de base' : 'Sécurité du compte'}
            </span>
          </div>

          <h1 className="fade-up-1" style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 8, letterSpacing: '-0.02em' }}>Créer un compte</h1>
          <p className="fade-up-1" style={{ color: 'var(--text2)', marginBottom: 28, fontSize: '0.95rem' }}>
            Déjà inscrit ? <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>Se connecter</Link>
          </p>

          {step === 1 && (
            <>
              <button className="btn btn-secondary fade-up-2" style={{ width: '100%', justifyContent: 'center', marginBottom: 20 }}>
                <Globe size={18} /> Continuer avec Google
              </button>
              <div className="divider" style={{ marginBottom: 20 }}>ou</div>
            </>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {step === 1 && (
              <>
                <div className="form-group fade-up-2">
                  <label className="form-label">Nom complet</label>
                  <div className="input-wrap">
                    <User size={17} className="iicon" />
                    <input type="text" className="form-input" placeholder="Votre nom" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                  </div>
                </div>
                <div className="form-group fade-up-3">
                  <label className="form-label">Adresse email</label>
                  <div className="input-wrap">
                    <Mail size={17} className="iicon" />
                    <input type="email" className="form-input" placeholder="vous@exemple.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="form-group fade-up">
                  <label className="form-label">Mot de passe</label>
                  <div className="input-wrap" style={{ position: 'relative' }}>
                    <Lock size={17} className="iicon" />
                    <input type={showPwd ? 'text' : 'password'} className="form-input" placeholder="Minimum 8 caractères" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required style={{ paddingRight: 44 }} />
                    <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer' }}>
                      {showPwd ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                  {form.password && (
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 6 }}>
                      {[1, 2, 3].map(i => (
                        <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= pwdStrength ? strengthColors[pwdStrength] : 'var(--border)', transition: 'background 0.3s' }} />
                      ))}
                      <span style={{ fontSize: '0.78rem', color: strengthColors[pwdStrength], fontWeight: 600, minWidth: 40 }}>{strengthLabels[pwdStrength]}</span>
                    </div>
                  )}
                </div>
                <div className="fade-up-1" style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <input type="checkbox" id="agree" checked={form.agree} onChange={e => setForm({ ...form, agree: e.target.checked })} required style={{ marginTop: 3, width: 16, height: 16, accentColor: 'var(--accent)', cursor: 'pointer', flexShrink: 0 }} />
                  <label htmlFor="agree" style={{ fontSize: '0.85rem', color: 'var(--text2)', cursor: 'pointer', lineHeight: 1.5 }}>
                    J'accepte les <a href="#" style={{ color: 'var(--accent)' }}>Conditions d'utilisation</a> et la <a href="#" style={{ color: 'var(--accent)' }}>Politique de confidentialité</a>
                  </label>
                </div>
              </>
            )}

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.7 : 1 }} disabled={loading}>
              {loading ? (
                <><div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Création...</>
              ) : step === 1 ? (
                <>Continuer <ArrowRight size={18} /></>
              ) : (
                <>Créer mon compte <ArrowRight size={18} /></>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
