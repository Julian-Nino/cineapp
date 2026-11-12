// =============================================
// DATOS MOCK - Semilla mientras el backend finaliza
// =============================================

export const mockGeneros = [
  { id: 1, nombre: 'Acción', descripcion: 'Películas y series con mucha adrenalina y efectos.', estado: 'Activo' },
  { id: 2, nombre: 'Drama', descripcion: 'Contenido con narrativa emocional y personajes complejos.', estado: 'Activo' },
  { id: 3, nombre: 'Comedia', descripcion: 'Contenido humorístico y entretenido.', estado: 'Activo' },
  { id: 4, nombre: 'Terror', descripcion: 'Películas y series de suspenso y miedo.', estado: 'Activo' },
  { id: 5, nombre: 'Ciencia Ficción', descripcion: 'Universos futuristas y tecnología avanzada.', estado: 'Activo' },
  { id: 6, nombre: 'Animación', descripcion: 'Producción animada para toda la familia.', estado: 'Inactivo' },
];

export const mockDirectores = [
  { id: 1, nombres: 'Christopher Nolan', estado: 'Activo' },
  { id: 2, nombres: 'Martin Scorsese', estado: 'Activo' },
  { id: 3, nombres: 'Steven Spielberg', estado: 'Activo' },
  { id: 4, nombres: 'Quentin Tarantino', estado: 'Activo' },
  { id: 5, nombres: 'James Cameron', estado: 'Inactivo' },
];

export const mockProductoras = [
  { id: 1, nombre: 'Warner Bros.', slogan: 'The World of Entertainment', descripcion: 'Empresa multinacional de entretenimiento fundada en 1923.', estado: 'Activo' },
  { id: 2, nombre: 'Universal Pictures', slogan: 'See the World', descripcion: 'Estudio de cine más antiguo de los EE.UU.', estado: 'Activo' },
  { id: 3, nombre: 'Marvel Studios', slogan: 'A Universe Begins', descripcion: 'Productora especializada en superhéroes del universo Marvel.', estado: 'Activo' },
  { id: 4, nombre: 'Netflix Originals', slogan: 'Watch Anywhere', descripcion: 'División de contenido original de Netflix.', estado: 'Activo' },
  { id: 5, nombre: 'Columbia Pictures', slogan: 'Torch Bearer', descripcion: 'Subsidiaria de Sony Pictures Entertainment.', estado: 'Inactivo' },
];

export const mockTipos = [
  { id: 1, nombre: 'Película', descripcion: 'Contenido audiovisual de larga duración, típicamente entre 1.5 y 3 horas.' },
  { id: 2, nombre: 'Serie', descripcion: 'Contenido dividido en episodios y temporadas.' },
  { id: 3, nombre: 'Documental', descripcion: 'Contenido informativo y real sobre temas específicos.' },
  { id: 4, nombre: 'Corto', descripcion: 'Producción audiovisual de duración inferior a 40 minutos.' },
];

