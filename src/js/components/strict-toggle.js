// src/js/components/strict-toggle.js
// Interruptor modo normal / modo estricto: cambia la insignia del bloque
// de código, la salida visible y el estado aria del switch.

const setStrictMode = (
  isStrict,
  { toggleSwitch, badge, normalOutput, strictOutput, root }
) => {
  toggleSwitch.setAttribute("aria-checked", String(isStrict));
  toggleSwitch.setAttribute(
    "aria-label",
    isStrict ? "Cambiar a modo normal" : "Cambiar a modo estricto"
  );
  badge.textContent = isStrict ? "modo estricto" : "modo normal";
  normalOutput.hidden = isStrict;
  strictOutput.hidden = !isStrict;
  root.classList.toggle("is-strict", isStrict);

  // Reinicia la animación de entrada de la salida visible.
  const shownOutput = isStrict ? strictOutput : normalOutput;
  shownOutput.classList.remove("console--pop");
  void shownOutput.offsetWidth;
  shownOutput.classList.add("console--pop");
};

const isStrictModeActive = (toggleSwitch) =>
  toggleSwitch.getAttribute("aria-checked") === "true";

export function init() {
  const root = document.getElementById("strict-demo");
  if (!root) return () => {};

  const toggleSwitch = root.querySelector("[data-strict-switch]");
  const badge = root.querySelector("[data-strict-badge]");
  const normalOutput = root.querySelector("[data-output-normal]");
  const strictOutput = root.querySelector("[data-output-strict]");
  if (!toggleSwitch || !badge || !normalOutput || !strictOutput) return () => {};

  const elements = { toggleSwitch, badge, normalOutput, strictOutput, root };
  const handleSwitchClick = () => {
    const isStrictMode = isStrictModeActive(toggleSwitch);
    setStrictMode(!isStrictMode, elements);
  };
  toggleSwitch.addEventListener("click", handleSwitchClick);

  return () => toggleSwitch.removeEventListener("click", handleSwitchClick);
}
