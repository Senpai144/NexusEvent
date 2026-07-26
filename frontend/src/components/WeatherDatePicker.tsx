import { useState, useMemo } from 'react'
import {
  Sun, CloudRain, CloudLightning, Cloud, CloudSun, Thermometer, Wind, Droplets, CheckCircle, AlertTriangle, ArrowRight, Clock, Calendar
} from 'lucide-react'

interface HourlyData {
  time: string
  temp: number
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'partly-cloudy'
}

export interface ForecastDay {
  date: string
  dayName: string
  tempMax: number
  tempMin: number
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'partly-cloudy'
  humidity: number
  precipitation: number
  wind: number
  hourlyData: HourlyData[]
  isIdealForEvent: boolean
}

const CONDITION_ICONS: Record<string, { icon: typeof Sun; color: string }> = {
  sunny: { icon: Sun, color: 'var(--warning)' },
  'partly-cloudy': { icon: CloudSun, color: 'var(--text2)' },
  cloudy: { icon: Cloud, color: 'var(--text3)' },
  rainy: { icon: CloudRain, color: 'var(--violet)' },
  stormy: { icon: CloudLightning, color: 'var(--danger)' },
}

function ConditionIcon({ condition, size = 24 }: { condition: string; size?: number }) {
  const match = CONDITION_ICONS[condition] || CONDITION_ICONS['partly-cloudy']
  const Icon = match.icon
  return <Icon size={size} color={match.color} />
}

