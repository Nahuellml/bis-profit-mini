/** 
 * Motor de cálculo financiero BIS Profit Mini V1.4
 * Funciones puras libres de efectos secundarios y manipulación del DOM
 */

// 1. Ventas retenidas: V = N - D 
export function calcularVentasRetenidas(ventasPagadas, devoluciones) {
  return Math.max(0, ventasPagadas - devoluciones);
}

//2. Ingresos retenidos: G = P * V
export function calcularIngresosRetenidos(precio, ventasRetenidas) {
  return precio * ventasRetenidas;
}

// 3. Costos fijos: F = Fp + Fs + Fh + Ft + Fo
export function calcularCostosFijos(fijos) {
  const { fp = 0, fs = 0, fh = 0, ft = 0, fo = 0 } = fijos;
  return fp + fs + fh + ft + fo;
}

// 4. Tasa combinada: q = (f + g + t + h) / 100
export function calcularTasaCombinada(comisiones) {
  const { f = 0, g = 0, t = 0, h = 0 } = comisiones;
  return (f + g + t + h) / 100;
}

// 5. Costos variables: CV = G * q + c * V
export function calcularCostosVariables(ingresosRetenidos, tasaCombinada, costoFijoPorVenta, ventasRetenidas) {
  return (ingresosRetenidos * tasaCombinada) + (costoFijoPorVenta * ventasRetenidas);
}

// 6. Inversión / Costos totales: I = A + F + CV
export function calcularInversionTotal(publicidadTotal, costosFijos, costosVariables) {
  return publicidadTotal + costosFijos + costosVariables;
}

// 7. Resultado o beneficio: U = G - I
export function calcularBeneficio(ingresosRetenidos, inversionTotal) {
  return ingresosRetenidos - inversionTotal;
}

// 8. ROI neto estimado (%): 100 * U / I (si I > 0)
export function calcularRoiNeto(beneficio, inversionTotal) {
  if (inversionTotal <= 0) return "No calculable";
  return (100 * beneficio) / inversionTotal;
}

// 9. Margen neto estimado (%): 100 * U / G (si G > 0)
export function calcularMargenNeto(beneficio, ingresosRetenidos) {
  if (ingresosRetenidos <= 0) return "No calculable";
  return (100 * beneficio) / ingresosRetenidos;
}

// 10. ROAS ajustado: G / A (si A > 0)
export function calcularRoas(ingresosRetenidos, publicidadTotal) {
  if (publicidadTotal <= 0) return "No calculable";
  return ingresosRetenidos / publicidadTotal;
}

// 11. CPA efectivo: G / A (si V > 0)
export function calcularCpaEfectivo(publicidadTotal, ventasRetenidas) {
  if (ventasRetenidas <= 0) return "No calculable";
  return publicidadTotal / ventasRetenidas;
}

// 12. Publicidad máxima compatible con ROI 40%: Amax = G / 1.40 - (F + CV)
export function calcularAmax(ingresosRetenidos, costosFijos, costosVariables) {
  const aMax = (ingresosRetenidos / 1.40) - (costosFijos + costosVariables);
  if (aMax < 0) return "Inviable aún sin pauta";
  return aMax;
}

// 13. CPA máximo compatible con ROI 40%: Amax / V (si V > 0 y Amax >= 0)
export function calcularCpaMaximo(aMax, ventasRetenidas) {
  if (typeof aMax === "string" || aMax < 0 || ventasRetenidas <= 0) return "No calculable";
  return aMax / ventasRetenidas;
}

// 14. Umbrales de ventas retenidas (Equilibrio BE y Objetivo ROI 40% VT)
export function calcularUmbrales(precio, tasaCombinada, costoFijoPorVenta, costosFijos, publicidadTotal) {
  // M = P * (1 - q) - c (contribución por pedido retenido)
  const M = precio * (1 - tasaCombinada) - costoFijoPorVenta;
  // K = A + F (gasto no dependiente del número de ventas)
  const K = publicidadTotal + costosFijos;

  // Equilibrio (BE): techo(K / M)
  let BE = "No alcanzable";
  if (M > 0) {
    BE = Math.ceil(K / M);
  }

  // Objetivo ROI 40% (VT): techo[(1.40 * K) / (P - 1.40 * (P * q + c))]
  let VT = "No alcanzable";
  const denominadorVT = precio - 1.40 * (precio * tasaCombinada + costoFijoPorVenta);
  if (denominadorVT > 0) {
    const calculoVT = (1.40 * K) / denominadorVT;
    VT = Math.ceil(calculoVT);
  }

  return { BE, VT };
} 
