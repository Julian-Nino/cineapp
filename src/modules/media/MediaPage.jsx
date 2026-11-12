import { useState, useEffect } from 'react';
import { useCrud, getItemId, normalizeList } from '../../hooks/useCrud';
import mediaService     from '../../services/mediaService';
import generoService    from '../../services/generoService';
import directorService  from '../../services/directorService';
import productoraService from '../../services/productoraService';
import tipoService      from '../../services/tipoService';
import Modal        from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Spinner      from '../../components/common/Spinner';
import { useToast } from '../../components/common/ToastProvider';
import { tw } from '../../utils/tw';

const CURRENT_YEAR = new Date().getFullYear();

const EMPTY_FORM = {
  serial: '', titulo: '', sinopsis: '',
  urlContenido: '', urlPortada: '',
  anioEstreno: CURRENT_YEAR,
  generoId: '', directorId: '', productoraId: '', tipoId: '',
};

// ─── Stat Card ───────────────────────────────────────────────────────────────
function StatCard({ icon, value, label, color }) {
  const colorMap = {
    red:    'bg-[#e50914]/15',
    blue:   'bg-blue-500/15',
    purple: 'bg-purple-500/15',
    green:  'bg-green-500/15',
    orange: 'bg-amber-500/15',
  };
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex items-center gap-4 hover:border-[#e50914]/30 transition-colors">
      <div className={`w-12 h-12 rounded-xl ${colorMap[color]} flex items-center justify-center text-2xl shrink-0`}>
        {icon}
      </div>
      <div>
        <div className="text-3xl font-extrabold leading-none">{value}</div>
        <div className="text-xs text-zinc-400 mt-1">{label}</div>
      </div>
    </div>
  );
}

