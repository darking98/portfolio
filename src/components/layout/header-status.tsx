import { LABEL } from './constants'

// Reloj + ubicación + indicador de disponibilidad (bloque izquierdo del header)
export function HeaderStatus({ time }: { time: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
      <span style={LABEL}>{time}</span>
      <span style={{ ...LABEL, color: '#b0a090' }}>·</span>
      <span style={LABEL}>Buenos Aires</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: '#7d9b6a',
            display: 'inline-block',
            boxShadow: '0 0 0 0 rgba(125, 155, 106, 0.6)',
            animation: 'availablePulse 2.4s ease-in-out infinite'
          }}
        />
        <span style={LABEL}>Available for work</span>
      </div>
    </div>
  )
}
