# Tarea: Implementar un mini "validador de API"

### Laboratorio 9: TypeScript y Vite

#### Alumno: Hector Arguello

## Instrucciones de ejecución

```bash
npm install
npm run dev
```

Para verificar tipos y generar la versión de producción:

```bash
npm run build
```

## Estructura del proyecto

```
validador-api/
├── index.html        # <div id="app"> y carga de /src/main.ts
├── package.json
├── tsconfig.json     # TypeScript en modo estricto
└── src/
    ├── main.ts       # lógica del validador
    ├── vite-env.d.ts # tipos de Vite (permite importar el CSS)
    └── style.css
```

## Qué hace el validador

1. Simula una respuesta de API con `const json = '{"id":1,"name":"Hermione","scores":[95, 100, 98]}'`.
2. `safeParse(json: string): unknown` intenta parsear el texto y devuelve `null` si no es un JSON válido.
3. `type Student = { id: number; name: string; scores: number[] }` define la forma esperada.
4. `isStudent(x: unknown): x is Student` es un *type guard* que valida la forma y los tipos en tiempo de ejecución.
5. Si el dato es válido, se muestra un `h1` con el nombre y un `p` con el promedio calculado por `average(nums: number[]): number`.
6. Si es inválido, se renderiza un mensaje de error en el DOM.

Además, la página incluye un selector con casos de prueba (uno válido y tres inválidos) para ver ambos flujos. Los datos se escapan antes de insertarse en el DOM para evitar inyección de HTML.

## ¿Qué es React y cómo se integra con Vite, TypeScript y TSX?

**React** es una biblioteca de JavaScript para construir interfaces de usuario a partir de **componentes**: funciones que reciben datos (*props*) y devuelven la interfaz que debe mostrarse. Cada componente puede tener su propio estado, y cuando ese estado cambia React actualiza solo las partes del DOM que lo necesitan (usando un DOM virtual). Esto permite describir la UI de forma declarativa ("qué se ve para este estado") en lugar de manipular el DOM a mano, como se hace en este laboratorio con `innerHTML`.

**Integración con Vite.** Vite es la herramienta de desarrollo y empaquetado. Con `npm create vite@latest` se elige la plantilla `react-ts`, que deja configurado:

- el servidor de desarrollo con recarga instantánea (HMR),
- el plugin `@vitejs/plugin-react`, que transforma JSX/TSX y habilita el refresco rápido de componentes,
- el empaquetado optimizado para producción con `vite build`.

**Integración con TypeScript y TSX.** **JSX** es una sintaxis que permite escribir etiquetas parecidas a HTML dentro del código JavaScript, y **TSX** es lo mismo en archivos TypeScript (extensión `.tsx`). Por ejemplo:

```tsx
type Props = { name: string; average: number };

function StudentCard({ name, average }: Props) {
  return (
    <main>
      <h1>{name}</h1>
      <p>Promedio: {average.toFixed(2)}</p>
    </main>
  );
}
```

Aquí TypeScript verifica que quien use `<StudentCard />` pase las props correctas. Para que funcione, `tsconfig.json` incluye la opción `"jsx": "react-jsx"`, y el punto de entrada (`main.tsx`) monta la aplicación con `createRoot(...).render(<App />)`.

**Diferencia entre las plantillas.**

| Plantilla | Contenido |
|---|---|
| `vanilla-ts` | Solo TypeScript y manipulación directa del DOM (la usada en este laboratorio). |
| `react-ts` | TypeScript + React: componentes, JSX/TSX, hooks y el plugin de React para Vite. |

En este laboratorio, el *type guard* `isStudent` sería el mismo en un proyecto React: validaría los datos de la API antes de pasarlos como props a un componente.
