# Test Plan — Landing "Contexto de Ejecución y this"

## Application Overview

Landing page de una lección interactiva en español (JS para principiantes): Contexto de Ejecución + reglas de this (pre-ES6). Vanilla HTML/CSS/JS + Vite, servida en http://localhost:5173 (baseURL en playwright.config.ts, proyecto chromium, viewport por defecto 1280x720, testDir ./tests).

Componentes interactivos (verificados contra la página real):
1. Stepper del call stack (#stack-demo): botón [data-next] avanza 6 pasos; frames div.frame[data-name] entran/salen de [data-stack] (animación ~450ms FRAME_MS); contador [data-depth]; línea activa .code-line.is-active en [data-code]; estado en vivo [data-status] con aria-live="polite"; botón [data-reset] "Reiniciar".
2. Toggle modo normal/estricto (#strict-demo): button.switch[data-strict-switch] role="switch"; badge [data-strict-badge]; salidas [data-output-normal]/[data-output-strict] (.console__line); clase #strict-demo.is-strict.
3. TOC sticky + scrollspy ([data-toc], 5 enlaces .toc__link a #contexto/#this/#estricto/#poo/#resumen): IntersectionObserver con rootMargin "-45% 0px -50% 0px" añade .is-active + aria-current="true" al enlace de la sección en la banda central; barra de progreso [data-progress] con transform: scaleX. Nota: scroll-behavior: smooth + scroll-padding-top: 80px — tras un clic de ancla hay que esperar a que el scroll se estabilice antes de afirmar scrollspy/hash.

PROBLEMA CONOCIDO (documentado en el test responsive): en viewport 375px existe overflow horizontal real — documentElement.scrollWidth = 454px > clientWidth = 375px. Causa: figure.stack-diagram de #contexto (.frame con white-space: nowrap, contenedor sin recorte). El resto de candidatos (.toc__list, .table-wrap, .hero-visual) sí están recortados.

Modo oscuro: @media (prefers-color-scheme: dark) en variables.css → --color-bg #10151f (body rgb(16,21,31)); claro #f7f2e9 (rgb(247,242,233)). Sin Google Fonts CDN (0 referencias). Ejecución: arrancar dev server (npm run dev) y npx playwright test.

## Test Scenarios

### 1. Carga de página

**Seed:** `tests/seed.spec.ts`

#### 1.1. La página carga con idioma español, título y estructura completa

**File:** `tests/page-load/page-structure.spec.ts`

**Steps:**
  1. Navegar a la URL base (http://localhost:5173/) y esperar a que cargue la red
    - expect: Respuesta HTTP 200 y title del documento: "Contexto de Ejecución y this — JavaScript para principiantes"
  2. Comprobar el atributo lang del elemento html
    - expect: document.documentElement.lang === "es"
  3. Contar las secciones dentro de main
    - expect: 6 secciones: #inicio (hero), #contexto, #this, #estricto, #poo, #resumen, cada una con aria-labelledby (hero-title, contexto-title, this-title, estricto-title, poo-title, resumen-title)
  4. Comprobar main#contenido, header.site-header, footer.site-footer y nav.toc[data-toc] aria-label="Índice de la lección"
    - expect: main id="contenido"
    - expect: header.site-header visible (position: sticky)
    - expect: footer.site-footer visible: .footer__love "Hecho con ♥ para estudiantes de JavaScript", .footer__back "Volver arriba ↑" href="#inicio"
  5. Verificar los 5 enlaces .toc__link del TOC
    - expect: Enlaces exactos: "Contexto"→#contexto, "this"→#this, "Estricto"→#estricto, "POO"→#poo, "Resumen"→#resumen
  6. Verificar el script type="application/ld+json"
    - expect: @type LearningResource, inLanguage "es", teaches con 6 temas

#### 1.2. Hero: título, premisa, badge y CTA

**File:** `tests/page-load/hero.spec.ts`

**Steps:**
  1. Leer el h1#hero-title
    - expect: Texto normalizado: "El Contexto de Ejecución y el misterio de this"
  2. Leer p.hero__kicker
    - expect: "JavaScript para principiantes"
  3. Leer p.hero__premise
    - expect: Empieza "Antes de las clases, antes de los frameworks:" y menciona "quién es realmente this"
  4. Leer p.hero__badge
    - expect: "Enfoque pre-ES6 · Base para entender POO"
  5. Comprobar a.hero__cta
    - expect: Texto "Empezar la lección", href="#contexto", clases btn btn--primary
  6. Verificar .hero-visual (aria-hidden=true)
    - expect: 3 div.frame--hero: saludar("Ana"), main(), global (frame--lit); caption "LIFO · el último en entrar, primero en salir"

#### 1.3. No hay Google Fonts CDN en el HTML

**File:** `tests/page-load/no-external-fonts.spec.ts`

**Steps:**
  1. Obtener el HTML completo (page.content())
    - expect: NO contiene "fonts.googleapis.com" ni "fonts.gstatic.com"
    - expect: Único stylesheet: /src/styles/main.css
  2. Comprobar el script del módulo
    - expect: Único script type="module" → /src/js/main.js antes de </body>
  3. Verificar el favicon
    - expect: link rel="icon" → /favicon.svg (ruta local)

#### 1.4. Contenido de enseñanza y ejemplos pre-ES6 (var, no const)

**File:** `tests/page-load/var-not-const.spec.ts`

**Steps:**
  1. Contar <span class="tok-kw">var</span> en el HTML renderizado
    - expect: ≥7 ocurrencias de var (ej. Regla 2: var ana = { nombre: "Ana" }; Regla 3: var fija = foo.bind(objeto); Regla 4 y #poo: var ana = new Persona("Ana"))
  2. Buscar el token const en bloques de código
    - expect: Ninguna aparición de <span class="tok-kw">const</span>
  3. Verificar strings clave en el texto visible
    - expect: "Contexto de Ejecución" (h2 #contexto-title; section__num "01 · Contexto de Ejecución")
    - expect: "this y las 4 reglas" (h2 #this-title)
    - expect: "Por defecto" (rule-card__title Regla 1)
    - expect: "modo estricto" (p.ej. section__num "03 · Modo estricto vs normal")
    - expect: "Persona" (constructora en #poo y Regla 4)
    - expect: "Hola, soy Ana" (comentario del bloque #poo)
  4. Verificar los 5 h2 y referencias MDN
    - expect: h2s: "Contexto de Ejecución", "this y las 4 reglas", "Modo estricto vs normal", "Puente a la POO", "Resumen (cheat sheet)"
    - expect: 4 enlaces MDN en footer (this, call/apply/bind, modo estricto, operador new) target="_blank" rel="noopener"

### 2. Stepper del call stack (#stack-demo)

**Seed:** `tests/seed.spec.ts`

#### 2.1. Estado inicial del stepper

**File:** `tests/stack-demo/initial-state.spec.ts`

**Steps:**
  1. Navegar a la URL base y hacer scroll hasta #stack-demo
    - expect: #stack-demo visible
  2. Leer el botón [data-next]
    - expect: Texto: "Ejecutar paso a paso"
  3. Comprobar [data-reset]
    - expect: Texto "Reiniciar" y disabled=true
  4. Leer [data-depth]
    - expect: Texto "1"
  5. Leer los frames de [data-stack]
    - expect: 1 frame: div.frame[data-name="global"] texto "global" (clase frame--enter)
    - expect: [data-stack] aria-hidden="true"
  6. Leer [data-status]
    - expect: Texto exacto: "Paso 1 de 6 · profundidad 1: Se crea el contexto global. El programa aún no ha llamado a nada."
    - expect: aria-live="polite"
  7. Comprobar la línea activa en [data-code]
    - expect: Ningún .code-line.is-active (paso 1 sin resaltado)

#### 2.2. Recorrido completo: 6 pasos (frames, profundidad, líneas, status)

**File:** `tests/stack-demo/click-through.spec.ts`

**Steps:**
  1. Clic en [data-next] + espera 500ms (FRAME_MS=450)
    - expect: [data-next] "Siguiente paso"; [data-reset] habilitado; [data-depth] "2"
    - expect: Frames [data-stack]: global, main
    - expect: Línea activa: .code-line[data-line="6"].is-active
    - expect: Status: "Paso 2 de 6 · profundidad 2: Se llama a main(): su contexto entra al stack (push)."
  2. 2º clic + 500ms
    - expect: [data-depth] "3"; frames: global, main, saludar
    - expect: Línea activa: data-line="4"
    - expect: Status: "Paso 3 de 6 · profundidad 3: Dentro de main(), se llama a saludar("Ana"): otro push."
  3. 3er clic + 500ms
    - expect: [data-depth] sigue "3"; frames sin cambios
    - expect: Línea activa: data-line="1"
    - expect: Status: "Paso 4 de 6 · profundidad 3: Se ejecuta console.log("Hola Ana"). El contexto activo es saludar."
  4. 4º clic + 500ms
    - expect: [data-depth] "2"; frames: global, main (saludar recibe frame--leave y se elimina tras 450ms)
    - expect: Línea activa: data-line="2"
    - expect: Status: "Paso 5 de 6 · profundidad 2: saludar termina: su contexto sale del stack (pop) y se destruye."
  5. 5º clic + 500ms
    - expect: [data-depth] "1"; frames: global
    - expect: Línea activa: data-line="5"
    - expect: Status: "Paso 6 de 6 · profundidad 1: main termina: pop. Solo queda el contexto global. Fin del programa."
    - expect: [data-next] cambia a "Reiniciar" (último paso)

#### 2.3. Reinicio: por label Reiniciar y por botón [data-reset]

**File:** `tests/stack-demo/reset.spec.ts`

**Steps:**
  1. Avanzar 5 clics hasta el último paso (+500ms cada uno)
    - expect: [data-next] "Reiniciar", depth 1, status "Paso 6 de 6 · profundidad 1: main termina: pop. Solo queda el contexto global. Fin del programa."
  2. Clic en [data-next] (label Reiniciar) + 500ms
    - expect: Estado inicial: [data-next] "Ejecutar paso a paso", [data-reset] disabled, depth 1, frame [global], sin .is-active
    - expect: Status: "Paso 1 de 6 · profundidad 1: Se crea el contexto global. El programa aún no ha llamado a nada."
  3. Avanzar 2 pasos y pulsar [data-reset]
    - expect: [data-reset] habilitado tras el avance
    - expect: Tras pulsar: estado inicial completo (label, depth 1, frame [global], sin línea activa, disabled)

#### 2.4. Accesibilidad por teclado del stepper (Enter y Espacio)

**File:** `tests/stack-demo/keyboard.spec.ts`

**Steps:**
  1. Navegar, scroll a #stack-demo, enfocar [data-next]
    - expect: document.activeElement es [data-next]
    - expect: Con :focus-visible hay outline 2px (outline-style solid, width 2px, color var(--color-focus))
  2. Pulsar Enter
    - expect: Status: "Paso 2 de 6 · profundidad 2: Se llama a main(): su contexto entra al stack (push).", depth 2
  3. Pulsar Espacio
    - expect: Status: "Paso 3 de 6 · profundidad 3: Dentro de main(), se llama a saludar("Ana"): otro push.", depth 3
    - expect: El foco sigue en el botón

### 3. Toggle modo normal/estricto (#strict-demo)

**Seed:** `tests/seed.spec.ts`

#### 3.1. Estado inicial: modo normal activo

**File:** `tests/strict-toggle/initial-state.spec.ts`

**Steps:**
  1. Navegar y hacer scroll hasta #strict-demo
    - expect: #strict-demo visible y SIN clase .is-strict
  2. Comprobar button.switch[data-strict-switch]
    - expect: role="switch", aria-checked="false", aria-label="Cambiar a modo estricto"
    - expect: Contiene span.switch__thumb
  3. Leer las etiquetas .strict-demo__label
    - expect: "modo normal" (--normal) y "modo estricto" (--strict) visibles
  4. Leer la insignia [data-strict-badge]
    - expect: Texto: "modo normal"
  5. Comprobar las salidas .console--output
    - expect: [data-output-normal] visible: .console__line "window (el objeto global)"
    - expect: [data-output-strict] oculto (hidden) con .console__line "undefined"

#### 3.2. Cambio de modo: normal → estricto → normal

**File:** `tests/strict-toggle/toggle-flip.spec.ts`

**Steps:**
  1. Clic en [data-strict-switch]
    - expect: aria-checked="true"; aria-label="Cambiar a modo normal"
    - expect: Badge: "modo estricto"; #strict-demo gana .is-strict
    - expect: [data-output-normal] hidden=true; [data-output-strict] visible mostrando "undefined"
  2. Clic de nuevo en [data-strict-switch]
    - expect: aria-checked="false"; aria-label="Cambiar a modo estricto"
    - expect: Badge: "modo normal"; .is-strict eliminada
    - expect: [data-output-normal] visible "window (el objeto global)"; [data-output-strict] oculto

#### 3.3. Accesibilidad por teclado del switch

**File:** `tests/strict-toggle/keyboard.spec.ts`

**Steps:**
  1. Enfocar [data-strict-switch] y pulsar Enter
    - expect: aria-checked="true", badge "modo estricto", salida strict visible
  2. Pulsar Espacio
    - expect: aria-checked="false", badge "modo normal", salida normal visible
    - expect: El switch sigue enfocado

### 4. TOC sticky y scrollspy

**Seed:** `tests/seed.spec.ts`

#### 4.1. Los 5 enlaces del TOC navegan a sus secciones

**File:** `tests/toc/navigation.spec.ts`

**Steps:**
  1. Para cada .toc__link (href #contexto, #this, #estricto, #poo, #resumen): clic y esperar a que window.scrollY se estabilice (scroll-behavior: smooth; máx ~2s)
    - expect: location.hash coincide con el href pulsado
    - expect: La sección destino visible: getBoundingClientRect().top ≈ 80px (scroll-padding-top: calc(4rem + space-4) sobre header sticky), bottom > 0
  2. Verificar el header fijo tras scroll profundo
    - expect: header.site-header position: sticky, visible al llegar a #resumen
  3. Pulsar .footer__back "Volver arriba ↑"
    - expect: location.hash "#inicio" y el hero vuelve al viewport

#### 4.2. Scrollspy: la sección en la banda central activa su enlace

**File:** `tests/toc/scrollspy.spec.ts`

**Steps:**
  1. Navegar a la URL base (scrollY=0)
    - expect: El enlace "Contexto" mantiene .is-active y aria-current="true" (comportamiento observado: la banda 45-50% cae en el hero, no observado; el último activo persiste)
  2. Para cada objetivo (#contexto, #this, #estricto, #poo, #resumen): window.scrollTo(0, seccion.offsetTop - 1) y esperar .is-active en su enlace (waitForFunction, timeout 3s)
    - expect: Solo el enlace de la sección en banda tiene .is-active + aria-current="true"
    - expect: El enlace anterior pierde .is-active y aria-current (atributo eliminado)
  3. Scroll hasta el final y comprobar la barra de progreso
    - expect: [data-progress] transform scaleX ≈ 1 tras estabilizarse
    - expect: .progress (header) aria-hidden="true"

#### 4.3. Barra de progreso de lectura

**File:** `tests/toc/progress-bar.spec.ts`

**Steps:**
  1. Navegar a la URL base
    - expect: [data-progress] scaleX = 0 (transform matrix con escala 0)
  2. Scroll hasta el fondo (scrollTo(0, scrollHeight)) y esperar estabilización
    - expect: scaleX ≈ 1 (pct = min(1, scrollY/max))
  3. Volver arriba
    - expect: scaleX vuelve a ≈ 0

### 5. Accesibilidad

**Seed:** `tests/seed.spec.ts`

#### 5.1. Skip link: oculto y visible al enfocar

**File:** `tests/a11y/skip-link.spec.ts`

**Steps:**
  1. Comprobar a.skip-link sin foco
    - expect: Texto "Saltar al contenido principal", href="#contenido"
    - expect: Computed left ≈ -9999px (fuera de pantalla)
  2. Enfocar el enlace (focus() o Tab)
    - expect: Computed left = 16px (space-4), visible arriba-izquierda
    - expect: z-index alto (var(--z-toast)=500), por encima del header sticky
  3. Pulsar Enter sobre el skip link
    - expect: Foco en main#contenido (activeElement dentro de main) y hash #contenido

#### 5.2. Región aria-live anuncia los pasos del stepper

**File:** `tests/a11y/aria-live.spec.ts`

**Steps:**
  1. Localizar los elementos con aria-live
    - expect: Único [aria-live] en la página: p.stack-demo__status[data-status] con aria-live="polite"
  2. Clic en [data-next] y comprobar el anuncio
    - expect: [data-status] pasa a "Paso 2 de 6 · profundidad 2: Se llama a main(): su contexto entra al stack (push)."
  3. Comprobar ocultación de decorativos para lectores de pantalla
    - expect: [data-stack] aria-hidden="true"
    - expect: .hero-visual aria-hidden="true"
    - expect: .progress aria-hidden="true"

### 6. Modo oscuro (prefers-color-scheme)

**Seed:** `tests/seed.spec.ts`

#### 6.1. Dark mode: fondo y texto oscuros

**File:** `tests/dark-mode/dark-mode.spec.ts`

**Steps:**
  1. Contexto colorScheme dark (browser.newContext({ colorScheme: "dark" })) y navegar
    - expect: body computed background-color: rgb(16, 21, 31) (#10151f)
    - expect: body computed color: rgb(232, 228, 216) (#e8e4d8)
  2. Comprobar el token en :root
    - expect: getPropertyValue("--color-bg") === "#10151f"
  3. Verificar que no cambia el layout
    - expect: scrollWidth igual que en light; interactivos operativos

#### 6.2. Light mode (por defecto): fondo claro

**File:** `tests/dark-mode/light-mode.spec.ts`

**Steps:**
  1. Navegar con colorScheme light
    - expect: body computed background-color: rgb(247, 242, 233) (#f7f2e9)
    - expect: --color-bg === "#f7f2e9"

### 7. Responsive (viewport 375px)

**Seed:** `tests/seed.spec.ts`

#### 7.1. TOC y header en móvil: chips scrollables, marca colapsada

**File:** `tests/responsive/mobile-toc.spec.ts`

**Steps:**
  1. Contexto viewport 375x812 y navegar
    - expect: header.site-header position: sticky
    - expect: .brand__tag display: none (max-width: 40rem)
  2. Comprobar .toc__list
    - expect: overflow-x: auto (scroll interno)
    - expect: scrollWidth > clientWidth (verificado: 391px vs 156px)
  3. Verificar los 5 enlaces .toc__link
    - expect: Presentes con los mismos hrefs
  4. Comprobar el layout del stepper en móvil
    - expect: Panel de código y pila apilados verticalmente (media max: 52rem), ambos visibles, sin solapamiento

#### 7.2. Sin overflow horizontal en 375px

**File:** `tests/responsive/no-horizontal-overflow.spec.ts`

**Steps:**
  1. Contexto 375x812, medir documentElement.scrollWidth vs clientWidth
    - expect: PROBLEMA CONOCIDO — actualmente FALLA: scrollWidth 454px > clientWidth 375px. Causa raíz: figure.stack-diagram de #contexto (.frame white-space: nowrap sin recorte; .toc__list, .table-wrap y .hero-visual sí recortan). Criterio de aceptación cuando se arregle: scrollWidth <= clientWidth
  2. Verificar interacción en 375px a pesar del desbordamiento
    - expect: Scroll vertical funcional; #stack-demo y #strict-demo operativos
