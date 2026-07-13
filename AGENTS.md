# Portfolio — Diego Gabriel Rodriguez

Portfolio personal single-page con animaciones scroll-driven. Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4 + GSAP/ScrollTrigger + Lenis + React Three Fiber/drei.

- Dev: `pnpm dev` · Build: `pnpm build` · Type-check: `npx tsc --noEmit`
- Deploy: Vercel con pnpm. El build valida `--frozen-lockfile`: si tocás `package.json`, actualizá `pnpm-lock.yaml` en el mismo commit.

## Convenciones de archivos y estructura

- **Nombres de archivo en kebab-case** — SIEMPRE, incluso para componentes React (`hero.tsx`, `avatar-3d.tsx`, `scroll-guide.tsx`, `use-hero-animation.ts`). No hay archivos sueltos con mayúscula en `components/`.
- **Un componente = su propia carpeta** bajo `src/components/<nombre>/`, abstraída por responsabilidad (mismo patrón en todas: `experience-skills/`, `contact/`, `projects/`, `hero/`, `layout/`):
  - `<nombre>.tsx` = orquestador (refs + JSX; delega animación y datos).
  - `use-<nombre>-animation.ts` = los `useGSAP`/timelines (recibe refs por props).
  - `constants.ts` = colores, medidas, tipos de estilo.
  - `data.ts` = contenido/estructura + tipos.
  - subcomponentes = un archivo por pieza cohesiva.
- `layout/` agrupa lo transversal montado en `layout.tsx`/`page.tsx`: `background`, `smooth-scroll`, `scroll-guide`, `header`, `shader-background`. `hero/` contiene el Hero + su `avatar-3d` (no se reutiliza; si un componente 3D pasara a compartirse, va en su propia carpeta).
- Vistas de rutas de detalle: `src/views/<ruta>/<ruta>.page.tsx` (ver Transiciones).
- **Hooks reutilizables (cross-componente) van en `src/hooks/`** en camelCase (`useTilt.ts`, `useScrollTop.ts`, `useViewport.ts`, `useDarkBackdrop.ts`) e importan por `@/hooks/<name>`. NO viven en `src/lib/` (eso es para helpers no-hook: `transition.ts`, `scrollStore.ts`, `workReturn.ts`). **Excepción — hooks co-locados**: los `use-<nombre>-animation.ts` (kebab-case) que pertenecen a UN solo componente quedan JUNTO a él en su carpeta (`experience-skills/use-experience-skills-animation.ts`, etc.), no en `src/hooks/`. Regla práctica: ¿lo usan 2+ componentes/vistas? → `src/hooks/`. ¿Es la lógica de animación de un componente puntual? → co-locado.
- **Responsive** (adaptación mobile/tablet gradual por sección): `useViewport()` → `{ isMobile, isTablet, isDesktop, isPortrait, isTouch }`, SSR-safe (arranca en default desktop en server Y primer render de cliente para no romper hidratación; corrige en efecto). Breakpoints canónicos (`mobile <768`, `tablet 768–1023`, `desktop ≥1024`) espejados en `BREAKPOINTS` del hook y en `@theme` de `globals.css`. El `export const viewport` de `layout.tsx` es imprescindible (sin él nada escala en mobile). `useDarkBackdrop(probeY, enabled?)` decide si el fondo tras una franja del viewport es oscuro (para header/ScrollGuide adaptativos): sondea `#contact` y la parte oscura de `#experience-skills` (el sky oscurece a ~0.35·vh scrolleados dentro de la sección). Bypass de loader para testear: `?nointro`.

## Arquitectura de scroll (leer antes de tocar secciones)

Flujo: `Loader → Hero → ExperienceSkills → Work → Contact`, en `src/app/page.tsx`. El nav (header + `ScrollGuide`) tiene 4 items: **Experience · Skills · Work · Contact**. Experience y Skills viven ambos dentro de la sección `experience-skills` (son sus dos actos, un solo arco continuo); anclan a `<span id="experience">`/`<span id="skills">` absolutos dentro de la section (fuera del sticky) a alturas de scroll fijas — el nav salta a esas posiciones.

