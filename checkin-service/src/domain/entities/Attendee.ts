export interface Attendee {
  id: string;
  eventId: string;
  userId: string;
  ticketId: string;
  checkInTime?: Date;
  checkOutTime?: Date;
  status: AttendeeStatus;
  qrCode: string;
  sponsorBoothVisits: SponsorBoothVisit[];
  createdAt: Date;
  updatedAt: Date;
}

export enum AttendeeStatus {
  REGISTERED = 'REGISTERED',
  CHECKED_IN = 'CHECKED_IN',
  CHECKED_OUT = 'CHECKED_OUT',
  CANCELLED = 'CANCELLED'
}

export interface SponsorBoothVisit {
  boothId: string;
  visitTime: Date;
  duration: number; // in minutes
}
