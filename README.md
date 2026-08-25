![POO en JavaScript](https://capsule-render.vercel.app/api?type=waving&color=1E3A5F&height=220&section=header&text=POO%20en%20JavaScript&fontSize=48&fontColor=ffffff&fontAlignY=36&desc=Contexto%20de%20Ejecuci%C3%B3n%20y%20this&descSize=20&descAlignY=56)

![Version](https://img.shields.io/badge/version-1.11.0-blue?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-1E3A5F?style=flat-square)](https://kikdras.github.io/poo-js/)

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=flat-square&logo=playwright&logoColor=white)

Landing page educativa que enseña **POO en JavaScript** desde sus cimientos:
el **Contexto de Ejecución** y **`this`**. La lección usa la mecánica pre-ES6
(constructores + `prototype`) con sintaxis moderna (`let`/`const`), para que
las clases ES6 sean el siguiente paso natural, no un salto al vacío.

Creada con **inteligencia artificial** y **curada por un desarrollador**:
la estructura, los ejemplos y los demos se generaron con un pipeline de
agentes de IA y se revisaron manualmente para garantizar precisión técnica
y pedagógica.

---

## Live Demo

[Ver la lección en GitHub Pages](https://kikdras.github.io/poo-js/)

---

## Qué enseña

- **Contexto de Ejecución** — call stack, fases de creación/ejecución, hoisting
- **Modo estricto vs. modo normal** — comparación lado a lado del mismo código
- **`this` y sus 4 reglas** — con la metáfora de la llamada telefónica
  (`this` = quien contesta): default, implícita, explícita y `new`
- **Puente a la POO** — constructor functions, `prototype`, patrón `new` + `this`

Cada bloque de código es reproducible: definiciones, llamadas y salida
esperada en comentario. Se puede pegar en la consola o Node sin editar nada.

## Características interactivas

- **Call-stack stepper** — ejecuta el código paso a paso y ve cómo los
  contextos se apilan y desapilan en vivo
- **Toggle strict/sloppy** — cambia el modo de ejecución y compara resultados
- **Haz visual de `this`** — muestra quién "contesta la llamada" en cada ejemplo

## Stack

| Capa  | Tecnología |
| ----- | ---------- |
| Estructura | HTML5 semántico, WCAG 2.1 AA |
| Estilos | CSS nativo (lightningcss), sistema de diseño propio |
| Lógica | JavaScript ES6+, módulos nativos |
| Build | Vite |
| Tests | Playwright |

## Desarrollo

```bash
npm install        # instala dependencias
npm run dev        # servidor de desarrollo → http://localhost:5173
npm run build      # build de producción → dist/
npm run preview    # previsualiza el build
```

## Licencia

[MIT](LICENSE)