function HourlySparkline({ data }: { data: HourlyData[] }) {
  const temps = data.map(d => d.temp)
  const min = Math.min(...temps)
  const max = Math.max(...temps)
  const range = max - min || 1
  const w = data.length * 40
  const h = 60

  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: h, position: 'relative' }}>
      <svg width={w} height={h} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
        <polyline points={temps.map((t, i) => `${i * 40 + 20},${h - 10 - ((t - min) / range) * (h - 30)}`).join(' ')}
          fill="none" stroke="var(--violet)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity={0.4} />
      </svg>
      <div style={{ display: 'flex', gap: 4, width: '100%', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
        {data.map((d, i) => {
          const barH = Math.max(((d.temp - min) / range) * (h - 20), 4)
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1 }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text2)' }}>{d.temp}°</div>
              <div style={{
                width: 24, height: barH, borderRadius: 4,
                background: d.condition === 'rainy' || d.condition === 'stormy' ? 'rgba(124,92,252,0.4)' : 'rgba(255,92,58,0.35)',
              }} />
              <div style={{ fontSize: '0.6rem', color: 'var(--text3)', marginTop: 2 }}>{d.time}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const MOCK_FORECAST: ForecastDay[] = [
  {
    date: '2026-07-13', dayName: 'Mon 13 July', tempMax: 28, tempMin: 22,
    condition: 'sunny', humidity: 45, precipitation: 10, wind: 12,
    hourlyData: [
      { time: '9am', temp: 23, condition: 'sunny' },
      { time: '12pm', temp: 27, condition: 'sunny' },
      { time: '3pm', temp: 28, condition: 'partly-cloudy' },
      { time: '6pm', temp: 25, condition: 'sunny' },
      { time: '9pm', temp: 22, condition: 'cloudy' },
    ],
    isIdealForEvent: true,
  },
  {
    date: '2026-07-14', dayName: 'Tue 14 July', tempMax: 30, tempMin: 24,
    condition: 'sunny', humidity: 40, precipitation: 5, wind: 8,
    hourlyData: [
      { time: '9am', temp: 25, condition: 'sunny' },
      { time: '12pm', temp: 29, condition: 'sunny' },
      { time: '3pm', temp: 30, condition: 'sunny' },
      { time: '6pm', temp: 27, condition: 'sunny' },
      { time: '9pm', temp: 24, condition: 'partly-cloudy' },
    ],
    isIdealForEvent: true,
  },
  {
    date: '2026-07-15', dayName: 'Wed 15 July', tempMax: 26, tempMin: 21,
    condition: 'rainy', humidity: 72, precipitation: 80, wind: 25,
    hourlyData: [
      { time: '9am', temp: 22, condition: 'rainy' },
      { time: '12pm', temp: 24, condition: 'rainy' },
      { time: '3pm', temp: 26, condition: 'cloudy' },
      { time: '6pm', temp: 23, condition: 'rainy' },
      { time: '9pm', temp: 21, condition: 'rainy' },
    ],
    isIdealForEvent: false,
  },
  {
    date: '2026-07-16', dayName: 'Thu 16 July', tempMax: 24, tempMin: 19,
    condition: 'stormy', humidity: 82, precipitation: 90, wind: 35,
    hourlyData: [
      { time: '9am', temp: 20, condition: 'rainy' },
      { time: '12pm', temp: 22, condition: 'stormy' },
      { time: '3pm', temp: 24, condition: 'stormy' },
      { time: '6pm', temp: 21, condition: 'rainy' },
      { time: '9pm', temp: 19, condition: 'rainy' },
    ],
    isIdealForEvent: false,
  },
  {
    date: '2026-07-17', dayName: 'Fri 17 July', tempMax: 27, tempMin: 22,
    condition: 'partly-cloudy', humidity: 55, precipitation: 30, wind: 15,
    hourlyData: [
      { time: '9am', temp: 23, condition: 'cloudy' },
      { time: '12pm', temp: 25, condition: 'partly-cloudy' },
      { time: '3pm', temp: 27, condition: 'partly-cloudy' },
      { time: '6pm', temp: 25, condition: 'cloudy' },
      { time: '9pm', temp: 22, condition: 'cloudy' },
    ],
    isIdealForEvent: true,
  },
]

interface WeatherDatePickerProps {
  forecastData?: ForecastDay[]
  onConfirm?: (day: ForecastDay) => void
  onCreateEvent?: (day: ForecastDay) => void
  city?: string
}

export default function WeatherDatePicker({ forecastData, onConfirm, onCreateEvent, city = 'Dakar' }: WeatherDatePickerProps) {
  const data = forecastData || MOCK_FORECAST
  const [selectedDate, setSelectedDate] = useState(data[0]?.date || '')
  const [confirmed, setConfirmed] = useState(false)

  const selectedDay = useMemo(() => data.find(d => d.date === selectedDate) || data[0], [data, selectedDate])

  const handleConfirm = () => {
    if (selectedDay) {
      setConfirmed(true)
      onConfirm?.(selectedDay)
    }
  }

  const getConditionLabel = (condition: string) => {
    const labels: Record<string, string> = {
      sunny: 'Ensoleillé',
      'partly-cloudy': 'Partiellement nuageux',
      cloudy: 'Nuageux',
      rainy: 'Pluie forte',
      stormy: 'Orage / Éclairs',
    }
    return labels[condition] || condition
  }

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--border2)' }}>
      <div style={{ padding: '28px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gap: 28,
        }} className="weather-grid">
          {/* LEFT: Current Weather Details */}
          <div style={{
            background: 'var(--bg3)',
            borderRadius: 16,
            padding: '24px',
            border: '1px solid var(--border)',
          }}>
            {/* Header */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text2)' }}>{city}</span>
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--text3)' }} />
                <span style={{ fontSize: '0.82rem', color: 'var(--text3)' }}>{selectedDay?.dayName}</span>
              </div>
              <div style={{
                fontSize: '0.78rem',
                color: selectedDay?.isIdealForEvent ? 'var(--success)' : 'var(--warning)',
                fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6,
              }}>
                {selectedDay?.isIdealForEvent ? <CheckCircle size={12} /> : <AlertTriangle size={12} />}
                {getConditionLabel(selectedDay?.condition || 'sunny')}
              </div>
            </div>

            {/* Temperature */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <ConditionIcon condition={selectedDay?.condition || 'sunny'} size={52} />
              <div>
                <div style={{
                  fontSize: '3rem', fontWeight: 800, color: 'var(--text)',
                  lineHeight: 1, fontFamily: 'Syne, sans-serif',
                }}>
                  {selectedDay?.tempMax}°
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text3)' }}>
                  H:{selectedDay?.tempMax}° L:{selectedDay?.tempMin}°
                </div>
              </div>
            </div>

            {/* Details */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 24 }}>
              {[
                { icon: Droplets, label: 'Précip.', value: `${selectedDay?.precipitation}%`, color: 'var(--violet)' },
                { icon: Wind, label: 'Vent', value: `${selectedDay?.wind} km/h`, color: 'var(--accent)' },
                { icon: Thermometer, label: 'Humidité', value: `${selectedDay?.humidity}%`, color: 'var(--warning)' },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} style={{ textAlign: 'center', padding: '10px 6px', background: 'var(--bg2)', borderRadius: 10 }}>
                  <Icon size={16} color={color} style={{ marginBottom: 4 }} />
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text)' }}>{value}</div>
                  <div style={{ fontSize: '0.62rem', color: 'var(--text3)', marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Hourly Forecast */}
            <div>
              <div style={{
                fontSize: '0.72rem', fontWeight: 600, color: 'var(--text3)',
                textTransform: 'uppercase', letterSpacing: '0.08em',
                marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <Clock size={12} /> Prévisions horaires
              </div>
              <HourlySparkline data={selectedDay?.hourlyData || []} />
            </div>
          </div>

          {/* RIGHT: Day Selector */}
          <div>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text)', fontFamily: 'Syne, sans-serif', marginBottom: 4 }}>
                Choisissez votre jour
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text3)' }}>
                Sélectionnez un jour avec une météo favorable
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: 12,
              marginBottom: 20,
            }}>
              {data.map((day) => {
                const isSelected = selectedDate === day.date
                const IconConfig = CONDITION_ICONS[day.condition] || CONDITION_ICONS['partly-cloudy']
                const DayIcon = IconConfig.icon

                return (
                  <button
                    key={day.date}
                    onClick={() => { setSelectedDate(day.date); setConfirmed(false) }}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                      padding: '18px 10px',
                      background: isSelected ? 'var(--surface)' : 'var(--bg3)',
                      border: isSelected ? '2px solid var(--success)' : '1px solid var(--border)',
                      borderRadius: 14, cursor: 'pointer',
                      transition: 'all 0.2s',
                      outline: 'none', position: 'relative',
                      boxShadow: isSelected ? '0 0 20px rgba(34,197,94,0.15)' : 'none',
                    }}
                    onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'var(--surface)' }}
                    onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'var(--bg3)' }}
                  >
                    <div style={{
                      position: 'absolute', top: 6, right: 6,
                      padding: '2px 7px', borderRadius: 50,
                      fontSize: '0.55rem', fontWeight: 700, whiteSpace: 'nowrap',
                      background: day.isIdealForEvent ? 'rgba(34,197,94,0.15)' : 'rgba(245,158,11,0.15)',
                      color: day.isIdealForEvent ? 'var(--success)' : 'var(--warning)',
                      border: `1px solid ${day.isIdealForEvent ? 'rgba(34,197,94,0.3)' : 'rgba(245,158,11,0.3)'}`,
                    }}>
                      {day.isIdealForEvent ? '✓ Idéal' : '⚠ Éviter'}
                    </div>

                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text2)', marginTop: 4 }}>
                      {day.dayName}
                    </div>

                    <DayIcon size={26} color={IconConfig.color} />

                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text)' }}>
                      {day.tempMax}° / {day.tempMin}°
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Confirmation bar */}
            <div style={{
              background: 'var(--bg3)',
              borderRadius: 14,
              padding: '18px 22px',
              border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginBottom: 2 }}>
                  Jour sélectionné pour l'événement :
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CheckCircle size={15} color="var(--success)" />
                  {selectedDay?.dayName || 'Aucun jour'} — {selectedDay?.date || ''}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button
                  onClick={handleConfirm}
                  disabled={confirmed}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '10px 24px', borderRadius: 50,
                    background: confirmed ? 'rgba(34,197,94,0.15)' : 'var(--accent)',
                    color: '#fff', border: 'none', fontSize: '0.85rem', fontWeight: 600,
                    cursor: confirmed ? 'default' : 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: confirmed ? 'none' : '0 4px 20px var(--accent-glow)',
                  }}
                  onMouseEnter={e => { if (!confirmed) e.currentTarget.style.transform = 'translateY(-1px)' }}
                  onMouseLeave={e => { if (!confirmed) e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  {confirmed ? (
                    <>Confirmé <CheckCircle size={16} /></>
                  ) : (
                    <>Confirmer la date <ArrowRight size={16} /></>
                  )}
                </button>
                {onCreateEvent && (
                  <button
                    onClick={() => onCreateEvent(selectedDay)}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 8,
                      padding: '10px 24px', borderRadius: 50,
                      background: 'var(--surface)',
                      color: 'var(--text)', border: '1px solid var(--border2)',
                      fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface2)'; e.currentTarget.style.borderColor = 'var(--accent)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.borderColor = 'var(--border2)' }}
                  >
                    <Calendar size={15} /> Créer un événement
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .weather-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