// ─── Media Card ──────────────────────────────────────────────────────────────
function MediaCard({ item, onEdit, onDelete }) {
  const typeName = typeof item?.tipo === 'object' ? item?.tipo?.nombre : item?.tipo || item?.tipo_nombre || '—';
  const typeBadge =
    typeName === 'Película' ? tw.badgePelicula :
    typeName === 'Serie'    ? tw.badgeSerie    : tw.badgeTipo;

  const posterUrl = item?.portada || item?.urlPortada;
  const contentUrl = item?.url || item?.urlContenido;
  const generoName = typeof item?.genero === 'object' ? item?.genero?.nombre : item?.genero || item?.genero_nombre || '—';
  const directorName = typeof item?.director === 'object' ? item?.director?.nombres : item?.director || item?.director_nombre || '—';
  const anio = item?.anio_estreno || item?.anioEstreno || '—';

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:-translate-y-1 hover:shadow-2xl hover:border-[#e50914]/40 transition-all cursor-pointer group">
      {/* Poster */}
      <div className="aspect-[2/3] bg-zinc-800 overflow-hidden relative">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={item?.titulo || 'Poster'}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={e => { e.target.style.display = 'none'; }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-zinc-600 gap-2">
            <span className="text-5xl">🎬</span>
            <span className="text-xs tracking-wide">Sin portada</span>
          </div>
        )}

        {/* Type badge */}
        <div className="absolute top-2 left-2">
          <span className={typeBadge}>{typeName}</span>
        </div>

        {/* Action overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent pt-8 p-2.5 flex gap-1.5 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(item)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-800/90 hover:bg-zinc-700 text-white border border-zinc-700 text-xs transition-colors"
            title="Editar"
          >✏️</button>
          <button
            onClick={() => onDelete(item)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/30 text-xs transition-colors"
            title="Eliminar"
          >🗑️</button>
          {contentUrl && (
            <a
              href={contentUrl}
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#e50914]/20 hover:bg-[#e50914] text-[#e50914] hover:text-white border border-[#e50914]/30 text-xs transition-colors"
              title="Ver contenido"
            >▶️</a>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-3 pb-3.5">
        <div className="text-sm font-bold text-white truncate mb-1" title={item?.titulo}>
          {item?.titulo || 'Sin título'}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-400 truncate max-w-[110px]" title={generoName}>{generoName}</span>
          <span className="text-xs font-bold text-amber-500">{anio}</span>
        </div>
        <div className="text-xs text-zinc-500 mt-1 truncate" title={directorName}>
          🎥 {directorName}
        </div>
      </div>
    </div>
  );
}

// ─── Media Form Modal ─────────────────────────────────────────────────────────
function MediaFormModal({ mode, initialForm, generos, directores, productoras, tipos, onSubmit, onClose, saving }) {
  const [form, setForm]     = useState(initialForm);
  const [errors, setErrors] = useState({});

  const set = (field, val) => setForm(f => ({ ...f, [field]: val }));

  const validate = () => {
    const e = {};
    if (!form.serial.trim())        e.serial       = 'El serial es requerido';
    if (!form.titulo.trim())        e.titulo       = 'El título es requerido';
    if (!form.urlContenido.trim())  e.urlContenido = 'La URL del contenido es requerida';
    if (!form.urlPortada.trim())    e.urlPortada   = 'La URL de la portada es requerida';
    if (!form.tipoId)               e.tipoId       = 'Selecciona un tipo';
    if (!form.generoId)             e.generoId     = 'Selecciona un género';
    if (!form.directorId)           e.directorId   = 'Selecciona un director';
    if (!form.productoraId)         e.productoraId = 'Selecciona una productora';

    const yr = Number(form.anioEstreno);
    if (!yr || !Number.isInteger(yr) || yr < 1888 || yr > CURRENT_YEAR) {
      e.anioEstreno = `Año válido entre 1888 y ${CURRENT_YEAR}`;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (validate()) onSubmit(form);
  };

  const inp = (err) => err ? tw.inputError : tw.input;

  return (
    <Modal
      title={mode === 'create' ? '🎬 Nuevo Contenido Multimedia' : '✏️ Editar Contenido Multimedia'}
      onClose={onClose}
      size="lg"
      footer={
        <>
          <button className={tw.btnSecondary} onClick={onClose}>Cancelar</button>
          <button className={tw.btnPrimary} onClick={handleSubmit} disabled={saving}>
            {saving ? 'Guardando...' : mode === 'create' ? 'Crear Contenido' : 'Guardar Cambios'}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        {/* Serial + Año */}
        <div className={tw.formRow}>
          <div className={tw.formGroup}>
            <label className={tw.label}>Serial *</label>
            <input
              className={inp(errors.serial)}
              value={form.serial}
              onChange={e => set('serial', e.target.value)}
              placeholder="Ej: PEL001"
            />
            {errors.serial && <p className={tw.errorMsg}>⚠ {errors.serial}</p>}
          </div>
          <div className={tw.formGroup}>
            <label className={tw.label}>Año de Estreno * (1888 - {CURRENT_YEAR})</label>
            <input
              type="number"
              className={inp(errors.anioEstreno)}
              value={form.anioEstreno}
              onChange={e => set('anioEstreno', e.target.value)}
              min="1888"
              max={CURRENT_YEAR}
            />
            {errors.anioEstreno && <p className={tw.errorMsg}>⚠ {errors.anioEstreno}</p>}
          </div>
        </div>

        {/* Título */}
        <div className={tw.formGroup}>
          <label className={tw.label}>Título *</label>
          <input
            className={inp(errors.titulo)}
            value={form.titulo}
            onChange={e => set('titulo', e.target.value)}
            placeholder="Nombre de la película o serie"
          />
          {errors.titulo && <p className={tw.errorMsg}>⚠ {errors.titulo}</p>}
        </div>

        {/* Sinopsis */}
        <div className={tw.formGroup}>
          <label className={tw.label}>Sinopsis</label>
          <textarea
            className={tw.input}
            rows={3}
            value={form.sinopsis}
            onChange={e => set('sinopsis', e.target.value)}
            placeholder="Breve descripción del contenido..."
          />
        </div>

        {/* URLs */}
        <div className={tw.formRow}>
          <div className={tw.formGroup}>
            <label className={tw.label}>URL Contenido *</label>
            <input
              className={inp(errors.urlContenido)}
              value={form.urlContenido}
              onChange={e => set('urlContenido', e.target.value)}
              placeholder="https://..."
            />
            {errors.urlContenido && <p className={tw.errorMsg}>⚠ {errors.urlContenido}</p>}
          </div>
          <div className={tw.formGroup}>
            <label className={tw.label}>URL Portada *</label>
            <input
              className={inp(errors.urlPortada)}
              value={form.urlPortada}
              onChange={e => set('urlPortada', e.target.value)}
              placeholder="https://..."
            />
            {errors.urlPortada && <p className={tw.errorMsg}>⚠ {errors.urlPortada}</p>}
          </div>
        </div>

        {/* Selectores relacionales — fila 1 */}
        <div className={tw.formRow}>
          <div className={tw.formGroup}>
            <label className={tw.label}>Tipo *</label>
            <select
              className={inp(errors.tipoId)}
              value={form.tipoId}
              onChange={e => set('tipoId', e.target.value)}
            >
              <option value="">— Seleccionar Tipo —</option>
              {tipos.map(t => (
                <option key={getItemId(t)} value={getItemId(t)}>
                  {t.nombre}
                </option>
              ))}
            </select>
            {errors.tipoId && <p className={tw.errorMsg}>⚠ {errors.tipoId}</p>}
          </div>
          <div className={tw.formGroup}>
            <label className={tw.label}>
              Género * <span className="normal-case font-normal text-zinc-600">(solo activos)</span>
            </label>
            <select
              className={inp(errors.generoId)}
              value={form.generoId}
              onChange={e => set('generoId', e.target.value)}
            >
              <option value="">— Seleccionar Género —</option>
              {generos.filter(g => g.estado === 'Activo').map(g => (
                <option key={getItemId(g)} value={getItemId(g)}>
                  {g.nombre}
                </option>
              ))}
            </select>
            {errors.generoId && <p className={tw.errorMsg}>⚠ {errors.generoId}</p>}
          </div>
        </div>

        {/* Selectores relacionales — fila 2 */}
        <div className={tw.formRow}>
          <div className={tw.formGroup}>
            <label className={tw.label}>
              Director * <span className="normal-case font-normal text-zinc-600">(solo activos)</span>
            </label>
            <select
              className={inp(errors.directorId)}
              value={form.directorId}
              onChange={e => set('directorId', e.target.value)}
            >
              <option value="">— Seleccionar Director —</option>
              {directores.filter(d => d.estado === 'Activo').map(d => (
                <option key={getItemId(d)} value={getItemId(d)}>
                  {d.nombres}
                </option>
              ))}
            </select>
            {errors.directorId && <p className={tw.errorMsg}>⚠ {errors.directorId}</p>}
          </div>
          <div className={tw.formGroup}>
            <label className={tw.label}>
              Productora * <span className="normal-case font-normal text-zinc-600">(solo activas)</span>
            </label>
            <select
              className={inp(errors.productoraId)}
              value={form.productoraId}
              onChange={e => set('productoraId', e.target.value)}
            >
              <option value="">— Seleccionar Productora —</option>
              {productoras.filter(p => p.estado === 'Activo').map(p => (
                <option key={getItemId(p)} value={getItemId(p)}>
                  {p.nombre}
                </option>
              ))}
            </select>
            {errors.productoraId && <p className={tw.errorMsg}>⚠ {errors.productoraId}</p>}
          </div>
        </div>
      </form>
    </Modal>
  );
}

