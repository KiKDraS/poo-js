# Test Plan — Landing «Contexto de Ejecución y this» (con sección Clases ES6 + Arrow Functions y POO)

## Application Overview

Landing page de una lección interactiva en español (JS para principiantes):
Contexto de Ejecución + reglas de this (pre-ES6) + nueva sección 05 · Clases ES6
(#clases, rama feature/clases-es6) + sub-bloque "Las Arrow Functions y el POO"
(rama feature/arrow-poo). Vanilla HTML/CSS/JS + Vite, servida en
http://localhost:5173 (baseURL en playwright.config.ts, proyecto chromium,
viewport por defecto 1280x720, testDir ./tests). Ejecución: arrancar dev server
(npm run dev) y npx playwright test.

Estructura verificada contra la página real (7 secciones en main): #inicio
(hero), #contexto, #this, #estricto, #poo, #clases (NUEVA), #resumen (renumerada
06). TOC sticky con 6 enlaces .toc\_\_link:
Contexto/this/Estricto/POO/Clases/Resumen. Cada sección con aria-labelledby
(hero-title, contexto-title, this-title, estricto-title, poo-title,
clases-title, resumen-title).

Componentes interactivos:

1. Stepper del call stack (#stack-demo): botón [data-next] avanza 6 pasos;
   frames div.frame[data-name] entran/salen de [data-stack] (animación ~450ms
   FRAME_MS); contador [data-depth]; línea activa .code-line.is-active en
   [data-code]; estado en vivo [data-status] con aria-live="polite"; botón
   [data-reset] "Reiniciar".
2. Toggle modo normal/estricto (#strict-demo): button.switch[data-strict-switch]
   role="switch"; badge [data-strict-badge]; salidas
   [data-output-normal]/[data-output-strict] (.console\_\_line); clase
   #strict-demo.is-strict.
3. TOC sticky + scrollspy ([data-toc], 6 enlaces): IntersectionObserver con
   rootMargin "-45% 0px -50% 0px" añade .is-active + aria-current="true" al
   enlace de la sección en la banda central; barra de progreso [data-progress]
   con transform: scaleX. Nota: scroll-behavior: smooth + scroll-padding-top:
   80px — tras un clic de ancla hay que esperar a que el scroll se estabilice
   antes de afirmar scrollspy/hash.

Sección nueva #clases (05 · Clases ES6: la POO moderna): bloque de código con
clase Persona/Estudiante (class, constructor, #campo privado, #método privado,
get, static, extends, super, override) y comentarios de versión ("ES2015 (ES6)",
"ES2022", "SyntaxError — # es privado de verdad (ES2022)"); tabla timeline
.sheet (Característica/Versión/Año, 4 filas, contiene "ES6 · ES2015" y "ES2022
(ES13)"); callout .callout--pattern con spotlight aria-hidden "contesta: ana ·
instancia de Estudiante"; 6 elementos [data-reveal] en la sección.

Sub-bloque "Las Arrow Functions y el POO" (rama feature/arrow-poo, VERIFICADO en
vivo): h3[data-reveal] "Las Arrow Functions y el POO" + div.split[data-reveal]
con 2º pre.code-block (clase Usuario: método saludar vs campo con Arrow Function
`saludarFlecha = () => {}`; la ventaja real: `setTimeout(u.saludar, 1000)` ("al
ejecutarse, this se perdió → TypeError") vs `setTimeout(u.saludarFlecha, 1000)`
("\"Hola, soy Ana\" — this ya está fijado"); extracción `const f = u.saludar`
(pierde this → TypeError/undefined) vs `const g = u.saludarFlecha` (conserva
this); `u.saludarFlecha.call(...)` con comentario "call ignorado" — la línea
`u.saludar.call(...)` ("call aplica") se ELIMINÓ; `new (() => {})` con
comentario "TypeError — la Arrow Function no es constructor") + prose de 2
párrafos ("La Arrow Function no tiene this propio: lo hereda del ámbito donde
nació (léxico)"; "La ventaja real: podés pasar saludarFlecha suelta — a
setTimeout, a un evento, a un .map()", "auto-bind, sin necesidad de .bind()",
"copia por instancia", "no comparte prototype", "this no es dinámico") +
div.callout.callout--trap[data-reveal] "Trampa clásica" ("Fuera de una clase, la
Arrow Function no captura el objeto.",
`const o = { saluda: () => this.nombre }`). #clases pasa de 6 a 9 elementos
[data-reveal] (3 nuevos: h3 Arrow Functions, split Arrow Functions,
callout--trap).

#resumen (06) actualizado en la rama: la tabla "Las 4 reglas de this de un
vistazo" (caption exacto) gana la fila "Arrow Function (excepción)" al final del
tbody (5 filas: Por defecto, Implícita, Explícita, Con new, Arrow Function
(excepción); celdas: `() => {}` y "el this de donde nació (léxico) · ignora
call/bind · no es constructor"); ul.mistakes gana el 4º li.mistakes\_\_item
"Confiar en bind con una Arrow Function" (fix: "f.bind(otro) no cambia nada… usa
un método normal").

NOTA RESPONSIVE (actualizada): el problema conocido de overflow horizontal en
375px (figure.stack-diagram, scrollWidth 454px > 375px) está CORREGIDO en esta
rama — verificado en vivo: documentElement.scrollWidth == clientWidth == 375.
tests/responsive/no-horizontal-overflow.spec.ts pasa (guarda de regresión). El
texto viejo del plan que lo describía como fallando está desactualizado. El
nuevo bloque de Arrow Functions no reintroduce overflow (.table-wrap y
.code-block recortan).

Modo oscuro: @media (prefers-color-scheme: dark) en variables.css → --color-bg
#10151f (body rgb(16,21,31)); claro #f7f2e9 (rgb(247,242,233)). Sin Google Fonts
CDN (0 referencias). JSON-LD: @type LearningResource, inLanguage es, teaches con
6 temas (sin entrada de clases — sin cambios en el test).

REGRESIÓN (rama feature/arrow-poo, suite completa corrida en vivo: 3 FALLAN / 25
PASAN): tests/clases-es6/code-block.spec.ts (2 pre.code-block en #clases →
strict mode violation; fix: `.first()`), tests/clases-es6/section.spec.ts
(toHaveCount(6)→(9) de [data-reveal] en #clases),
tests/page-load/var-not-const.spec.ts (constCount toBe(6)→(9): 3 const nuevos
`u`, `f`, `g` del bloque Arrow Functions). NO fallan (pasan tal cual,
verificado): page-structure, mobile-toc, toc, scrollspy, headings,
timeline-table, callout (selector .callout--pattern sigue único), resumen, hero,
no-external-fonts, aria-live, skip-link, stack-demo, strict-toggle, dark-mode,
progress-bar, seed, no-horizontal-overflow (375px sigue sin overflow con el
nuevo bloque).

## Test Scenarios

### 1. Carga de página

**Seed:** `tests/seed.spec.ts`

#### 1.1. La página carga con idioma español, título y estructura completa (7 secciones)

**File:** `tests/page-load/page-structure.spec.ts`

**Steps:**

1. Navegar a la URL base (http://localhost:5173/) y esperar a que cargue la red


    - expect: Respuesta HTTP 200 y title del documento: "Contexto de Ejecución y this — JavaScript para principiantes"

2. Comprobar el atributo lang del elemento html


    - expect: document.documentElement.lang === "es"

3. Contar las secciones dentro de main y verificar aria-labelledby de cada una


    - expect: 7 secciones: #inicio (hero), #contexto, #this, #estricto, #poo, #clases, #resumen
    - expect: Cada sección con aria-labelledby: hero-title, contexto-title, this-title, estricto-title, poo-title, clases-title, resumen-title

4. Comprobar main#contenido, header.site-header, footer.site-footer y
   nav.toc[data-toc] aria-label="Índice de la lección"


    - expect: main id="contenido"
    - expect: header.site-header visible (position: sticky)
    - expect: footer.site-footer visible: .footer__love "Hecho con ♥ para estudiantes de JavaScript", .footer__back "Volver arriba ↑" href="#inicio"

5. Verificar los 6 enlaces .toc\_\_link del TOC (ACTUALIZADO: antes 5)


    - expect: Enlaces exactos: "Contexto"→#contexto, "this"→#this, "Estricto"→#estricto, "POO"→#poo, "Clases"→#clases, "Resumen"→#resumen

6. Verificar el script type="application/ld+json"


    - expect: @type LearningResource, inLanguage "es", teaches con 6 temas (sin cambios — el JSON-LD no incluye la sección Clases)

#### 1.2. Hero: título, premisa, badge y CTA

**File:** `tests/page-load/hero.spec.ts`

**Steps:**

1. Leer el h1#hero-title


    - expect: Texto normalizado: "El Contexto de Ejecución y el misterio de this"

2. Leer p.hero**kicker y p.hero**premise


    - expect: hero__kicker: "JavaScript para principiantes"
    - expect: Premise empieza "Antes de las clases, antes de los frameworks:" y contiene "quién es realmente this" (verificado: sigue pasando)

3. Leer p.hero**badge y comprobar a.hero**cta


    - expect: Badge: "Enfoque pre-ES6 · Base para entender POO"
    - expect: CTA: texto "Empezar la lección", href="#contexto", clases btn btn--primary

4. Verificar .hero-visual (aria-hidden=true)


    - expect: 3 div.frame--hero: saludar("Ana"), main(), global (frame--lit); caption "LIFO · el último en entrar, primero en salir"

#### 1.3. No hay Google Fonts CDN en el HTML

**File:** `tests/page-load/no-external-fonts.spec.ts`

**Steps:**

1. Obtener el HTML completo (page.content())


    - expect: NO contiene "fonts.googleapis.com" ni "fonts.gstatic.com"
    - expect: Único stylesheet: /src/styles/main.css

2. Comprobar el script del módulo y el favicon


    - expect: Único script type="module" → /src/main.js en <head>
    - expect: link rel="icon" → /favicon.svg (ruta local)

#### 1.4. Contenido de enseñanza y ejemplos modernos (let/const, var solo en hoisting)

**File:** `tests/page-load/var-not-const.spec.ts`

**Steps:**

1. Contar <span class="tok-kw">var</span> en el HTML renderizado


    - expect: 2 ocurrencias (hoisting de var + contraste TDZ) — sin cambios, #clases no añade var

2. Contar el token const en bloques de código (ACTUALIZADO x2: 5 → 6 → 9)


    - expect: 9 ocurrencias de <span class="tok-kw">const</span> (5 previos + `const ana = new Estudiante(...)` + 3 del bloque Arrow Functions: `const u = new Usuario();`, `const f = u.saludar;`, `const g = u.saludarFlecha;`) — VERIFICADO en vivo: 9

3. Verificar strings clave en el texto visible y en los bloques de código


    - expect: h2#contexto-title "Contexto de Ejecución"; section__num "01 · Contexto de Ejecución"
    - expect: h2#this-title "this y las 4 reglas"; Regla 1 "Por defecto"; "03 · Modo estricto vs normal"
    - expect: Código contiene: 'const ana = new Persona("Ana");', 'const fija = foo.bind(objeto);', 'let apodo = "Anita";', 'var despedida = "Chau";', 'Hola, soy Ana'
    - expect: ≥2 menciones de Persona en código (el bloque Arrow Functions usa Usuario y no altera el conteo)

4. Verificar los 6 h2 y referencias MDN (ACTUALIZADO: antes 5)


    - expect: h2s exactos: "Contexto de Ejecución", "this y las 4 reglas", "Modo estricto vs normal", "Puente a la POO", "Clases ES6: la POO moderna" (NUEVO), "Resumen (cheat sheet)"
    - expect: 4 enlaces MDN en footer (this, call/apply/bind, modo estricto, operador new) target="_blank" rel="noopener"

### 2. Stepper del call stack (#stack-demo)

**Seed:** `tests/seed.spec.ts`

#### 2.1. Estado inicial del stepper

**File:** `tests/stack-demo/initial-state.spec.ts`

**Steps:**

1. Navegar a la URL base y hacer scroll hasta #stack-demo


    - expect: #stack-demo visible

2. Leer el botón [data-next] y [data-reset]


    - expect: [data-next]: "Ejecutar paso a paso"
    - expect: [data-reset]: "Reiniciar" y disabled=true

3. Leer [data-depth] y los frames de [data-stack]


    - expect: [data-depth] "1"
    - expect: 1 frame: div.frame[data-name="global"] (clase frame--enter); [data-stack] aria-hidden="true"

4. Leer [data-status] y la línea activa en [data-code]


    - expect: Status exacto: "Paso 1 de 6 · profundidad 1: Se crea el contexto global. El programa aún no ha llamado a nada." con aria-live="polite"
    - expect: Ningún .code-line.is-active (paso 1 sin resaltado)

#### 2.2. Recorrido completo: 6 pasos (frames, profundidad, líneas, status)

**File:** `tests/stack-demo/click-through.spec.ts`

**Steps:**

1. Clic en [data-next] + espera 500ms (FRAME_MS=450)


    - expect: [data-next] "Siguiente paso"; [data-reset] habilitado; [data-depth] "2"
    - expect: Frames: global, main; línea activa data-line="6"; status "Paso 2 de 6 · profundidad 2: Se llama a main(): su contexto entra al stack (push)."

2. 2º clic + 500ms


    - expect: [data-depth] "3"; frames: global, main, saludar
    - expect: Línea activa data-line="4"; status "Paso 3 de 6 · profundidad 3: Dentro de main(), se llama a saludar("Ana"): otro push."

3. 3er clic + 500ms


    - expect: [data-depth] sigue "3"; frames sin cambios
    - expect: Línea activa data-line="1"; status "Paso 4 de 6 · profundidad 3: Se ejecuta console.log("Hola Ana"). El contexto activo es saludar."

4. 4º clic + 500ms


    - expect: [data-depth] "2"; frames: global, main (saludar recibe frame--leave y se elimina tras 450ms)
    - expect: Línea activa data-line="2"; status "Paso 5 de 6 · profundidad 2: saludar termina: su contexto sale del stack (pop) y se destruye."

5. 5º clic + 500ms


    - expect: [data-depth] "1"; frames: global
    - expect: Línea activa data-line="5"; status "Paso 6 de 6 · profundidad 1: main termina: pop. Solo queda el contexto global. Fin del programa."
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


    - expect: role="switch", aria-checked="false", aria-label="Cambiar a modo estricto", contiene span.switch__thumb

3. Leer las etiquetas .strict-demo\_\_label y la insignia [data-strict-badge]


    - expect: "modo normal" (--normal) y "modo estricto" (--strict) visibles
    - expect: Badge: "modo normal"

4. Comprobar las salidas .console--output


    - expect: [data-output-normal] visible: .console__line "window (el objeto global)"
    - expect: [data-output-strict] oculto (hidden) con .console__line "undefined"

#### 3.2. Cambio de modo: normal → estricto → normal

**File:** `tests/strict-toggle/toggle-flip.spec.ts`

**Steps:**

1. Clic en [data-strict-switch]


    - expect: aria-checked="true"; aria-label="Cambiar a modo normal"; badge "modo estricto"; #strict-demo gana .is-strict
    - expect: [data-output-normal] hidden=true; [data-output-strict] visible mostrando "undefined"

2. Clic de nuevo en [data-strict-switch]


    - expect: aria-checked="false"; aria-label="Cambiar a modo estricto"; badge "modo normal"; .is-strict eliminada
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

#### 4.1. Los 6 enlaces del TOC navegan a sus secciones (ACTUALIZADO: antes 5)

**File:** `tests/toc/navigation.spec.ts`

**Steps:**

1. Para cada .toc\_\_link (href #contexto, #this, #estricto, #poo, #clases,
   #resumen): clic y esperar a que window.scrollY se estabilice
   (scroll-behavior: smooth; máx ~2s). ACTUALIZACIÓN MÍNIMA: añadir '#clases' a
   la lista LINKS y renombrar el test a "Los 6 enlaces…". El test actual NO
   falla (itera su propia lista), solo le falta cobertura de #clases.


    - expect: location.hash coincide con el href pulsado
    - expect: La sección destino visible: getBoundingClientRect().top ≈ 80px (scroll-padding-top: calc(4rem + space-4) sobre header sticky), bottom > 0

2. Verificar el header fijo tras scroll profundo


    - expect: header.site-header position: sticky, visible al llegar a #resumen

3. Pulsar .footer\_\_back "Volver arriba ↑"


    - expect: location.hash "#inicio" y el hero vuelve al viewport

#### 4.2. Scrollspy: la sección en la banda central activa su enlace (ACTUALIZADO: +clases)

**File:** `tests/toc/scrollspy.spec.ts`

**Steps:**

1. Navegar a la URL base (scrollY=0)


    - expect: Ningún .toc__link.is-active al inicio (la banda 45-50% cae en el hero)

2. Para cada objetivo (#contexto, #this, #estricto, #poo, #clases, #resumen):
   window.scrollTo(0, seccion.offsetTop - 1) y esperar .is-active en su enlace
   (waitForFunction, timeout 3s). ACTUALIZACIÓN MÍNIMA: añadir 'clases' a la
   lista SECTIONS entre 'poo' y 'resumen'. El test actual NO falla, solo no
   cubre #clases.


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

1. Localizar los elementos con aria-live (verificado: #clases no añade ninguno)


    - expect: Único [aria-live] en la página: p.stack-demo__status[data-status] con aria-live="polite"

2. Clic en [data-next] y comprobar el anuncio


    - expect: [data-status] pasa a "Paso 2 de 6 · profundidad 2: Se llama a main(): su contexto entra al stack (push)."

3. Comprobar ocultación de decorativos para lectores de pantalla


    - expect: [data-stack] aria-hidden="true"
    - expect: .hero-visual aria-hidden="true"
    - expect: .progress aria-hidden="true"
    - expect: .spotlight de #poo y #clases aria-hidden="true" (consistente)

### 6. Modo oscuro (prefers-color-scheme)

**Seed:** `tests/seed.spec.ts`

#### 6.1. Dark mode: fondo y texto oscuros

**File:** `tests/dark-mode/dark-mode.spec.ts`

**Steps:**

1. Contexto colorScheme dark (browser.newContext({ colorScheme: "dark" })) y
   navegar


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

#### 7.1. TOC y header en móvil: chips scrollables, marca colapsada (ACTUALIZADO: antes 5 enlaces)

**File:** `tests/responsive/mobile-toc.spec.ts`

**Steps:**

1. Contexto viewport 375x812 y navegar


    - expect: header.site-header position: sticky
    - expect: .brand__tag display: none (max-width: 40rem)

2. Comprobar .toc\_\_list


    - expect: overflow-x: auto (scroll interno)
    - expect: scrollWidth > clientWidth (verificado: 391px vs 156px)

3. Verificar los 6 enlaces .toc\_\_link (ACTUALIZACIÓN MÍNIMA:
   toHaveCount(5)→(6) y añadir '#clases' a la lista de hrefs)


    - expect: Presentes con los mismos hrefs: #contexto, #this, #estricto, #poo, #clases, #resumen

4. Comprobar el layout del stepper en móvil


    - expect: Panel de código y pila apilados verticalmente (media max: 52rem), ambos visibles, sin solapamiento

#### 7.2. Sin overflow horizontal en 375px (ACTUALIZADO: ahora PASA)

**File:** `tests/responsive/no-horizontal-overflow.spec.ts`

**Steps:**

1. Contexto 375x812, medir documentElement.scrollWidth vs clientWidth


    - expect: scrollWidth <= clientWidth — VERIFICADO en vivo en esta rama: 375 == 375 (el bug conocido figure.stack-diagram 454px está corregido; #clases y el bloque de Arrow Functions no reintroducen overflow: .table-wrap y .code-block recortan)

2. Verificar interacción en 375px


    - expect: Scroll vertical funcional; #stack-demo y #strict-demo operativos

### 8. Clases ES6 (#clases) — NUEVA SECCIÓN

**Seed:** `tests/seed.spec.ts`

#### 8.1. La sección #clases existe, está entre #poo y #resumen y está bien cableada

**File:** `tests/clases-es6/section.spec.ts`

**Steps:**

1. Navegar a la URL base y localizar main section#clases


    - expect: Existe main section#clases con clase .section

2. Verificar la posición en el orden de secciones


    - expect: Orden de ids en main: inicio, contexto, this, estricto, poo, clases, resumen (clases entre poo y resumen)

3. Leer el número de sección y el encabezado


    - expect: .section__num: "05 · Clases ES6"
    - expect: h2#clases-title: "Clases ES6: la POO moderna"

4. Verificar aria-labelledby y su objetivo


    - expect: section#clases aria-labelledby="clases-title"
    - expect: document.getElementById("clases-title") existe (target resuelto)

5. Contar elementos [data-reveal] dentro de #clases (ACTUALIZADO: antes 6)


    - expect: 9 elementos [data-reveal] (header, prose, split Persona, callout--pattern, h3 Arrow Functions, split Arrow Functions, callout--trap, h3 versiones, table-wrap) — el sub-bloque de Arrow Functions añade 3

#### 8.2. El enlace del TOC "Clases" está entre POO y Resumen y navega a #clases

**File:** `tests/clases-es6/toc.spec.ts`

**Steps:**

1. Localizar los enlaces .toc\_\_link y comprobar el orden


    - expect: 6 enlaces: Contexto, this, Estricto, POO, Clases, Resumen ("Clases" entre "POO" y "Resumen")
    - expect: El enlace "Clases" tiene href="#clases"

2. Clic en el enlace "Clases" y esperar a que el scroll se estabilice (smooth,
   ~2s)


    - expect: location.hash === "#clases"
    - expect: La sección #clases queda visible: getBoundingClientRect().top ≈ 80px (scroll-padding-top), bottom > 0

3. Volver arriba y clicar el enlace "POO" para verificar que ambos lados del TOC
   siguen operativos


    - expect: #poo vuelve a quedar en la banda ~80px

#### 8.3. El bloque de código contiene la clase Persona, herencia, campos privados y comentarios de versión

**File:** `tests/clases-es6/code-block.spec.ts`

**Steps:**

1. Localizar el .code-block de #clases y leer su texto (textContent del pre).
   ACTUALIZADO (feature/arrow-poo): ahora hay 2 pre.code-block → usar .first()
   (o filter hasText 'CLASE BASE'); el 2º (Arrow Functions) lo cubre el
   escenario 8.8.


    - expect: Contiene "class Persona"
    - expect: Contiene "extends" (class Estudiante extends Persona)
    - expect: Contiene "#secreto" (campo privado)
    - expect: Contiene "super(nombre, edad)"
    - expect: Contiene el comentario "ES2015 (ES6)" (p.ej. "class — ES2015 (ES6)")
    - expect: Contiene "ES2022" (campos privados, método privado)
    - expect: Contiene "SyntaxError — # es privado de verdad (ES2022)"

2. Verificar el hint del bloque (ACTUALIZADO: 2 hints idénticos → .first())


    - expect: p.code-block__hint "Pégalo en la consola de tu navegador o en Node."

#### 8.4. La tabla timeline tiene 4 filas con cabeceras Característica/Versión/Año y las versiones clave

**File:** `tests/clases-es6/timeline-table.spec.ts`

**Steps:**

1. Localizar la tabla .sheet de #clases (h3 "Versiones de ECMAScript"
   precediéndola)


    - expect: thead con columnheaders: "Característica", "Versión", "Año" (con scope="col")
    - expect: 4 filas en tbody
    - expect: caption .visually-hidden: "Versiones de ECMAScript de las características de clase"

2. Leer los valores de la columna Versión


    - expect: Contiene "ES6 · ES2015" (class/constructor/extends/super/static)
    - expect: Contiene "ES2022 (ES13)" (campos públicos y campos/métodos privados #)
    - expect: Contiene "ES5 (2009) · en clase: ES6" (get/set)

3. Verificar años


    - expect: Filas con años "2015" y "2022" presentes

#### 8.5. El callout de patrón está presente con su spotlight "contesta: ana · instancia de Estudiante"

**File:** `tests/clases-es6/callout.spec.ts`

**Steps:**

1. Localizar el .callout--pattern dentro de #clases


    - expect: callout__label: "Patrón"
    - expect: callout__text contiene "Clases = azúcar, debajo sigue el motor."

2. Verificar el spotlight


    - expect: .spotlight__owner: "contesta: ana · instancia de Estudiante"
    - expect: .spotlight aria-hidden="true" (decorativo)

#### 8.6. Resumen renumerado a 06 con el siguiente paso TypeScript

**File:** `tests/clases-es6/resumen.spec.ts`

**Steps:**

1. Localizar main section#resumen


    - expect: .section__num: "06 · Resumen" (renumerado tras insertar #clases)
    - expect: h2#resumen-title: "Resumen (cheat sheet)"

2. Verificar el bloque next-step


    - expect: h3 del .next-step: "Siguiente paso: TypeScript"
    - expect: El párrafo menciona implements, abstract y public/private/protected

#### 8.7. A11y: orden de encabezados intacto y todos los aria-labelledby resueltos

**File:** `tests/clases-es6/headings.spec.ts`

**Steps:**

1. Recorrer los encabezados de main (h1, h2, h3) en orden de documento


    - expect: Exactamente 1 h1 (hero-title)
    - expect: 6 h2 (contexto-title, this-title, estricto-title, poo-title, clases-title, resumen-title)
    - expect: Todos los h3 cuelgan de un h2 inmediatamente anterior: ningún nivel saltado (no hay h3 antes del primer h2 ni h2→h4)
    - expect: Orden intacto: h1 → h2s → h3s, sin niveles que se salten (el nuevo h3 "Las Arrow Functions y el POO" no rompe — verificado)

2. Para cada section de main, resolver su aria-labelledby


    - expect: Los 7 aria-labelledby (hero-title, contexto-title, this-title, estricto-title, poo-title, clases-title, resumen-title) resuelven a un elemento existente
    - expect: El elemento referenciado es el encabezado de la sección

#### 8.8. El sub-bloque "Las Arrow Functions y el POO": h3, código (saludarFlecha, call ignorado, TypeError) y callout "Trampa clásica" (NUEVO — rama feature/arrow-poo)

**File:** `tests/clases-es6/arrow-block.spec.ts`

**Steps:**

1. Navegar a la URL base y localizar main section#clases


    - expect: h3 con texto "Las Arrow Functions y el POO" existe y es visible (2º h3 de #clases, tras el callout--pattern)
    - expect: #clases tiene exactamente 2 pre.code-block (bloque Persona + bloque Arrow Functions)

2. Localizar el bloque de Arrow Functions (2º pre.code-block: filter hasText
   "ARROW FUNCTIONS Y POO" o .nth(1)) y leer su texto


    - expect: Contiene "class Usuario"
    - expect: Contiene "saludarFlecha = () => {" y el comentario "Campo con Arrow Function: this = la instancia (léxico)"
    - expect: Contiene "La ventaja real: pasar el método suelto sin perder this"
    - expect: Contiene "setTimeout(u.saludar, 1000)" con comentario "al ejecutarse, this se perdió → TypeError"
    - expect: Contiene "setTimeout(u.saludarFlecha, 1000)" con comentario "\"Hola, soy Ana\" — this ya está fijado"
    - expect: Contiene "const f = u.saludar;" con comentario "Método extraído: pierde this" y "TypeError / undefined (regla por defecto)"
    - expect: Contiene "const g = u.saludarFlecha;" con comentario "Arrow Function extraída: conserva this" y "\"Hola, soy Ana\" (auto-bind)"
    - expect: Contiene "u.saludarFlecha.call({ nombre: \"Beto\" })" y el comentario "call ignorado" (la línea u.saludar.call con "call aplica" se eliminó del bloque)
    - expect: Contiene "new (() => {})" con el comentario "TypeError — la Arrow Function no es constructor"
    - expect: p.code-block__hint del bloque: "Pégalo en la consola de tu navegador o en Node."

3. Verificar la prosa del 2º split (prose split\_\_body del bloque de Arrow
   Functions)


    - expect: Contiene "La Arrow Function no tiene this propio" y "lo hereda del ámbito donde nació (léxico)"
    - expect: Contiene "call" / "apply" / "bind" se ignoran y "new" no existe ("TypeError")
    - expect: Menciona "saludarFlecha suelta" como "copia por instancia" y "auto-bind"
    - expect: Menciona "La ventaja real" (pasar saludarFlecha suelta a "setTimeout", a un evento, a un ".map()"), "auto-bind, sin necesidad de .bind()", "no comparte prototype" y "this no es dinámico" — ya NO contiene "setTimeout(this.saludarFlecha)"

4. Localizar el .callout--trap de #clases (inmediatamente tras el split de Arrow
   Functions)


    - expect: callout__label: "Trampa clásica"
    - expect: callout__text contiene "Fuera de una clase, la Arrow Function no captura el objeto."
    - expect: callout__text contiene "const o = { saluda: () => this.nombre }" (HTML: `const o = { saluda: () =&gt; this.nombre }`)
    - expect: callout__text menciona "window" (normal) y "undefined" (estricto) como ámbito exterior

#### 8.9. La tabla "Las 4 reglas de this de un vistazo" tiene la fila "Arrow Function (excepción)" al final (NUEVO — rama feature/arrow-poo)

**File:** `tests/clases-es6/resumen-flecha-row.spec.ts`

**Steps:**

1. Navegar y localizar la tabla de las 4 reglas en main section#resumen (primer
   table.sheet; filter por caption "Las 4 reglas de this de un vistazo")


    - expect: caption: "Las 4 reglas de this de un vistazo"
    - expect: thead con "Regla", "Cómo llamas", "this es…" (scope="col")

2. Verificar las filas del tbody


    - expect: 5 filas (4 reglas + Arrow Function) — ACTUALIZADO: antes 4
    - expect: Última fila: th scope="row" con texto "Arrow Function (excepción)"
    - expect: 2ª celda de la última fila: "() => {}"
    - expect: 3ª celda de la última fila contiene "el this de donde nació (léxico)", "ignora call/bind" y "no es constructor"

3. Verificar que las 4 filas previas se mantienen en orden (regresión interna)


    - expect: th en orden: "Por defecto", "Implícita", "Explícita", "Con new", "Arrow Function (excepción)"

#### 8.10. El error común "Confiar en bind con una Arrow Function" es el último item de ul.mistakes (NUEVO — rama feature/arrow-poo)

**File:** `tests/clases-es6/mistakes-bind.spec.ts`

**Steps:**

1. Navegar y localizar ul.mistakes de main section#resumen


    - expect: 4 li.mistakes__item — ACTUALIZADO: antes 3

2. Leer el último item de la lista


    - expect: .mistakes__title: "Confiar en bind con una Arrow Function"
    - expect: .mistakes__fix contiene "f.bind(otro) no cambia nada" y "la Arrow Function ignora la regla explícita"
    - expect: .mistakes__fix contiene "Si necesitas this dinámico, usa un método normal"

3. Verificar que los 3 primeros items se mantienen (regresión interna)


    - expect: Títulos en orden: "Extraer un método y perder this", "Pasar un método a setTimeout", "Olvidar la prioridad", "Confiar en bind con una Arrow Function"

### 9. Regresión — ajustes mínimos a tests existentes (ramas feature/clases-es6 + feature/arrow-poo)

**Seed:** `tests/seed.spec.ts`

#### 9.1. page-structure.spec.ts: conteos 6→7 y 5→6 (ya aplicado en rama anterior — PASA)

**File:** `tests/page-load/page-structure.spec.ts`

**Steps:**

1. Verificar el estado actual en la rama


    - expect: PASA sin cambios: 7 secciones, 6 enlaces TOC, aria-labelledby completo, JSON-LD teaches con 6 temas

#### 9.2. var-not-const.spec.ts: const 5→6 (ya aplicado en rama feature/clases-es6) — ver 9.10 para el fallo de esta rama

**File:** `tests/page-load/var-not-const.spec.ts`

**Steps:**

1. Verificar el estado del cambio previo (rama feature/clases-es6)


    - expect: constCount toBe(6) ya aplicado y h2s con 'Clases ES6: la POO moderna' ya en la lista

2. Estado actual en feature/arrow-poo: FALLA de nuevo (6 vs 9 en vivo) — el fix
   de esta rama está documentado en el escenario 9.10


    - expect: No aplicar aquí el fix 6→9 dos veces; ejecutar una sola vez (9.10)

#### 9.3. mobile-toc.spec.ts: enlaces 5→6 (ya aplicado — PASA)

**File:** `tests/responsive/mobile-toc.spec.ts`

**Steps:**

1. Verificar el estado actual en la rama


    - expect: PASA sin cambios: 6 enlaces .toc__link con #clases incluido

#### 9.4. navigation.spec.ts: NO falla — extensión recomendada (opcional)

**File:** `tests/toc/navigation.spec.ts`

**Steps:**

1. Evaluar el estado actual


    - expect: PASA tal cual: itera su propia lista LINKS (los 5 viejos siguen existiendo) — no rompe

2. Extensión mínima recomendada para cubrir #clases


    - expect: Añadir '#clases' a LINKS entre '#poo' y '#resumen'
    - expect: Renombrar el test: "Los 5 enlaces" → "Los 6 enlaces del TOC navegan a sus secciones"

#### 9.5. scrollspy.spec.ts: NO falla — extensión recomendada (opcional)

**File:** `tests/toc/scrollspy.spec.ts`

**Steps:**

1. Evaluar el estado actual


    - expect: PASA tal cual: itera su propia lista SECTIONS (sin #clases) y el assert de 1 solo .is-active se mantiene

2. Extensión mínima recomendada


    - expect: Añadir 'clases' a SECTIONS entre 'poo' y 'resumen' para que la banda central de #clases active su enlace

#### 9.6. no-horizontal-overflow.spec.ts: PASA (nota del plan desactualizada ya corregida)

**File:** `tests/responsive/no-horizontal-overflow.spec.ts`

**Steps:**

1. Evaluar el estado actual en la rama


    - expect: PASA: scrollWidth 375 <= clientWidth 375 en 375px (bug figure.stack-diagram corregido; el bloque de Arrow Functions no reintroduce overflow)

#### 9.7. Sin cambios necesarios (verificado)

**File:** sin cambios — ningún archivo (solo verificación)

**Steps:**

1. Verificar que estos tests siguen pasando sin tocar nada


    - expect: hero.spec.ts: premisa sigue conteniendo 'quién es realmente this' (verificado)
    - expect: no-external-fonts.spec.ts: sin fuentes externas nuevas
    - expect: aria-live.spec.ts: sigue habiendo un único [aria-live] (#clases no añade)
    - expect: skip-link, stack-demo (4), strict-toggle (3), progress-bar, dark-mode (2): sin relación con #clases
    - expect: seed.spec.ts: título y status 200 intactos

#### 9.8. section.spec.ts: FALLA — toHaveCount(6) → (9) de [data-reveal] en #clases (NUEVO — rama feature/arrow-poo)

**File:** `tests/clases-es6/section.spec.ts`

**Steps:**

1.  Cambiar el assert de conteo (línea ~54)


    - expect: await expect(section.locator('[data-reveal]')).toHaveCount(6) → toHaveCount(9)
    - expect: Actualizar el comentario de la línea 5: "(header, prose, split, callout, h3, table-wrap)" → "(header, prose, split Persona, callout--pattern, h3 Arrow Functions, split Arrow Functions, callout--trap, h3 versiones, table-wrap)"

2.  No tocar el resto del test (ids de secciones, .section\_\_num,
    aria-labelledby intactos — verificado en vivo)

#### 9.9. code-block.spec.ts: FALLA — strict mode violation (2 pre.code-block) → .first() (NUEVO — rama feature/arrow-poo)

**File:** `tests/clases-es6/code-block.spec.ts`

**Steps:**

1.  Cambiar el selector del bloque de código (línea 23)


    - expect: page.locator('main section#clases pre.code-block') → añadir .first() (el bloque Persona es el primero; el 2º es el de Arrow Functions que cubre 8.8)
    - expect: Alternativa robusta: filter({ hasText: 'CLASE BASE' }) si se quiere explícito

2.  Cambiar el selector del hint (línea 37) — ahora hay 2 p.code-block\_\_hint
    idénticos


    - expect: page.locator('main section#clases p.code-block__hint') → añadir .first() (toHaveText pasa con ambos al ser idénticos, pero .first() evita ambigüedad futura)

3.  No tocar las aserciones de texto (class Persona, extends, #secreto, super,
    ES2015, ES2022, SyntaxError) — verificadas en vivo contra el bloque Persona

#### 9.10. var-not-const.spec.ts: FALLA — constCount toBe(6) → toBe(9) (NUEVO — rama feature/arrow-poo)

**File:** `tests/page-load/var-not-const.spec.ts`

**Steps:**

1.  Cambiar el assert de const (línea 49)


    - expect: expect(constCount).toBe(6) → toBe(9) — el bloque de Arrow Functions añade 3 tokens const: `const u = new Usuario();`, `const f = u.saludar;`, `const g = u.saludarFlecha;` (verificado en vivo: 6+3=9)

2.  No tocar el resto (varCount 2, strings clave, h2s, MDN 4) — verificados en
    vivo, siguen pasando


    - expect: 'const ana = new Persona("Ana");' sigue presente en el bloque Persona
    - expect: Persona ≥2 menciones (el bloque Arrow Functions usa Usuario, no altera el conteo)