export const mockMedia = [
  {
    id: 1, serial: 'PEL001', titulo: 'Inception', sinopsis: 'Un ladrón que roba secretos corporativos ingresando a los sueños de las personas.',
    urlContenido: 'https://example.com/inception', urlPortada: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
    anioEstreno: 2010, genero: { id: 1, nombre: 'Acción' }, director: { id: 1, nombres: 'Christopher Nolan' },
    productora: { id: 1, nombre: 'Warner Bros.' }, tipo: { id: 1, nombre: 'Película' }
  },
  {
    id: 2, serial: 'SER001', titulo: 'Breaking Bad', sinopsis: 'Un profesor de química con cáncer se convierte en fabricante de metanfetaminas.',
    urlContenido: 'https://example.com/breakingbad', urlPortada: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
    anioEstreno: 2008, genero: { id: 2, nombre: 'Drama' }, director: { id: 2, nombres: 'Martin Scorsese' },
    productora: { id: 4, nombre: 'Netflix Originals' }, tipo: { id: 2, nombre: 'Serie' }
  },
  {
    id: 3, serial: 'PEL002', titulo: 'Interstellar', sinopsis: 'Exploración espacial para salvar a la humanidad de la extinción.',
    urlContenido: 'https://example.com/interstellar', urlPortada: '',
    anioEstreno: 2014, genero: { id: 5, nombre: 'Ciencia Ficción' }, director: { id: 1, nombres: 'Christopher Nolan' },
    productora: { id: 1, nombre: 'Warner Bros.' }, tipo: { id: 1, nombre: 'Película' }
  },
  {
    id: 4, serial: 'SER002', titulo: 'Stranger Things', sinopsis: 'Un grupo de niños descubre fuerzas sobrenaturales en su pequeña ciudad.',
    urlContenido: 'https://example.com/strangerthings', urlPortada: '',
    anioEstreno: 2016, genero: { id: 4, nombre: 'Terror' }, director: { id: 3, nombres: 'Steven Spielberg' },
    productora: { id: 4, nombre: 'Netflix Originals' }, tipo: { id: 2, nombre: 'Serie' }
  },
  {
    id: 5, serial: 'PEL003', titulo: 'Pulp Fiction', sinopsis: 'Narrativas entrelazadas de crimen en Los Ángeles.',
    urlContenido: 'https://example.com/pulpfiction', urlPortada: '',
    anioEstreno: 1994, genero: { id: 2, nombre: 'Drama' }, director: { id: 4, nombres: 'Quentin Tarantino' },
    productora: { id: 2, nombre: 'Universal Pictures' }, tipo: { id: 1, nombre: 'Película' }
  },
];

// Utility para simular latencia de API
export const delay = (ms = 400) => new Promise(r => setTimeout(r, ms));

// Estado mutable en memoria durante la sesión
let _generos = [...mockGeneros];
let _directores = [...mockDirectores];
let _productoras = [...mockProductoras];
let _tipos = [...mockTipos];
let _media = [...mockMedia];
let _nextId = { generos: 10, directores: 10, productoras: 10, tipos: 10, media: 10 };

export const mockDB = {
  generos: {
    getAll: async () => { await delay(); return [..._generos]; },
    create: async (data) => { await delay(); const item = { id: _nextId.generos++, ...data }; _generos.push(item); return item; },
    update: async (id, data) => { await delay(); _generos = _generos.map(g => g.id === id ? { ...g, ...data } : g); return _generos.find(g => g.id === id); },
    delete: async (id) => { await delay(); _generos = _generos.filter(g => g.id !== id); return { ok: true }; },
  },
  directores: {
    getAll: async () => { await delay(); return [..._directores]; },
    create: async (data) => { await delay(); const item = { id: _nextId.directores++, ...data }; _directores.push(item); return item; },
    update: async (id, data) => { await delay(); _directores = _directores.map(d => d.id === id ? { ...d, ...data } : d); return _directores.find(d => d.id === id); },
    delete: async (id) => { await delay(); _directores = _directores.filter(d => d.id !== id); return { ok: true }; },
  },
  productoras: {
    getAll: async () => { await delay(); return [..._productoras]; },
    create: async (data) => { await delay(); const item = { id: _nextId.productoras++, ...data }; _productoras.push(item); return item; },
    update: async (id, data) => { await delay(); _productoras = _productoras.map(p => p.id === id ? { ...p, ...data } : p); return _productoras.find(p => p.id === id); },
    delete: async (id) => { await delay(); _productoras = _productoras.filter(p => p.id !== id); return { ok: true }; },
  },
  tipos: {
    getAll: async () => { await delay(); return [..._tipos]; },
    create: async (data) => { await delay(); const item = { id: _nextId.tipos++, ...data }; _tipos.push(item); return item; },
    update: async (id, data) => { await delay(); _tipos = _tipos.map(t => t.id === id ? { ...t, ...data } : t); return _tipos.find(t => t.id === id); },
    delete: async (id) => { await delay(); _tipos = _tipos.filter(t => t.id !== id); return { ok: true }; },
  },
  media: {
    getAll: async () => { await delay(); return [..._media]; },
    create: async (data) => { await delay(); const item = { id: _nextId.media++, ...data }; _media.push(item); return item; },
    update: async (id, data) => { await delay(); _media = _media.map(m => m.id === id ? { ...m, ...data } : m); return _media.find(m => m.id === id); },
    delete: async (id) => { await delay(); _media = _media.filter(m => m.id !== id); return { ok: true }; },
  },
};

