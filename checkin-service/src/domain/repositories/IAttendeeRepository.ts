import { Attendee, AttendeeStatus } from '../entities/Attendee';

export interface IAttendeeRepository {
  findById(id: string): Promise<Attendee | null>;
  findByEventId(eventId: string): Promise<Attendee[]>;
  findByUserId(userId: string): Promise<Attendee[]>;
  findByTicketId(ticketId: string): Promise<Attendee | null>;
  findByQrCode(qrCode: string): Promise<Attendee | null>;
  findByStatus(status: AttendeeStatus): Promise<Attendee[]>;
  create(attendee: Omit<Attendee, 'id' | 'createdAt' | 'updatedAt'>): Promise<Attendee>;
  update(id: string, updates: Partial<Attendee>): Promise<Attendee>;
  delete(id: string): Promise<void>;
  countByEventId(eventId: string): Promise<number>;
  countByStatus(eventId: string, status: AttendeeStatus): Promise<number>;
}
