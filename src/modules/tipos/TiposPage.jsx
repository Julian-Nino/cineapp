import { useState } from 'react';
import { useCrud, getItemId } from '../../hooks/useCrud';
import tipoService from '../../services/tipoService';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Spinner from '../../components/common/Spinner';
import { useToast } from '../../components/common/ToastProvider';
import { tw } from '../../utils/tw';

const EMPTY = { nombre: '', descripcion: '' };

const tipoBadge = (nombre) => {
  if (nombre === 'Película')   return tw.badgePelicula;
  if (nombre === 'Serie')      return tw.badgeSerie;
  return tw.badgeTipo;
};

export default function TiposPage() {
  const toast = useToast();
  const { items, loading, saving, deleting, create, update, remove } = useCrud(tipoService);
  const [search, setSearch]           = useState('');
  const [modal, setModal]             = useState(null);
  const [form, setForm]               = useState(EMPTY);
  const [errors, setErrors]           = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);

  const safeItems = Array.isArray(items) ? items : [];

  const filtered = safeItems.filter(t =>
    (t?.nombre || '').toLowerCase().includes((search || '').toLowerCase())
  );

  const openCreate = () => { setForm(EMPTY); setErrors({}); setModal({ mode: 'create' }); };
  const openEdit   = (item) => {
    setForm({ nombre: item?.nombre || '', descripcion: item?.descripcion || '' });
    setErrors({});
    setModal({ mode: 'edit', item });
  };

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = 'El nombre es requerido';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    const result = modal.mode === 'create' ? await create(form) : await update(modal.item, form);
    if (result.ok) {
      toast(modal.mode === 'create' ? 'Tipo creado ✨' : 'Tipo actualizado', 'success');
      setModal(null);
    } else {
      toast(result.error || 'Error al guardar', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const result = await remove(deleteTarget);
    if (result.ok) {
      toast('Tipo eliminado', 'success');
      setDeleteTarget(null);
    } else {
      toast(result.error || 'Error al eliminar', 'error');
    }
  };

  return (
    <>
      <div className={tw.pageHeader}>
        <div>
          <h2 className={tw.pageTitle}>Tipos de Contenido</h2>
          <p className={tw.pageSubtitle}>Gestiona los tipos (Película, Serie, Documental…)</p>
        </div>
        <button className={tw.btnPrimary} onClick={openCreate}>+ Nuevo Tipo</button>
      </div>

      <div className={tw.tableWrapper}>
        <div className={tw.actionBar}>
          <div className={tw.searchWrap}>
            <span className={tw.searchIcon}>🔍</span>
            <input
              className={tw.searchInput}
              placeholder="Buscar tipo..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <span className="text-xs text-zinc-500">{filtered.length} registros</span>
        </div>

        {loading ? <Spinner /> : (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className={tw.th} style={{ width: 48 }}>#</th>
                <th className={tw.th}>Nombre</th>
                <th className={tw.th}>Descripción</th>
                <th className={tw.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-14 text-zinc-500">
                    <div className="text-4xl mb-2">📋</div>Sin registros
                  </td>
                </tr>
              ) : filtered.map(t => (
                <tr key={getItemId(t) || Math.random()} className={tw.trBody}>
                  <td className={`${tw.td} text-zinc-600`}>{getItemId(t) || '—'}</td>
                  <td className={tw.td}>
                    <span className={tipoBadge(t?.nombre)}>{t?.nombre || 'Sin nombre'}</span>
                  </td>
                  <td className={`${tw.td} text-zinc-400`}>{t?.descripcion || '—'}</td>
                  <td className={tw.td}>
                    <div className="flex gap-2">
                      <button className={tw.btnEdit} onClick={() => openEdit(t)}>✏️ Editar</button>
                      <button className={tw.btnDanger} onClick={() => setDeleteTarget(t)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <Modal
          title={modal.mode === 'create' ? 'Nuevo Tipo' : 'Editar Tipo'}
          onClose={() => setModal(null)}
          footer={
            <>
              <button className={tw.btnSecondary} onClick={() => setModal(null)}>Cancelar</button>
              <button className={tw.btnPrimary} onClick={handleSubmit} disabled={saving}>
                {saving ? 'Guardando...' : modal.mode === 'create' ? 'Crear Tipo' : 'Guardar'}
              </button>
            </>
          }
        >
          <form onSubmit={handleSubmit}>
            <div className={tw.formGroup}>
              <label className={tw.label}>Nombre *</label>
              <input
                className={errors.nombre ? tw.inputError : tw.input}
                value={form.nombre}
                onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                placeholder="Ej: Película"
              />
              {errors.nombre && <p className={tw.errorMsg}>⚠ {errors.nombre}</p>}
            </div>
            <div className={tw.formGroup}>
              <label className={tw.label}>Descripción</label>
              <textarea
                className={tw.input}
                value={form.descripcion}
                onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
                placeholder="Descripción del tipo de contenido..."
                rows={3}
              />
            </div>
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Eliminar Tipo"
          message={`¿Eliminar el tipo "${deleteTarget.nombre || ''}"? Esta acción no se puede deshacer.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </>
  );
}
