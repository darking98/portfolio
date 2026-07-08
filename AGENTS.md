# Portfolio — Diego Gabriel Rodriguez

Portfolio personal single-page con animaciones scroll-driven. Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4 + GSAP/ScrollTrigger + Lenis + React Three Fiber/drei.

- Dev: `pnpm dev` · Build: `pnpm build` · Type-check: `npx tsc --noEmit`
- Deploy: Vercel con pnpm. El build valida `--frozen-lockfile`: si tocás `package.json`, actualizá `pnpm-lock.yaml` en el mismo commit.

## Arquitectura de scroll (leer antes de tocar secciones)

Flujo: `Loader → Hero → About → Projects (carousel) → Contact`, en `src/app/page.tsx`.

- **Patrón: sticky + scrub — NO usar `pin` de ScrollTrigger.** Cada sección es un contenedor alto (150–340vh) con un hijo `sticky top-0 h-screen`; la animación es un timeline con `scrub` mapeado de `top top` a `bottom bottom`. Los pin-spacers de `pin: true` dejaban pantallas muertas y secciones re-apareciendo estáticas — ya se probó y se descartó. Excepción: el carousel de Projects sí usa `pin` + `snap` (necesita snapping).
- **About se solapa sobre Hero** con `margin-top: -100vh`: engancha justo cuando el avatar del Hero termina su fade. Si cambiás la altura del Hero, revisá ese margen.
- **Loader ↔ Hero handshake**: `page.tsx` pasa `resumeRef` al Loader; el Hero avisa cuando el GLB cargó (`onAvatarLoaded`) y el Loader recién ahí termina su ciclo (carita + guiño) y libera el Hero (`onReady`). Además `layout.tsx` inyecta un script inline `__loader_cover` que tapa el primer paint. La variable módulo `hasLoaded` en `page.tsx` evita que el Loader se repita al volver de otra ruta (SPA).
- **Lenis** (smooth scroll) se instancia en `SmoothScroll.tsx` y se expone en `window.lenis` — los scroll programáticos (ScrollGuide, carousel) lo usan con guard `typeof lenis.scrollTo === 'function'`.
- **Transiciones de ruta**: `next-view-transitions` (`useTransitionRouter`) + helpers `slideUp`/`slideDown` en `src/lib/transition.ts` (parallax: la page saliente se mueve 22% y se oscurece, la entrante pasa completa). La posición de scroll se preserva al volver vía `src/lib/scrollStore.ts` + `router.push(..., { scroll: false })`.

## Minas terrestres (costaron horas — no "arreglar" sin entender)

1. **`overflow-x: clip` en el body, jamás `hidden`** — `hidden` crea un contenedor de scroll y rompe todos los `position: sticky`.
2. **No poner clases `transition-*`/`hover:opacity-*` de Tailwind en elementos que GSAP anima con scrub** — la transición CSS pelea con los valores por-frame de GSAP y deja elementos invisibles (pasó con los links del Contact).
3. **Canvas R3F: siempre full-screen fijo; nunca animar su width/height** — el ResizeObserver de R3F recalcula la cámara en cada frame y produce artefactos. Para "recortar" visualmente usar `clip-path` en un wrapper.
4. **La cámara del Hero se anima por ref** (`cameraZRef` escrito por GSAP, leído en `useFrame`), no por state — no introducir re-renders en ese camino.
5. **Usar el `AsciiRenderer` local (`src/ui/ascii-renderer.tsx`), no el de drei** — el de drei llama `setSize` en un `useEffect` pasivo y un rAF puede colarse antes con `iWidth/iHeight` undefined → `getImageData ... not of type 'long'`. El fork hace `setSize` en `useLayoutEffect` + guard. El gate por tamaño (`AsciiFX`) sigue además de eso.
6. **Los canvas R3F quedan montados pero pausados (`frameloop='never'`) cuando no se ven — nunca desmontarlos.** Recrear el contexto WebGL + compilar shaders + re-subir los 85MB de geometría tarda visible: en el Hero producía un hitch al volver, y en Contact dejaba el reveal de la scanline en negro. Hero: pausa vía `onLeave`/`onEnterBack` del ScrollTrigger de salida. Contact: pausa vía IntersectionObserver (`rootMargin: '75%'` reanuda antes de llegar) + `WarmUp` renderiza 1 frame (`advance`) apenas resuelve el GLB para que la subida a GPU pase durante la carga inicial, tapada por el clip-path.

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
- Tono: minimalista premium, pocas animaciones "firma" (mask reveals, blur→clear, letra-por-letra) — no acumular micro-efectos.
- Labels/links: uppercase, tracking amplio, tamaños ~0.6–0.72rem. El ScrollGuide (derecha) cambia a paleta clara cuando el Contact cubre el centro del viewport.
