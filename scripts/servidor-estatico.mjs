// Servidor estático mínimo para revisar maquetas HTML en el navegador (solo desarrollo local).
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const raiz = process.cwd();
const puerto = Number(process.env.PORT || 5500);
const tipos = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.json': 'application/json' };

http.createServer(async (req, res) => {
  const ruta = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^[\\/]+/, '');
  const archivo = join(raiz, ruta || 'index.html');
  if (!archivo.startsWith(raiz)) { res.writeHead(403).end(); return; }
  try {
    const cuerpo = await readFile(archivo);
    res.writeHead(200, { 'Content-Type': tipos[extname(archivo)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(cuerpo);
  } catch { res.writeHead(404).end('No encontrado'); }
}).listen(puerto, '127.0.0.1', () => console.log(`Sirviendo ${raiz} en http://localhost:${puerto}`));
