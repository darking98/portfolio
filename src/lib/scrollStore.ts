// Guarda la posición de scroll al salir de una ruta para restaurarla al volver.
// Módulo-scope: persiste entre navegaciones SPA, se resetea en reload completo.
let saved = 0

export const saveScroll = (y: number) => { saved = y }

// Devuelve la posición guardada y la limpia (restaura una sola vez).
export const takeScroll = () => {
  const y = saved
  saved = 0
  return y
}
