import api from './axios';
export const savedJobApi = {
  list: () => api.get('/saved-jobs'),
  save: (jobId) => api.post(`/saved-jobs/${jobId}`),
  unsave: (jobId) => api.delete(`/saved-jobs/${jobId}`),
};