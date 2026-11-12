import api, { isMock } from './api';
import { mockDB } from './mockData';

const tipoService = {
  getAll: () => isMock() ? mockDB.tipos.getAll() : api.get('/tipos'),
  create: (data) => isMock() ? mockDB.tipos.create(data) : api.post('/tipos', data),
  update: (id, data) => isMock() ? mockDB.tipos.update(id, data) : api.put(`/tipos/${id}`, data),
  delete: (id) => isMock() ? mockDB.tipos.delete(id) : api.delete(`/tipos/${id}`),
};

export default tipoService;

