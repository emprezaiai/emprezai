// Captura las fichas de ícono animadas (Hoy: racha/piezas/semana · landing: dolores y los 3 pasos)
// en su estado final. Uso: node scripts/captura-fichas.mjs http://localhost:3100
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const [base = 'http://localhost:3100'] = process.argv.slice(2);
const carpeta = 'docs/revisiones/fichas';
mkdirSync(carpeta, { recursive: true });

const navegador = await chromium.launch();
const pagina = await (await navegador.newContext({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2 })).newPage();
const errores = [];
pagina.on('pageerror', (e) => errores.push(e.message));
pagina.on('console', (m) => m.type() === 'error' && errores.push(m.text()));
const espera = (ms) => pagina.waitForTimeout(ms);

// Hoy (datos de ejemplo de Carlos, día 8)
await pagina.goto(`${base}/login?qa=1`);
await pagina.evaluate(() => localStorage.clear());
await pagina.goto(`${base}/app?demo=carlos`, { waitUntil: 'load' });
const datos = pagina.getByRole('list', { name: 'Tu avance' });
await datos.waitFor();
await espera(2600);
await datos.screenshot({ path: `${carpeta}/hoy-datos.png` });

// Página de ventas: dolores y pasos
await pagina.goto(`${base}/`, { waitUntil: 'load' });
for (const [nombre, etiqueta] of [
  ['landing-dolores', 'El problema'],
  ['landing-pasos', 'Cómo funciona'],
]) {
  const seccion = pagina.getByRole('region', { name: etiqueta });
  await seccion.scrollIntoViewIfNeeded();
  await espera(2300);
  await seccion.screenshot({ path: `${carpeta}/${nombre}.png` });
}

console.log(errores.length ? `ERRORES:\n${errores.join('\n')}` : 'sin errores en consola');
await navegador.close();
