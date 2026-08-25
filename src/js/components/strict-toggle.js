// src/js/components/strict-toggle.js
// Interruptor modo normal / modo estricto: cambia la insignia del bloque
// de código, la salida visible y el estado aria del switch.

export function init(config = {}) {
  const root = document.getElementById("strict-demo");
  if (!root) return () => {};

  const toggleSwitch = root.querySelector("[data-strict-switch]");
  const badge = root.querySelector("[data-strict-badge]");
  const normalOutput = root.querySelector("[data-output-normal]");
  const strictOutput = root.querySelector("[data-output-strict]");
  if (!toggleSwitch || !badge || !normalOutput || !strictOutput) return () => {};

  const setStrictMode = (strict) => {
    toggleSwitch.setAttribute("aria-checked", String(strict));
    toggleSwitch.setAttribute(
      "aria-label",
      strict ? "Cambiar a modo normal" : "Cambiar a modo estricto"
    );
    badge.textContent = strict ? "modo estricto" : "modo normal";
    normalOutput.hidden = strict;
    strictOutput.hidden = !strict;
    root.classList.toggle("is-strict", strict);

    // Reinicia la animación de entrada de la salida visible.
    const shown = strict ? strictOutput : normalOutput;
    shown.classList.remove("console--pop");
    void shown.offsetWidth;
    shown.classList.add("console--pop");
  };

  const handleSwitchClick = () =>
    setStrictMode(toggleSwitch.getAttribute("aria-checked") !== "true");
  toggleSwitch.addEventListener("click", handleSwitchClick);

  return () => toggleSwitch.removeEventListener("click", handleSwitchClick);
}
