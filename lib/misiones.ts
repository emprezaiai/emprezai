// Misiones guiadas (nivel intermedio-fácil, como la misión 1): 2-3 preguntas con opciones del área
// + "Otra cosa (escribe la tuya)", y la pieza se compone con las respuestas y las piezas anteriores.
// Días 2-4 funcionan ya sin IA. Del día 5 en adelante la pieza la arma la IA (Sesión 6): mientras
// tanto la misión lo dice con honestidad y no inventa un resultado.

import type { DetallePieza, PiezaGuardada } from './cuenta';
import type { IdArea, Respuestas } from './onboarding';

export interface ContextoMision {
  area: IdArea;
  respuestas: Respuestas;
  piezas: PiezaGuardada[];
}

export interface PreguntaMision {
  id: string;
  pregunta: string;
  /** Palabras de la pregunta que van en dorado (1-3, deben existir literal). */
  acento: string;
  consejo: string;
  opciones: (c: ContextoMision) => string[];
  /** Varias respuestas (se confirman con un botón). */
  multiple?: boolean;
}

export interface PiezaCompuesta {
  contenido: string;
  resumen?: string;
  detalle?: DetallePieza[];
}

export interface MisionGuiada {
  dia: number;
  preguntas: PreguntaMision[];
  componer: (resp: Record<string, string[]>, c: ContextoMision) => PiezaCompuesta;
}

const porArea = (mapa: Record<IdArea, string[]>) => (c: ContextoMision) => mapa[c.area];
const minuscula = (t: string) => (t.length > 1 && t[1] === t[1].toLowerCase() ? t[0].toLowerCase() + t.slice(1) : t);
const mayuscula = (t: string) => (t ? t[0].toUpperCase() + t.slice(1) : t);
const lista = (items: string[]) =>
  items.length <= 1 ? (items[0] ?? '') : `${items.slice(0, -1).join(', ')} y ${items[items.length - 1]}`;

