import { useState } from 'react';
import { useCrud, getItemId } from '../../hooks/useCrud';
import generoService from '../../services/generoService';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Spinner from '../../components/common/Spinner';
import { useToast } from '../../components/common/ToastProvider';
import { tw } from '../../utils/tw';

const EMPTY = { nombre: '', descripcion: '', estado: 'Activo' };

export default function GenerosPage() {
  const toast = useToast();
  const { items, loading, saving, deleting, create, update, remove } = useCrud(generoService);
  const [search, setSearch]           = useState('');
  const [modal, setModal]             = useState(null);
  const [form, setForm]               = useState(EMPTY);
  const [errors, setErrors]           = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);

  const safeItems = Array.isArray(items) ? items : [];

  const filtered = safeItems.filter(g =>
    (g?.nombre || '').toLowerCase().includes((search || '').toLowerCase())
  );

  const openCreate = () => { setForm(EMPTY); setErrors({}); setModal({ mode: 'create' }); };
  const openEdit   = (item) => {
    setForm({
      nombre: item?.nombre || '',
      descripcion: item?.descripcion || '',
      estado: item?.estado || 'Activo'
    });
    setErrors({});
    setModal({ mode: 'edit', item });
  };

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = 'El nombre es requerido';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const result = modal.mode === 'create' ? await create(form) : await update(modal.item, form);
    if (result.ok) {
      toast(modal.mode === 'create' ? 'Género creado ✨' : 'Género actualizado', 'success');
      setModal(null);
    } else {
      toast(result.error || 'Error al guardar', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const result = await remove(deleteTarget);
    if (result.ok) {
      toast('Género eliminado', 'success');
      setDeleteTarget(null);
    } else {
      toast(result.error || 'Error al eliminar', 'error');
    }
  };

  return (
    <>
      {/* Header */}
      <div className={tw.pageHeader}>
        <div>
          <h2 className={tw.pageTitle}>Géneros</h2>
          <p className={tw.pageSubtitle}>Administra los géneros del catálogo</p>
        </div>
        <button className={tw.btnPrimary} onClick={openCreate}>+ Nuevo Género</button>
      </div>

      {/* Tabla */}
      <div className={tw.tableWrapper}>
        <div className={tw.actionBar}>
          <div className={tw.searchWrap}>
            <span className={tw.searchIcon}>🔍</span>
            <input
              className={tw.searchInput}
              placeholder="Buscar género..."
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
                <th className={tw.th}>Estado</th>
                <th className={tw.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-14 text-zinc-500">
                    <div className="text-4xl mb-2">🏷️</div>Sin registros
                  </td>
                </tr>
              ) : filtered.map(g => (
                <tr key={getItemId(g) || Math.random()} className={tw.trBody}>
                  <td className={`${tw.td} text-zinc-600`}>{getItemId(g) || '—'}</td>
                  <td className={tw.td}>
                    <span className="font-semibold">{g?.nombre || 'Sin nombre'}</span>
                  </td>
                  <td className={`${tw.td} text-zinc-400 max-w-xs truncate`}>
                    {g?.descripcion || '—'}
                  </td>
                  <td className={tw.td}>
                    <span className={g?.estado === 'Activo' ? tw.badgeActive : tw.badgeInactive}>
                      {g?.estado === 'Activo' ? '●' : '○'} {g?.estado || 'Desconocido'}
                    </span>
                  </td>
                  <td className={tw.td}>
                    <div className="flex gap-2">
                      <button className={tw.btnEdit} onClick={() => openEdit(g)}>✏️ Editar</button>
                      <button className={tw.btnDanger} onClick={() => setDeleteTarget(g)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Form */}
      {modal && (
        <Modal
          title={modal.mode === 'create' ? 'Nuevo Género' : 'Editar Género'}
          onClose={() => setModal(null)}
          footer={
            <>
              <button className={tw.btnSecondary} onClick={() => setModal(null)}>Cancelar</button>
              <button className={tw.btnPrimary} onClick={handleSubmit} disabled={saving}>
                {saving ? 'Guardando...' : modal.mode === 'create' ? 'Crear Género' : 'Guardar Cambios'}
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
                placeholder="Ej: Acción"
              />
              {errors.nombre && <p className={tw.errorMsg}>⚠ {errors.nombre}</p>}
            </div>
            <div className={tw.formGroup}>
              <label className={tw.label}>Descripción</label>
              <textarea
                className={tw.input}
                value={form.descripcion}
                onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
                placeholder="Descripción del género..."
                rows={3}
              />
            </div>
            <div className={tw.formGroup}>
              <label className={tw.label}>Estado</label>
              <select
                className={tw.input}
                value={form.estado}
                onChange={e => setForm(f => ({ ...f, estado: e.target.value }))}
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
          </form>
        </Modal>
      )}

      {/* Confirm Delete */}
      {deleteTarget && (
        <ConfirmDialog
          title="Eliminar Género"
          message={`¿Eliminar el género "${deleteTarget.nombre || ''}"? Esta acción no se puede deshacer.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </>
  );
}
