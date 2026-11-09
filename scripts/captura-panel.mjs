// Captura las pantallas del panel de la dueña a 375px (y 1440 de referencia) en docs/revisiones/panel/.
// Requiere el servidor local levantado con PANEL_CAPTURA=<archivo de tests/db/panel-fixture.mjs>
// (datos de prueba; nunca la base real). Mide el desborde horizontal de cada pantalla.
// Uso: node scripts/captura-panel.mjs http://localhost:3100 [ruta1,ruta2,...]
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const [base = 'http://localhost:3100', lista = '/admin'] = process.argv.slice(2);
const carpeta = 'docs/revisiones/panel';
mkdirSync(carpeta, { recursive: true });
const navegador = await chromium.launch();
const medidas = [];
const errores = [];

for (const [ancho, alto, sufijo] of [
  [375, 812, '375'],
  [1440, 900, '1440'],
]) {
  const pagina = await navegador.newPage({ viewport: { width: ancho, height: alto }, deviceScaleFactor: ancho === 375 ? 2 : 1 });
  pagina.on('pageerror', (e) => errores.push(`${ancho}: ${e.message}`));
  pagina.on('console', (m) => m.type() === 'error' && errores.push(`${ancho}: ${m.text()}`));
  for (const ruta of lista.split(',')) {
    await pagina.goto(`${base}${ruta}`, { waitUntil: 'load' });
    await pagina.evaluate(() => document.fonts.ready);
    await pagina.waitForTimeout(1800);
    const m = await pagina.evaluate(() => ({
      desborde: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      alto: document.documentElement.scrollHeight,
    }));
    const nombre = ruta === '/admin' ? 'inicio' : ruta.replace('/admin/', '').replace(/[/?=&]/g, '-');
    medidas.push({ nombre, ancho, ...m });
    await pagina.screenshot({ path: `${carpeta}/${nombre}-${sufijo}.png`, fullPage: true });
  }
  await pagina.close();
}
console.log(JSON.stringify({ medidas, errores }, null, 1));
await navegador.close();
