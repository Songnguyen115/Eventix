// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  GUEST = 'GUEST',
  VISITOR = 'VISITOR',
  SPONSOR = 'SPONSOR',
  EVENT_OPERATOR = 'EVENT_OPERATOR',
  CHECKING_STAFF = 'CHECKING_STAFF',
  ADMIN = 'ADMIN'
}

// Event Types
export interface Event {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  category: EventCategory;
  startDate: string;
  endDate: string;
  location: Location;
  capacity: number;
  currentAttendees: number;
  price: number;
  currency: string;
  status: EventStatus;
  organizer: User;
  sponsors: Sponsor[];
  images: string[];
  tags: string[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum EventCategory {
  SEMINAR = 'SEMINAR',
  CONFERENCE = 'CONFERENCE',
  WORKSHOP = 'WORKSHOP',
  NETWORKING = 'NETWORKING',
  EXHIBITION = 'EXHIBITION',
  COMPETITION = 'COMPETITION',
  OTHER = 'OTHER'
}

export enum EventStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface Location {
  address: string;
  city: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  venue?: string;
}

// Ticket Types
export interface Ticket {
  id: string;
  eventId: string;
  userId: string;
  ticketNumber: string;
  qrCode: string;
  status: TicketStatus;
  price: number;
  currency: string;
  purchaseDate: string;
  checkInDate?: string;
  checkInLocation?: string;
  checkInStaff?: string;
  refunded: boolean;
  refundDate?: string;
  createdAt: string;
  updatedAt: string;
}

export enum TicketStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CHECKED_IN = 'CHECKED_IN',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED'
}

// Payment Types
export interface Payment {
  id: string;
  ticketId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  gatewayResponse?: any;
  createdAt: string;
  updatedAt: string;
}

export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CASH = 'CASH',
  DIGITAL_WALLET = 'DIGITAL_WALLET'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

// Sponsor Types
export interface Sponsor {
  id: string;
  name: string;
  logo: string;
  website?: string;
  description?: string;
  boothNumber?: string;
  contactPerson?: User;
  events: string[];
  createdAt: string;
  updatedAt: string;
}

// Check-in Types
export interface CheckIn {
  id: string;
  ticketId: string;
  eventId: string;
  userId: string;
  checkInTime: string;
  checkInLocation: string;
  checkInStaff: string;
  boothVisits: BoothVisit[];
  notes?: string;
  createdAt: string;
}

export interface BoothVisit {
  id: string;
  sponsorId: string;
  visitTime: string;
  duration: number;
  notes?: string;
}

// Analytics Types
export interface EventAnalytics {
  eventId: string;
  totalTickets: number;
  soldTickets: number;
  checkedInTickets: number;
  revenue: number;
  averageCheckInTime: number;
  boothVisits: BoothVisitAnalytics[];
  demographics: Demographics;
  createdAt: string;
}

export interface BoothVisitAnalytics {
  sponsorId: string;
  sponsorName: string;
  totalVisits: number;
  averageDuration: number;
  uniqueVisitors: number;
}

export interface Demographics {
  ageGroups: { [key: string]: number };
  genders: { [key: string]: number };
  locations: { [key: string]: number };
  occupations: { [key: string]: number };
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: string;
}

export enum NotificationType {
  TICKET_PURCHASED = 'TICKET_PURCHASED',
  EVENT_REMINDER = 'EVENT_REMINDER',
  CHECK_IN_SUCCESS = 'CHECK_IN_SUCCESS',
  PAYMENT_SUCCESS = 'PAYMENT_SUCCESS',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  EVENT_CANCELLED = 'EVENT_CANCELLED',
  EVENT_UPDATED = 'EVENT_UPDATED',
  SURVEY_REQUEST = 'SURVEY_REQUEST'
}

// Survey Types
export interface Survey {
  id: string;
  eventId: string;
  title: string;
  description: string;
  questions: SurveyQuestion[];
  isActive: boolean;
  startDate: string;
  endDate: string;
  responses: SurveyResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface SurveyQuestion {
  id: string;
  question: string;
  type: QuestionType;
  options?: string[];
  required: boolean;
  order: number;
}

export enum QuestionType {
  TEXT = 'TEXT',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  CHECKBOX = 'CHECKBOX',
  RATING = 'RATING',
  EMAIL = 'EMAIL'
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  userId: string;
  answers: SurveyAnswer[];
  submittedAt: string;
}

export interface SurveyAnswer {
  questionId: string;
  answer: string | string[] | number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: Pagination;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
}

export interface EventForm {
  title: string;
  description: string;
  shortDescription?: string;
  category: EventCategory;
  startDate: string;
  endDate: string;
  location: Location;
  capacity: number;
  price: number;
  currency: string;
  images: File[];
  tags: string[];
}

// Filter Types
export interface EventFilters {
  category?: EventCategory;
  status?: EventStatus;
  dateRange?: {
    start: string;
    end: string;
  };
  priceRange?: {
    min: number;
    max: number;
  };
  location?: string;
  search?: string;
}

export interface TicketFilters {
  status?: TicketStatus;
  eventId?: string;
  userId?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}
