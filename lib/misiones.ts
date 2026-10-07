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
  /** Un ejemplo resuelto (Ana, tortas por encargo) para orientarse sin copiar. */
  ejemplo: string;
  dia: number;
  pregunta: string;
  acento: string;
  consejo: string;
  plantilla: string;
}

export const GUIAS_BORRADOR: GuiaBorrador[] = [
  { dia: 5, pregunta: '¿Quién más vende algo parecido?', acento: 'algo parecido', consejo: 'Busca 3 en Google o Instagram y anota en qué eres distinto.', plantilla: 'Los demás ___. Yo, en cambio, ___.', ejemplo: 'Las pastelerías del barrio venden tortas de vitrina. Yo hago tortas a pedido, con el diseño que el cliente elige y entrega a domicilio.' },
  { dia: 6, pregunta: '¿Qué le preguntarías a un posible cliente?', acento: 'posible cliente', consejo: 'Pregunta por lo que hace hoy, no por lo que haría.', plantilla: '1) ¿Cómo resuelves hoy ___? 2) ¿Qué es lo más difícil de eso? 3) ¿Pagarías por ___?', ejemplo: '1) ¿Cómo consigues hoy la torta para un cumpleaños? 2) ¿Qué es lo más difícil de eso? 3) ¿Pagarías por una torta a tu gusto, entregada en casa?' },
  { dia: 8, pregunta: '¿Cómo se va a llamar tu negocio?', acento: 'llamar', consejo: 'Corto, fácil de decir y que suene a lo que resuelves.', plantilla: 'Nombre: ___. Lo elegí porque ___.', ejemplo: 'Nombre: Dulce Encargo. Lo elegí porque dice lo que hago y es fácil de recordar.' },
  { dia: 9, pregunta: '¿Qué frase hace que tu cliente diga «es para mí»?', acento: '«es para mí»', consejo: 'Nombra a quién ayudas y el resultado, en una línea.', plantilla: 'Para ___ que quieren ___: ___.', ejemplo: 'Para mamás ocupadas que quieren un cumpleaños especial: tortas a tu gusto, entregadas en tu puerta.' },
  { dia: 10, pregunta: '¿Por qué empezaste esto?', acento: 'empezaste', consejo: 'Una historia corta y real conecta más que un currículum.', plantilla: 'Empecé porque ___. Hoy ayudo a ___ para que ___.', ejemplo: 'Empecé porque en el cumpleaños de mi hija no encontré la torta que soñaba. Hoy ayudo a otras mamás para que su fiesta tenga esa torta.' },
  { dia: 11, pregunta: '¿Qué 3 cosas gana tu cliente?', acento: '3 cosas', consejo: 'Resultados que se sienten, no características.', plantilla: '1) ___ 2) ___ 3) ___', ejemplo: '1) Una torta igual a la que imaginó 2) Cero estrés el día de la fiesta 3) Fotos que todos comentan' },
  { dia: 12, pregunta: '¿Qué dudas frenan la compra?', acento: 'frenan la compra', consejo: 'Escribe cada duda tal como la diría tu cliente y tu respuesta.', plantilla: '«___» → ___. «___» → ___. «___» → ___.', ejemplo: '«¿Y si no llega a tiempo?» → Entrego 2 horas antes. «¿Es caro?» → Cuesta como una de vitrina. «¿Y si no me gusta?» → Te muestro el boceto antes.' },
  { dia: 13, pregunta: '¿Qué dice tu bio para redes?', acento: 'tu bio', consejo: 'En 150 caracteres: a quién ayudas, a qué y cómo contactarte.', plantilla: 'Ayudo a ___ a ___ · ___ · Escríbeme por DM', ejemplo: 'Ayudo a mamás a tener la torta soñada · Tortas a pedido en Bogotá · Escríbeme por DM' },
  { dia: 15, pregunta: '¿En qué partes se divide lo que entregas?', acento: 'partes', consejo: 'De 3 a 5 pasos, en el orden en que tu cliente avanza.', plantilla: 'Parte 1: ___ · Parte 2: ___ · Parte 3: ___', ejemplo: 'Parte 1: elegir el diseño · Parte 2: boceto y aprobación · Parte 3: entrega y fotos' },
  { dia: 16, pregunta: '¿Cuál es la primera parte de tu producto?', acento: 'primera parte', consejo: 'Lo mínimo para que tu cliente vea un resultado.', plantilla: 'Primera parte: ___. Incluye: ___.', ejemplo: 'Primera parte: catálogo de 12 diseños. Incluye: precios por tamaño y fechas disponibles.' },
  { dia: 17, pregunta: '¿Cómo se llama tu forma de hacerlo?', acento: 'se llama', consejo: 'Un nombre propio hace que tu método se recuerde.', plantilla: 'El Método ___: ___ pasos para ___.', ejemplo: 'El Método Torta Soñada: 3 pasos para una fiesta sin estrés.' },
  { dia: 18, pregunta: '¿Qué regalo acelera la compra?', acento: 'acelera la compra', consejo: 'Algo útil que cueste poco entregar y valga mucho.', plantilla: 'Si compras hoy, te llevas ___ (vale $___).', ejemplo: 'Si compras hoy, te llevas 12 cupcakes a juego (vale $15).' },
  { dia: 19, pregunta: '¿Qué garantía quita el miedo a comprar?', acento: 'quita el miedo', consejo: 'Que sea simple y que la puedas cumplir.', plantilla: 'Si en ___ días ___, te devuelvo tu dinero.', ejemplo: 'Si en 7 días el boceto no te convence, te devuelvo tu dinero.' },
  { dia: 20, pregunta: '¿Cómo se ordena tu página de venta?', acento: 'página de venta', consejo: 'Titular, problema, solución, oferta y garantía.', plantilla: 'Titular: ___ · Problema: ___ · Solución: ___ · Oferta: ___ · Garantía: ___', ejemplo: 'Titular: La torta que imaginas, en tu puerta · Problema: sin tiempo ni opciones · Solución: tortas a pedido · Oferta: torta + cupcakes · Garantía: boceto aprobado o te devuelvo' },
  { dia: 22, pregunta: '¿Qué vas a publicar esta semana?', acento: 'publicar', consejo: 'Ideas que respondan dudas reales de tu cliente.', plantilla: '1) ___ 2) ___ 3) ___ 4) ___ 5) ___ 6) ___ 7) ___', ejemplo: '1) Antes y después de un diseño 2) 3 errores al pedir una torta 3) Mi historia 4) Opinión de una clienta 5) Cómo hago el boceto 6) Preguntas frecuentes 7) Fechas libres del mes' },
  { dia: 23, pregunta: '¿Qué dice tu video de 30 segundos?', acento: '30 segundos', consejo: 'Gancho en los 3 primeros segundos; cierra con qué hacer.', plantilla: 'Gancho: ___ · Problema: ___ · Solución: ___ · Qué hacer: ___', ejemplo: 'Gancho: «¿Otra vez la torta de vitrina?» · Problema: sin tiempo para buscar · Solución: la diseño contigo · Qué hacer: escríbeme por DM' },
  { dia: 24, pregunta: '¿Qué mensaje mandas por WhatsApp o DM?', acento: 'WhatsApp o DM', consejo: 'Corto, personal y con una pregunta al final.', plantilla: 'Hola ___, vi que ___. Te cuento que ___. ¿Te interesa que te explique?', ejemplo: 'Hola Laura, vi que se acerca el cumpleaños de tu hijo. Te cuento que hago tortas a pedido con entrega. ¿Te interesa que te explique?' },
  { dia: 25, pregunta: '¿Qué dice tu correo de lanzamiento?', acento: 'lanzamiento', consejo: 'Un asunto que dé curiosidad y un solo enlace.', plantilla: 'Asunto: ___ · ___', ejemplo: 'Asunto: La torta que tu hijo va a recordar · Abrí 10 cupos para este mes: elige tu diseño aquí.' },
  { dia: 26, pregunta: '¿Qué respondes cuando te dicen «está caro»?', acento: '«está caro»', consejo: 'Sin discutir: recuerda el resultado y la garantía.', plantilla: 'Te entiendo. Piensa que ___. Y si no te sirve, ___.', ejemplo: 'Te entiendo. Piensa que es el centro de la fiesta y te ahorra horas. Y si no te convence el boceto, te devuelvo tu dinero.' },
  { dia: 27, pregunta: '¿Qué dice tu primer anuncio?', acento: 'primer anuncio', consejo: 'Empieza con el dolor de tu cliente, no con tu nombre.', plantilla: '¿Te pasa ___? ___ te ayuda a ___. ___.', ejemplo: '¿Te pasa que nunca encuentras la torta que imaginas? Dulce Encargo te la diseña y te la lleva. Escríbeme hoy.' },
  { dia: 28, pregunta: '¿Qué haces cada día del lanzamiento?', acento: 'cada día', consejo: 'Una acción concreta por día durante 7 días.', plantilla: 'Día 1: ___ · Día 2: ___ · Día 3: ___ · Día 4: ___ · Día 5: ___ · Día 6: ___ · Día 7: ___', ejemplo: 'Día 1: anuncio en historias · Día 2: video del proceso · Día 3: DM a 10 mamás · Día 4: correo · Día 5: testimonio · Día 6: últimos cupos · Día 7: cierre' },
  { dia: 29, pregunta: '¿Cómo sabrás si funciona?', acento: 'si funciona', consejo: 'Una meta de ventas y 2 números que mires cada semana.', plantilla: 'Meta: ___ ventas en ___ días · Miro: ___ y ___', ejemplo: 'Meta: 10 ventas en 30 días · Miro: mensajes recibidos y ventas cerradas' },
];

