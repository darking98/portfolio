import type { RefObject } from 'react'
import SmilingFace from '@/ui/smiling-face'
import { CREAM, LINK, SOCIALS } from './constants'

type ContactFooterProps = {
  winkEyeRef: RefObject<SVGGElement | null>
  onWink: () => void
}

export function ContactFooter({ winkEyeRef, onWink }: ContactFooterProps) {
  return (
    <div className="absolute bottom-0 inset-x-0 z-10 px-8 md:px-12 pb-6">
      {/* Links de utilidad: anclados en la esquina inferior izquierda, sobre
          el borde oscuro del ASCII donde contrastan (bold + blur local) */}
      <div className="absolute left-8 md:left-12 bottom-6 z-20 flex flex-col items-start gap-2">
        <a
          href="mailto:me@diegogabrielrodriguez.com"
          style={LINK}
          className="contact-fade"
        >
          me@diegogabrielrodriguez.com
        </a>

        <div className="flex items-center gap-5 md:gap-7">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              style={LINK}
              className="contact-fade"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>

      {/* Nombre gigante escalonado (letra por letra) */}
      <div className="flex flex-col items-start leading-[0.85] select-none">
        {/* Diego */}
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 'clamp(3rem, 13vw, 15rem)',
            fontWeight: 500,
            letterSpacing: '-0.04em',
            color: CREAM,
            textShadow: '0 4px 40px rgba(0,0,0,0.55)'
          }}
        >
          {'Diego'.split('').map((ch, i) => (
            <span key={i} className="contact-letter inline-block">
              {ch}
            </span>
          ))}
        </span>

        {/* Gabriel — desplazado a la derecha y solapado hacia arriba */}
        <span
          style={{
            marginLeft: '18vw',
            marginTop: '-0.18em',
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: 'italic',
            fontSize: 'clamp(3rem, 13vw, 15rem)',
            fontWeight: 500,
            letterSpacing: '-0.01em',
            color: CREAM,
            whiteSpace: 'nowrap',
            textShadow: '0 4px 40px rgba(0,0,0,0.55)'
          }}
        >
          {'Gabriel'.split('').map((ch, i) => (
            <span key={i} className="contact-letter inline-block">
              {ch}
            </span>
          ))}
        </span>

        {/* Rodriguez — aún más a la derecha y solapado hacia arriba */}
        <span
          className="relative"
          style={{
            marginLeft: '36vw',
            marginTop: '-0.18em',
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: 'italic',
            fontSize: 'clamp(3rem, 13vw, 15rem)',
            fontWeight: 500,
            letterSpacing: '-0.01em',
            color: CREAM,
            whiteSpace: 'nowrap',
            textShadow: '0 4px 40px rgba(0,0,0,0.55)'
          }}
        >
          {'Rodriguez'.split('').map((ch, i) => (
            <span key={i} className="contact-letter inline-block">
              {ch}
            </span>
          ))}
          {/* Carita: se apoya sobre el final de la "z", guiña al pasar el mouse */}
          <SmilingFace
            winkEyeRef={winkEyeRef}
            size="clamp(28px, 3.4vw, 56px)"
            color={CREAM}
            className="contact-fade absolute cursor-pointer"
            style={{ bottom: '0', right: '-0.2em' }}
            onMouseEnter={onWink}
          />
        </span>
      </div>
    </div>
  )
}
