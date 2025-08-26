// API Configuration for Eventix Backend Services
// Kết nối với các backend services trong folder Eventix

export const API_CONFIG = {
  // Backend service URLs - cập nhật theo cấu hình thực tế của backend
  ANALYTICS_SERVICE: process.env.NEXT_PUBLIC_ANALYTICS_API || 'http://localhost:3003',
  CHECKIN_SERVICE: process.env.NEXT_PUBLIC_CHECKIN_API || 'http://localhost:3001', 
  EVENT_SERVICE: process.env.NEXT_PUBLIC_EVENT_API || 'http://localhost:3003',
  IDENTITY_SERVICE: process.env.NEXT_PUBLIC_IDENTITY_API || 'http://localhost:3004',
  NOTIFICATION_SERVICE: process.env.NEXT_PUBLIC_NOTIFICATION_API || 'http://localhost:3005',
  PAYMENT_SERVICE: process.env.NEXT_PUBLIC_PAYMENT_API || 'http://localhost:3006',
  TICKET_SERVICE: process.env.NEXT_PUBLIC_TICKET_API || 'http://localhost:3007',
  CONTENT_SERVICE: process.env.NEXT_PUBLIC_CONTENT_API || 'http://localhost:3008',
  
  // API endpoints mapping theo backend structure
  ENDPOINTS: {
    // Analytics Service endpoints
    ANALYTICS: {
      DASHBOARD_METRICS: '/dashboard/metrics',
      GENERATE_REPORT: '/reports/generate',
      EVENT_ANALYTICS: '/events/:eventId/analytics',
      SURVEY_MANAGEMENT: '/surveys',
      REALTIME_DATA: '/realtime/:eventId'
    },
    
    // Check-in Service endpoints  
    CHECKIN: {
      ATTENDANCE_TRACKING: '/events/:eventId/attendance',
      QR_VALIDATION: '/qr/validate',
      SPONSOR_BOOTHS: '/events/:eventId/sponsor-booths',
      REALTIME_CHECKIN: '/events/:eventId/realtime'
    },
    
    // Event Service endpoints
    EVENTS: {
      EVENT_CRUD: '/events',
      EVENT_CATEGORIES: '/categories', 
      RESOURCE_MANAGEMENT: '/resources',
      EVENT_REGISTRATION: '/events/:eventId/register'
    },
    
    // Identity Service endpoints
    IDENTITY: {
      AUTHENTICATION: '/auth',
      USER_MANAGEMENT: '/users',
      ROLE_MANAGEMENT: '/roles',
      PROFILE_MANAGEMENT: '/profile'
    },
    
    // Notification Service endpoints
    NOTIFICATIONS: {
      EMAIL_SEND: '/email/send',
      SMS_SEND: '/sms/send', 
      PUSH_SEND: '/push/send',
      TEMPLATES: '/templates'
    }
  },
  
  // Request configuration
  REQUEST_CONFIG: {
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  },
  
  // Authentication settings
  AUTH: {
    TOKEN_KEY: 'eventix_auth_token',
    REFRESH_TOKEN_KEY: 'eventix_refresh_token',
    TOKEN_EXPIRY: 3600, // 1 hour
    REFRESH_EXPIRY: 604800 // 7 days
  },
  
  // Real-time settings
  REALTIME: {
    SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL || 'ws://localhost:3009',
    RECONNECT_ATTEMPTS: 5,
    RECONNECT_INTERVAL: 3000
  },
  
  // Feature flags
  FEATURES: {
    REALTIME_UPDATES: true,
    OFFLINE_SUPPORT: false,
    PUSH_NOTIFICATIONS: true,
    ANALYTICS_TRACKING: true,
    DEBUG_MODE: process.env.NODE_ENV === 'development'
  }
};

// Service health check endpoints
export const HEALTH_CHECK_ENDPOINTS = {
  analytics: `${API_CONFIG.ANALYTICS_SERVICE}/health`,
  checkin: `${API_CONFIG.CHECKIN_SERVICE}/health`, 
  event: `${API_CONFIG.EVENT_SERVICE}/health`,
  identity: `${API_CONFIG.IDENTITY_SERVICE}/health`,
  notification: `${API_CONFIG.NOTIFICATION_SERVICE}/health`
};

// Error messages mapping
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.',
  UNAUTHORIZED: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
  FORBIDDEN: 'Bạn không có quyền truy cập tính năng này.',
  NOT_FOUND: 'Không tìm thấy dữ liệu yêu cầu.',
  SERVER_ERROR: 'Đã xảy ra lỗi server. Vui lòng thử lại sau.',
  VALIDATION_ERROR: 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.',
  TIMEOUT_ERROR: 'Yêu cầu quá thời gian chờ. Vui lòng thử lại.'
};

export default API_CONFIG;
