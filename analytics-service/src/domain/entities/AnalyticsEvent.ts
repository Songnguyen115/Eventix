export interface AnalyticsEvent {
  id: string;
  eventId: string;
  eventType: AnalyticsEventType;
  userId?: string;
  sessionId?: string;
  metadata?: Record<string, any>;
  timestamp: Date;
}

export enum AnalyticsEventType {
  PAGE_VIEW = 'PAGE_VIEW',
  BUTTON_CLICK = 'BUTTON_CLICK',
  FORM_SUBMIT = 'FORM_SUBMIT',
  API_CALL = 'API_CALL',
  ERROR = 'ERROR'
}

export interface AnalyticsEventMetadata {
  page?: string;
  button?: string;
  form?: string;
  apiEndpoint?: string;
  errorCode?: string;
  errorMessage?: string;
  userAgent?: string;
  ipAddress?: string;
  [key: string]: any;
}