// ─── MediaPage ────────────────────────────────────────────────────────────────
export default function MediaPage() {
  const toast = useToast();
  const { items, loading, saving, deleting, create, update, remove } = useCrud(mediaService);

  const [generos,    setGeneros]    = useState([]);
  const [directores, setDirectores] = useState([]);
  const [productoras,setProductoras]= useState([]);
  const [tipos,      setTipos]      = useState([]);

  const [search,      setSearch]      = useState('');
  const [filterTipo,  setFilterTipo]  = useState('');
  const [filterGenero,setFilterGenero]= useState('');

  const [modal,       setModal]       = useState(null);
  const [deleteTarget,setDeleteTarget]= useState(null);

  useEffect(() => {
    generoService.getAll().then(res => setGeneros(normalizeList(res))).catch(() => {});
    directorService.getAll().then(res => setDirectores(normalizeList(res))).catch(() => {});
    productoraService.getAll().then(res => setProductoras(normalizeList(res))).catch(() => {});
    tipoService.getAll().then(res => setTipos(normalizeList(res))).catch(() => {});
  }, []);

  const safeItems = Array.isArray(items) ? items : [];

  const filtered = safeItems.filter(m => {
    const q = (search || '').toLowerCase();
    const titulo = (m?.titulo || '').toLowerCase();
    const serial = (m?.serial || '').toLowerCase();
    const matchesSearch = titulo.includes(q) || serial.includes(q);

    const tipoId = String(m?.id_tipo || m?.tipo?.id || '');
    const generoId = String(m?.id_genero || m?.genero?.id || '');

    const matchesTipo = filterTipo ? tipoId === filterTipo : true;
    const matchesGenero = filterGenero ? generoId === filterGenero : true;

    return matchesSearch && matchesTipo && matchesGenero;
  });

  // Construye exactamente el payload con los 10 campos requeridos por el backend
  const buildPayload = (form) => ({
    serial: form.serial.trim(),
    titulo: form.titulo.trim(),
    sinopsis: form.sinopsis?.trim() || null,
    url: form.urlContenido.trim(),
    portada: form.urlPortada.trim(),
    anio_estreno: Number(form.anioEstreno),
    id_genero: Number(form.generoId),
    id_director: Number(form.directorId),
    id_productora: Number(form.productoraId),
    id_tipo: Number(form.tipoId),
  });

  const getInitialForm = (item) => item ? {
    serial:       item?.serial || '',
    titulo:       item?.titulo || '',
    sinopsis:     item?.sinopsis || '',
    urlContenido: item?.url || item?.urlContenido || '',
    urlPortada:   item?.portada || item?.urlPortada || '',
    anioEstreno:  item?.anio_estreno || item?.anioEstreno || CURRENT_YEAR,
    generoId:     String(item?.id_genero || item?.genero?.id || ''),
    directorId:   String(item?.id_director || item?.director?.id || ''),
    productoraId: String(item?.id_productora || item?.productora?.id || ''),
    tipoId:       String(item?.id_tipo || item?.tipo?.id || ''),
  } : EMPTY_FORM;

  const handleSubmit = async (form) => {
    const payload = buildPayload(form);

    let result;
    if (modal.mode === 'create') {
      result = await create(payload);
    } else {
      const id = getItemId(modal.item);
      if (!id) {
        toast('No se encontró el ID del registro para actualizar', 'error');
        return;
      }
      result = await update(id, payload);
    }

    if (result.ok) {
      toast(modal.mode === 'create' ? '🎬 Contenido creado con éxito' : 'Contenido actualizado', 'success');
      setModal(null);
    } else {
      toast(result.error || 'Error al guardar el contenido', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const result = await remove(deleteTarget);
    if (result.ok) {
      toast('Contenido eliminado', 'success');
      setDeleteTarget(null);
    } else {
      toast(result.error || 'Error al eliminar', 'error');
    }
  };

  const hasFilters = search || filterTipo || filterGenero;
  const pelisCount = safeItems.filter(m => (m?.tipo?.nombre || m?.tipo) === 'Película').length;
  const seriesCount = safeItems.filter(m => (m?.tipo?.nombre || m?.tipo) === 'Serie').length;

  return (
    <>
      {/* Header */}
      <div className={tw.pageHeader}>
        <div>
          <h2 className={tw.pageTitle}>Catálogo de Media</h2>
          <p className={tw.pageSubtitle}>
            {safeItems.length} contenidos · {pelisCount} películas · {seriesCount} series
          </p>
        </div>
        <button className={tw.btnPrimary} onClick={() => setModal({ mode: 'create' })}>
          + Nuevo Contenido
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-7">
        <StatCard icon="🎬" value={safeItems.length} label="Total Contenidos" color="red" />
        <StatCard icon="🎥" value={pelisCount} label="Películas" color="blue" />
        <StatCard icon="📺" value={seriesCount} label="Series" color="purple" />
        <StatCard icon="🏷️" value={generos.filter(g => g.estado === 'Activo').length} label="Géneros Activos" color="green" />
        <StatCard icon="🏢" value={productoras.filter(p => p.estado === 'Activo').length} label="Productoras" color="orange" />
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm pointer-events-none">🔍</span>
          <input
            className="bg-zinc-900 border border-zinc-800 text-white pl-9 pr-4 py-2 rounded-lg text-sm w-72 outline-none focus:border-[#e50914] placeholder:text-zinc-500 transition"
            placeholder="Buscar por título o serial..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <select
          className="bg-zinc-900 border border-zinc-800 text-white px-3 py-2 rounded-lg text-sm outline-none focus:border-[#e50914] cursor-pointer min-w-[160px] transition"
          value={filterTipo}
          onChange={e => setFilterTipo(e.target.value)}
        >
          <option value="">Todos los Tipos</option>
          {tipos.map(t => (
            <option key={getItemId(t)} value={getItemId(t)}>
              {t.nombre}
            </option>
          ))}
        </select>

        <select
          className="bg-zinc-900 border border-zinc-800 text-white px-3 py-2 rounded-lg text-sm outline-none focus:border-[#e50914] cursor-pointer min-w-[160px] transition"
          value={filterGenero}
          onChange={e => setFilterGenero(e.target.value)}
        >
          <option value="">Todos los Géneros</option>
          {generos.filter(g => g.estado === 'Activo').map(g => (
            <option key={getItemId(g)} value={getItemId(g)}>
              {g.nombre}
            </option>
          ))}
        </select>

        {hasFilters && (
          <button
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 rounded-lg text-sm font-medium transition-colors"
            onClick={() => { setSearch(''); setFilterTipo(''); setFilterGenero(''); }}
          >
            ✕ Limpiar
          </button>
        )}

        <span className="ml-auto text-xs text-zinc-500">{filtered.length} resultados</span>
      </div>

      {/* Grid */}
      {loading ? <Spinner /> : filtered.length === 0 ? (
        <div className="text-center py-16 text-zinc-500">
          <div className="text-5xl mb-3">🎬</div>
          <p className="text-base">No se encontraron contenidos</p>
          {hasFilters && <p className="text-sm mt-2">Intenta ajustar los filtros de búsqueda</p>}
        </div>
      ) : (
        <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))' }}>
          {filtered.map(item => (
            <MediaCard
              key={getItemId(item) || item?.serial || Math.random()}
              item={item}
              onEdit={i => setModal({ mode: 'edit', item: i })}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      {/* Modal Form */}
      {modal && (
        <MediaFormModal
          mode={modal.mode}
          initialForm={getInitialForm(modal.item)}
          generos={generos}
          directores={directores}
          productoras={productoras}
          tipos={tipos}
          onSubmit={handleSubmit}
          onClose={() => setModal(null)}
          saving={saving}
        />
      )}

      {/* Confirm Delete */}
      {deleteTarget && (
        <ConfirmDialog
          title="Eliminar Contenido"
          message={`¿Eliminar "${deleteTarget.titulo || deleteTarget.serial || ''}"? Esta acción no se puede deshacer.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </>
  );
}
