// Recorre ENTRAR + la app por dentro a 375px (o el ancho dado) y captura cada pantalla en
// docs/revisiones/app/. Tres caminos: (A) cuenta nueva el día 1 (pieza 1 hecha hoy),
// (B) día 2 con la misión guiada completa, (C) datos de ejemplo de Carlos en el día 8.
// Uso: node scripts/captura-app.mjs http://localhost:3100 [ancho]
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const [base = 'http://localhost:3100', ancho = '375'] = process.argv.slice(2);
const carpeta = `docs/revisiones/app${ancho === '375' ? '' : `-${ancho}`}`;
mkdirSync(carpeta, { recursive: true });

const navegador = await chromium.launch();
const contexto = await navegador.newContext({ viewport: { width: Number(ancho), height: 812 }, deviceScaleFactor: 2 });
const pagina = await contexto.newPage();
const errores = [];
pagina.on('pageerror', (e) => errores.push(e.message));
pagina.on('console', (m) => m.type() === 'error' && errores.push(m.text()));
const espera = (ms) => pagina.waitForTimeout(ms);
const medidas = [];

async function capturar(nombre) {
  await pagina.evaluate(() => document.fonts.ready);
  const m = await pagina.evaluate(() => ({
    desborde: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    alto: document.documentElement.scrollHeight,
  }));
  medidas.push({ nombre, ...m });
  if (m.alto <= 830) {
    await pagina.screenshot({ path: `${carpeta}/${nombre}.png` });
    return;
  }
  await pagina.screenshot({ path: `${carpeta}/${nombre}-arriba.png` });
  await pagina.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await espera(500);
  await pagina.screenshot({ path: `${carpeta}/${nombre}-final.png` });
  await pagina.evaluate(() => window.scrollTo(0, 0));
  await espera(200);
}

const ir = async (ruta, ms = 1400) => {
  await pagina.goto(`${base}${ruta}`, { waitUntil: 'load' });
  await espera(ms);
};

// ── Camino A: viene del recorrido con su pieza 1 y entra por primera vez ──
await ir('/login?qa=1', 300);
await pagina.evaluate(() => {
  localStorage.clear();
  sessionStorage.clear();
  const ahora = new Date().toISOString();
  localStorage.setItem(
    'empresai_onboarding',
    JSON.stringify({
      v: 1,
      paso: 'pieza',
      plan: 'anual',
      respuestas: {
        punto: 'oferta', freno: 'blanco', area: 'servicios', areaFinal: 'servicios',
        idea: 'Manejo de redes sociales para negocios locales', momento: 'noche',
        cliente: 'dueños de pequeños negocios', resultado: 'conseguir clientes por redes', dolor: 'contratar una agencia cara',
      },
      primeraPieza: {
        titulo: 'Tu frase de negocio',
        frase: 'Manejo de redes sociales para negocios locales: ayudo a dueños de pequeños negocios a conseguir clientes por redes sin contratar una agencia cara.',
        idea: 'Manejo de redes sociales para negocios locales', area: 'servicios',
        prueba: 'Lee tu frase en voz alta a 3 personas que encajen con «dueños de pequeños negocios» y anota qué te responden.',
        creadaEn: ahora,
      },
    }),
  );
});
await ir('/login', 900);
await capturar('01-entrar');
await pagina.getByRole('button', { name: /Enviarme mi enlace/ }).click();
await espera(400);
await capturar('02-entrar-error');
await pagina.getByLabel('Tu correo').fill('carlos.ruiz@gmail.com');
await pagina.getByRole('button', { name: /Enviarme mi enlace/ }).click();
await espera(1300);
await capturar('03-entrar-revisa-correo');
await pagina.getByRole('button', { name: /Entrar en modo demostración/ }).click();
await pagina.waitForURL('**/app');
await espera(1600);
await capturar('04-hoy-dia1-hecho');
await ir('/app/ruta', 1600);
await capturar('05-ruta-dia1');
await ir('/app/empresa', 1400);
await capturar('06-empresa-dia1');
await ir('/app/mision', 1000);
await capturar('07-mision-ya-hecha');
await ir('/app/perfil', 1000);
await capturar('08-perfil');

// ── Camino B: al día siguiente (la pieza 1 pasa a "ayer") hace la misión 2 ──
await pagina.evaluate(() => {
  const c = JSON.parse(localStorage.getItem('empresai_cuenta'));
  const ayer = new Date();
  ayer.setDate(ayer.getDate() - 1);
  const f = `${ayer.getFullYear()}-${String(ayer.getMonth() + 1).padStart(2, '0')}-${String(ayer.getDate()).padStart(2, '0')}`;
  c.piezas = c.piezas.map((p) => ({ ...p, fecha: f }));
  localStorage.setItem('empresai_cuenta', JSON.stringify(c));
});
await ir('/app', 1600);
await capturar('09-hoy-dia2-pendiente');
await pagina.getByRole('link', { name: /Empezar la misión de hoy/ }).click();
await pagina.waitForURL('**/app/mision');
await espera(1000);
await capturar('10-mision2-pregunta1');
await pagina.getByRole('radio', { name: 'De 30 a 45 años' }).click();
await espera(900);
await capturar('11-mision2-pregunta2');
await pagina.getByRole('radio').first().click();
await espera(900);
await pagina.getByRole('checkbox', { name: 'Instagram' }).click();
await pagina.getByRole('checkbox', { name: 'WhatsApp' }).click();
await espera(300);
await capturar('12-mision2-pregunta3');
await pagina.getByRole('button', { name: /^Continuar/ }).click();
await espera(700);
await capturar('13-mision2-armando');
await espera(1800);
await capturar('14-mision2-resultado');
await pagina.getByRole('button', { name: /Guardar en Mi Empresa/ }).click();
await espera(2600);
await capturar('15-mision2-celebracion');
await ir('/app', 1600);
await capturar('16-hoy-dia2-hecho');