**Naming: carpeta ≠ label del nav ≠ id — mapeo canónico:**
- `hero/` → Hero.
- `experience-skills/` (`id="experience-skills"`, `<section>`) → contiene los DOS actos: **01 — Experience** + **02 — Skills**. Componente `ExperienceSkills`, animación `useExperienceSkillsAnimation`. NO se splitea en dos carpetas: un solo timeline scrub + morph que une Experience→Skills + starfield/sky/gate `mounted` compartidos → separarlos rompería el arco.
- `projects/` (`id="work"`, `<section>`) → sección **03 — Work** (la vitrina). Es "Work", no hay carpeta `work/` para la sección.
- `contact/` (`id="contact"`) → Contact.
- **Rutas de detalle SÍ usan el label**: `app/experience/[slug]` + `views/experience/` (detalle de una experiencia, data en `experience-skills/data.ts`); `app/work/[slug]` + `views/work/` (detalle de un proyecto, data en `projects/data.ts`).

- **Patrón: sticky + scrub — NO usar `pin` de ScrollTrigger.** Cada sección es un contenedor alto (150–420vh) con un hijo `sticky top-0 h-screen`; la animación es un timeline con `scrub` mapeado de `top top` a `bottom bottom`. Los pin-spacers de `pin: true` dejaban pantallas muertas y secciones re-apareciendo estáticas — ya se probó y se descartó. (Work ya NO usa pin/snap: se reconstruyó como vitrina sin carousel — ver más abajo.)
- **ExperienceSkills se solapa sobre Hero** con `margin-top: -100vh`: engancha justo cuando el avatar del Hero termina su fade. Si cambiás la altura del Hero, revisá ese margen.
- **Loader ↔ Hero handshake**: `page.tsx` pasa `resumeRef` al Loader; el Hero avisa cuando el GLB cargó (`onAvatarLoaded`) y el Loader recién ahí termina su ciclo (carita + guiño) y libera el Hero (`onReady`). Además `layout.tsx` inyecta un script inline `__loader_cover` que tapa el primer paint. La variable módulo `hasLoaded` en `page.tsx` evita que el Loader se repita al volver de otra ruta (SPA).
- **Lenis** (smooth scroll) se instancia en `SmoothScroll.tsx` y se expone en `window.lenis` — los scroll programáticos lo usan con guard `typeof lenis.scrollTo === 'function'`.

## Secciones Experience/Skills y Work (reconstruidas — no derivables del layout viejo)

- **ExperienceSkills = un solo arco "hacia el espacio"** (`src/components/experience-skills/`). Acto 1-2 (Experience): fondo pastel del Hero que **asciende** a espacio oscuro (`skyRef` opacity 0→1) mientras las 4 experiencias se encienden como estrellas de una constelación conectadas por líneas SVG (`stations.tsx` = `Trajectory`). Acto 3 (Skills): morph fluido — las estrellas fluyen a las posiciones de 3 constelaciones de skills interactivas (`constellation.tsx`), que se despliegan al click. El starfield es **Canvas 2D dedicado** (`starfield.tsx`, NO R3F) con parallax por mouse + estrellas fugaces + modo `warp` imperativo. Toda la coreografía en `use-experience-skills-animation.ts`. Ancla las X/Y de estrellas y clusters al mismo mapeo `%` del viewport (viewBox 1920×1000 → `x/1920*100`); el SVG de líneas usa `viewBox 0 0 100 100` + `preserveAspectRatio="none"` para compartir ese mapeo (con `xMidYMid slice` las líneas caían al lado de los puntos). **Responsive (portrait/mobile):** la constelación horizontal se reorganiza en columna ascendente zigzag vía coords `xM/yM` en `data.ts` (Stations y Clusters); flag `vertical = isMobile || isPortrait` en el componente, propagado a `Trajectory`/`Constellation`/animación. Labels debajo del punto (centrados) en mobile. Kickers y `ScrollGuide` se ocultan en mobile.
- **Work = vitrina, no carousel** (`src/components/projects/`). Lista tipográfica gigante; hover enciende la fila + atenúa el resto + muestra una **preview flotante generativa** (`project-preview.tsx`, mockup animado por CSS, placeholder reemplazable por `<img>/<video>`) que sigue el cursor con `gsap.quickTo` + métricas de impacto. Data y detalle en `data.ts`. **Estructura (orquestador + hooks co-locados + subcomponentes):** `projects.tsx` = orquestador (refs + JSX + navegación `openProject`); `use-active-row.ts` = fila activa por scroll (ticker GSAP) + anclaje vertical de la preview; `use-work-return.ts` = coreografía del morph inverso al volver del detalle; `project-row.tsx` = una fila; `project-preview.tsx` = la tarjeta flotante (gestiona la RAM del `<video>`, ver más abajo). **Nota linter (React Compiler rules):** un hook NO puede mutar refs pasados como argumento — por eso la limpieza de los `view-transition-name` (`clearNames`) vive en el orquestador (muta sus refs locales) y `use-work-return` solo decide *cuándo* llamarla.
- **Rutas de detalle**: cada experiencia y proyecto tiene su página estática. Patrón **server resuelve data / view pinta**: `app/experience/[slug]/page.tsx` y `app/work/[slug]/page.tsx` son server components con `generateStaticParams` + `dynamicParams=false` + `notFound()`, resuelven la data y la pasan como props a una view en `src/views/<ruta>/<ruta>.page.tsx` (client, `'use client'`). Convención: nuevas páginas de detalle siguen `views/<ruta>/<ruta>.page.tsx`.