export const MISIONES_GUIADAS: MisionGuiada[] = [
  {
    dia: 2,
    preguntas: [
      {
        id: 'edad',
        pregunta: '¿Qué edad tiene, más o menos?',
        acento: 'edad',
        consejo: 'No es para dejar a nadie fuera: es para saber cómo hablarle.',
        opciones: () => ['De 20 a 30 años', 'De 30 a 45 años', 'De 45 a 60 años', 'Cualquier edad'],
      },
      {
        id: 'dolor',
        pregunta: '¿Qué le quita el sueño?',
        acento: 'quita el sueño',
        consejo: 'El problema que ya le duele hoy, no uno que tú imaginas.',
        opciones: porArea({
          servicios: ['Faltan clientes nuevos', 'No tener claro cuánto se gana', 'Tareas repetidas que roban el día', 'Una imagen poco profesional'],
          cursos: ['Quedarse atrás', 'Falta de tiempo para aprender', 'Cursos pagados y sin terminar', 'No saber por dónde empezar'],
          productos: ['No encontrar algo que guste de verdad', 'Opciones caras o de mala calidad', 'Falta de tiempo para buscar', 'Querer algo especial para regalar'],
        }),
      },
      {
        id: 'redes',
        pregunta: '¿Dónde pasa su tiempo en internet?',
        acento: 'en internet',
        consejo: 'Ahí lo vas a buscar en la semana 4. Elige todas las que apliquen.',
        opciones: () => ['Instagram', 'TikTok', 'Facebook', 'WhatsApp', 'YouTube', 'LinkedIn'],
        multiple: true,
      },
    ],
    componer: (r, c) => {
      const cliente = mayuscula(c.respuestas.cliente ?? 'Tu cliente');
      const edad = r.edad[0] === 'Cualquier edad' ? '' : `, ${minuscula(r.edad[0])}`;
      return {
        resumen: `${cliente}${edad}`,
        contenido: `${cliente}${edad}. Su mayor dolor: ${minuscula(r.dolor[0])}. Su meta: ${c.respuestas.resultado ?? 'avanzar'}. Canales: ${lista(r.redes)}.`,
        detalle: [{ rotulo: 'Úsalo así', valor: 'Antes de escribir cualquier cosa para vender, léelo y pregúntate: ¿esto le habla a esta persona?' }],
      };
    },
  },
  {
    dia: 3,
    preguntas: [
      {
        id: 'formato',
        pregunta: '¿Cómo lo vas a entregar?',
        acento: 'entregar',
        consejo: 'El formato más simple que resuelva el problema. Puedes crecer después.',
        opciones: porArea({
          servicios: ['Una sesión 1 a 1', 'Un paquete mensual', 'Un servicio llave en mano', 'Una revisión rápida'],
          cursos: ['Un mini curso en video', 'Un e-book práctico', 'Un taller en vivo', 'Una mentoría en grupo'],
          productos: ['Un producto individual', 'Un kit o combo', 'Una suscripción mensual', 'Una edición limitada'],
        }),
      },
      {
        id: 'tiempo',
        pregunta: '¿En cuánto tiempo ve el resultado?',
        acento: 'el resultado',
        consejo: 'Mientras más rápido el primer resultado, más fácil decir que sí.',
        opciones: () => ['En 1 día', 'En 7 días', 'En 30 días', 'Desde la primera vez que lo usa'],
      },
      {
        id: 'incluye',
        pregunta: '¿Qué incluye para que sea fácil?',
        acento: 'fácil',
        consejo: 'Algo que le ahorre trabajo y que la competencia no dé.',
        opciones: () => ['Una plantilla lista para usar', 'Ayuda por WhatsApp', 'Una guía paso a paso', 'Una sesión de dudas'],
      },
    ],
    componer: (r, c) => ({
      resumen: `${mayuscula(minuscula(r.formato[0]))}, ${minuscula(r.tiempo[0])}`,
      contenido: `${mayuscula(minuscula(r.formato[0]))} para ${c.respuestas.cliente ?? 'tu cliente'} que quieren ${c.respuestas.resultado ?? 'avanzar'}, ${minuscula(r.tiempo[0])}. Incluye ${minuscula(r.incluye[0])}.`,
      detalle: [{ rotulo: 'Úsalo así', valor: 'Es lo que respondes cuando alguien te pregunta "¿y qué vendes?". Dilo tal cual.' }],
    }),
  },
  {
    dia: 4,
    preguntas: [
      {
        id: 'precio',
        pregunta: '¿Con qué precio arrancas?',
        acento: 'precio',
        consejo: 'Accesible para tus primeros 10 clientes; lo subes cuando tengas pruebas.',
        opciones: porArea({
          servicios: ['$29 · para conseguir tus primeros clientes', '$79 · precio medio del mercado', '$149 · servicio premium'],
          cursos: ['$9 · precio de entrada', '$19 · precio de lanzamiento', '$47 · precio completo'],
          productos: ['$15 · precio de entrada', '$29 · precio medio', '$49 · precio premium'],
        }),
      },
      {
        id: 'pago',
        pregunta: '¿Cómo te pagan?',
        acento: 'pagan',
        consejo: 'Pago único es lo más simple para empezar.',
        opciones: () => ['Pago único', 'Pago mensual', 'En 2 o 3 cuotas'],
      },
      {
        id: 'subida',
        pregunta: '¿Cuándo lo subes?',
        acento: 'lo subes',
        consejo: 'Avisar que el precio sube es una razón honesta para comprar hoy.',
        opciones: () => ['Tras los primeros 10 clientes', 'Al terminar el lanzamiento', 'En 30 días'],
      },
    ],
    componer: (r) => {
      const monto = r.precio[0].split('·')[0].trim();
      return {
        resumen: `${monto}, ${minuscula(r.pago[0])}`,
        contenido: `${monto}, ${minuscula(r.pago[0])}, como precio de lanzamiento. Lo subes ${minuscula(r.subida[0])}.`,
        detalle: [{ rotulo: 'Úsalo así', valor: 'Este precio lo usa la misión del día 5 para compararte con tu competencia.' }],
      };
    },
  },
];

export function misionGuiada(dia: number): MisionGuiada | undefined {
  return MISIONES_GUIADAS.find((m) => m.dia === dia);
}

/* ── Misiones de borrador (días 5-30, antes de la IA): una pregunta clara, un consejo y una plantilla
   para rellenar. La pieza se guarda como "versión base" y la IA la afina cuando se conecte. Los días de
   cierre de semana (7, 14, 21, 30) no preguntan: juntan las piezas de la semana en una sola. ── */

export interface GuiaBorrador {
  dia: number;
  pregunta: string;
  acento: string;
  consejo: string;
  plantilla: string;
}

