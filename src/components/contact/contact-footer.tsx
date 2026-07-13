import type { RefObject } from 'react'
import SmilingFace from '@/ui/smiling-face'
import { CREAM, LINK, SOCIALS } from './constants'
import { useViewport } from '@/hooks/useViewport'

type ContactFooterProps = {
  winkEyeRef: RefObject<SVGGElement | null>
  onWink: () => void
}

export function ContactFooter({ winkEyeRef, onWink }: ContactFooterProps) {
  const { isMobile } = useViewport()
  // Nombre más grande en mobile (pedido); en desktop se mantiene el clamp base.
  const nameSize = isMobile
    ? 'clamp(3.4rem, 15.5vw, 15rem)'
    : 'clamp(3rem, 13vw, 15rem)'
  // Escalonado (indentación de Gabriel/Rodriguez). En mobile MUCHO menor: con
  // 18vw/36vw + el nombre grande, "Rodriguez" se escapaba fuera del viewport.
  const indent2 = isMobile ? '10vw' : '18vw'
  const indent3 = isMobile ? '22vw' : '36vw'
  return (
    <div
      className={
        // Mobile: cubre TODO el sticky (inset-0) para poder anclar los links
        // arriba y el nombre abajo (mt-auto). Desktop: solo la franja inferior.
        isMobile
          ? 'absolute inset-0 z-10 px-8 pb-6 flex flex-col'
          : 'absolute bottom-0 inset-x-0 z-10 px-8 md:px-12 pb-6'
      }
    >
      {/* Links de utilidad. Desktop: esquina inferior izquierda (absolute).
          Mobile: apenas ARRIBA del nombre (mt-auto empuja el par links+nombre al
          fondo; el nombre queda debajo), alineados a la derecha sobre el ASCII. */}
      <div
        className={
          isMobile
            ? 'z-20 mt-auto mb-3 flex flex-col items-end gap-2 text-right'
            : 'absolute left-8 md:left-12 bottom-6 z-20 flex flex-col items-start gap-2'
        }
      >
        <a
          href="mailto:me@diegogabrielrodriguez.com"
          style={LINK}
          className="contact-fade"
        >
          me@diegogabrielrodriguez.com
        </a>

        <div className="flex items-center gap-5 md:gap-7">
          {SOCIALS.map((s) => {
            // CV (/cv) es ruta interna → misma pestaña, sin target/rel externos.
            const ext = s.external !== false
            return (
              <a
                key={s.label}
                href={s.href}
                {...(ext ? { target: '_blank', rel: 'noreferrer' } : {})}
                style={LINK}
                className="contact-fade"
              >
                {s.label}
              </a>
            )
          })}
        </div>
      </div>

      {/* Nombre gigante escalonado (letra por letra). En mobile queda al fondo:
          el bloque de links (mt-auto) empuja el par al fondo y el nombre va
          debajo de los links. */}
      <div className="flex flex-col items-start leading-[0.85] select-none">
        {/* Diego */}
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: nameSize,
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
            marginLeft: indent2,
            marginTop: '-0.18em',
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: 'italic',
            fontSize: nameSize,
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
            marginLeft: indent3,
            marginTop: '-0.18em',
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: 'italic',
            fontSize: nameSize,
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
          {/* Carita: se apoya sobre el final de la "z", guiña al pasar el mouse.
              En mobile se separa un poco más (a la derecha y arriba) para no
              tocar la "z" con el nombre agrandado. */}
          <SmilingFace
            winkEyeRef={winkEyeRef}
            size={isMobile ? 'clamp(26px, 8vw, 44px)' : 'clamp(28px, 3.4vw, 56px)'}
            color={CREAM}
            className="contact-fade absolute cursor-pointer"
            style={
              isMobile
                ? { bottom: '0', right: '-0.45em' }
                : { bottom: '0', right: '-0.2em' }
            }
            onMouseEnter={onWink}
          />
        </span>
      </div>
    </div>
  )
}
