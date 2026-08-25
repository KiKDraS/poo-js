// src/main.js — SOLO inicialización. Sin manipulación de DOM ni
// DOMContentLoaded: los módulos ES se ejecutan con el DOM ya parseado.

import { init as initNav } from "./js/layout/nav.js";
import { init as initReveal } from "./js/layout/reveal.js";
import { init as initStackDemo } from "./js/components/stack-demo.js";
import { init as initStrictToggle } from "./js/components/strict-toggle.js";

initNav();
initReveal();
initStackDemo();
initStrictToggle();
