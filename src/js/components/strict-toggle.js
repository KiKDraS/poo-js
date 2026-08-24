// src/js/components/strict-toggle.js
// Interruptor modo normal / modo estricto: cambia la insignia del bloque
// de código, la salida visible y el estado aria del switch.

export function init(config = {}) {
  const root = document.getElementById("strict-demo");
  if (!root) return () => {};

  const sw = root.querySelector("[data-strict-switch]");
  const badge = root.querySelector("[data-strict-badge]");
  const outNormal = root.querySelector("[data-output-normal]");
  const outStrict = root.querySelector("[data-output-strict]");
  if (!sw || !badge || !outNormal || !outStrict) return () => {};

  const setMode = (strict) => {
    sw.setAttribute("aria-checked", String(strict));
    sw.setAttribute(
      "aria-label",
      strict ? "Cambiar a modo normal" : "Cambiar a modo estricto"
    );
    badge.textContent = strict ? "modo estricto" : "modo normal";
    outNormal.hidden = strict;
    outStrict.hidden = !strict;
    root.classList.toggle("is-strict", strict);

    // Reinicia la animación de entrada de la salida visible.
    const shown = strict ? outStrict : outNormal;
    shown.classList.remove("console--pop");
    void shown.offsetWidth;
    shown.classList.add("console--pop");
  };

  const onClick = () => setMode(sw.getAttribute("aria-checked") !== "true");
  sw.addEventListener("click", onClick);

  return () => sw.removeEventListener("click", onClick);
}