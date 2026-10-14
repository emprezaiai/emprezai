import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2 });
const out = 'docs/revisiones/marca';
for (const [ruta, nombre, alto] of [['/', 'landing', 160], ['/login', 'entrar', 160], ['/terminos', 'legal', 140]]) {
  await p.goto('http://localhost:3100' + ruta, { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(1200);
  await p.screenshot({ path: `${out}-${nombre}.png`, clip: { x: 0, y: 0, width: 375, height: alto } });
}
await p.setViewportSize({ width: 600, height: 300 });
await p.setContent(`<html><body style="margin:0;background:#0f0d16;display:grid;place-items:center;height:300px"><img src="http://localhost:3100/icon.svg" width="200" height="200"></body></html>`);
await p.waitForTimeout(500);
await p.screenshot({ path: `${out}-isotipo.png` });
await b.close();
