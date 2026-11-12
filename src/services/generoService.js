import api, { isMock } from './api';
import { mockDB } from './mockData';

const generoService = {
  getAll: () => isMock() ? mockDB.generos.getAll() : api.get('/generos'),
  create: (data) => isMock() ? mockDB.generos.create(data) : api.post('/generos', data),
  update: (id, data) => isMock() ? mockDB.generos.update(id, data) : api.put(`/generos/${id}`, data),
  delete: (id) => isMock() ? mockDB.generos.delete(id) : api.delete(`/generos/${id}`),
};

export default generoService;

