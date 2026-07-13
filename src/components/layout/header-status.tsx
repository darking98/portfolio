import { LABEL } from './constants'

// Reloj + ubicación + indicador de disponibilidad (bloque izquierdo del header).
// `dark`: sobre fondo oscuro (espacio de Skills / Contact en mobile) aclara el
// texto para que contraste.
export function HeaderStatus({
  time,
  dark = false
}: {
  time: string
  dark?: boolean
}) {
  const label: React.CSSProperties = dark
    ? { ...LABEL, color: '#c9bcae', transition: 'color 0.4s ease' }
    : { ...LABEL, transition: 'color 0.4s ease' }
  const dot: React.CSSProperties = { ...label, color: dark ? '#8a7d6f' : '#b0a090' }
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.5rem 1rem'
      }}
    >
      <span style={label}>{time}</span>
      <span style={dot}>·</span>
      <span style={label}>Buenos Aires</span>
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
        <span style={label}>Available for work</span>
      </div>
    </div>
  )
}
