import * as Calc from './calculator.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('profit-form');
  const btnLimpiar = document.getElementById('btn-limpiar');
  const statusBanner = document.getElementById('status-banner');

  //Referencias a los campos de resultado en el DOM
  const resVentasValidas = document.getElementById('res-ventas-validas');
  const resIngresos = document.getElementById('res-ingresos');
  const resCostosFijos = document.getElementById('res-costos-fijos');
  const resCostosVariables = document.getElementById('res-costos-variables');
  const resInversion = document.getElementById('res-inversion');
  const resGanancia = document.getElementById('res-ganancia');
  const resRoi = document.getElementById('res-roi');
  const resMargen = document.getElementById('res-margen');
  const resRoas = document.getElementById('res-roas');
  const resCpa = document.getElementById('res-cpa');
  const resAmax = document.getElementById('res-amax');
  const resCpaMax = document.getElementById('res-cpamax');
  const resUmbrales = document.getElementById('res-umbrales');

  // Función principal de cálculo disparada por el submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    calcularTodo();
  });

  // Invalidar resultados en cuanto el usuario modifique cualquier input
  form.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => {
      statusBanner.textContent = "Pendiente de recalcular";
      statusBanner.className = "status-badge pending";
    });
  });

  //Botón limpiar
  btnLimpiar.addEventListener('click', () => {
    form.reset();
    limpiarResultados();
  });

  function calcularTodo() {
    // 1. Capturar entradas
    const P = parseFloat(document.getElementById('precio').value) || 0;
    const N = parseInt(document.getElementById('ventasPagadas').value) || 0;
    const D = parseInt(document.getElementById('devoluciones').value) || 0;
    const A = parseFloat(document.getElementById('publicidadTotal').value) || 0;

    const Fp = parseFloat(document.getElementById('produccion').value) || 0;
    const Fs = parseFloat(document.getElementById('abonoTienda').value) || 0;
    const Fh = parseFloat(document.getElementById('hosting').value) || 0;
    const Ft = parseFloat(document.getElementById('herramientas').value) || 0;
    const Fo = parseFloat(document.getElementById('otrosFijos').value) || 0;

    const f = parseFloat(document.getElementById('comisionTienda').value) || 0;
    const g = parseFloat(document.getElementById('comisionPasarela').value) || 0;
    const t = parseFloat(document.getElementById('impuestosVenta').value) || 0;
    const h = parseFloat(document.getElementById('otrosVariables').value) || 0;
    const c = parseFloat(document.getElementById('otrosPorVenta').value) || 0;

    // Validaciones básicas de integridad (Precio > 0, D <= N, porcentajes 0-100)
    if (P <= 0 || N < 0 || D < 0 || D > N || f < 0 || f > 100 || g < 0 || g > 100 || t < 0 || t > 100 || h < 0 || h > 100) {
      alert("Error de validación: Revise que los precios sean positivos, porcentajes entre 0 y 100, y devoluciones menores o iguales a las ventas.");
      return;
    }

    // 2. Ejecutar motor de cálculo puro
    const V = Calc.calcularVentasRetenidas(N, D);
    const G = Calc.calcularIngresosRetenidos(P, V);
    const F = Calc.calcularCostosFijos({ fp: Fp, fs: Fs, fh: Fh, ft: Ft, fo: Fo });
    const q = Calc.calcularTasaCombinada({ f, g, t, h });
    const CV = Calc.calcularCostosVariables(G, q, c, V);
    const I = Calc.calcularInversionTotal(A, F, CV);
    const U = Calc.calcularBeneficio(G, I);

    const roi = Calc.calcularRoiNeto(U, I);
    const margen = Calc.calcularMargenNeto(U, G);
    const roas = Calc.calcularRoas(G, A);
    const cpa = Calc.calcularCpaEfectivo(A, V);

    const aMax = Calc.calcularAmax(G, F, CV);
    const cpaMax = Calc.calcularCpaMaximo(aMax, V);
    const umbrales = Calc.calcularUmbrales(P, q, c, F, A);

    // 3. Renderizar resultados en pantalla con formato adecuado
    resVentasValidas.textContent = `${V}`;
    resIngresos.textContent = `USD ${formatMoney(G)}`;
    resCostosFijos.textContent = `USD ${formatMoney(F)}`;
    resCostosVariables.textContent = `USD ${formatMoney(CV)}`;
    resInversion.textContent = `USD ${formatMoney(I)}`;
    resGanancia.textContent = `USD ${formatMoney(U)}`;

    resRoi.textContent = typeof roi === 'number' ? `${roi.toFixed(1)}%` : roi;
    resMargen.textContent = typeof margen === 'number' ? `${margen.toFixed(1)}%` : margen;
    resRoas.textContent = typeof roas === 'number' ? `${roas.toFixed(2)}x` : roas;
    resCpa.textContent = typeof cpa === 'number' ? `USD ${formatMoney(cpa)}` : cpa;

    resAmax.textContent = typeof aMax === 'number' ? `USD ${formatMoney(aMax)}` : aMax;
    resCpaMax.textContent = typeof cpaMax === 'number' ? `USD ${formatMoney(cpaMax)}` : cpaMax;

    resUmbrales.textContent = `${umbrales.BE} / ${umbrales.VT}`;

    // 4. Semáforo / Estado de cumplimiento (ROI >= 40%)
    if (I <= 0) {
      statusBanner.textContent = "Sin datos suficientes";
      statusBanner.className = "status-badge warning";
    } else {
      const roiValue = typeof roi === 'number' ? roi : -999;
      if (roiValue >= 40.0) {
        statusBanner.textContent = "Cumple ROI >= 40%";
        statusBanner.className = "status-badge success";
      } else {
        statusBanner.textContent = "No cumple ROI >= 40%";
        statusBanner.className = "status-badge danger";
      }
    }
  }

  function limpiarResultados() {
    resVentasValidas.textContent = "-";
    resIngresos.textContent = "-";
    resCostosFijos.textContent = "-";
    resCostosVariables.textContent = "-";
    resInversion.textContent = "-";
    resGanancia.textContent = "-";
    resRoi.textContent = "-";
    resMargen.textContent = "-";
    resRoas.textContent = "-";
    resCpa.textContent = "-";
    resAmax.textContent = "-";
    resCpaMax.textContent = "-";
    resUmbrales.textContent = "-";
    statusBanner.textContent = "Pendiente de recalcular";
    statusBanner.className = "status-badge pending";
  }

  function formatMoney(value) {
    return Number(value).toFixed(2);
  }
});
