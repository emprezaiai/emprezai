import { chromium } from 'playwright';
const [url, prefijo, alto = '1100'] = process.argv.slice(2);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 1 });
await p.goto(url, { waitUntil: 'load' });
const total = await p.evaluate(async () => { await document.fonts.ready; for (let y = 0; y < document.body.scrollHeight; y += 250) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 300)); } window.scrollTo(0,0); await new Promise(r => setTimeout(r, 1200)); return document.documentElement.scrollHeight; });
const h = Number(alto); let i = 0;
for (let y = 0; y < total; y += h) { await p.screenshot({ path: `${prefijo}-${i++}.png`, fullPage: true, clip: { x: 0, y, width: 375, height: Math.min(h, total - y) } }); }
console.log(i, total);
await b.close();
