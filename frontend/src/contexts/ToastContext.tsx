import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: number
  message: string
  type: ToastType
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void
  success: (message: string) => void
  error: (message: string) => void
  warning: (message: string) => void
  info: (message: string) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

let nextId = 0

const ICONS: Record<ToastType, typeof CheckCircle> = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
}

const COLORS: Record<ToastType, { bg: string; border: string; color: string }> = {
  success: { bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.25)', color: 'var(--success)' },
  error: { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.25)', color: 'var(--danger)' },
  warning: { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)', color: 'var(--warning)' },
  info: { bg: 'rgba(124,92,252,0.1)', border: 'rgba(124,92,252,0.25)', color: 'var(--violet)' },
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = nextId++
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4000)
  }, [])

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{
      toast: addToast,
      success: (msg: string) => addToast(msg, 'success'),
      error: (msg: string) => addToast(msg, 'error'),
      warning: (msg: string) => addToast(msg, 'warning'),
      info: (msg: string) => addToast(msg, 'info'),
    }}>
      {children}
      <div style={{
        position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
        display: 'flex', flexDirection: 'column', gap: 8,
        maxWidth: 400,
      }}>
        {toasts.map(t => {
          const Icon = ICONS[t.type]
          const c = COLORS[t.type]
          return (
            <div key={t.id} className="fade-up" style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '14px 18px',
              background: c.bg, border: `1px solid ${c.border}`,
              borderRadius: 12, color: c.color,
              fontSize: '0.88rem', fontWeight: 500,
              backdropFilter: 'blur(12px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            }}>
              <Icon size={18} style={{ flexShrink: 0 }} />
              <span style={{ flex: 1, color: 'var(--text)' }}>{t.message}</span>
              <button onClick={() => removeToast(t.id)} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', padding: 2 }}>
                <X size={14} />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
