# retail-t-app

## Descripción general

App móvil de punto de venta (POS) para bodega/tienda retail.
Permite escanear productos por código de barras y registrar ventas con cálculo automático.
Prioridad actual: **Android**. iOS se dará soporte más adelante de ser necesario.

---

## Stack técnico — Versiones exactas

```json
{
  "expo": "~55.0.23",
  "react": "19.2.0",
  "react-native": "0.83.6",
  "expo-router": "~55.0.14",
  "react-native-vision-camera": "^5.0.9",
  "react-native-vision-camera-barcode-scanner": "^5.0.9",
  "react-native-worklets": "0.7.4",
  "@tanstack/react-query": "^5.100.10",
  "axios": "^1.16.0",
  "zod": "^4.4.3",
  "nativewind": "^4.2.3",
  "tailwindcss": "^3.4.17",
  "react-native-reanimated": "4.2.1",
  "react-native-gesture-handler": "~2.30.0",
  "zustand": "^5.0.13"
}
```

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

## Reglas de código — SIEMPRE respetar

- **Nombres de archivos y componentes**: en inglés
- **Comentarios**: en español
- **Routing**: file-based con Expo Router — las rutas van en `app/`
- **Estilos**: NativeWind (Tailwind) — no StyleSheet salvo casos excepcionales
- **HTTP**: siempre usar la instancia Axios de `@/src/lib/api.ts` — nunca `fetch` directo
- **Datos del servidor**: TanStack Query (hooks en `src/hooks/`)
- **Estado UI de sesión**: Zustand (`src/store/saleStore.ts`)
- **Validación API**: Zod schemas en `src/schemas/`
- **Tipos**: inferidos de Zod con `z.infer<>` — nunca duplicar tipos manualmente
- **Iconos**: importar SOLO desde `@/src/components/ui/icons/index.tsx` — nunca de `@expo/vector-icons` directo
- **Auth JWT**: no implementar en esta fase

---

## Lo que NO se implementa en esta fase

- Autenticación JWT
- Pantalla de historial de ventas
- Agregar producto manualmente (descartado en el diseño)
- Soporte iOS (se agrega después)
- Sincronización offline con SQLite (análisis hecho, implementación futura)
