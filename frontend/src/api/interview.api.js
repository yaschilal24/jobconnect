import api from './axios';
export const interviewApi = {
  schedule: (data) => api.post('/interviews', data),
  mine: () => api.get('/interviews/mine'),
  cancel: (id) => api.patch(`/interviews/${id}/cancel`),
  reschedule: (id, scheduledAt) => api.patch(`/interviews/${id}/reschedule`, { scheduledAt }),
};