// src/js/components/stack-demo.js
// Stepper del call stack: máquina de estados sobre un array de pasos.
// Renderiza los frames de la pila en el DOM y anuncia el paso en vivo.

const FRAME_ANIMATION_MS = 450; // = --duration-step (DESIGN.md §2.5)

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

  const stackContainer = root.querySelector("[data-stack]");
  const depthLabel = root.querySelector("[data-depth]");
  const statusText = root.querySelector("[data-status]");
  const nextButton = root.querySelector("[data-next]");
  const resetButton = root.querySelector("[data-reset]");
  const codeBlock = root.querySelector("[data-code]");
  if (!stackContainer || !depthLabel || !statusText || !nextButton || !resetButton || !codeBlock) {
    return () => {};
  }

  const codeLines = Array.from(codeBlock.querySelectorAll("[data-line]"));
  let activeStepIndex = 0;

  const isFirstStep = () => activeStepIndex === 0;
  const isLastStep = () => activeStepIndex >= STEPS.length - 1;

  const getNextButtonLabel = () => {
    if (isLastStep()) return "Reiniciar";
    if (isFirstStep()) return "Ejecutar paso a paso";
    return "Siguiente paso";
  };

  const highlightActiveCodeLine = (line) => {
    for (const element of codeLines) {
      element.classList.toggle("is-active", Number(element.dataset.line) === line);
    }
  };

  // Los frames que salen se animan y se eliminan al terminar
  // (FRAME_ANIMATION_MS): quitarlos al instante cortaría la animación de salida.
  const synchronizeFramesWithStack = (stack) => {
    const visible = new Set(
      Array.from(stackContainer.children).map((element) => element.dataset.name)
    );
    for (const name of stack) {
      if (!visible.has(name)) {
        const frame = document.createElement("div");
        frame.className = "frame frame--enter";
        frame.dataset.name = name;
        frame.textContent = name;
        stackContainer.append(frame);
      }
    }
    for (const element of Array.from(stackContainer.children)) {
      if (!stack.includes(element.dataset.name)) {
        element.classList.add("frame--leave");
        setTimeout(() => element.remove(), FRAME_ANIMATION_MS);
      }
    }
  };

  const renderActiveStep = (index) => {
    const current = STEPS[index];
    const depth = current.stack.length;
    highlightActiveCodeLine(current.line);
    synchronizeFramesWithStack(current.stack);
    depthLabel.textContent = String(depth);
    statusText.textContent = `Paso ${index + 1} de ${STEPS.length} · profundidad ${depth}: ${current.text}`;
    nextButton.textContent = getNextButtonLabel();
    resetButton.disabled = activeStepIndex === 0;
  };

  const advanceToNextStep = () => {
    activeStepIndex = isLastStep() ? 0 : activeStepIndex + 1;
    renderActiveStep(activeStepIndex);
  };

  const resetToFirstStep = () => {
    activeStepIndex = 0;
    renderActiveStep(activeStepIndex);
  };

  const handleControlsClick = (event) => {
    const button = event.target.closest("[data-next], [data-reset]");
    if (!button) return;
    if (button.matches("[data-next]")) advanceToNextStep();
    else resetToFirstStep();
  };

  root.addEventListener("click", handleControlsClick);
  renderActiveStep(0);

  return () => {
    root.removeEventListener("click", handleControlsClick);
  };
}