export const GUIAS_BORRADOR: GuiaBorrador[] = [
  { dia: 5, pregunta: '¿Quién más vende algo parecido?', acento: 'algo parecido', consejo: 'Busca 3 en Google o Instagram y anota en qué eres distinto.', plantilla: 'Los demás ___. Yo, en cambio, ___.' },
  { dia: 6, pregunta: '¿Qué le preguntarías a un posible cliente?', acento: 'posible cliente', consejo: 'Pregunta por lo que hace hoy, no por lo que haría.', plantilla: '1) ¿Cómo resuelves hoy ___? 2) ¿Qué es lo más difícil de eso? 3) ¿Pagarías por ___?' },
  { dia: 8, pregunta: '¿Cómo se va a llamar tu negocio?', acento: 'llamar', consejo: 'Corto, fácil de decir y que suene a lo que resuelves.', plantilla: 'Nombre: ___. Lo elegí porque ___.' },
  { dia: 9, pregunta: '¿Qué frase hace que tu cliente diga «es para mí»?', acento: '«es para mí»', consejo: 'Nombra a quién ayudas y el resultado, en una línea.', plantilla: 'Para ___ que quieren ___: ___.' },
  { dia: 10, pregunta: '¿Por qué empezaste esto?', acento: 'empezaste', consejo: 'Una historia corta y real conecta más que un currículum.', plantilla: 'Empecé porque ___. Hoy ayudo a ___ para que ___.' },
  { dia: 11, pregunta: '¿Qué 3 cosas gana tu cliente?', acento: '3 cosas', consejo: 'Resultados que se sienten, no características.', plantilla: '1) ___ 2) ___ 3) ___' },
  { dia: 12, pregunta: '¿Qué dudas frenan la compra?', acento: 'frenan la compra', consejo: 'Escribe cada duda tal como la diría tu cliente y tu respuesta.', plantilla: '«___» → ___. «___» → ___. «___» → ___.' },
  { dia: 13, pregunta: '¿Qué dice tu bio para redes?', acento: 'tu bio', consejo: 'En 150 caracteres: a quién ayudas, a qué y cómo contactarte.', plantilla: 'Ayudo a ___ a ___ · ___ · Escríbeme por DM' },
  { dia: 15, pregunta: '¿En qué partes se divide lo que entregas?', acento: 'partes', consejo: 'De 3 a 5 pasos, en el orden en que tu cliente avanza.', plantilla: 'Parte 1: ___ · Parte 2: ___ · Parte 3: ___' },
  { dia: 16, pregunta: '¿Cuál es la primera parte de tu producto?', acento: 'primera parte', consejo: 'Lo mínimo para que tu cliente vea un resultado.', plantilla: 'Primera parte: ___. Incluye: ___.' },
  { dia: 17, pregunta: '¿Cómo se llama tu forma de hacerlo?', acento: 'se llama', consejo: 'Un nombre propio hace que tu método se recuerde.', plantilla: 'El Método ___: ___ pasos para ___.' },
  { dia: 18, pregunta: '¿Qué regalo acelera la compra?', acento: 'acelera la compra', consejo: 'Algo útil que cueste poco entregar y valga mucho.', plantilla: 'Si compras hoy, te llevas ___ (vale $___).' },
  { dia: 19, pregunta: '¿Qué garantía quita el miedo a comprar?', acento: 'quita el miedo', consejo: 'Que sea simple y que la puedas cumplir.', plantilla: 'Si en ___ días ___, te devuelvo tu dinero.' },
  { dia: 20, pregunta: '¿Cómo se ordena tu página de venta?', acento: 'página de venta', consejo: 'Titular, problema, solución, oferta y garantía.', plantilla: 'Titular: ___ · Problema: ___ · Solución: ___ · Oferta: ___ · Garantía: ___' },
  { dia: 22, pregunta: '¿Qué vas a publicar esta semana?', acento: 'publicar', consejo: 'Ideas que respondan dudas reales de tu cliente.', plantilla: '1) ___ 2) ___ 3) ___ 4) ___ 5) ___ 6) ___ 7) ___' },
  { dia: 23, pregunta: '¿Qué dice tu video de 30 segundos?', acento: '30 segundos', consejo: 'Gancho en los 3 primeros segundos; cierra con qué hacer.', plantilla: 'Gancho: ___ · Problema: ___ · Solución: ___ · Qué hacer: ___' },
  { dia: 24, pregunta: '¿Qué mensaje mandas por WhatsApp o DM?', acento: 'WhatsApp o DM', consejo: 'Corto, personal y con una pregunta al final.', plantilla: 'Hola ___, vi que ___. Te cuento que ___. ¿Te interesa que te explique?' },
  { dia: 25, pregunta: '¿Qué dice tu correo de lanzamiento?', acento: 'lanzamiento', consejo: 'Un asunto que dé curiosidad y un solo enlace.', plantilla: 'Asunto: ___ · ___' },
  { dia: 26, pregunta: '¿Qué respondes cuando te dicen «está caro»?', acento: '«está caro»', consejo: 'Sin discutir: recuerda el resultado y la garantía.', plantilla: 'Te entiendo. Piensa que ___. Y si no te sirve, ___.' },
  { dia: 27, pregunta: '¿Qué dice tu primer anuncio?', acento: 'primer anuncio', consejo: 'Empieza con el dolor de tu cliente, no con tu nombre.', plantilla: '¿Te pasa ___? ___ te ayuda a ___. ___.' },
  { dia: 28, pregunta: '¿Qué haces cada día del lanzamiento?', acento: 'cada día', consejo: 'Una acción concreta por día durante 7 días.', plantilla: 'Día 1: ___ · Día 2: ___ · Día 3: ___ · Día 4: ___ · Día 5: ___ · Día 6: ___ · Día 7: ___' },
  { dia: 29, pregunta: '¿Cómo sabrás si funciona?', acento: 'si funciona', consejo: 'Una meta de ventas y 2 números que mires cada semana.', plantilla: 'Meta: ___ ventas en ___ días · Miro: ___ y ___' },
];

export function guiaBorrador(dia: number): GuiaBorrador | undefined {
  return GUIAS_BORRADOR.find((g) => g.dia === dia);
}
