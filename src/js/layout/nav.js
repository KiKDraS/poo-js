// src/js/layout/nav.js
// TOC sticky: resalta la sección activa al hacer scroll (IntersectionObserver)
// y mueve la barra de progreso de lectura. O(n) con n = nº de secciones (≤ 5).

export function init(config = {}) {
  const toc = document.querySelector("[data-toc]");
  const bar = document.querySelector("[data-progress]");
  if (!toc || !bar) return () => {};

  const links = Array.from(toc.querySelectorAll("a[href^='#']"));
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);
  if (!sections.length) return () => {};

  // Progreso de lectura: transform scaleX, sin reflow.
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    bar.style.transform = `scaleX(${pct})`;
  };

  // Sección activa: banda central de la ventana.
  let activeId = "";
  const spy = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) activeId = entry.target.id;
      }
      for (const link of links) {
        const isActive = link.getAttribute("href") === `#${activeId}`;
        link.classList.toggle("is-active", isActive);
        if (isActive) {
          link.setAttribute("aria-current", "true");
        } else {
          link.removeAttribute("aria-current");
        }
      }
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );
  sections.forEach((section) => spy.observe(section));

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Skip link: mueve el foco al main (WCAG 2.4.1). El navegador ya hace el
  // scroll del ancla; preventScroll evita el doble salto.
  const skip = document.querySelector(".skip-link");
  const main = document.querySelector("main#contenido");
  const onSkipClick = () => main.focus({ preventScroll: true });
  if (skip && main) skip.addEventListener("click", onSkipClick);

  return () => {
    spy.disconnect();
    window.removeEventListener("scroll", onScroll);
    if (skip && main) skip.removeEventListener("click", onSkipClick);
  };
}