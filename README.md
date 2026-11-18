# BIS Profit Mini — Calculadora de Rentabilidad (V1.4)

Herramienta web de una sola pantalla diseñada para estimar la rentabilidad operativa de un infoproducto y verificar si alcanza un **ROI mínimo del 40%** sobre todos los costos introducidos.

## Alcance del MVP

- **14 variables de entrada manual:** Precio por pedido ($P$), ventas pagadas ($N$), devoluciones ($D$), inversión publicitaria ($A$), costos fijos prorrateados ($Fp, Fs, Fh, Ft, Fo$), comisiones e impuestos porcentuales ($f, g, t, h$) y costos fijos por venta retenida ($c$).
- **Métricas calculadas:** Ventas válidas, ingresos retenidos, costos fijos, costos variables, inversión total, ganancia neta, ROI estimado, margen neto, ROAS ajustado, CPA efectivo, pauta máxima compatible con ROI 40% ($A_{max}$), CPA máximo 40% y umbrales de equilibrio ($BE$) y objetivo ($VT$).
- **Sin dependencias ni integraciones externas:** Carga manual, ejecución 100% en el navegador, sin base de datos, login, historial ni conexión a pasarelas o plataformas publicitarias.

## Arquitectura del Proyecto

El código separa estrictamente la lógica financiera de la manipulación de la interfaz:

- `index.html`: Estructura semántica de pantalla única y layout responsivo.
- `styles.css`: Estilos visuales, cuadrícula adaptable a móviles y estados dinámicos del semáforo de rentabilidad.
- `calculator.js`: Motor matemático compuesto exclusivamente por **funciones puras** sin efectos secundarios, manteniendo precisión interna completa y redondeando solo en la capa de presentación.
- `app.js`: Controlador del DOM, validación de integridad de entradas, gestión de eventos y formateo de salida.

## Ejecución Local

Dado que el proyecto utiliza módulos nativos de JavaScript (`type="module"`), requiere servirse a través de HTTP local para evitar bloqueos CORS del navegador:

```bash
# Opción 1: Con Node.js (usando pnpm)
pnpm dlx serve .

# Opción 2: Con Node.js (usando npx)
npx serve .

# Opción 3: Con Python 3
python3 -m http.server 8000
```

Luego abrir `http://localhost:3000` (o 8000) en el navegador.

## Aviso Legal y Limitaciones

> Estimación basada en costos cargados. Revisá costos no recuperables, impuestos y cambio de moneda antes de invertir. Las cifras de prueba no predicen ventas.
