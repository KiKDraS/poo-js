// src/js/layout/reveal.js
// Reveal por scroll: IntersectionObserver añade .is-visible a [data-reveal].
// Si no hay soporte, muestra todo directamente (sin contenido oculto).

export function init(config = {}) {
  const revealTargets = Array.from(document.querySelectorAll("[data-reveal]"));
  if (!revealTargets.length) return () => {};

  if (!("IntersectionObserver" in window)) {
    revealTargets.forEach((element) => element.classList.add("is-visible"));
    return () => {};
  }

  const onIntersect = (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    }
  };
  const revealObserver = new IntersectionObserver(onIntersect, {
    threshold: 0.12,
    rootMargin: "0px 0px -8% 0px",
  });

  revealTargets.forEach((element) => revealObserver.observe(element));

  return () => revealObserver.disconnect();
}