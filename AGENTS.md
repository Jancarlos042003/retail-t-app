# Retail-t-app

## Descripción general

App móvil de punto de venta (POS) para bodega/tienda retail.
Permite escanear productos por código de barras y registrar ventas con cálculo automático.
Prioridad actual: **Android**. iOS se dará soporte más adelante de ser necesario.

---

## Decisiones de producto

- Escaneo por código de barras es prioritario.
- El flujo de venta debe tener el menor número posible de pasos.
- No agregar funcionalidad fuera del alcance actual.
- No implementar autenticación JWT en esta fase.
- No implementar historial de ventas en esta fase.
- No implementar carga manual de productos en esta fase.

---

## Stack técnico

Ver `package.json` — es la fuente de verdad para versiones exactas.

---

## Estructura de directorios

```
retail-t-app/
├── app/                        # Expo Router — SOLO rutas, sin lógica
│   └── (app)/                  # Grupo de rutas principales de la app
│
└── src/
    ├── components/
    │   ├── ui/                 # Componentes genéricos reutilizables
    │   │   └── icons/
    │   │       └── index.tsx   # Única fuente de iconos — nunca importar de @expo/vector-icons
    │   ├── product/            # Componentes relacionados al producto escaneado
    │   ├── sale/               # Componentes del carrito y proceso de venta
    │   └── scanner/            # Componentes visuales de la cámara/escáner
    ├── hooks/                  # TanStack Query — consultas y mutaciones al servidor
    ├── store/
    │   └── saleStore.ts        # Zustand — estado del carrito activo
    ├── lib/
    │   ├── api.ts              # Instancia Axios configurada — usar siempre esta, nunca fetch
    │   └── queryClient.ts      # Configuración global de TanStack Query
    ├── schemas/                # Zod schemas — fuente de verdad de tipos y validación de API
    ├── types/                  # Tipos inferidos de Zod con z.infer<> — nunca definir tipos manualmente
    └── constants/              # URLs base, textos globales y valores fijos de la app
```

---

## Reglas de arquitectura

- `app/` debe contener solo rutas.
- No colocar lógica de negocio, hooks, stores, schemas ni componentes reutilizables dentro de `app/`.
- Los componentes compartidos van en `src/components/`.
- Las consultas de servidor van en `src/hooks/`.
- El estado UI de la venta activa va en `src/store/saleStore.ts`.
- Los schemas de validación van en `src/schemas/`.
- Los tipos deben inferirse desde Zod con `z.infer<>`.
- No duplicar tipos manualmente si ya existen en schemas.

---

## Reglas obligatorias de código

- Nombres de archivos y componentes en inglés.
- Todos los comentarios deben estar en español, sin excepción: comentarios inline, bloques y JSDoc.
- Routing file-based con Expo Router; las rutas pertenecen a `app/`.
- Cada grupo de rutas debe tener su `_layout.tsx` cuando sea necesario.
- Eliminar archivos de rutas viejas cuando se reestructura navegación.
- Estilos con NativeWind; evitar `StyleSheet` salvo casos excepcionales.
- HTTP siempre con la instancia Axios de `@/src/lib/api.ts`.
- Nunca usar `fetch` directo.
- Toda consulta o mutación del servidor debe vivir en `src/hooks/`.
- El estado UI temporal de la venta debe vivir en Zustand.
- Validación siempre con Zod en `src/schemas/`.
- Tipos siempre inferidos desde Zod.
- Los iconos se importan solo desde `@/src/components/ui/icons/index.tsx`.
- No importar iconos directo desde `@expo/vector-icons`.
- No implementar JWT en esta fase.

---

## Alcance de las skills

### Tabla de responsabilidades

| Skill | Qué decide | No decide |
|---|---|---|
| `building-native-ui` | Estructura de rutas, navegación (Stack/Tabs/Modal/Sheet), safe areas, scroll, headers, gestures, transiciones | Estilos visuales, colores, performance de listas |
| `vercel-react-native-skills` | Performance de listas (FlashList, memoización), animaciones (GPU properties), rendering, state patterns | Rutas, estilos visuales, branding |
| `ui-ux-pro-max` | Accesibilidad, touch targets, feedback de interacción, timing de animaciones, calidad visual pre-entrega | Estructura de rutas, lógica de negocio, setup de librerías |

### Regla de override de estilos

`building-native-ui` recomienda inline styles y prohíbe Tailwind. **Esta regla no aplica a este proyecto.** Usar siempre NativeWind para estilos visuales. La skill se invoca solo por sus decisiones de navegación y estructura de pantallas.

### Cuándo invocar cada skill

- **`building-native-ui`** — Al crear o modificar rutas, layouts de pantalla, navegación o comportamiento nativo de pantallas.
- **`vercel-react-native-skills`** — Al trabajar con listas, animaciones con Reanimated, optimización de renders o patrones de estado.
- **`ui-ux-pro-max`** — Al diseñar o revisar componentes UI (botones, forms, modales), verificar accesibilidad o hacer revisión de calidad antes de entregar una pantalla. No invocar para branding ni paletas de color (ya definidas en el proyecto).

### Cuándo invocar múltiples skills

Si una tarea cruza responsabilidades (ej. nueva pantalla con lista y formulario), invocar en este orden:

1. `building-native-ui` — estructura y navegación
2. `vercel-react-native-skills` — performance
3. `ui-ux-pro-max` — calidad UI y accesibilidad

---

## Prioridad de decisiones

Cuando existan dudas, seguir este orden:

1. Alcance del producto y restricciones de la fase actual
2. Arquitectura del proyecto (reglas de este documento)
3. Reglas de `building-native-ui`
4. Reglas de `vercel-react-native-skills`
5. Reglas de `ui-ux-pro-max`
6. Estilos con NativeWind
7. Preferencias locales del componente

No introducir nuevas librerías, patrones o estructuras sin una razón clara.
No mezclar lógica de negocio con rutas.
No mezclar decisiones de navegación con decisiones de estilo.

---

## Reglas de UI y UX

- La UI debe ser rápida de operar.
- Priorizar flujo de venta con el menor número posible de pasos.
- Mostrar información crítica de forma clara.
- El escaneo debe ser el foco principal de la experiencia.
- Evitar pantallas innecesarias o interacciones redundantes.
- Mantener la interfaz simple para uso en mostrador.

---

## Reglas de componentes

- Los componentes reutilizables deben ser pequeños y enfocados.
- Evitar componentes demasiado genéricos sin necesidad.
- Separar componentes de UI, producto, venta y escáner según su responsabilidad.
- Preferir composición sobre componentes monolíticos.

---

## Reglas de calidad

- Mantener el código legible y consistente.
- No agregar abstracciones prematuras.
- No inventar funcionalidades fuera del alcance actual.
- Si una tarea afecta varias capas, resolver primero la arquitectura antes de tocar UI.
- Si hay conflicto entre conveniencia y orden del proyecto, priorizar orden.

### Criterio de "done"

Un cambio está listo cuando:

1. `npx tsc --noEmit` no reporta errores.
2. `npm run lint` no reporta errores.

La verificación en dispositivo físico es responsabilidad del revisor humano, no del agente.

---

## Reglas de respuesta esperadas del agente

- Proponer cambios mínimos y correctos.
- Respetar la estructura de carpetas existente.
- No romper convenciones ya definidas.
- Antes de crear archivos nuevos, verificar si existe una carpeta adecuada.
- Antes de agregar una librería, justificar por qué es necesaria.
