import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Zap, Mail, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => { setLoading(false); setSent(true) }, 1500)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: 24, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '20%', left: '20%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(124,92,252,0.1) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(60px)' }} />
      <div style={{ position: 'absolute', bottom: '20%', right: '20%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(255,92,58,0.1) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(60px)' }} />

      <div className="card fade-up" style={{ width: '100%', maxWidth: 440, padding: 48, position: 'relative', textAlign: 'center' }}>
        <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--text3)', fontSize: '0.85rem', marginBottom: 32, transition: 'color 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text3)'}>
          <ArrowLeft size={16} /> Retour à la connexion
        </Link>

        {!sent ? (
          <>
            <div style={{ width: 64, height: 64, borderRadius: 18, background: 'var(--violet-glow)', border: '1px solid rgba(124,92,252,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <Mail size={28} color="var(--violet)" />
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 10, letterSpacing: '-0.02em' }}>Mot de passe oublié ?</h1>
            <p style={{ color: 'var(--text2)', marginBottom: 32, fontSize: '0.92rem', lineHeight: 1.6 }}>
              Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
            </p>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="form-group" style={{ textAlign: 'left' }}>
                <label className="form-label">Adresse email</label>
                <div className="input-wrap">
                  <Mail size={17} className="iicon" />
                  <input type="email" className="form-input" placeholder="vous@exemple.com" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.7 : 1 }} disabled={loading}>
                {loading ? (
                  <><div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Envoi...</>
                ) : (
                  <>Envoyer le lien <ArrowRight size={18} /></>
                )}
              </button>
            </form>
          </>
        ) : (
          <>
            <div style={{ width: 64, height: 64, borderRadius: 18, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <CheckCircle size={28} color="var(--success)" />
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 10 }}>Email envoyé !</h1>
            <p style={{ color: 'var(--text2)', marginBottom: 8, fontSize: '0.92rem', lineHeight: 1.6 }}>
              Nous avons envoyé un lien de réinitialisation à
            </p>
            <p style={{ color: 'var(--text)', fontWeight: 600, marginBottom: 32 }}>{email}</p>
            <div style={{ background: 'var(--bg3)', borderRadius: 12, padding: 16, marginBottom: 32, textAlign: 'left' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text2)', lineHeight: 1.6 }}>
                📬 Vérifiez votre boîte de réception et vos spams. Le lien expire dans <strong style={{ color: 'var(--text)' }}>15 minutes</strong>.
              </p>
            </div>
            <button onClick={() => setSent(false)} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
              Renvoyer l'email
            </button>
          </>
        )}

        <div style={{ marginTop: 32 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, background: 'var(--accent)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={14} color="#fff" fill="#fff" />
            </div>
            <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '0.95rem' }}>Event<span style={{ color: 'var(--accent)' }}>Flow</span></span>
          </Link>
        </div>
      </div>
    </div>
  )
}
