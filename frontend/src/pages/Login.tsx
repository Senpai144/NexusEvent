import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ email: '', password: '', remember: false })
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Identifiants incorrects')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg)' }}>
      
      {/* PANNEAU GAUCHE : Inspiré par Untitled.jpg */}
      <div className="hide-mobile" style={{ 
        flex: 1, 
        background: '#FFF5F2',
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: 40 
      }}>
        <div className="fade-up" style={{ textAlign: 'center', maxWidth: '80%' }}>
          <img 
            src="https://illustrations.popsy.co/amber/shopping-cart.svg" 
            alt="Illustration EvenFlow" 
            style={{ width: '100%', maxHeight: '400px', marginBottom: '30px' }} 
          />
          <h2 style={{ color: '#1a1a1a', fontSize: '2rem', fontWeight: 800, fontFamily: 'Syne' }}>
            Prêt à organiser votre prochain événement ?
          </h2>
        </div>
      </div>

      {/* PANNEAU DROIT : Formulaire de connexion */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: 'clamp(24px, 5vw, 60px)'
      }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          
          <div className="fade-up">
            <p style={{ color: 'var(--accent)', fontWeight: 700, marginBottom: 8, fontFamily: 'Syne' }}>
              Bienvenue sur NexusEvent
            </p>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 8, letterSpacing: '-0.02em', fontFamily: 'Syne' }}>
              Connectez-vous
            </h1>
            <p style={{ color: 'var(--text2)', marginBottom: 32 }}>
              Retrouvez rapidement votre espace organisateur et pilotage de vos événements.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Champ Email */}
            <div className="form-group fade-up-1">
              <label className="form-label">Email</label>
              <div className="input-wrap">
                <Mail size={18} className="iicon" />
                <input 
                  type="email" 
                  className="form-input" 
                  placeholder="email@exemple.com" 
                  value={form.email} 
                  onChange={e => setForm({ ...form, email: e.target.value })} 
                  required 
                />
              </div>
            </div>

            {/* Champ Mot de passe */}
            <div className="form-group fade-up-2">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label className="form-label">Mot de passe</label>
                <Link to="/forgot-password" style={{ color: 'var(--text3)', fontSize: '0.8rem' }}>Mot de passe oublié</Link>
              </div>
              <div className="input-wrap">
                <Lock size={18} className="iicon" />
                <input 
                  type={showPwd ? 'text' : 'password'} 
                  className="form-input" 
                  placeholder="••••••••••••" 
                  value={form.password} 
                  onChange={e => setForm({ ...form, password: e.target.value })} 
                  required 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPwd(!showPwd)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text3)' }}
                >
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, color: 'var(--danger)', fontSize: '0.85rem' }}>
                <AlertCircle size={16} /> {error}
              </div>
            )}
            <button 
              type="submit" 
              className="btn btn-primary btn-lg fade-up-3" 
              style={{ width: '100%', justifyContent: 'center', marginTop: 10 }}
              disabled={loading}
            >
              {loading ? "Connexion en cours..." : "Se connecter"}
            </button>
          </form>

          <p className="fade-up-4" style={{ textAlign: 'center', marginTop: 32, fontSize: '0.9rem', color: 'var(--text2)' }}>
            Pas encore de compte ? <Link to="/register-client" style={{ color: 'var(--accent)', fontWeight: 600 }}>S'inscrire</Link>
          </p>

          <div style={{ textAlign: 'center', marginTop: 16, fontSize: '0.82rem', color: 'var(--text3)' }}>
            Organisateur ? <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 500 }}>Créer un compte organisateur</Link>
          </div>
        </div>
      </div>
    </div>
  )
}