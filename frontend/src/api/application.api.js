import api from './axios';
export const applicationApi = {
  apply: (fd) => api.post('/applications', fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
  mine: () => api.get('/applications/mine'),
  byJob: (jobId) => api.get(`/applications/job/${jobId}`),
  updateStatus: (id, data) => api.patch(`/applications/${id}/status`, data),
  withdraw: (id) => api.patch(`/applications/${id}/withdraw`),
  history: (id) => api.get(`/applications/${id}/history`),
};