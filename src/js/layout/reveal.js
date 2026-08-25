// src/js/layout/reveal.js
// Reveal por scroll: IntersectionObserver añade .is-visible a [data-reveal].
// Si no hay soporte, muestra todo directamente (sin contenido oculto).

const revealOnIntersect = (entries, revealObserver) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  }
};

export function init() {
  const revealTargets = Array.from(document.querySelectorAll("[data-reveal]"));
  if (!revealTargets.length) return () => {};

  const supportsIntersectionObserver = "IntersectionObserver" in window;
  if (!supportsIntersectionObserver) {
    revealTargets.forEach((element) => element.classList.add("is-visible"));
    return () => {};
  }

  const revealObserver = new IntersectionObserver(
    (entries) => revealOnIntersect(entries, revealObserver),
    {
      threshold: 0.12,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  revealTargets.forEach((element) => revealObserver.observe(element));

  return () => revealObserver.disconnect();
}
