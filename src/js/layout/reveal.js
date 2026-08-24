// src/js/layout/reveal.js
// Reveal por scroll: IntersectionObserver añade .is-visible a [data-reveal].
// Si no hay soporte, muestra todo directamente (sin contenido oculto).

export function init(config = {}) {
  const targets = Array.from(document.querySelectorAll("[data-reveal]"));
  if (!targets.length) return () => {};

  if (!("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-visible"));
    return () => {};
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );

  targets.forEach((el) => io.observe(el));

  return () => io.disconnect();
}