/* Ejemplos resueltos según el rubro de la persona (productos = Ana, el de cada guía). */
const EJEMPLOS_POR_AREA: Record<'servicios' | 'cursos', { quien: string; dias: Record<number, string> }> = {
  servicios: { quien: 'Sofía (redes para negocios)', dias: {
    5: 'Las agencias cobran caro y hacen de todo. Yo solo manejo el Instagram de negocios del barrio, con fotos reales del local.',
    6: '1) ¿Quién publica hoy en tu Instagram? 2) ¿Qué es lo más difícil de eso? 3) ¿Pagarías por no tener que pensar qué publicar?',
    8: 'Nombre: Vitrina Local. Lo elegí porque dice que muestro tu negocio y suena cercano.',
    9: 'Para negocios del barrio que quieren más clientes: tu Instagram al día, sin que tengas que publicar.',
    10: 'Empecé porque la panadería de mi tía tenía las mejores empanadas y nadie lo sabía. Hoy ayudo a negocios locales para que los encuentren.',
    11: '1) Clientes nuevos que llegan por Instagram 2) Una hora libre cada día 3) Un perfil del que estás orgulloso',
    12: '«No tengo tiempo» → Yo lo hago todo. «¿Funciona en mi rubro?» → Te muestro casos parecidos. «¿Y si no veo resultados?» → El primer mes es sin permanencia.',
    13: 'Ayudo a negocios locales a llenarse de clientes · Instagram sin esfuerzo · Escríbeme por DM',
    15: 'Parte 1: diagnóstico del perfil · Parte 2: plan de 12 publicaciones · Parte 3: publicar y medir',
    16: 'Primera parte: diagnóstico de tu perfil. Incluye: 5 cambios rápidos y tu nueva bio.',
    17: 'El Método Vitrina: 3 pasos para que tu barrio te encuentre.',
    18: 'Si contratas hoy, te llevas una sesión de fotos del local (vale $40).',
    19: 'Si en 30 días no crecen tus mensajes, el segundo mes es gratis.',
    20: 'Titular: Tu negocio, lleno por Instagram · Problema: sin tiempo para publicar · Solución: lo hago por ti · Oferta: plan mensual + fotos · Garantía: segundo mes gratis',
    22: '1) Antes y después de un perfil 2) 3 errores en Instagram 3) Mi historia 4) Opinión de un cliente 5) Un día publicando 6) Preguntas frecuentes 7) Cupos del mes',
    23: 'Gancho: «¿Tu Instagram está abandonado?» · Problema: sin tiempo · Solución: lo manejo por ti · Qué hacer: escríbeme por DM',
    24: 'Hola Marta, vi que tu panadería tiene fotos increíbles. Te cuento que manejo el Instagram de negocios del barrio. ¿Te interesa que te explique?',
    25: 'Asunto: Tu negocio merece que lo encuentren · Abrí 5 cupos este mes: agenda tu diagnóstico aquí.',
    26: 'Te entiendo. Piensa que con 2 clientes nuevos al mes ya se paga. Y si no crecen tus mensajes, el segundo mes es gratis.',
    27: '¿Te pasa que publicas y nadie escribe? Vitrina Local maneja tu Instagram por ti. Escríbeme hoy.',
    28: 'Día 1: anuncio en historias · Día 2: caso real · Día 3: DM a 10 negocios · Día 4: correo · Día 5: testimonio · Día 6: últimos cupos · Día 7: cierre',
    29: 'Meta: 5 clientes en 30 días · Miro: diagnósticos agendados y ventas cerradas'
  } },
  cursos: { quien: 'Diego (fotos con el celular)', dias: {
    5: 'Los cursos de fotografía piden cámara profesional. Yo enseño a hacer fotos de producto solo con el celular, en una semana.',
    6: '1) ¿Cómo haces hoy las fotos de lo que vendes? 2) ¿Qué es lo más difícil de eso? 3) ¿Pagarías por aprender a hacerlas con tu celular?',
    8: 'Nombre: Foto Fácil. Lo elegí porque promete lo que logras y se recuerda al toque.',
    9: 'Para emprendedores que venden por redes y quieren fotos que vendan: aprende con tu celular en 7 días.',
    10: 'Empecé porque mis primeras fotos de producto eran oscuras y no vendía nada. Hoy ayudo a emprendedores para que sus fotos vendan por ellos.',
    11: '1) Fotos que dan ganas de comprar 2) Ahorro en fotógrafo 3) Confianza para publicar todos los días',
    12: '«No tengo buena cámara» → Solo usas tu celular. «No tengo tiempo» → 15 minutos al día. «¿Y si no aprendo?» → 7 días de garantía.',
    13: 'Ayudo a emprendedores a vender con mejores fotos · Solo con tu celular · Escríbeme por DM',
    15: 'Parte 1: luz natural · Parte 2: fondos y composición · Parte 3: edición en el celular',
    16: 'Primera parte: luz natural. Incluye: 3 videos cortos y una guía para tu ventana.',
    17: 'El Método Ventana: 3 pasos para fotos que venden con tu celular.',
    18: 'Si compras hoy, te llevas 20 fondos listos para imprimir (vale $12).',
    19: 'Si en 7 días tus fotos no mejoran, te devuelvo tu dinero.',
    20: 'Titular: Fotos que venden, con tu celular · Problema: fotos oscuras que no venden · Solución: curso de 7 días · Oferta: curso + fondos · Garantía: 7 días',
    22: '1) Antes y después 2) 3 errores de luz 3) Mi historia 4) Opinión de un alumno 5) Fondo casero 6) Preguntas frecuentes 7) Abren inscripciones',
    23: 'Gancho: «Esta foto la hice con mi celular» · Problema: fotos que no venden · Solución: el Método Ventana · Qué hacer: escríbeme por DM',
    24: 'Hola Pedro, vi tus productos en Instagram. Te cuento que enseño a hacer fotos que venden con el celular. ¿Te interesa que te explique?',
    25: 'Asunto: La foto que vende está en tu bolsillo · Abrí inscripciones del curso: entra aquí.',
    26: 'Te entiendo. Piensa que una buena foto vende cada día que la publicas. Y si en 7 días no mejoran, te devuelvo tu dinero.',
    27: '¿Te pasa que tus productos son buenos pero tus fotos no venden? Foto Fácil te enseña con tu celular. Escríbeme hoy.',
    28: 'Día 1: anuncio en historias · Día 2: antes y después · Día 3: DM a 10 emprendedores · Día 4: correo · Día 5: testimonio · Día 6: últimas plazas · Día 7: cierre',
    29: 'Meta: 15 alumnos en 30 días · Miro: mensajes recibidos y ventas cerradas'
  } },
};

export function ejemploPara(guia: GuiaBorrador, area?: string): { quien: string; texto: string } {
  const propio = area === 'servicios' || area === 'cursos' ? EJEMPLOS_POR_AREA[area] : undefined;
  const texto = propio?.dias[guia.dia];
  return propio && texto ? { quien: propio.quien, texto } : { quien: 'Ana (tortas por encargo)', texto: guia.ejemplo };
}

export function guiaBorrador(dia: number): GuiaBorrador | undefined {
  return GUIAS_BORRADOR.find((g) => g.dia === dia);
}
