// Prepara los archivos de la marca a partir de los logos originales de la dueña (2026-10-14):
// · isotipo plano (logo horizontal) → public/marca/isotipo.png, fondo negro → transparente
//   conservando el halo (se "desmezcla" del negro).
// · ícono 3D de app → app/icon.png (favicon) y app/apple-icon.png (pantalla de inicio del celular),
//   recortado al cuadro redondeado (el original trae un damero pintado alrededor).
// Uso: node scripts/preparar-marca.mjs <ruta-icono-3d.png> <ruta-logo-horizontal.png>

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
console.log('marca lista');
