import "./style.css";

// 1. Tipo esperado para la respuesta de la "API"
type Student = {
  id: number;
  name: string;
  scores: number[];
};

// 2. Parseo seguro: devuelve null en lugar de lanzar una excepción
function safeParse(json: string): unknown {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

// 3. Type guard: valida la forma y los tipos en tiempo de ejecución
function isStudent(x: unknown): x is Student {
  if (typeof x !== "object" || x === null) return false;

  const obj = x as Record<string, unknown>;

  return (
    typeof obj.id === "number" &&
    typeof obj.name === "string" &&
    Array.isArray(obj.scores) &&
    obj.scores.every((score) => typeof score === "number")
  );
}

// 4. Promedio (0 si el arreglo está vacío, para evitar NaN)
function average(nums: number[]): number {
  if (nums.length === 0) return 0;
  const sum = nums.reduce((acc, curr) => acc + curr, 0);
  return sum / nums.length;
}

// Evita inyección de HTML al mostrar datos que vienen de afuera
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Respuesta JSON simulada que pide la consigna
const json = '{"id":1,"name":"Hermione","scores":[95, 100, 98]}';

// Casos de prueba para ver también el flujo de error
const samples: Record<string, { label: string; json: string }> = {
  valid: { label: "Válido (Hermione)", json },
  idString: {
    label: "Inválido: id como string y sin scores",
    json: '{"id":"1","name":"Hermione"}',
  },
  badScores: {
    label: "Inválido: scores con un string",
    json: '{"id":1,"name":"Hermione","scores":[95,"100",98]}',
  },
  notJson: { label: "Inválido: texto que no es JSON", json: "esto no es JSON" },
};

function renderResult(container: HTMLElement, raw: string): void {
  const parsedData = safeParse(raw);

  if (isStudent(parsedData)) {
    const avg = average(parsedData.scores);
    container.innerHTML = `
      <main class="card">
        <h1>${escapeHtml(parsedData.name)}</h1>
        <p>Promedio de calificaciones: <strong>${avg.toFixed(2)}</strong></p>
      </main>
    `;
  } else {
    container.innerHTML = `
      <main class="error-card">
        <h2>Error de validación</h2>
        <p>Los datos recibidos no cumplen con la estructura requerida para un estudiante.</p>
      </main>
    `;
  }
}

function renderApp(): void {
  const app = document.querySelector<HTMLDivElement>("#app");
  if (!app) return;

  const options = Object.entries(samples)
    .map(([key, s]) => `<option value="${key}">${s.label}</option>`)
    .join("");

  app.innerHTML = `
    <label class="picker">
      Caso de prueba:
      <select id="sample">${options}</select>
    </label>
    <pre id="raw" class="raw"></pre>
    <div id="result"></div>
  `;

  const select = app.querySelector<HTMLSelectElement>("#sample");
  const raw = app.querySelector<HTMLPreElement>("#raw");
  const result = app.querySelector<HTMLDivElement>("#result");
  if (!select || !raw || !result) return;

  const update = (): void => {
    const current = samples[select.value];
    raw.textContent = current.json;
    renderResult(result, current.json);
  };

  select.addEventListener("change", update);
  update();
}

renderApp();
