import api from './axios';
export const jobApi = {
  search: (params) => api.get('/jobs', { params }),
  getById: (id) => api.get(`/jobs/${id}`),
  create: (data) => api.post('/jobs', data),
  update: (id, data) => api.patch(`/jobs/${id}`, data),
  remove: (id) => api.delete(`/jobs/${id}`),
  mine: () => api.get('/jobs/mine'),
  // add the public state
  publicStats: () => api.get('/jobs/stats/public'),
};