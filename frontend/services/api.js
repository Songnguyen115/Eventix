import axios from 'axios';

// API base URLs - cấu hình theo backend services có sẵn
const API_CONFIG = {
  ANALYTICS_SERVICE: process.env.NEXT_PUBLIC_ANALYTICS_API || 'http://localhost:3003',
  CHECKIN_SERVICE: process.env.NEXT_PUBLIC_CHECKIN_API || 'http://localhost:3001',
  EVENT_SERVICE: process.env.NEXT_PUBLIC_EVENT_API || 'http://localhost:3003',
  IDENTITY_SERVICE: process.env.NEXT_PUBLIC_IDENTITY_API || 'http://localhost:3004',
  NOTIFICATION_SERVICE: process.env.NEXT_PUBLIC_NOTIFICATION_API || 'http://localhost:3005',
  PAYMENT_SERVICE: process.env.NEXT_PUBLIC_PAYMENT_API || 'http://localhost:3006',
  TICKET_SERVICE: process.env.NEXT_PUBLIC_TICKET_API || 'http://localhost:3007',
  CONTENT_SERVICE: process.env.NEXT_PUBLIC_CONTENT_API || 'http://localhost:3008',
};

// Create axios instances for each service
const createApiInstance = (baseURL, serviceName) => {
  const instance = axios.create({
    baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
  instance.interceptors.request.use(
  (config) => {
      const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
      console.log(`[${serviceName}] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
      console.error(`[${serviceName}] Request error:`, error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
  instance.interceptors.response.use(
    (response) => {
      console.log(`[${serviceName}] Response:`, response.status);
      return response;
    },
  (error) => {
      console.error(`[${serviceName}] Response error:`, error.response?.status, error.message);
      
      // Handle common errors
      if (error.response?.status === 401) {
        localStorage.removeItem('authToken');
        window.location.href = '/identity/auth';
    }
    
    return Promise.reject(error);
  }
);

  return instance;
};

// API instances
export const analyticsApi = createApiInstance(API_CONFIG.ANALYTICS_SERVICE, 'Analytics');
export const checkinApi = createApiInstance(API_CONFIG.CHECKIN_SERVICE, 'CheckIn');
export const eventApi = createApiInstance(API_CONFIG.EVENT_SERVICE, 'Event');
export const identityApi = createApiInstance(API_CONFIG.IDENTITY_SERVICE, 'Identity');
export const notificationApi = createApiInstance(API_CONFIG.NOTIFICATION_SERVICE, 'Notification');
export const paymentApi = createApiInstance(API_CONFIG.PAYMENT_SERVICE, 'Payment');
export const ticketApi = createApiInstance(API_CONFIG.TICKET_SERVICE, 'Ticket');
export const contentApi = createApiInstance(API_CONFIG.CONTENT_SERVICE, 'Content');

// Analytics Service APIs
export const analyticsService = {
  // Dashboard metrics
  getDashboardMetrics: (eventId = '550e8400-e29b-41d4-a716-446655440000', params = {}) => analyticsApi.get(`/analytics/dashboard/metrics/${eventId}`, { params }),
  
  // Reports
  getReports: (type, params = {}) => analyticsApi.get(`/analytics/reports/${type}`, { params }),
  generateReport: (reportConfig) => analyticsApi.post('/analytics/reports/generate', reportConfig),
  exportReport: (reportId, format) => analyticsApi.get(`/analytics/reports/${reportId}/export/${format}`, { responseType: 'blob' }),
  
  // Event analytics
  getEventAnalytics: (eventId) => analyticsApi.get(`/analytics/events/${eventId}/analytics`),
  getEventAttendance: (eventId) => analyticsApi.get(`/analytics/events/${eventId}/attendance`),
  getEventRevenue: (eventId) => analyticsApi.get(`/analytics/events/${eventId}/revenue`),
  
  // Surveys
  getSurveys: (params = {}) => analyticsApi.get('/surveys', { params }),
  createSurvey: (surveyData) => analyticsApi.post('/surveys', surveyData),
  getSurveyResults: (surveyId) => analyticsApi.get(`/surveys/${surveyId}/results`),
  
  // Real-time analytics
  getRealtimeData: (eventId) => analyticsApi.get(`/analytics/realtime/${eventId}`),
};

// Check-in Service APIs
export const checkinService = {
  // Attendance tracking
  getAttendanceList: (eventId, params = {}) => checkinApi.get(`/api/v1/checkin/attendance/${eventId}`, { params }),
  checkInAttendee: (eventId, attendeeData) => checkinApi.post(`/api/v1/checkin/checkin`, attendeeData),
  getCheckInStats: (eventId) => checkinApi.get(`/api/v1/checkin/stats/${eventId}`),
  
  // QR Code validation
  validateQrCode: (qrCode) => checkinApi.get(`/api/v1/checkin/validate-qr/${qrCode}`),
  
  // Real-time check-in
  getRealtimeCheckIn: (eventId) => checkinApi.get(`/api/v1/checkin/realtime/${eventId}`),
  
  // Sponsor booth management
  getSponsorBooths: (eventId) => checkinApi.get(`/api/v1/checkin/sponsor-booths/${eventId}`),
  updateBoothVisit: (eventId, boothId, visitorData) => checkinApi.post(`/api/v1/checkin/sponsor-booths/${eventId}/${boothId}/visit`, visitorData),
  
  // Attendance reports
  getAttendanceReport: (eventId, params = {}) => checkinApi.get(`/api/v1/checkin/attendance/${eventId}/report`, { params }),
};

// Event Service APIs
export const eventService = {
  // Event CRUD
  getEvents: (params = {}) => eventApi.get('/events', { params }),
  getEvent: (eventId) => eventApi.get(`/events/${eventId}`),
  createEvent: (eventData) => eventApi.post('/events', eventData),
  updateEvent: (eventId, eventData) => eventApi.put(`/events/${eventId}`, eventData),
  deleteEvent: (eventId) => eventApi.delete(`/events/${eventId}`),
  
  // Event categories
  getCategories: () => eventApi.get('/categories'),
  createCategory: (categoryData) => eventApi.post('/categories', categoryData),
  updateCategory: (categoryId, categoryData) => eventApi.put(`/categories/${categoryId}`, categoryData),
  deleteCategory: (categoryId) => eventApi.delete(`/categories/${categoryId}`),
  
  // Resource management
  getResources: (params = {}) => eventApi.get('/resources', { params }),
  createResource: (resourceData) => eventApi.post('/resources', resourceData),
  updateResource: (resourceId, resourceData) => eventApi.put(`/resources/${resourceId}`, resourceData),
  deleteResource: (resourceId) => eventApi.delete(`/resources/${resourceId}`),
  
  // Event registration
  registerForEvent: (eventId, registrationData) => eventApi.post(`/events/${eventId}/register`, registrationData),
  getRegistrations: (eventId, params = {}) => eventApi.get(`/events/${eventId}/registrations`, { params }),
};

// Identity Service APIs
export const identityService = {
  // Authentication
  login: (credentials) => identityApi.post('/auth/login', credentials),
  register: (userData) => identityApi.post('/auth/register', userData),
  logout: () => identityApi.post('/auth/logout'),
  refreshToken: () => identityApi.post('/auth/refresh'),
  forgotPassword: (email) => identityApi.post('/auth/forgot-password', { email }),
  resetPassword: (token, newPassword) => identityApi.post('/auth/reset-password', { token, newPassword }),
  
  // Profile management
  getProfile: () => identityApi.get('/profile'),
  updateProfile: (profileData) => identityApi.put('/profile', profileData),
  changePassword: (passwordData) => identityApi.put('/profile/password', passwordData),
  
  // User management
  getUsers: (params = {}) => identityApi.get('/users', { params }),
  getUser: (userId) => identityApi.get(`/users/${userId}`),
  createUser: (userData) => identityApi.post('/users', userData),
  updateUser: (userId, userData) => identityApi.put(`/users/${userId}`, userData),
  deleteUser: (userId) => identityApi.delete(`/users/${userId}`),
  
  // Role management
  getRoles: () => identityApi.get('/roles'),
  createRole: (roleData) => identityApi.post('/roles', roleData),
  updateRole: (roleId, roleData) => identityApi.put(`/roles/${roleId}`, roleData),
  deleteRole: (roleId) => identityApi.delete(`/roles/${roleId}`),
  
  // 2FA
  enable2FA: () => identityApi.post('/auth/2fa/enable'),
  verify2FA: (code) => identityApi.post('/auth/2fa/verify', { code }),
  disable2FA: (code) => identityApi.post('/auth/2fa/disable', { code }),
};

// Notification Service APIs
export const notificationService = {
  // Email notifications
  sendEmail: (emailData) => notificationApi.post('/email/send', emailData),
  getEmailTemplates: () => notificationApi.get('/email/templates'),
  createEmailTemplate: (templateData) => notificationApi.post('/email/templates', templateData),
  
  // SMS notifications
  sendSMS: (smsData) => notificationApi.post('/sms/send', smsData),
  getSMSTemplates: () => notificationApi.get('/sms/templates'),
  createSMSTemplate: (templateData) => notificationApi.post('/sms/templates', templateData),
  
  // Push notifications
  sendPush: (pushData) => notificationApi.post('/push/send', pushData),
  getPushTemplates: () => notificationApi.get('/push/templates'),
  createPushTemplate: (templateData) => notificationApi.post('/push/templates', templateData),
  
  // Notification history
  getNotificationHistory: (params = {}) => notificationApi.get('/history', { params }),
  getNotificationStats: () => notificationApi.get('/stats'),
};

// Utility functions
export const apiUtils = {
  // Handle API errors
  handleApiError: (error) => {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      return {
        status,
        message: data.message || `HTTP Error ${status}`,
        details: data.details || null
      };
    } else if (error.request) {
      // Request made but no response
      return {
        status: 0,
        message: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.',
        details: null
      };
    } else {
      // Something else happened
      return {
        status: -1,
        message: error.message || 'Đã xảy ra lỗi không xác định',
        details: null
      };
    }
  },

  // Format API response
  formatResponse: (response) => {
    return {
      data: response.data,
      status: response.status,
      headers: response.headers,
      timestamp: new Date().toISOString()
    };
  },

  // Check if service is available
  checkServiceHealth: async (serviceName) => {
    try {
      const apiInstance = {
        analytics: analyticsApi,
        checkin: checkinApi,
        event: eventApi,
        identity: identityApi,
        notification: notificationApi,
      }[serviceName];

      if (!apiInstance) {
        throw new Error('Unknown service');
      }

      const response = await apiInstance.get('/health');
      return { status: 'healthy', data: response.data };
    } catch (error) {
      return { status: 'unhealthy', error: error.message };
    }
  }
};

// Export default API configuration
export default {
  analyticsService,
  checkinService,
  eventService,
  identityService,
  notificationService,
  apiUtils,
  API_CONFIG
};