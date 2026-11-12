import api, { isMock } from './api';
import { mockDB } from './mockData';

const directorService = {
  getAll: () => isMock() ? mockDB.directores.getAll() : api.get('/directores'),
  create: (data) => isMock() ? mockDB.directores.create(data) : api.post('/directores', data),
  update: (id, data) => isMock() ? mockDB.directores.update(id, data) : api.put(`/directores/${id}`, data),
  delete: (id) => isMock() ? mockDB.directores.delete(id) : api.delete(`/directores/${id}`),
};

export default directorService;

