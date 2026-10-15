// Prepara los archivos de la marca a partir de los logos originales de la dueña (2026-10-14):
// · isotipo plano (logo horizontal) → public/marca/isotipo.png, fondo negro → transparente
//   conservando el halo (se "desmezcla" del negro).
// · ícono 3D de app → app/icon.png (favicon) y app/apple-icon.png (pantalla de inicio del celular),
//   recortado al cuadro redondeado (el original trae un damero pintado alrededor).
// Uso: node scripts/preparar-marca.mjs <icono-3d.png> <logo-horizontal.png> [personaje.png]

import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const [icono3d, horizontal] = process.argv.slice(2);
if (!icono3d || !horizontal) throw new Error('Uso: node scripts/preparar-marca.mjs <icono-3d.png> <logo-horizontal.png>');
mkdirSync('public/marca', { recursive: true });

// 1) Isotipo plano con halo, fondo transparente (desmezcla del negro: a = max(r,g,b)).
{
  const { data, info } = await sharp(horizontal)
    .extract({ left: 46, top: 47, width: 198, height: 198 })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    const max = Math.max(data[i], data[i + 1], data[i + 2]);
    const a = max < 14 ? 0 : max / 255;
    if (a === 0) {
      data[i + 3] = 0;
      continue;
    }
    data[i] = Math.min(255, Math.round(data[i] / a));
    data[i + 1] = Math.min(255, Math.round(data[i + 1] / a));
    data[i + 2] = Math.min(255, Math.round(data[i + 2] / a));
    data[i + 3] = Math.round(a * 255);
  }
  await sharp(data, { raw: info }).png().toFile('public/marca/isotipo.png');
}

// 2) Ícono 3D recortado al cuadro redondeado.
{
  const lado = 392;
  const recorte = await sharp(icono3d).extract({ left: 64, top: 52, width: lado, height: lado }).png().toBuffer();
  const radio = Math.round(lado * 0.2);
  const mascara = Buffer.from(`<svg width="${lado}" height="${lado}"><rect x="4" y="2" width="${lado - 8}" height="${lado - 6}" rx="${radio}" ry="${radio}" fill="#fff"/></svg>`);
  const redondeado = await sharp(recorte).composite([{ input: mascara, blend: 'dest-in' }]).png().toBuffer();
  await sharp(redondeado).resize(512, 512).png().toFile('public/marca/icono-app.png');
  await sharp(redondeado).resize(64, 64).png().toFile('app/icon.png');
  // Pantalla de inicio (iOS recorta las esquinas solo): cuadro lleno con el color del cuerpo del ícono.
  await sharp({ create: { width: 180, height: 180, channels: 4, background: '#2b3237' } })
    .composite([{ input: await sharp(redondeado).resize(180, 180).png().toBuffer() }])
    .png()
    .toFile('app/apple-icon.png');
}
// 3) Personaje (opcional, 3er argumento): recorte del guepardo con un desvanecido radial en los
//    bordes, para que su fondo oscuro se funda con la tarjeta (el original no trae transparencia).
const personaje = process.argv[4];
if (personaje) {
  const W = 262;
  const H = 330;
  const { data, info } = await sharp(personaje).extract({ left: 0, top: 52, width: W, height: H }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  // alpha = máx(desvanecido radial, brillo): el fondo oscuro se va hacia los bordes, pero el pelaje,
  // el brillo y las estelas (claros) se conservan aunque toquen el borde.
  const suave = (x, a, b) => Math.min(1, Math.max(0, (x - a) / (b - a)));
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      const dx = (x - W * 0.52) / (W * 0.5);
      const dy = (y - H * 0.5) / (H * 0.5);
      const radial = 1 - suave(Math.sqrt(dx * dx + dy * dy), 0.55, 1.0);
      const lum = 0.3 * data[i] + 0.59 * data[i + 1] + 0.11 * data[i + 2];
      const brillo = suave(lum, 38, 95);
      // ningún borde duro: todo se desvanece en los últimos 18 px del recorte
      const borde = suave(Math.min(x, y, W - 1 - x, H - 1 - y), 0, 18);
      data[i + 3] = Math.round(255 * borde * Math.max(radial, brillo * suave(1.15 - Math.sqrt(dx * dx + dy * dy), 0, 0.25)));
    }
  }
  await sharp(data, { raw: info }).png().toFile('public/marca/personaje.png');
}
console.log('marca lista');
