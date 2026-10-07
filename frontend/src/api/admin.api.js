// import api from './axios';
// export const adminApi = {
//   stats: () => api.get('/admin/stats'),
//   recentApplications: () => api.get('/admin/recent-applications'),
//   //auditLogs: (params) => api.get('/admin/audit-logs', { params }),
//   users: (params) => api.get('/admin/users', { params }),
//   toggleUser: (id) => api.patch(`/admin/users/${id}/toggle`),
//   companies: (params) => api.get('/admin/companies', { params }),
//   charts: () => api.get('/admin/charts'),
//   verifyCompany: (id, status) => api.patch(`/admin/companies/${id}/verify`, { status }),
//   jobs: (params) => api.get('/admin/jobs', { params }),
//   deleteJob: (id) => api.delete(`/admin/jobs/${id}`),
//   auditLogs: (params) => api.get('/admin/audit-logs', { params }),
// };
import api from './axios';

export const adminApi = {
  stats: () => api.get('/admin/stats'),
  recentApplications: () => api.get('/admin/recent-applications'),
  auditLogs: (params) => api.get('/admin/audit-logs', { params }),
  charts: () => api.get('/admin/charts'),
  users: (params) => api.get('/admin/users', { params }),
  toggleUser: (id) => api.patch(`/admin/users/${id}/toggle`),
  companies: (params) => api.get('/admin/companies', { params }),
  verifyCompany: (id, status) => api.patch(`/admin/companies/${id}/verify`, { status }),
  jobs: (params) => api.get('/admin/jobs', { params }),
  deleteJob: (id) => api.delete(`/admin/jobs/${id}`),
    auditLogs: (params) => api.get('/admin/audit-logs', { params }),

};