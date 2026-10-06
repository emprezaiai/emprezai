// Recorre el onboarding completo + la pantalla de planes a 375px (o el ancho dado) y captura
// cada paso en docs/revisiones/recorrido/. Mide el desborde horizontal en cada pantalla.
// Uso: node scripts/captura-recorrido.mjs http://localhost:3100 [ancho] [ruta: con-area|nose]
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const [base = 'http://localhost:3100', ancho = '375', ruta = 'con-area'] = process.argv.slice(2);
const carpeta = `docs/revisiones/recorrido${ancho === '375' ? '' : `-${ancho}`}${ruta === 'nose' ? '-nose' : ''}`;
mkdirSync(carpeta, { recursive: true });

const navegador = await chromium.launch();
const pagina = await navegador.newPage({ viewport: { width: Number(ancho), height: 812 }, deviceScaleFactor: 2 });
const errores = [];
pagina.on('pageerror', (e) => errores.push(e.message));
pagina.on('console', (m) => m.type() === 'error' && errores.push(m.text()));

const espera = (ms) => pagina.waitForTimeout(ms);
const medidas = [];
let n = 0;
async function capturar(nombre) {
  await pagina.evaluate(() => document.fonts.ready);
  const m = await pagina.evaluate(() => ({
    desborde: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    alto: document.documentElement.scrollHeight,
  }));
  medidas.push({ nombre, ...m });
  n += 1;
  const ruta = `${carpeta}/${String(n).padStart(2, '0')}-${nombre}`;
  // Con barra fija abajo, la captura de página completa la deja flotando al medio: en pantallas
  // largas se capturan dos vistas reales del celular (arriba y al final del scroll).
  if (m.alto <= 830) {
    await pagina.screenshot({ path: `${ruta}.png` });
    return;
  }
  await pagina.screenshot({ path: `${ruta}-arriba.png` });
  await pagina.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await espera(500);
  await pagina.screenshot({ path: `${ruta}-final.png` });
  await pagina.evaluate(() => window.scrollTo(0, 0));
  await espera(200);
}
const tocar = async (texto) => {
  await pagina.getByText(texto, { exact: false }).first().click();
};

await pagina.goto(`${base}/onboarding?plan=anual&qa=1`, { waitUntil: 'load' });
await pagina.evaluate(() => localStorage.clear());
await pagina.reload({ waitUntil: 'load' });
await espera(900);
await capturar('punto');
await tocar(ruta === 'nose' ? 'Aún no tengo idea' : 'Sé qué vender');
await espera(900);
await capturar('freno');
await tocar('me quedo en blanco');
await espera(1200);
await capturar('reconocimiento');
await tocar('Tiene sentido');
await espera(900);
await capturar('area');
if (ruta === 'nose') {
  await tocar('No lo sé');
  await espera(900);
  await capturar('ayuda');
  await tocar('Explicar y enseñar');
} else {
  await tocar('Servicios o consultoría');
}
await espera(900);
await capturar('idea-vacia');
await pagina.locator('[aria-label="Sugerencias de idea"] button').first().click();
await espera(300);
await capturar('idea-llena');
await tocar('Esta es mi idea');
await espera(900);
await capturar('momento');
await tocar('En la noche');
await espera(1500);
await capturar('etiqueta');
await tocar('Hacer mi primera misión');
await espera(900);
await capturar('ejercicio-1');
for (let i = 0; i < 3; i++) {
  await pagina.locator('[role="group"] button[aria-pressed]').first().click();
  await espera(700);
  if (i === 0) await capturar('ejercicio-2');
}
await capturar('ejercicio-completo');
await tocar('Armar mi pieza');
await espera(2600);
await capturar('armando');
await espera(4200);
await capturar('pieza');
await tocar('Seguir armando mi empresa');
await pagina.waitForURL('**/paywall**');
await espera(1800);
await capturar('planes');
await pagina.getByRole('radio', { name: /Mensual/ }).click();
await espera(500);
await capturar('planes-mensual');
await tocar('Seguir mi ruta: 7 días gratis');
await espera(600);
await capturar('planes-vista-previa');

console.log(JSON.stringify({ medidas, errores }, null, 1));
await navegador.close();