## Transiciones de ruta (`src/lib/transition.ts`)

`next-view-transitions` (`useTransitionRouter`) + `router.push(..., { onTransitionReady, scroll: false })`. Helpers:
- `slideUp`/`slideDown`: parallax (saliente 22% + oscurece, entrante completa).
- `warpIn`/`warpOut`: cross-fade luminoso (Experience). El "viaje" espacial lo dibuja el `starfield.warp(cx,cy)` (líneas de velocidad + flash blanco desde la estrella clickeada) **antes** de navegar; `warpIn` continúa desde el blanco → destino claro (blanco→blanco, sin costura). Origen del flash vía `--warp-x/--warp-y`.
- `sharedMorph`/`sharedMorphBack`: shared-element (Work). Título e imagen del proyecto llevan `view-transition-name` `work-title`/`work-media` en la vitrina Y en el detalle → el browser morphea su caja. Curvas de esos grupos en `globals.css` (`::view-transition-group(work-title|work-media)`). **Vuelta = solo el título** (`work-title`); el slug a reasignar se recuerda en `src/lib/workReturn.ts` y la vitrina lee `takeWorkReturn()` **sincrónicamente en el primer render** para que el name esté en el snapshot.
- **Scroll**: `scroll: false` NO resetea el scroll → las views de detalle llaman `useScrollTop()` (`src/hooks/useScrollTop.ts`, resetea Lenis, no solo window). Al **volver** al home, la posición se restaura vía `src/lib/scrollStore.ts` (`saveScroll`/`takeScroll`) + el `useIsoLayoutEffect` de `page.tsx`.

## Minas terrestres (costaron horas — no "arreglar" sin entender)

