// src/js/layout/nav.js
// TOC sticky: resalta la sección activa al hacer scroll (IntersectionObserver)
// y mueve la barra de progreso de lectura. O(n) con n = nº de secciones (≤ 5).

// Progreso de lectura: transform scaleX, sin reflow.
const updateReadingProgress = (progressBar) => {
  const totalScrollableDistance =
    document.documentElement.scrollHeight - window.innerHeight;
  const hasScrollableDistance = totalScrollableDistance > 0;
  const progressRatio = hasScrollableDistance
    ? Math.min(1, window.scrollY / totalScrollableDistance)
    : 0;
  progressBar.style.transform = `scaleX(${progressRatio})`;
};

const highlightActiveSection = (navLinks, activeSectionId) => {
  for (const link of navLinks) {
    const isActive = link.getAttribute("href") === `#${activeSectionId}`;
    link.classList.toggle("is-active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "true");
    } else {
      link.removeAttribute("aria-current");
    }
  }
};

export function init() {
  const tableOfContents = document.querySelector("[data-toc]");
  const progressBar = document.querySelector("[data-progress]");
  if (!tableOfContents || !progressBar) return () => {};

  const navLinks = Array.from(tableOfContents.querySelectorAll("a[href^='#']"));
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);
  if (!sections.length) return () => {};

  // Sección activa: banda central de la ventana.
  let activeSectionId = "";
  const scrollSpyObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) activeSectionId = entry.target.id;
      }
      highlightActiveSection(navLinks, activeSectionId);
    },
    {
      rootMargin: "-45% 0px -50% 0px",
      threshold: 0,
    }
  );
  sections.forEach((section) => scrollSpyObserver.observe(section));

  updateReadingProgress(progressBar);
  const handleScroll = () => updateReadingProgress(progressBar);
  window.addEventListener("scroll", handleScroll, { passive: true });

  // Skip link: mueve el foco al main (WCAG 2.4.1). Delegado — un listener en
  // document, target via [data-skip-link]. El navegador ya hace el scroll del
  // ancla; preventScroll evita el doble salto.
  const mainElement = document.querySelector("main#contenido");
  const handleSkipLinkClick = (event) => {
    if (!mainElement || !event.target.closest("[data-skip-link]")) return;
    mainElement.focus({ preventScroll: true });
  };
  document.addEventListener("click", handleSkipLinkClick);

  return () => {
    scrollSpyObserver.disconnect();
    window.removeEventListener("scroll", handleScroll);
    document.removeEventListener("click", handleSkipLinkClick);
  };
}
