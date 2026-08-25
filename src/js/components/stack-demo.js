// src/js/components/stack-demo.js
// Stepper del call stack: máquina de estados sobre un array de pasos.
// Renderiza los frames de la pila en el DOM y anuncia el paso en vivo.

const FRAME_MS = 450; // = --duration-step (DESIGN.md §2.5)

// Un paso = pila (abajo → arriba) + línea de código activa + anuncio.
// n ≤ 3 frames: escaneo inline O(n) permitido (perf-reliability §lookup).
const STEPS = [
  {
    stack: ["global"],
    line: -1,
    text: "Se crea el contexto global. El programa aún no ha llamado a nada.",
  },
  {
    stack: ["global", "main"],
    line: 6,
    text: 'Se llama a main(): su contexto entra al stack (push).',
  },
  {
    stack: ["global", "main", "saludar"],
    line: 4,
    text: 'Dentro de main(), se llama a saludar("Ana"): otro push.',
  },
  {
    stack: ["global", "main", "saludar"],
    line: 1,
    text: 'Se ejecuta console.log("Hola Ana"). El contexto activo es saludar.',
  },
  {
    stack: ["global", "main"],
    line: 2,
    text: "saludar termina: su contexto sale del stack (pop) y se destruye.",
  },
  {
    stack: ["global"],
    line: 5,
    text: "main termina: pop. Solo queda el contexto global. Fin del programa.",
  },
];

export function init(config = {}) {
  const root = document.getElementById("stack-demo");
  if (!root) return () => {};

  const stackEl = root.querySelector("[data-stack]");
  const depthEl = root.querySelector("[data-depth]");
  const statusEl = root.querySelector("[data-status]");
  const nextBtn = root.querySelector("[data-next]");
  const resetBtn = root.querySelector("[data-reset]");
  const codeEl = root.querySelector("[data-code]");
  if (!stackEl || !depthEl || !statusEl || !nextBtn || !resetBtn || !codeEl) {
    return () => {};
  }

  const lineEls = Array.from(codeEl.querySelectorAll("[data-line]"));
  let step = 0; // índice del paso actual

  const isFirstStep = () => step === 0;
  const isLastStep = () => step >= STEPS.length - 1;

  const nextLabel = () => {
    if (isLastStep()) return "Reiniciar";
    if (isFirstStep()) return "Ejecutar paso a paso";
    return "Siguiente paso";
  };

  const setActiveLine = (line) => {
    for (const el of lineEls) {
      el.classList.toggle("is-active", Number(el.dataset.line) === line);
    }
  };

  // Reconcilia los frames del DOM con la pila del paso.
  // Los que salen se animan y se eliminan al terminar (FRAME_MS).
  const renderFrames = (stack) => {
    const visible = new Set(
      Array.from(stackEl.children).map((el) => el.dataset.name)
    );
    for (const name of stack) {
      if (!visible.has(name)) {
        const frame = document.createElement("div");
        frame.className = "frame frame--enter";
        frame.dataset.name = name;
        frame.textContent = name;
        stackEl.append(frame);
      }
    }
    for (const el of Array.from(stackEl.children)) {
      if (!stack.includes(el.dataset.name)) {
        el.classList.add("frame--leave");
        setTimeout(() => el.remove(), FRAME_MS);
      }
    }
  };

  const renderStep = (index) => {
    const current = STEPS[index];
    const depth = current.stack.length;
    setActiveLine(current.line);
    renderFrames(current.stack);
    depthEl.textContent = String(depth);
    statusEl.textContent = `Paso ${index + 1} de ${STEPS.length} · profundidad ${depth}: ${current.text}`;
    nextBtn.textContent = nextLabel();
    resetBtn.disabled = step === 0;
  };

  const next = () => {
    step = isLastStep() ? 0 : step + 1;
    renderStep(step);
  };

  const reset = () => {
    step = 0;
    renderStep(step);
  };

  const onRootClick = (event) => {
    const btn = event.target.closest("[data-next], [data-reset]");
    if (!btn) return;
    if (btn.matches("[data-next]")) next();
    else reset();
  };

  root.addEventListener("click", onRootClick);
  renderStep(0);

  return () => {
    root.removeEventListener("click", onRootClick);
  };
}