1. **`overflow-x: clip` en el body, jamás `hidden`** — `hidden` crea un contenedor de scroll y rompe todos los `position: sticky`.
2. **No poner clases `transition-*`/`hover:opacity-*` de Tailwind en elementos que GSAP anima con scrub** — la transición CSS pelea con los valores por-frame de GSAP y deja elementos invisibles (pasó con los links del Contact).
3. **Canvas R3F: siempre full-screen fijo; nunca animar su width/height** — el ResizeObserver de R3F recalcula la cámara en cada frame y produce artefactos. Para "recortar" visualmente usar `clip-path` en un wrapper.
4. **La cámara del Hero se anima por ref** (`cameraZRef` escrito por GSAP, leído en `useFrame`), no por state — no introducir re-renders en ese camino.
5. **Usar el `AsciiRenderer` local (`src/components/contact/ascii-renderer.tsx`), no el de drei** — el de drei llama `setSize` en un `useEffect` pasivo y un rAF puede colarse antes con `iWidth/iHeight` undefined → `getImageData ... not of type 'long'`. El fork hace `setSize` en `useLayoutEffect` + guard. El gate por tamaño (`AsciiFX`) sigue además de eso.
6. **Los canvas R3F quedan montados pero pausados (`frameloop='never'`) cuando no se ven — nunca desmontarlos.** Recrear el contexto WebGL + compilar shaders + re-subir los 85MB de geometría tarda visible: en el Hero producía un hitch al volver, y en Contact dejaba el reveal de la scanline en negro. Hero: pausa vía `onLeave`/`onEnterBack` del ScrollTrigger de salida. Contact: pausa vía IntersectionObserver (`rootMargin: '75%'` reanuda antes de llegar) + `WarmUp` renderiza 1 frame (`advance`) apenas resuelve el GLB para que la subida a GPU pase durante la carga inicial, tapada por el clip-path.
7. **`gsap.quickTo` para parallax de mouse: throttlear a rAF Y matar en cleanup.** Los `quickTo` viven en el ticker global de GSAP; sin `gsap.killTweensOf(el)` en el cleanup del `useEffect`, al remontar la sección (volver de una ruta) se acumulan → fuga de RAM sostenida (pasó en la constelación de skills con ~60 setters). Además, el listener de `mousemove` no debe encolar tweens por evento (cientos/seg): guardar coords y aplicar una vez por `requestAnimationFrame`.
8. **View transitions con shared elements: el `view-transition-name` debe existir en el snapshot, y limpiarse después.** Se aplica imperativamente en el click (antes de `router.push`) o sincrónicamente en el primer render (al volver). Un name que queda pegado en el DOM rompe la próxima transición (dos elementos con el mismo name) — limpiarlo tras usarlo. Un name debe ser único por transición.
9. **La animación por scrub y el posicionamiento no pueden compartir `transform`.** Si GSAP anima `x/y/scale` de un elemento, su centrado NO puede venir de clases Tailwind `-translate-*` (GSAP las pisa) — usar `xPercent/yPercent` en el `gsap.set`. Y el offset de parallax por-frame va en un wrapper propio (sin transición CSS) separado del elemento que tiene su transición de estado (variante de la mina #2, apareció en estrellas-skill y en las estrellas-experiencia).

## El avatar (public/avatar.glb) — historia obligatoria

- La fuente es un export **3MF de Meshy** (impresión 3D a color): sin texturas, 6 materiales planos y **dithering por triángulo** para simular gradientes. Eso producía un moteado que NO es z-fighting (polygonOffset no hace nada).
- `avatar.glb` actual = horneado (colores de material → vertex colors `COLOR_0`, 6 primitivas unidas, colores/normales promediados por posición, 1 pasada Laplaciana) + optimizado con gltf-transform: `weld` → `quantize` (pos 14 / normal 16 / color 8, `KHR_mesh_quantization`) → `EXT_meshopt_compression --level high`. 20MB en disco, ~85MB decodificado (la versión Draco f32 decodificaba a 183MB de RAM + otro tanto en GPU). **No usar Draco** (dequantiza a f32 y duplica la memoria; el decoder meshopt lo cablea `useGLTF` de drei por defecto). **No usar `simplify`**: re-expone el moteado del dithering (menos vértices = colores interpolando sobre triángulos grandes → manchas) — ya se probó y quedó horrible; para bajar de 3.8M tris hace falta remesh + transfer de vertex colors en Blender desde `avatar-original.glb`. Material único **doubleSided** (el 3MF tiene winding mixto; sin doubleSided aparecen agujeros blancos).
- `avatar-original.glb` (236MB) es la fuente, **gitignoreado** — backup local, re-generar variantes desde ahí.
- **`public/avatar.glb` debe quedar FUERA de Git LFS** (exclusión explícita en `.gitattributes`). Si cae en LFS, Vercel sirve el puntero de 134 bytes y el modelo no carga (`Unexpected token 'v', "version ht"...`). Verificar con `git check-attr filter public/avatar.glb` → debe dar `unspecified`.
- El mismo GLB se usa en el Hero (render normal) y en Contact (render ASCII); Contact clona la escena (`scene.clone(true)`) para no compartir estado.

## Sistema de diseño

- Paleta: fondo pastel `#e8e0d5` · texto `#2a1a14` · muted `#8a7a70` · accent maroon `#6B3040` · cierre oscuro (Contact) `#171210` con crema `#e8e0d5`.
- Tipografías: **DM Sans** (sans, nombres/UI) y **Cormorant Garamond itálica** (serif, momentos expresivos: loader, "Rodriguez." del footer).
- Fondo global (`Background.tsx` en layout): gradiente radial cálido + grain SVG, fijo detrás de todo. Las secciones son transparentes salvo Contact.
- Tono: minimalista premium, pocas animaciones "firma" (mask reveals, blur→clear, letra-por-letra, viaje al detalle) — no acumular micro-efectos. ExperienceSkills es la excepción "wow" (arco al espacio); Work y las páginas de detalle vuelven al pastel.
- Labels/links: uppercase, tracking amplio, tamaños ~0.6–0.72rem. Kickers de sección numerados (`01 — Experience`, `02 — Skills`, `03 — Work`). El ScrollGuide (derecha) cambia a paleta clara cuando el Contact cubre el centro del viewport.

## Misc

- **`THREE.Clock: deprecated` en consola** es ruido de `@react-three/fiber` (three 0.185 deprecó `Clock` a favor de `Timer`); NO es del código propio. Ignorar hasta que R3F migre — no downgradear three (rompería meshopt/`KHR_mesh_quantization` del avatar).