// Racha rota (vuelve 3 días después) y cuenta sin piezas: estados que solo existían en el código
await pagina.evaluate(() => {
  const c = JSON.parse(localStorage.getItem('empresai_cuenta'));
  const hace = (n) => {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };
  c.piezas = c.piezas.map((p, i) => ({ ...p, fecha: hace(4 - i) }));
  localStorage.setItem('empresai_cuenta', JSON.stringify(c));
});
await ir('/app', 1600);
await capturar('16b-hoy-racha-rota');
await pagina.evaluate(() => {
  const c = JSON.parse(localStorage.getItem('empresai_cuenta'));
  c.piezas = [];
  localStorage.setItem('empresai_cuenta', JSON.stringify(c));
  localStorage.removeItem('empresai_onboarding');
});
await ir('/app', 1600);
await capturar('16c-hoy-sin-piezas');

// ── Camino C: datos de ejemplo (Carlos, día 8) ──
await pagina.evaluate(() => {
  localStorage.clear();
  sessionStorage.clear();
});
await ir('/app?demo=carlos', 1800);
await capturar('17-hoy-demo-dia8');
// Retomar: con un borrador a medias, el botón dice 'Seguir donde lo dejé'
await pagina.evaluate(() => localStorage.setItem('empresai_borrador_8', 'Nombre: Excel'));
await ir('/app', 1600);
await capturar('17b-hoy-seguir-donde-lo-deje');
await pagina.evaluate(() => localStorage.removeItem('empresai_borrador_8'));
await ir('/app/ruta', 1800);
await capturar('18-ruta-demo-dia8');
await ir('/app/empresa', 1600);
await capturar('19-empresa-demo-dia8');
await pagina.getByRole('button', { name: /^COMPETENCIA|Competencia/i }).first().click().catch(() => {});
await espera(600);
await capturar('20-empresa-demo-detalle');
await ir('/app/mision', 1200);
await capturar('21-mision-demo-dia8-borrador');
await pagina.getByRole('button', { name: /Usar plantilla/ }).click();
await espera(400);
await capturar('22-mision-demo-dia8-plantilla');
// Celebración con nombre (Carlos): guardar la pieza del día 8
await pagina.locator('textarea').first().fill('Nombre: Excel Fácil. Lo elegí porque dice lo que logras en pocas palabras.');
await pagina.getByRole('button', { name: /Guardar en Mi Empresa/ }).click();
await espera(2600);
await capturar('22c-mision-demo-celebracion');

// ── Camino D: el estado REAL antes de conectar el correo (fuera del computador de desarrollo) ──
// [::1] no está en la lista de "local" de la demo: se ve lo que vería un comprador hoy.
const baseReal = base.replace('localhost', '[::1]');
await pagina.goto(`${baseReal}/login`, { waitUntil: 'load' });
await pagina.evaluate(() => {
  localStorage.clear();
  sessionStorage.clear();
  localStorage.setItem(
    'empresai_onboarding',
    JSON.stringify({
      v: 1,
      paso: 'pieza',
      respuestas: { areaFinal: 'servicios', idea: 'Manejo de redes sociales para negocios locales', momento: 'noche' },
      primeraPieza: { titulo: 'Tu frase de negocio', frase: 'Manejo de redes sociales: ayudo a negocios locales a conseguir clientes por redes.', idea: 'Manejo de redes', area: 'servicios', prueba: '—', creadaEn: new Date().toISOString() },
    }),
  );
});
await pagina.goto(`${baseReal}/login`, { waitUntil: 'load' });
await espera(1500);
await capturar('22b-entrar-real-inicio');
await pagina.getByLabel('Tu correo').fill('carlos.ruiz@gmail.com');
await pagina.getByRole('button', { name: /Guardar mi correo de acceso|Enviarme mi enlace/ }).click();
await espera(2500);
await capturar('23-entrar-sin-servidor');
await pagina.goto(`${baseReal}/login`, { waitUntil: 'load' });
await espera(1500);
await capturar('23b-entrar-real-vuelve');

console.log(JSON.stringify({ medidas: medidas.map((m) => `${m.nombre}:${m.desborde}`), errores }, null, 1));
await navegador.close();
