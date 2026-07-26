import { useState, useEffect } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import Pagination from '../components/Pagination'
import { usePagination } from '../hooks/usePagination'
import { Users, Search, Shield, AlertCircle, CheckCircle, XCircle, ArrowUpDown } from 'lucide-react'
import { usersApi } from '../services/api'
import { useAuth } from '../contexts/AuthContext'

const SORTABLE = ['name', 'email', 'role', 'isActive', 'createdAt'] as const

export default function DashboardUsers() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [editId, setEditId] = useState<string | null>(null)
  const [editRole, setEditRole] = useState('')

  useEffect(() => {
    usersApi.getAll().then(res => setUsers(res.data)).catch(() => {})
  }, [])

  const filtered = users.filter((u: any) =>
    u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())
  )

  const { page, totalPages, paginated, sortKey, sortDir, toggleSort, goTo } = usePagination(filtered, 8)

  const handleToggleActive = async (id: string, current: boolean) => {
    try {
      await usersApi.update(id, { isActive: !current })
      setUsers(users.map((u: any) => u.id === id ? { ...u, isActive: !current } : u))
    } catch {}
  }

  const handleSaveRole = async (id: string) => {
    try {
      await usersApi.update(id, { role: editRole })
      setUsers(users.map((u: any) => u.id === id ? { ...u, role: editRole } : u))
      setEditId(null)
    } catch {}
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cet utilisateur ?')) return
    try {
      await usersApi.delete(id)
      setUsers(users.filter((u: any) => u.id !== id))
    } catch {}
  }

  const SortHeader = ({ field, label }: { field: string; label: string }) => (
    <th style={{ textAlign: 'left', padding: '14px 16px', fontWeight: 600, cursor: 'pointer', userSelect: 'none' }}
      onClick={() => toggleSort(field as any)}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        {label}
        <ArrowUpDown size={12} style={{ opacity: sortKey === field ? 1 : 0.3, color: sortKey === field ? 'var(--accent)' : 'var(--text3)' }} />
        {sortKey === field && <span style={{ fontSize: '0.65rem' }}>{sortDir === 'asc' ? '▲' : '▼'}</span>}
      </div>
    </th>
  )

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 4 }}>Utilisateurs</h1>
        <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>{filtered.length} utilisateur{filtered.length > 1 ? 's' : ''}</p>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <div className="input-wrap" style={{ flex: 1, maxWidth: 360 }}>
          <Search size={16} className="iicon" />
          <input className="form-input" placeholder="Rechercher un utilisateur..." value={search} onChange={e => setSearch(e.target.value)} style={{ fontSize: '0.85rem' }} />
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text3)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                <SortHeader field="name" label="Utilisateur" />
                <SortHeader field="email" label="Email" />
                <SortHeader field="role" label="Rôle" />
                <SortHeader field="isActive" label="Statut" />
                <th style={{ textAlign: 'center', padding: '14px 16px', fontWeight: 600 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((u: any) => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '14px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--violet))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.8rem', fontFamily: 'Syne' }}>
                        {u.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{u.name}</div>
                        {u.id === currentUser?.id && <span style={{ fontSize: '0.72rem', color: 'var(--accent)' }}>Vous</span>}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--text2)', fontSize: '0.83rem' }}>{u.email}</td>
                  <td style={{ padding: '14px 16px' }}>
                    {editId === u.id ? (
                      <select className="form-input" value={editRole} onChange={e => setEditRole(e.target.value)} style={{ fontSize: '0.8rem', padding: '4px 8px' }}>
                        <option value="admin">Admin</option>
                        <option value="organizer">Organisateur</option>
                        <option value="user">Utilisateur</option>
                      </select>
                    ) : (
                      <span className={`badge ${u.role === 'admin' ? 'badge-violet' : u.role === 'organizer' ? 'badge-accent' : 'badge-success'}`} style={{ fontSize: '0.72rem', textTransform: 'capitalize' }}>
                        {u.role}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span className={`badge ${u.isActive ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.72rem' }}>
                      {u.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 24px', textAlign: 'center' }}>
                    {editId === u.id ? (
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                        <button className="btn btn-primary" style={{ padding: '4px 10px', fontSize: '0.75rem' }} onClick={() => handleSaveRole(u.id)}>
                          <CheckCircle size={12} /> OK
                        </button>
                        <button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: '0.75rem' }} onClick={() => setEditId(null)}>
                          <XCircle size={12} /> Annuler
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                        <button className="btn btn-ghost" style={{ padding: '4px 8px' }} onClick={() => { setEditId(u.id); setEditRole(u.role) }} title="Changer rôle">
                          <Shield size={14} />
                        </button>
                        <button className="btn btn-ghost" style={{ padding: '4px 8px', color: u.isActive ? '#f59e0b' : '#22c55e' }} onClick={() => handleToggleActive(u.id, u.isActive)} title={u.isActive ? 'Désactiver' : 'Activer'}>
                          {u.isActive ? <XCircle size={14} /> : <CheckCircle size={14} />}
                        </button>
                        {u.id !== currentUser?.id && (
                          <button className="btn btn-ghost" style={{ padding: '4px 8px', color: 'var(--danger)' }} onClick={() => handleDelete(u.id)} title="Supprimer">
                            <AlertCircle size={14} />
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '60px', textAlign: 'center' }}>
                    <Users size={36} color="var(--text3)" opacity={0.3} style={{ marginBottom: 12 }} />
                    <div style={{ color: 'var(--text3)', fontSize: '0.9rem' }}>Aucun utilisateur trouvé</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination page={page} totalPages={totalPages} total={filtered.length} onPageChange={goTo} />
      </div>
    </DashboardLayout>
  )
}
