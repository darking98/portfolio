# Portfolio V2 — Context for AI Assistants

## Stack

- **Next.js 16.2.10** — App Router, Server + Client Components (`'use client'` required for anything interactive)
- **React 19 + TypeScript**
- **Tailwind CSS v4** — usa `@import "tailwindcss"` (no config file), sintaxis de variables CSS: `hover:text-(--fg)` (no `[var(--fg)]`)
- **GSAP 3 + `@gsap/react`** — usar `useGSAP` hook, registrar plugins con `gsap.registerPlugin()`
- **Lenis** — smooth scroll, integrado con GSAP ticker en `SmoothScroll.tsx`
- **React Three Fiber + @react-three/drei** — Three.js declarativo. Versión drei: 10.7.7
- **Three.js** — loaders, materiales, etc.

## Estructura de archivos clave

```
src/
  app/
    layout.tsx          — importa ../styles/globals.css, wrappea con SmoothScroll
    page.tsx            — 'use client', maneja estado loaderDone, importa secciones
  styles/
    globals.css         — Google Fonts DEBE ser primer @import (antes de tailwindcss)
  components/
    Loader.tsx          — 7 paneles escalera + contador 0→100
    Hero.tsx            — sección hero con animaciones GSAP
    ShaderBackground.tsx — canvas WebGL fullscreen (fondo interactivo)
    Avatar3D.tsx        — modelo 3D del avatar
    SmoothScroll.tsx    — Lenis + GSAP ticker
public/
  avatar.glb            — modelo 3D exportado desde Blender (con texturas de Meshy)
  studio.exr            — HDRI para iluminación (Poly Haven, 1k)
```

## Diseño / Estética

- **Paleta**: `--bg: #0c0c0c`, `--fg: #e8e2d9`, `--fg-muted: #7a7a6e`, `--accent: #8a9b65` (olive green), `--loader: #1a3105`
- **Tipografía**: Cormorant Garamond (display, serif, weight 300) + Inter (body)
- **Estilo**: dark premium, minimalista editorial, serif elegante

## Componentes — detalles importantes

### Loader (`Loader.tsx`)
- 7 paneles horizontales `var(--loader)` cubren la pantalla completa (fixed, z-50)
- Contador grande abajo-derecha: cuenta 0→100 en 1.5s con `snap`
- Paneles se animan hacia arriba con `stagger: { amount: 0.55, from: 'end' }` (de derecha a izquierda)
- Llama `onComplete` cuando terminan de salir

### Hero (`Hero.tsx`)
- **CRÍTICO**: la animación de scroll se registra en el `onComplete` del timeline de intro — si se registra antes, GSAP hace conflicto de estado y la animación de opacidad no funciona
- `gsap.set` inicial pone todos los elementos en `opacity: 0, y: 40` para que no flasheen debajo del loader
- "Rodriguez" empieza con `x: '5vw'` (ligeramente fuera de pantalla a la derecha)
- Animación de scroll (ScrollTrigger): los nombres suben, se cruzan y salen por los costados
  - Fase 1 (35%): suben y se cruzan (`firstNameRef` va derecha, `lastNameRef` va izquierda)
  - Fase 2 (65%): salen de pantalla lateralmente
- La sección NO tiene `overflow-hidden` (para que el texto anime fuera de los bordes)
- El canvas del shader está en un wrapper con `overflow-hidden` separado

### ShaderBackground (`ShaderBackground.tsx`)
- NDC vertex shader + `PlaneGeometry(2,2)` → fullscreen sin depender de cámara
- Columnas de luz olive green con función `softColumn`
- Mouse interpolado con factor 0.06 (lerp suave)
- Halo del cursor reactivo al movimiento

### Avatar3D (`Avatar3D.tsx`)
- GLB exportado desde Blender (el modelo fue generado en Meshy AI con foto de referencia)
- Se calcula el bounding box al montar para auto-escalar y centrar el modelo
- `roughness = 1.0, metalness = 0.0, envMapIntensity = 0.0` en todos los materiales → look flat/ilustrativo (como viewport Solid de Blender)
- Rotación en Y según scroll: `rotation.y = (scrollY / innerHeight*1.8) * Math.PI * 2`
- Canvas `alpha: true` → fondo transparente, el shader verde se ve detrás
- Importado con `dynamic(() => import(...), { ssr: false })` en Hero

### SmoothScroll (`SmoothScroll.tsx`)
- Lenis con `duration: 1.4`
- Integración: `lenis.on('scroll', ScrollTrigger.update)` + `gsap.ticker.add((time) => lenis.raf(time * 1000))`
- `gsap.ticker.lagSmoothing(0)` para evitar saltos

## Errores conocidos y soluciones

| Problema | Causa | Solución |
|----------|-------|----------|
| `@import` CSS error en línea 524 | Google Fonts `@import` estaba después de `@import "tailwindcss"` | Mover Google Fonts al primer lugar |
| Animación scroll mata opacidad intro | ScrollTrigger registrado simultáneamente con `gsap.set({opacity:0})` | Registrar scroll en `onComplete` del intro |
| Avatar gris rectangulo | `<Environment preset="studio" />` intenta bajar HDR de DigitalOcean CDN | Usar luces manuales o HDRI local |
| Avatar con fondo verde bleeding | `alpha: true` + `background:transparent` deja ver el shader | `alpha: false` + fondo sólido en el container, o `alpha: true` sin background |
| Modelo acostado de lado | Meshy/Blender exporta con Z-up, Three.js usa Y-up | `rotation={[-Math.PI/2, 0, 0]}` o exportar correctamente desde Blender |
| Remera con aspecto cuero/plástico | HDRI crea especular fuerte en materiales con baja roughness | `roughness=1.0, metalness=0.0, envMapIntensity=0.0` |

## Convenciones importantes

- En Tailwind v4, las clases con variables CSS usan `hover:text-(--var)`, NO `hover:text-[var(--var)]`
- Todo componente con WebGL/Three.js/GSAP necesita `'use client'`
- Componentes WebGL se importan con `dynamic(..., { ssr: false })` para evitar errores de SSR
- Next.js 16 puede tener breaking changes — revisar `node_modules/next/dist/docs/` ante dudas

## Secciones pendientes

- `About` — no implementada
- `Projects` — no implementada  
- `Skills` — no implementada
