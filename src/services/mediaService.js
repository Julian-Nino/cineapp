import api, { isMock } from './api';
import { mockDB } from './mockData';

const mediaService = {
  getAll: () => isMock() ? mockDB.media.getAll() : api.get('/media'),
  create: (data) => isMock() ? mockDB.media.create(data) : api.post('/media', data),
  update: (id, data) => isMock() ? mockDB.media.update(id, data) : api.put(`/media/${id}`, data),
  delete: (id) => isMock() ? mockDB.media.delete(id) : api.delete(`/media/${id}`),
};

export default mediaService;

