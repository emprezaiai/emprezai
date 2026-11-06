// Captura los estados de ENTRAR a 375px en docs/revisiones/entrar/: inicio con pieza 1, aviso
// "sin-acceso", correo enviado, error del servidor, sugerencia de dominio y sin conexión. El servidor de acceso se simula
// (respuestas fijas), así no se envían correos reales. Mide el desborde horizontal de cada estado.
// Uso: node scripts/captura-entrar.mjs http://localhost:3100 [ancho]
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const [base = 'http://localhost:3100', ancho = '375'] = process.argv.slice(2);
const carpeta = 'docs/revisiones/entrar';
mkdirSync(carpeta, { recursive: true });

const navegador = await chromium.launch();
const contexto = await navegador.newContext({ viewport: { width: Number(ancho), height: 812 }, deviceScaleFactor: 2 });
const pagina = await contexto.newPage();
const errores = [];
pagina.on('pageerror', (e) => errores.push(e.message));
const medidas = [];

let respuestaEnviar = { status: 200, body: { ok: true } };
await pagina.route('**/api/acceso/enviar', (r) =>
  r.fulfill({ status: respuestaEnviar.status, contentType: 'application/json', body: JSON.stringify(respuestaEnviar.body) }),
);

async function capturar(nombre) {
  await pagina.evaluate(() => document.fonts.ready);
  await pagina.waitForTimeout(700);
  const m = await pagina.evaluate(() => ({
    desborde: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    alto: document.documentElement.scrollHeight,
  }));
  medidas.push({ nombre, ...m });
  await pagina.screenshot({ path: `${carpeta}/${nombre}.png`, fullPage: m.alto > 830 });
}

// Pieza 1 hecha en este celular (como quien viene de los planes).
await pagina.goto(`${base}/login`, { waitUntil: 'load' });
await pagina.evaluate(() => {
  localStorage.clear();
  localStorage.setItem(
    'empresai_onboarding',
    JSON.stringify({
      paso: 'pieza',
      respuestas: { punto: 'idea', freno: 'blanco', area: 'servicios', areaFinal: 'servicios', idea: 'Manejo de redes sociales para negocios locales', momento: 'noche', cliente: 'negocios locales', resultado: 'ordenar sus ventas y cobros', dolor: 'contratar una agencia cara' },
      primeraPieza: { titulo: 'Tu frase de negocio', frase: 'Manejo las redes de negocios de mi barrio para que consigan clientes cada semana.', idea: 'Manejo de redes sociales para negocios locales', area: 'servicios', prueba: 'x', creadaEn: new Date().toISOString(), conIA: true },
      plan: 'anual',
    }),
  );
});
await pagina.reload({ waitUntil: 'load' });
await capturar('01-inicio');

await pagina.goto(`${base}/login?estado=sin-acceso`, { waitUntil: 'load' });
await capturar('02-sin-acceso');

await pagina.goto(`${base}/login`, { waitUntil: 'load' });
await pagina.getByLabel('Tu correo').fill('carla.mendez@gmail.com');
await pagina.getByRole('button', { name: /Enviarme mi enlace/ }).click();
await capturar('03-enviado');

respuestaEnviar = { status: 500, body: { error: 'interno' } };
await pagina.goto(`${base}/login`, { waitUntil: 'load' });
await pagina.getByLabel('Tu correo').fill('carla.mendez@gmail.com');
await pagina.getByRole('button', { name: /Enviarme mi enlace/ }).click();
await capturar('04-error-servidor');

respuestaEnviar = { status: 200, body: { ok: true } };
await pagina.goto(`${base}/login`, { waitUntil: 'load' });
await pagina.getByLabel('Tu correo').fill('carla.mendez@gmial.com');
await capturar('06-sugerencia-dominio');

respuestaEnviar = { status: 500, body: { error: 'interno' } };
await pagina.getByLabel('Tu correo').fill('carla.mendez@gmail.com');
await contexto.setOffline(true);
await pagina.getByRole('button', { name: /Enviarme mi enlace/ }).click();
await capturar('05-sin-conexion');
await contexto.setOffline(false);

console.log(JSON.stringify({ medidas, errores }, null, 1));
await navegador.close();
