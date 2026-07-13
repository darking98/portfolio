'use client'

import { LABEL } from './constants'
import { useClock } from './use-clock'
import { HeaderStatus } from './header-status'
import { useViewport } from '@/hooks/useViewport'
import { useDarkBackdrop } from '@/hooks/useDarkBackdrop'

export default function Header() {
  const time = useClock()
  const { isMobile } = useViewport()
  // El fondo del header solo aplica en mobile → solo ahí detectamos oscuridad.
  // Sonda a 48px del top (la franja donde vive el header).
  const dark = useDarkBackdrop(48, isMobile)

  // Sobre fondo oscuro los labels muted (#8a7a70) contrastan mal → los aclaramos.
  const navLabel: React.CSSProperties = dark
    ? { ...LABEL, color: '#c9bcae', transition: 'color 0.4s ease' }
    : { ...LABEL, transition: 'color 0.4s ease' }

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        display: 'flex',
        // Mobile: columna → nav (secciones) arriba, status abajo a la izquierda.
        // Desktop: fila con status ↔ nav a los extremos.
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'flex-start' : 'center',
        justifyContent: isMobile ? 'flex-start' : 'space-between',
        gap: isMobile ? '0.75rem' : undefined,
        padding: isMobile ? '1.25rem 1.5rem 2rem' : '1.5rem 2rem',
        animation: 'headerFadeIn 0.7s ease forwards'
      }}
    >
      {/* Fondo translúcido + blur SOLO en mobile: la lista de Work (y otras
          secciones full-width) pasaban por detrás del header transparente y se
          leían encima. Va en una capa propia (no en el <header>) para que la
          máscara de desvanecido no afecte a los links. Neutro: funciona sobre el
          pastel y sobre el Contact oscuro. pointer-events-none → no roba clicks. */}
      {isMobile && (
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: -1,
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            // Fondo adaptativo: crema sobre secciones claras, oscuro (#171210,
            // el cierre de Contact) sobre las oscuras (espacio de Skills +
            // Contact). Opaco arriba (tapa aunque el device no soporte
            // backdrop-filter) → desvanece hacia abajo, sin línea dura.
            background: dark
              ? 'linear-gradient(to bottom, rgba(23,18,16,0.92) 40%, rgba(23,18,16,0.7) 70%, rgba(23,18,16,0))'
              : 'linear-gradient(to bottom, rgba(232,224,213,0.94) 40%, rgba(232,224,213,0.75) 70%, rgba(232,224,213,0))',
            maskImage: 'linear-gradient(to bottom, #000 70%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, #000 70%, transparent 100%)',
            transition: 'background 0.4s ease'
          }}
        />
      )}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          // En mobile el nav va primero (arriba). En desktop, después del status.
          order: isMobile ? 0 : 1,
          gap: isMobile ? '1rem' : '1.5rem'
        }}
      >
        <a href="#experience" style={navLabel}>
          Experience
        </a>
        <a href="#skills" style={navLabel}>
          Skills
        </a>
        <a href="#work" style={navLabel}>
          Work
        </a>
        <a href="#contact" style={navLabel}>
          Contact
        </a>
        {/* CV: navegación real a la ruta /cv (no es ancla de scroll). Mismo
            estilo que el resto del nav. */}
        <a href="/cv" style={navLabel}>
          CV
        </a>
      </nav>
      <HeaderStatus time={time} dark={dark} />
    </header>
  )
}
