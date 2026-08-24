// src/main.js — SOLO inicialización. Sin manipulación de DOM ni
// DOMContentLoaded: los módulos ES se ejecutan con el DOM ya parseado.

import { init as initNav } from "./layout/nav.js";
import { init as initReveal } from "./layout/reveal.js";
import { init as initStackDemo } from "./components/stack-demo.js";
import { init as initStrictToggle } from "./components/strict-toggle.js";

initNav();
initReveal();
initStackDemo();
initStrictToggle();