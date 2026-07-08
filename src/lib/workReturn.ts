// Recuerda qué proyecto de Work se abrió, para que al volver la vitrina pueda
// reasignar los view-transition-name (título + preview) a esa fila y hacer el
// morph inverso. Módulo-scope: persiste entre navegaciones SPA, se consume una
// sola vez (como scrollStore).
let slug: string | null = null

export const setWorkReturn = (s: string) => {
  slug = s
}

// Devuelve el slug y lo limpia (el morph inverso se arma una sola vez).
export const takeWorkReturn = () => {
  const s = slug
  slug = null
  return s
}
