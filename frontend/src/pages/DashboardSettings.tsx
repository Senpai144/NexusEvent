import { useState } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { useAuth } from '../contexts/AuthContext'
import { User, Mail, Lock, Save, Globe, Bell, Moon, Sun } from 'lucide-react'

export default function DashboardSettings() {
  const { user } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [currentPwd, setCurrentPwd] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [saved, setSaved] = useState(false)
  const [darkMode, setDarkMode] = useState(() => document.documentElement.getAttribute('data-theme') !== 'light')
  const [notifEmail, setNotifEmail] = useState(true)
  const [notifSms, setNotifSms] = useState(false)
  const [lang, setLang] = useState('fr')

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPwd !== confirmPwd) return
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <DashboardLayout maxWidth={800}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 4 }}>Paramètres</h1>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>Gérez votre compte et vos préférences</p>
        </div>

        {saved && (
          <div style={{ padding: '14px 20px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 12, color: '#22c55e', fontWeight: 600, fontSize: '0.88rem', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Save size={18} /> Modifications enregistrées
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="card" style={{ padding: '28px', marginBottom: 24 }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
            <User size={20} /> Informations personnelles
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
            <div className="form-group">
              <label className="form-label">Nom complet</label>
              <div className="input-wrap">
                <User size={16} className="iicon" />
                <input className="form-input" value={name} onChange={e => setName(e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <div className="input-wrap">
                <Mail size={16} className="iicon" />
                <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </div>
          </div>
          <button type="submit" className="btn btn-primary">Enregistrer</button>
        </form>

        <form onSubmit={handleSavePassword} className="card" style={{ padding: '28px', marginBottom: 24 }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Lock size={20} /> Mot de passe
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 24 }}>
            <div className="form-group">
              <label className="form-label">Mot de passe actuel</label>
              <div className="input-wrap">
                <Lock size={16} className="iicon" />
                <input className="form-input" type="password" value={currentPwd} onChange={e => setCurrentPwd(e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Nouveau mot de passe</label>
              <div className="input-wrap">
                <Lock size={16} className="iicon" />
                <input className="form-input" type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Confirmer</label>
              <div className="input-wrap">
                <Lock size={16} className="iicon" />
                <input className="form-input" type="password" value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} style={{ borderColor: confirmPwd && newPwd !== confirmPwd ? 'var(--danger)' : '' }} />
              </div>
            </div>
          </div>
          <button type="submit" className="btn btn-primary">Changer le mot de passe</button>
        </form>

        <div className="card" style={{ padding: '28px', marginBottom: 24 }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Bell size={20} /> Notifications
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { label: 'Notifications par email', desc: 'Recevoir les mises à jour par email', value: notifEmail, set: setNotifEmail },
              { label: 'Notifications SMS', desc: 'Recevoir des alertes par SMS', value: notifSms, set: setNotifSms },
            ].map(n => (
              <label key={n.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--bg2)', borderRadius: 12, cursor: 'pointer' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{n.label}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>{n.desc}</div>
                </div>
                <input type="checkbox" checked={n.value} onChange={e => n.set(e.target.checked)} style={{ width: 20, height: 20, accentColor: 'var(--accent)', cursor: 'pointer' }} />
              </label>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: '28px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Globe size={20} /> Préférences
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div className="form-group">
              <label className="form-label">Langue</label>
              <select className="form-input" value={lang} onChange={e => setLang(e.target.value)} style={{ padding: '12px 16px' }}>
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="wo">Wolof</option>
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 4 }}>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flex: 1, padding: '12px 16px', background: 'var(--bg2)', borderRadius: 12, cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {darkMode ? <Moon size={18} /> : <Sun size={18} />}
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{darkMode ? 'Mode sombre' : 'Mode clair'}</span>
                </div>
                <input type="checkbox" checked={darkMode} onChange={e => {
                  const v = e.target.checked
                  setDarkMode(v)
                  document.documentElement.setAttribute('data-theme', v ? 'dark' : 'light')
                }} style={{ width: 20, height: 20, accentColor: 'var(--accent)', cursor: 'pointer' }} />
              </label>
            </div>
          </div>
        </div>
    </DashboardLayout>
  )
}
