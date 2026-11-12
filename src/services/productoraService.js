import api, { isMock } from './api';
import { mockDB } from './mockData';

const productoraService = {
  getAll: () => isMock() ? mockDB.productoras.getAll() : api.get('/productoras'),
  create: (data) => isMock() ? mockDB.productoras.create(data) : api.post('/productoras', data),
  update: (id, data) => isMock() ? mockDB.productoras.update(id, data) : api.put(`/productoras/${id}`, data),
  delete: (id) => isMock() ? mockDB.productoras.delete(id) : api.delete(`/productoras/${id}`),
};

export default productoraService;

