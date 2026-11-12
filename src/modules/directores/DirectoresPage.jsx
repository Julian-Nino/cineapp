import { useState } from 'react';
import { useCrud, getItemId } from '../../hooks/useCrud';
import directorService from '../../services/directorService';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Spinner from '../../components/common/Spinner';
import { useToast } from '../../components/common/ToastProvider';
import { tw } from '../../utils/tw';

const EMPTY = { nombres: '', estado: 'Activo' };

export default function DirectoresPage() {
  const toast = useToast();
  const { items, loading, saving, deleting, create, update, remove } = useCrud(directorService);
  const [search, setSearch]           = useState('');
  const [modal, setModal]             = useState(null);
  const [form, setForm]               = useState(EMPTY);
  const [errors, setErrors]           = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);

  const safeItems = Array.isArray(items) ? items : [];

  const filtered = safeItems.filter(d =>
    (d?.nombres || '').toLowerCase().includes((search || '').toLowerCase())
  );

  const openCreate = () => { setForm(EMPTY); setErrors({}); setModal({ mode: 'create' }); };
  const openEdit   = (item) => {
    setForm({ nombres: item?.nombres || '', estado: item?.estado || 'Activo' });
    setErrors({});
    setModal({ mode: 'edit', item });
  };

  const validate = () => {
    const e = {};
    if (!form.nombres.trim() || form.nombres.trim().length < 3)
      e.nombres = 'Nombre requerido (mínimo 3 caracteres)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    const result = modal.mode === 'create' ? await create(form) : await update(modal.item, form);
    if (result.ok) {
      toast(modal.mode === 'create' ? 'Director creado ✨' : 'Director actualizado', 'success');
      setModal(null);
    } else {
      toast(result.error || 'Error al guardar', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const result = await remove(deleteTarget);
    if (result.ok) {
      toast('Director eliminado', 'success');
      setDeleteTarget(null);
    } else {
      toast(result.error || 'Error al eliminar', 'error');
    }
  };

  return (
    <>
      <div className={tw.pageHeader}>
        <div>
          <h2 className={tw.pageTitle}>Directores</h2>
          <p className={tw.pageSubtitle}>Gestiona los directores disponibles en el catálogo</p>
        </div>
        <button className={tw.btnPrimary} onClick={openCreate}>+ Nuevo Director</button>
      </div>

      <div className={tw.tableWrapper}>
        <div className={tw.actionBar}>
          <div className={tw.searchWrap}>
            <span className={tw.searchIcon}>🔍</span>
            <input
              className={tw.searchInput}
              placeholder="Buscar director..."
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
                <th className={tw.th}>Nombre Completo</th>
                <th className={tw.th}>Estado</th>
                <th className={tw.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-14 text-zinc-500">
                    <div className="text-4xl mb-2">🎥</div>Sin registros
                  </td>
                </tr>
              ) : filtered.map(d => (
                <tr key={getItemId(d) || Math.random()} className={tw.trBody}>
                  <td className={`${tw.td} text-zinc-600`}>{getItemId(d) || '—'}</td>
                  <td className={tw.td}>
                    <span className="font-semibold">{d?.nombres || 'Sin nombre'}</span>
                  </td>
                  <td className={tw.td}>
                    <span className={d?.estado === 'Activo' ? tw.badgeActive : tw.badgeInactive}>
                      {d?.estado === 'Activo' ? '●' : '○'} {d?.estado || 'Desconocido'}
                    </span>
                  </td>
                  <td className={tw.td}>
                    <div className="flex gap-2">
                      <button className={tw.btnEdit} onClick={() => openEdit(d)}>✏️ Editar</button>
                      <button className={tw.btnDanger} onClick={() => setDeleteTarget(d)}>🗑️</button>
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
          title={modal.mode === 'create' ? 'Nuevo Director' : 'Editar Director'}
          onClose={() => setModal(null)}
          footer={
            <>
              <button className={tw.btnSecondary} onClick={() => setModal(null)}>Cancelar</button>
              <button className={tw.btnPrimary} onClick={handleSubmit} disabled={saving}>
                {saving ? 'Guardando...' : modal.mode === 'create' ? 'Crear Director' : 'Guardar'}
              </button>
            </>
          }
        >
          <form onSubmit={handleSubmit}>
            <div className={tw.formGroup}>
              <label className={tw.label}>Nombre Completo *</label>
              <input
                className={errors.nombres ? tw.inputError : tw.input}
                value={form.nombres}
                onChange={e => setForm(f => ({ ...f, nombres: e.target.value }))}
                placeholder="Ej: Christopher Nolan"
              />
              {errors.nombres && <p className={tw.errorMsg}>⚠ {errors.nombres}</p>}
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

      {deleteTarget && (
        <ConfirmDialog
          title="Eliminar Director"
          message={`¿Eliminar a "${deleteTarget.nombres || ''}"? Esta acción no se puede deshacer.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </>
  );
}
