// Captura la PANTALLA (sin bisel) de cada teléfono de vista-previa-app.html para el carrusel de la landing.
// Son vistas previas del diseño aprobado: se reemplazan por capturas de la app real en la Sesión 5.
import { chromium } from 'playwright';
const [url, dir] = process.argv.slice(2);
const nombres = ['hoy-v2', 'ruta-v2', 'inicio', 'mision-v2', 'mi-empresa-v2', 'planes'];
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 });
await p.goto(url, { waitUntil: 'networkidle' });
await p.evaluate(() => document.fonts.ready);
const telefonos = await p.$$('.telefono');
for (let i = 0; i < telefonos.length && i < nombres.length; i++) {
  await telefonos[i].scrollIntoViewIfNeeded();
  const caja = await telefonos[i].boundingBox();
  await p.screenshot({ path: `${dir}/${nombres[i]}.png`, clip: { x: caja.x + 10, y: caja.y + 10, width: caja.width - 20, height: caja.height - 20 } });
}
console.log('capturas', Math.min(telefonos.length, nombres.length));
await b.close();
