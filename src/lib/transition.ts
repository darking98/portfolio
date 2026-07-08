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
