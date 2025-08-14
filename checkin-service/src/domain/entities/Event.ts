export interface Event {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  maxAttendees: number;
  currentAttendees: number;
  status: EventStatus;
  organizerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum EventStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}
