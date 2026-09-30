// Captura de página completa a 375px con Playwright (si está disponible) — evidencia para el revisor.
import { chromium } from 'playwright';

const [url, salida, ancho = '375'] = process.argv.slice(2);
const navegador = await chromium.launch();
const pagina = await navegador.newPage({ viewport: { width: Number(ancho), height: 812 }, deviceScaleFactor: 2 });
await pagina.goto(url, { waitUntil: 'load' });
await pagina.evaluate(async () => {
  await document.fonts.ready;
  // Recorre la página para disparar las animaciones de entrada (whileInView) antes de capturar.
  for (let y = 0; y < document.body.scrollHeight; y += 250) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 300));
  }
  window.scrollTo(0, 0);
  await new Promise((r) => setTimeout(r, 1200));
});
const medidas = await pagina.evaluate(() => ({
  anchoDoc: document.documentElement.scrollWidth,
  anchoVista: document.documentElement.clientWidth,
  alto: document.documentElement.scrollHeight,
}));
await pagina.screenshot({ path: salida, fullPage: true });
console.log(JSON.stringify(medidas));
await navegador.close();
