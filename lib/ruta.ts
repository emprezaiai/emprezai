// La ruta de 30 días (Método Pieza a Pieza). Contenido estático versionado en el código (decisión
// técnica de ESTADO.md). Las 4 semanas salen de los sprints del documento de la dueña:
// idea y validación → marca y mensaje → tu producto → ventas y lanzamiento.
// Cada día entrega UNA pieza que se guarda en Mi Empresa y que las misiones siguientes reutilizan.

export interface Semana {
  numero: 1 | 2 | 3 | 4;
  tema: string;
  meta: string;
}

export interface DiaRuta {
  dia: number;
  semana: Semana['numero'];
  /** Nombre corto de la pieza (Mi Empresa, nodos de la ruta). */
  pieza: string;
  /** La misión en una línea, como se ve en Hoy. */
  mision: string;
  /** Qué piezas anteriores usa (el "Método Pieza a Pieza" hecho visible). */
  usa: number[];
  /** Cierre de semana: resumen + celebración. */
  cierre?: boolean;
}

export const SEMANAS: Semana[] = [
  { numero: 1, tema: 'Tu idea, validada', meta: 'Saber a quién le vendes, qué y a qué precio' },
  { numero: 2, tema: 'Tu marca y tu mensaje', meta: 'Que te entiendan y te recuerden en una frase' },
  { numero: 3, tema: 'Tu producto', meta: 'Tener armado lo que vas a entregar' },
  { numero: 4, tema: 'Ventas y lanzamiento', meta: 'Salir a vender con un plan de 7 días' },
];

export const RUTA: DiaRuta[] = [
  { dia: 1, semana: 1, pieza: 'Tu frase de negocio', mision: 'Arma tu frase de negocio', usa: [] },
  { dia: 2, semana: 1, pieza: 'Tu cliente ideal', mision: 'Dibuja a tu cliente ideal', usa: [1] },
  { dia: 3, semana: 1, pieza: 'Tu oferta', mision: 'Define tu oferta en una frase', usa: [1, 2] },
  { dia: 4, semana: 1, pieza: 'Tu precio', mision: 'Pon el precio de lanzamiento', usa: [2, 3] },
  { dia: 5, semana: 1, pieza: 'Tu competencia', mision: 'Mira a 3 competidores y encuentra tu hueco', usa: [3, 4] },
  { dia: 6, semana: 1, pieza: 'Tus preguntas de validación', mision: 'Prepara 3 preguntas para validar con personas reales', usa: [2, 3] },
  { dia: 7, semana: 1, pieza: 'Tu idea en 1 página', mision: 'Cierra la semana: tu idea en una página', usa: [1, 2, 3, 4, 5, 6], cierre: true },
  { dia: 8, semana: 2, pieza: 'El nombre de tu negocio', mision: 'Crea el nombre de tu negocio', usa: [2, 3] },
  { dia: 9, semana: 2, pieza: 'Tu mensaje principal', mision: 'Escribe la frase que vende', usa: [1, 8] },
  { dia: 10, semana: 2, pieza: 'Tu historia', mision: 'Cuenta por qué empezaste', usa: [2, 8] },
  { dia: 11, semana: 2, pieza: 'Tus 3 beneficios', mision: 'Elige tus 3 beneficios clave', usa: [2, 3] },
  { dia: 12, semana: 2, pieza: 'Tus respuestas a objeciones', mision: 'Responde las 3 dudas que frenan la compra', usa: [2, 4] },
  { dia: 13, semana: 2, pieza: 'Tu bio para redes', mision: 'Escribe tu bio para Instagram y TikTok', usa: [8, 9] },
  { dia: 14, semana: 2, pieza: 'Tu kit de marca', mision: 'Cierra la semana: tu kit de marca', usa: [8, 9, 10, 11, 12, 13], cierre: true },
  { dia: 15, semana: 3, pieza: 'La estructura de tu producto', mision: 'Arma la estructura de lo que entregas', usa: [3, 11] },
  { dia: 16, semana: 3, pieza: 'Tu primer entregable', mision: 'Crea la primera parte de tu producto', usa: [15] },
  { dia: 17, semana: 3, pieza: 'Tu método con nombre', mision: 'Bautiza tu método', usa: [8, 15] },
  { dia: 18, semana: 3, pieza: 'Tu bono de lanzamiento', mision: 'Diseña un bono que acelere la compra', usa: [3, 12] },
  { dia: 19, semana: 3, pieza: 'Tu garantía', mision: 'Escribe una garantía que quite el miedo', usa: [4, 12] },
  { dia: 20, semana: 3, pieza: 'Tu página de venta', mision: 'Ordena tu página de venta', usa: [9, 11, 18, 19] },
  { dia: 21, semana: 3, pieza: 'Tu producto listo', mision: 'Cierra la semana: tu producto listo', usa: [15, 16, 17, 18, 19, 20], cierre: true },
  { dia: 22, semana: 4, pieza: 'Tu plan de contenido', mision: 'Saca 7 ideas de contenido', usa: [2, 9] },
  { dia: 23, semana: 4, pieza: 'Tu primer guion de video', mision: 'Escribe tu primer guion de 30 segundos', usa: [9, 22] },
  { dia: 24, semana: 4, pieza: 'Tu mensaje de venta', mision: 'Escribe el mensaje para WhatsApp y DM', usa: [3, 12] },
  { dia: 25, semana: 4, pieza: 'Tu correo de lanzamiento', mision: 'Escribe tu correo de lanzamiento', usa: [9, 18] },
  { dia: 26, semana: 4, pieza: 'Tu respuesta a "está caro"', mision: 'Prepara tu respuesta a "está caro"', usa: [4, 12] },
  { dia: 27, semana: 4, pieza: 'Tu primer anuncio', mision: 'Escribe tu primer anuncio', usa: [2, 9] },
  { dia: 28, semana: 4, pieza: 'Tu plan de 7 días', mision: 'Arma tu plan de lanzamiento de 7 días', usa: [22, 24, 25] },
  { dia: 29, semana: 4, pieza: 'Tus números', mision: 'Define cómo sabrás si funciona', usa: [4, 28] },
  { dia: 30, semana: 4, pieza: 'Tu negocio, listo para vender', mision: 'Cierra la ruta: tu negocio completo', usa: [], cierre: true },
];

export const TOTAL_DIAS = RUTA.length;

export function diaRuta(dia: number): DiaRuta {
  return RUTA[Math.min(Math.max(dia, 1), TOTAL_DIAS) - 1];
}

export function semanaDe(dia: number): Semana {
  return SEMANAS[diaRuta(dia).semana - 1];
}
