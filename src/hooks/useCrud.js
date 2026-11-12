import { useState, useEffect, useCallback } from 'react';

/**
 * Extrae de forma inteligente la clave primaria de un registro,
 * ya sea que venga como `id`, `id_genero`, `id_director`, `_id`, etc.
 */
export function getItemId(item) {
  if (!item) return undefined;
  if (typeof item !== 'object') return item;
  return (
    item.id ??
    item.id_genero ??
    item.id_director ??
    item.id_productora ??
    item.id_tipo ??
    item.id_media ??
    item._id ??
    item.serial
  );
}

/**
 * Normaliza un item individual para garantizar que siempre tenga la propiedad `id`.
 */
export function normalizeItem(item) {
  if (!item || typeof item !== 'object') return item;
  const id = getItemId(item);
  return {
    ...item,
    id: id !== undefined ? id : item.id
  };
}

/**
 * Normaliza cualquier respuesta de backend o mock para garantizar que sea un Array
 * y que cada item tenga su campo `id` mapeado correctamente.
 */
export function normalizeList(data) {
  let list = [];
  if (Array.isArray(data)) list = data;
  else if (data && typeof data === 'object') {
    if (Array.isArray(data.data)) list = data.data;
    else if (Array.isArray(data.rows)) list = data.rows;
    else if (Array.isArray(data.results)) list = data.results;
    else if (Array.isArray(data.generos)) list = data.generos;
    else if (Array.isArray(data.directores)) list = data.directores;
    else if (Array.isArray(data.productoras)) list = data.productoras;
    else if (Array.isArray(data.tipos)) list = data.tipos;
    else if (Array.isArray(data.media)) list = data.media;
  }
  return list.map(normalizeItem);
}

/**
 * Hook genérico para operaciones CRUD sobre un service.
 */
export function useCrud(service) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await service.getAll();
      setItems(normalizeList(data));
    } catch (e) {
      setError(e.message);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [service]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const create = async (data) => {
    setSaving(true);
    try {
      const created = await service.create(data);

      try {
        const fresh = await service.getAll();
        setItems(normalizeList(fresh));
      } catch {
        const fallbackItem = normalizeItem({
          id: (typeof created === 'object' && getItemId(created)) ? getItemId(created) : Date.now(),
          ...data,
          ...(typeof created === 'object' ? created : {})
        });
        setItems(prev => [...(Array.isArray(prev) ? prev : []), fallbackItem]);
      }

      return { ok: true, data: created };
    } catch (e) {
      return { ok: false, error: e.message };
    } finally {
      setSaving(false);
    }
  };

  const update = async (idOrItem, data) => {
    const id = typeof idOrItem === 'object' ? getItemId(idOrItem) : idOrItem;
    if (id === undefined || id === null) {
      return { ok: false, error: 'ID no válido para actualizar' };
    }
    setSaving(true);
    try {
      const updated = await service.update(id, data);

      try {
        const fresh = await service.getAll();
        setItems(normalizeList(fresh));
      } catch {
        setItems(prev =>
          (Array.isArray(prev) ? prev : []).map(i =>
            getItemId(i) === id ? normalizeItem({ ...i, ...data, ...(typeof updated === 'object' ? updated : {}) }) : i
          )
        );
      }

      return { ok: true, data: updated };
    } catch (e) {
      return { ok: false, error: e.message };
    } finally {
      setSaving(false);
    }
  };

  const remove = async (idOrItem) => {
    const id = typeof idOrItem === 'object' ? getItemId(idOrItem) : idOrItem;
    if (id === undefined || id === null) {
      return { ok: false, error: 'No se pudo identificar el ID para eliminar' };
    }
    setDeleting(true);
    try {
      await service.delete(id);

      try {
        const fresh = await service.getAll();
        setItems(normalizeList(fresh));
      } catch {
        setItems(prev => (Array.isArray(prev) ? prev : []).filter(i => getItemId(i) !== id));
      }

      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message };
    } finally {
      setDeleting(false);
    }
  };

  return { items, loading, saving, deleting, error, fetchAll, create, update, remove };
}
