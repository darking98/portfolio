const DURATION = 900
const EASING = 'cubic-bezier(0.76, 0, 0.24, 1)'

// Cuánto se desplaza la capa que se va (menos que la que entra → parallax)
const RECEDE = 22 // %

// Ida: la nueva entra completa desde abajo; la anterior queda atrás
// (sube menos y se oscurece).
export function slideUp() {
  document.documentElement.animate(
    [
      { transform: 'translateY(0)', filter: 'brightness(1)' },
      { transform: `translateY(-${RECEDE}%)`, filter: 'brightness(0.5)' },
    ],
    { duration: DURATION, easing: EASING, pseudoElement: '::view-transition-old(root)' }
  )
  document.documentElement.animate(
    [{ transform: 'translateY(100%)' }, { transform: 'translateY(0)' }],
    { duration: DURATION, easing: EASING, pseudoElement: '::view-transition-new(root)' }
  )
}

// Vuelta: la nueva entra completa desde arriba; la anterior queda atrás
// (baja menos y se oscurece).
export function slideDown() {
  document.documentElement.animate(
    [
      { transform: 'translateY(0)', filter: 'brightness(1)' },
      { transform: `translateY(${RECEDE}%)`, filter: 'brightness(0.5)' },
    ],
    { duration: DURATION, easing: EASING, pseudoElement: '::view-transition-old(root)' }
  )
  document.documentElement.animate(
    [{ transform: 'translateY(-100%)' }, { transform: 'translateY(0)' }],
    { duration: DURATION, easing: EASING, pseudoElement: '::view-transition-new(root)' }
  )
}

// ── Warp / hyperspace ──────────────────────────────────────────────────────
// El "viaje hacia la estrella": la capa de líneas de velocidad la anima el
// canvas del starfield antes de disparar la navegación. Acá solo hacemos el
// clímax: la vista vieja termina de acelerar/blanquearse y la nueva emerge
// desde un punto de luz (flash → reveal). El origen (--warp-x/y en %) lo setea
// el que dispara el click; por defecto, centro.
const WARP_IN = 420
const WARP_OUT = 620
const WARP_EASE = 'cubic-bezier(0.4, 0, 0.2, 1)'

export function warpIn() {
  const root = document.documentElement

  // El canvas ya llegó al flash blanco total. Acá solo hacemos el cruce corto:
  // la vista vieja termina de fundirse al blanco y la nueva aparece EN SU LUGAR
  // por opacity (sin escalar/mover → nada de "rectángulo posicionándose").
  root.animate(
    [
      { opacity: 1, filter: 'brightness(3)' },
      { opacity: 0, filter: 'brightness(4)' },
    ],
    {
      duration: WARP_IN,
      easing: WARP_EASE,
      pseudoElement: '::view-transition-old(root)',
    }
  )
  root.animate(
    [
      { opacity: 0, filter: 'brightness(2.6)' },
      { opacity: 1, filter: 'brightness(1)' },
    ],
    {
      duration: WARP_IN,
      easing: WARP_EASE,
      pseudoElement: '::view-transition-new(root)',
    }
  )
}

// Vuelta: inversa de la ida — cross-fade por opacity (sin transform, nada de
// "rectángulo que se va"). La página del detalle se funde al blanco y la
// constelación reaparece en su lugar.
export function warpOut() {
  const root = document.documentElement
  root.animate(
    [
      { opacity: 1, filter: 'brightness(1)' },
      { opacity: 0, filter: 'brightness(3)' },
    ],
    {
      duration: WARP_OUT,
      easing: WARP_EASE,
      pseudoElement: '::view-transition-old(root)',
    }
  )
  root.animate(
    [
      { opacity: 0, filter: 'brightness(2.6)' },
      { opacity: 1, filter: 'brightness(1)' },
    ],
    {
      duration: WARP_OUT,
      easing: WARP_EASE,
      pseudoElement: '::view-transition-new(root)',
    }
  )
}

// ── Shared-element (Work) ───────────────────────────────────────────────────
// El título y la imagen del proyecto tienen el mismo view-transition-name en la
// vitrina y en el detalle → el browser anima automáticamente su placement
// (posición + tamaño) entre ambas vistas. Acá solo cross-fadeamos el "resto"
// (root) para que el contenido no compartido no salte; los pares nombrados
// (work-title / work-media) los coordina el propio API. La curva/duración de
// esos grupos se define por CSS en globals (::view-transition-group).
const SHARED = 520
const SHARED_EASE = 'cubic-bezier(0.4, 0, 0.2, 1)'

export function sharedMorph() {
  const root = document.documentElement
  root.animate(
    [{ opacity: 1 }, { opacity: 0 }],
    {
      duration: SHARED,
      easing: SHARED_EASE,
      pseudoElement: '::view-transition-old(root)',
    }
  )
  root.animate(
    [{ opacity: 0 }, { opacity: 1 }],
    {
      duration: SHARED,
      easing: SHARED_EASE,
      pseudoElement: '::view-transition-new(root)',
    }
  )
}

// Vuelta desde el detalle de Work (misma coreografía inversa; los shared
// elements vuelven a su lugar en la vitrina).
export function sharedMorphBack() {
  sharedMorph()
}
