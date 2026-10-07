import api from './axios';
export const companyApi = {
  list: (params) => api.get('/companies', { params }),
  mine: () => api.get('/companies/mine'),
  upsert: (data) => api.post('/companies', data),
};