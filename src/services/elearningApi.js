import axios from 'axios';

// Base URL for the separate E-Learning Backend
const API_BASE = import.meta.env.VITE_ELEARNING_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5001/api'
    : 'https://dx-elearning-backend.onrender.com/api');

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to attach student/admin LMS token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('dx_academy_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export const ElearningAPI = {
  // --- Auth ---
  register: (data) => api.post('/auth/register', data).then(r => r.data),
  login: (data) => api.post('/auth/login', data).then(r => r.data),
  verifyEmail: (token) => api.post('/auth/verify-email', { token }).then(r => r.data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }).then(r => r.data),
  resetPassword: (data) => api.post('/auth/reset-password', data).then(r => r.data),
  getMe: () => api.get('/auth/me').then(r => r.data),
  updateProfile: (data) => api.put('/auth/profile', data).then(r => r.data),

  // --- Public Programs & Settings ---
  getPrograms: (params) => api.get('/programs', { params }).then(r => r.data),
  getProgramBySlug: (slug) => api.get(`/programs/${slug}`).then(r => r.data),
  getPublicSettings: () => api.get('/settings/public').then(r => r.data),

  // --- Student Applications ---
  apply: (programId) => api.post('/applications/apply', { programId }).then(r => r.data),
  uploadReceipt: (applicationId, formData) => api.post(`/applications/${applicationId}/upload-receipt`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(r => r.data),
  getMyApplications: () => api.get('/applications/my').then(r => r.data),
  getApplicationById: (id) => api.get(`/applications/${id}`).then(r => r.data),

  // --- Student Enrollments & Learning ---
  getMyEnrollments: () => api.get('/enrollments/my').then(r => r.data),
  getCourseData: (slug) => api.get(`/enrollments/learn/${slug}`).then(r => r.data),
  getLesson: (id) => api.get(`/lessons/${id}`).then(r => r.data),
  toggleLessonProgress: (enrollmentId, lessonId) => api.post('/progress/toggle', { enrollmentId, lessonId }).then(r => r.data),
  downloadMaterial: (lessonId) => `${API_BASE}/lessons/${lessonId}/material`,

  // --- Certificates ---
  getMyCertificates: () => api.get('/certificates/my').then(r => r.data),
  verifyCertificate: (certId) => api.get(`/certificates/verify/${certId}`).then(r => r.data),
  downloadCertificateUrl: (id) => `${API_BASE}/certificates/${id}/download`,

  // --- Notifications ---
  getNotifications: () => api.get('/notifications').then(r => r.data),
  markNotificationRead: (id) => api.patch(`/notifications/${id}/read`).then(r => r.data),
  markAllNotificationsRead: () => api.patch('/notifications/read-all').then(r => r.data),

  // --- Admin Endpoints ---
  getDashboardStats: () => api.get('/admin/dashboard-stats').then(r => r.data),
  getAdminPrograms: () => api.get('/programs/admin/all').then(r => r.data),
  createProgram: (data) => api.post('/programs/admin', data).then(r => r.data),
  updateProgram: (id, data) => api.put(`/programs/admin/${id}`, data).then(r => r.data),
  deleteProgram: (id) => api.delete(`/programs/admin/${id}`).then(r => r.data),

  createModule: (data) => api.post('/modules', data).then(r => r.data),
  updateModule: (id, data) => api.put(`/modules/${id}`, data).then(r => r.data),
  deleteModule: (id) => api.delete(`/modules/${id}`).then(r => r.data),
  reorderModules: (moduleOrders) => api.put('/modules/reorder', { moduleOrders }).then(r => r.data),

  createLesson: (formData) => api.post('/lessons', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(r => r.data),
  updateLesson: (id, formData) => api.put(`/lessons/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(r => r.data),
  deleteLesson: (id) => api.delete(`/lessons/${id}`).then(r => r.data),

  getAdminApplications: (params) => api.get('/applications/admin/all', { params }).then(r => r.data),
  approveApplication: (id, adminNotes) => api.patch(`/applications/admin/${id}/approve`, { adminNotes }).then(r => r.data),
  rejectApplication: (id, rejectionReason, adminNotes) => api.patch(`/applications/admin/${id}/reject`, { rejectionReason, adminNotes }).then(r => r.data),

  getAdminEnrollments: (params) => api.get('/enrollments/admin/all', { params }).then(r => r.data),
  extendAccess: (id, data) => api.patch(`/enrollments/admin/${id}/extend`, data).then(r => r.data),

  getAdminCertificates: (params) => api.get('/certificates/admin/all', { params }).then(r => r.data),
  approveCertificate: (enrollmentId) => api.post(`/certificates/admin/approve/${enrollmentId}`).then(r => r.data),
  regenerateCertificate: (id, data) => api.post(`/certificates/admin/${id}/regenerate`, data).then(r => r.data),
  resendCertificateEmail: (id) => api.post(`/certificates/admin/${id}/resend-email`).then(r => r.data),

  getAdminStudents: (params) => api.get('/admin/students', { params }).then(r => r.data),
  getAdminStudentDetail: (id) => api.get(`/admin/students/${id}`).then(r => r.data),
  toggleStudentStatus: (id, status) => api.patch(`/admin/students/${id}/status`, { status }).then(r => r.data),
  getActivityLogs: (params) => api.get('/admin/activity-logs', { params }).then(r => r.data),

  getAdminSettings: () => api.get('/settings/admin').then(r => r.data),
  updateSetting: (key, value) => api.put('/settings/admin', { key, value }).then(r => r.data)
};

export default ElearningAPI;
