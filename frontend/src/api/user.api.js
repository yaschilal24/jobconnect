import api from './axios';
export const userApi = {
  me: () => api.get('/users/me'),
  update: (data) => api.patch('/users/me', data),
  addEducation: (data) => api.post('/users/me/educations', data),
  removeEducation: (id) => api.delete(`/users/me/educations/${id}`),
  addExperience: (data) => api.post('/users/me/experiences', data),
  removeExperience: (id) => api.delete(`/users/me/experiences/${id}`),
  addSkill: (name) => api.post('/users/me/skills', { name }),
  removeSkill: (id) => api.delete(`/users/me/skills/${id}`),
  uploadResume: (formData) =>
    api.post('/users/me/resume', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  uploadAvatar: (formData) =>
  api.post('/users/me/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
};