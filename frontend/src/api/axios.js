// import axios from 'axios';

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('jc_token');
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// api.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     if (err.response?.status === 401 && !window.location.pathname.startsWith('/login')) {
//       localStorage.removeItem('jc_token');
//       localStorage.removeItem('jc_user');
//       window.location.href = '/login';
//     }
//     return Promise.reject(err);
//   }
// );

// export default api;

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jc_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && !window.location.pathname.startsWith('/login')) {
      localStorage.removeItem('jc_token');
      localStorage.removeItem('jc_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

/**
 * Convert a stored path like "/uploads/resume.pdf" into a full URL
 * pointing at the backend server.
 *
 * - "/uploads/x.pdf"        → "http://localhost:5000/uploads/x.pdf"
 * - "http://.../x.pdf"      → unchanged
 * - "" or null              → ""
 */
export function fileUrl(path) {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  const base = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api')
    .replace(/\/api\/?$/, '');
  return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
}

export default api;